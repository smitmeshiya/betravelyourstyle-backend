import { Controller, Get, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { UserGuard } from '../../authGuard/user.guard';
import { CommonMessages } from '../../common/common-message';

@Controller('/api/recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    try {
      const data = await this.recommendationsService.getAll();
      return { status: true, message: CommonMessages.GET_LIST('Recommendations'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  @Get('/get/:slug')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('slug') slug: string) {
    try {
      const data = await this.recommendationsService.getById(slug);
      return { status: true, message: CommonMessages.GET_DATA('Recommendation'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // GET /api/recommendations/:slug/cruises?page=1&limit=10
  @Get('/cruises/list/:slug')
  @HttpCode(HttpStatus.OK)
  async getCruises(
    @Param('slug') slug: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const data = await this.recommendationsService.getCruisesBySlug(
        slug,
        Math.max(1, parseInt(page) || 1),
        Math.min(100, Math.max(1, parseInt(limit) || 10)),
      );
      return { status: true, message: CommonMessages.GET_LIST('Cruises'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }
}
