import { Controller, Get, Param, Put, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ShipsService } from './ships.service';
import { CommonMessages } from '../../common/common-message';

@Controller('/api/ships')
export class ShipsController {
  constructor(private readonly shipsService: ShipsService) {}

  // GET /api/ships/list
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    try {
      const data = await this.shipsService.getAll();
      return { status: true, message: CommonMessages.GET_LIST('Ships'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // GET /api/ships/get/:slug?page=1&size=10
  @Get('/get/:slug')
  @HttpCode(HttpStatus.OK)
  async getBySlug(
    @Param('slug') slug: string,
    @Query('page') page = '1',
    @Query('size') size = '10',
  ) {
    try {
      const data = await this.shipsService.getBySlug(slug, +page, +size);
      return { status: true, message: CommonMessages.GET_DATA('Ship'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // GET /api/ships/review/:id
  @Get('/review/:id')
  @HttpCode(HttpStatus.OK)
  async getReviewById(@Param('id') id: string) {
    try {
      const data = await this.shipsService.getReviewById(id);
      return { status: true, message: CommonMessages.GET_DATA('Review'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // PUT /api/ships/review/:id/helpful
  @Put('/review/:id/helpful')
  @HttpCode(HttpStatus.OK)
  async markHelpful(@Param('id') id: string) {
    try {
      await this.shipsService.markReviewHelpful(id, true);
      return { status: true, message: 'Marked as helpful' };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // PUT /api/ships/review/:id/not-helpful
  @Put('/review/:id/not-helpful')
  @HttpCode(HttpStatus.OK)
  async markNotHelpful(@Param('id') id: string) {
    try {
      await this.shipsService.markReviewHelpful(id, false);
      return { status: true, message: 'Marked as not helpful' };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }
}
