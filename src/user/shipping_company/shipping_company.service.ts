import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingCompany } from '../../schema/shipping-companies.schema';
import { CommonMessages } from '../../common/common-message';

@Injectable()
export class ShippingCompanyService {
  constructor(
    @InjectRepository(ShippingCompany)
    private readonly shippingCompanyRepo: Repository<ShippingCompany>,
  ) {}

  // ── Get all shipping companies ────────────────────────────
  async getAll() {
    try {
      return await this.shippingCompanyRepo.find({
        order: { created_at: 'DESC' },
      });
    } catch (error: any) {
      console.error('Error in getAll shipping companies:', error);
      throw error;
    }
  }

  // ── Get shipping company by slug ──────────────────────────
  async getBySlug(slug: string) {
    try {
      const record = await this.shippingCompanyRepo.findOne({ where: { slug } });
      if (!record) throw new NotFoundException(CommonMessages.not_found('Shipping company'));
      return record;
    } catch (error: any) {
      console.error('Error in getBySlug shipping company:', error);
      throw error;
    }
  }
}
