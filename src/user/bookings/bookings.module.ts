import { Module }          from '@nestjs/common';
import { TypeOrmModule }   from '@nestjs/typeorm';
import { BookingInquiry }  from '../../schema/booking-inquiries.schema';
import { BookingPassenger }from '../../schema/booking-passengers.schema';
import { Cruise }          from '../../schema/cruises.schema';
import { Ship }            from '../../schema/ships.schema';
import { ShippingCompany } from '../../schema/shipping-companies.schema';
import { Port }            from '../../schema/ports.schema';
import { BookingsService }    from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingInquiry,
      BookingPassenger,
      Cruise,
      Ship,
      ShippingCompany,
      Port,
    ]),
  ],
  controllers: [BookingsController],
  providers:   [BookingsService],
  exports:     [BookingsService],
})
export class BookingsModule {}
