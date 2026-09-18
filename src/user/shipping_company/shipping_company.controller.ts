import { Controller, Get, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ShippingCompanyService } from './shipping_company.service';
import { UserGuard } from '../../authGuard/user.guard';
import { CommonMessages } from '../../common/common-message';

@Controller('/api/shipping/companies')
export class ShippingCompanyController {
  constructor(private readonly shippingCompanyService: ShippingCompanyService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    try {
      const data = await this.shippingCompanyService.getAll();
      return { status: true, message: CommonMessages.GET_LIST('Shipping companies'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  @Get('/get/:slug')
  @HttpCode(HttpStatus.OK)
  async getBySlug(@Param('slug') slug: string) {
    try {
      const data = await this.shippingCompanyService.getBySlug(slug);
      return { status: true, message: CommonMessages.GET_DATA('Shipping company'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }
}
