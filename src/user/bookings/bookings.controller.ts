import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService, CreateBookingDto } from './bookings.service';
import { CommonMessages } from '../../common/common-message';

@Controller('/api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateBookingDto) {
    // Basic validation
    if (!body.cruise_id)      throw new BadRequestException('cruise_id is required');
    if (!body.customer_email) throw new BadRequestException('customer_email is required');
    if (!body.customer_name)  throw new BadRequestException('customer_name is required');
    if (!Array.isArray(body.passengers) || body.passengers.length === 0) {
      throw new BadRequestException('At least one passenger is required');
    }
    for (const p of body.passengers) {
      if (!p.firstname?.trim()) throw new BadRequestException('Each passenger must have a firstname');
      if (!p.lastname?.trim())  throw new BadRequestException('Each passenger must have a lastname');
    }

    try {
      const data = await this.bookingsService.createBooking(body);
      return {
        status:  true,
        message: CommonMessages.CREATED_DATA('Booking'),
        data,
      };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }
}
