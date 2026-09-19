import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { BookingInquiry }   from '../../schema/booking-inquiries.schema';
import { BookingPassenger } from '../../schema/booking-passengers.schema';
import { Cruise }           from '../../schema/cruises.schema';
import { Ship }             from '../../schema/ships.schema';
import { ShippingCompany }  from '../../schema/shipping-companies.schema';
import { Port }             from '../../schema/ports.schema';
import { sendMail }         from '../../common/common.utils';
import { bookingConfirmationTemplate } from '../../common/templates';

// ── Types ─────────────────────────────────────────────────────────────
export interface PassengerDto {
  firstname:   string;
  lastname:    string;
  birth_date:  string | null;   // ISO date string
  nationality: string | null;
  gender:      'male' | 'female' | 'other' | null;
}

export interface CreateBookingDto {
  cruise_id:       string;
  customer_name:   string;
  customer_email:  string;
  customer_phone:  string | null;
  customer_message?: string | null;
  number_of_adults:   number;
  number_of_children: number;
  selected_price_per_person?: number | null;
  passengers:      PassengerDto[];
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingInquiry)
    private readonly inquiryRepo: Repository<BookingInquiry>,

    @InjectRepository(BookingPassenger)
    private readonly passengerRepo: Repository<BookingPassenger>,

    @InjectRepository(Cruise)
    private readonly cruiseRepo: Repository<Cruise>,

    @InjectRepository(Ship)
    private readonly shipRepo: Repository<Ship>,

    @InjectRepository(ShippingCompany)
    private readonly companyRepo: Repository<ShippingCompany>,

    @InjectRepository(Port)
    private readonly portRepo: Repository<Port>,
  ) {}

  // ── Generate unique inquiry number ─────────────────────────
  private generateInquiryNumber(): string {
    const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result   = '';
    for (let i = 0; i < 12; i++) {
      if (i === 4 || i === 8) result += '-';
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result; // e.g. "FCM-ABCD-XY3Z"
  }

  // ── Create booking ──────────────────────────────────────────
  async createBooking(dto: CreateBookingDto) {
    // 1. Validate cruise exists
    const cruise = await this.cruiseRepo.findOne({
      where: { id: dto.cruise_id, status: 'published' },
    });
    if (!cruise) throw new BadRequestException('Cruise not found or not available.');

    // 2. Fetch enrichment data for the email
    const [ship, company] = await Promise.all([
      this.shipRepo.findOne({ where: { id: cruise.ship_id } }),
      this.companyRepo.findOne({ where: { id: cruise.shipping_company_id } }),
    ]);

    // Departure / destination port names
    let departure_port:    string | null = null;
    let destination_port:  string | null = null;
    if (cruise.start_port_id) {
      const p = await this.portRepo.findOne({ where: { id: cruise.start_port_id } });
      departure_port = p?.name ?? null;
    }
    if (cruise.end_port_id) {
      const p = await this.portRepo.findOne({ where: { id: cruise.end_port_id } });
      destination_port = p?.name ?? null;
    }

    // 3. Calculate total — use the cabin price the user selected,
    //    falling back to the cruise's base price_per_person
    const totalPax    = dto.number_of_adults + dto.number_of_children;
    const pricePerPax =
      dto.selected_price_per_person != null
        ? Number(dto.selected_price_per_person)
        : cruise.price_per_person
          ? Number(cruise.price_per_person)
          : null;
    const totalAmount = pricePerPax !== null ? pricePerPax * totalPax : null;

    // 4. Generate unique inquiry number (retry on collision)
    let inquiry_number: string;
    let attempts = 0;
    do {
      inquiry_number = this.generateInquiryNumber();
      const existing = await this.inquiryRepo.findOne({ where: { inquiry_number } });
      if (!existing) break;
      attempts++;
    } while (attempts < 5);

    // 5. Save booking inquiry
    const inquiry = this.inquiryRepo.create({
      inquiry_number,
      cruise_id:              dto.cruise_id,
      user_id:                null,
      status:                 'inquiry',
      number_of_adults:       dto.number_of_adults,
      number_of_children:     dto.number_of_children,
      total_estimated_amount: totalAmount,
      currency:               cruise.currency,
      customer_email:         dto.customer_email,
      customer_phone:         dto.customer_phone,
      customer_message:       dto.customer_message ?? null,
    });
    const saved = await this.inquiryRepo.save(inquiry);

    // 6. Save passengers
    const passengerEntities = dto.passengers.map((p, i) =>
      this.passengerRepo.create({
        booking_inquiry_id: saved.id,
        firstname:          p.firstname,
        lastname:           p.lastname,
        birth_date:         p.birth_date ? new Date(p.birth_date) : null,
        nationality:        p.nationality,
        gender:             p.gender,
        is_primary:         i === 0,
      }),
    );
    await this.passengerRepo.save(passengerEntities);

    // 7. Send confirmation email in background (non-blocking)
    const emailHtml = bookingConfirmationTemplate({
      inquiry_number,
      customer_name:    dto.customer_name,
      customer_email:   dto.customer_email,
      customer_phone:   dto.customer_phone,
      cruise_name:      cruise.name,
      cruise_code:      cruise.cruise_code,
      ship_name:        ship?.name ?? null,
      company_name:     company?.name ?? null,
      start_date:       cruise.start_date ? cruise.start_date.toString() : null,
      end_date:         cruise.end_date   ? cruise.end_date.toString()   : null,
      duration_days:    cruise.duration_days,
      departure_port,
      destination_port,
      number_of_adults:   dto.number_of_adults,
      number_of_children: dto.number_of_children,
      price_per_person:   pricePerPax,
      total_amount:       totalAmount,
      currency:           cruise.currency,
      passengers:         dto.passengers.map((p) => ({
        firstname:   p.firstname,
        lastname:    p.lastname,
        birth_date:  p.birth_date,
        nationality: p.nationality,
        gender:      p.gender,
      })),
    });

    // Fire-and-forget — do NOT await so the API responds immediately
    sendMail(
      dto.customer_email,
      `Booking confirmation – ${cruise.name} [${inquiry_number}]`,
      emailHtml,
    ).catch((mailErr) => {
      console.error('[BookingsService] background email send failed:', mailErr);
    });

    return {
      inquiry_number,
      booking_id:     saved.id,
      cruise_name:    cruise.name,
      cruise_code:    cruise.cruise_code,
      ship_name:      ship?.name ?? null,
      company_name:   company?.name ?? null,
      start_date:     cruise.start_date,
      end_date:       cruise.end_date,
      total_amount:   totalAmount,
      currency:       cruise.currency,
      passengers:     passengerEntities.length,
    };
  }
}
