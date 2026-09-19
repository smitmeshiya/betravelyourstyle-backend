import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CruisesService } from './cruises.service';
import { CommonMessages } from '../../common/common-message';

@Controller('/api/cruises')
export class CruisesController {
  constructor(private readonly cruisesService: CruisesService) {}

  /** GET /api/cruises/list */
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getList(
    @Query('page')          page          = '1',
    @Query('limit')         limit         = '12',
    @Query('search')        search        = '',
    @Query('min_price')     min_price     = '',
    @Query('max_price')     max_price     = '',
    @Query('duration_days') duration_days = '',
    @Query('company_slug')  company_slug  = '',
    @Query('sort')          sort          = 'start_date_asc',
  ) {
    try {
      const data = await this.cruisesService.getList({
        page:          Math.max(1, parseInt(page) || 1),
        limit:         Math.min(100, Math.max(1, parseInt(limit) || 12)),
        search:        search || undefined,
        min_price:     min_price ? parseFloat(min_price) : undefined,
        max_price:     max_price ? parseFloat(max_price) : undefined,
        duration_days: duration_days ? parseInt(duration_days) : undefined,
        company_slug:  company_slug || undefined,
        sort,
      });
      return { status: true, message: CommonMessages.GET_LIST('Cruises'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  /** GET /api/cruises/filters/meta */
  @Get('/filters/meta')
  @HttpCode(HttpStatus.OK)
  async getFiltersMeta() {
    try {
      const data = await this.cruisesService.getFiltersMeta();
      return { status: true, message: CommonMessages.GET_DATA('Filters'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  /** GET /api/cruises/get/:slug */
  @Get('/get/:slug')
  @HttpCode(HttpStatus.OK)
  async getBySlug(@Param('slug') slug: string) {
    try {
      const data = await this.cruisesService.getBySlug(slug);
      return { status: true, message: CommonMessages.GET_DATA('Cruise'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  /** GET /api/cruises/cabins/:slug */
  @Get('/cabins/:slug')
  @HttpCode(HttpStatus.OK)
  async getCabins(@Param('slug') slug: string) {
    try {
      const data = await this.cruisesService.getCabins(slug);
      return { status: true, message: CommonMessages.GET_DATA('Cabins'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  /** GET /api/cruises/reviews/:slug?page=1&size=10 */
  @Get('/reviews/:slug')
  @HttpCode(HttpStatus.OK)
  async getReviews(
    @Param('slug') slug: string,
    @Query('page') page = '1',
    @Query('size') size = '10',
  ) {
    try {
      const data = await this.cruisesService.getReviews(
        slug,
        Math.max(1, parseInt(page) || 1),
        Math.min(50, Math.max(1, parseInt(size) || 10)),
      );
      return { status: true, message: CommonMessages.GET_LIST('Reviews'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }
}
