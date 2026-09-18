import {
  Controller, Get, Post, Delete,
  Param, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UserGuard }        from '../../authGuard/user.guard';
import { CommonMessages }   from '../../common/common-message';
import { Request }          from 'express';

@Controller('/api/favorites')
@UseGuards(UserGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /** GET /api/favorites — full enriched list */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getList(@Req() req: Request & { user: any }) {
    try {
      const data = await this.favoritesService.getList(req.user.userId);
      return { status: true, message: CommonMessages.GET_LIST('Favorites'), data };
    } catch (e: any) { return { status: false, message: e.message }; }
  }

  /** GET /api/favorites/ids — lightweight: just cruise UUID list */
  @Get('ids')
  @HttpCode(HttpStatus.OK)
  async getIds(@Req() req: Request & { user: any }) {
    try {
      const data = await this.favoritesService.getFavoriteIds(req.user.userId);
      return { status: true, message: CommonMessages.GET_LIST('Favorite IDs'), data };
    } catch (e: any) { return { status: false, message: e.message }; }
  }

  /** POST /api/favorites/:cruise_id — add to favorites */
  @Post(':cruise_id')
  @HttpCode(HttpStatus.CREATED)
  async add(
    @Param('cruise_id') cruiseId: string,
    @Req() req: Request & { user: any },
  ) {
    try {
      const data = await this.favoritesService.addFavorite(req.user.userId, cruiseId);
      return { status: true, message: CommonMessages.CREATED_DATA('Favorite'), data };
    } catch (e: any) { return { status: false, message: e.message }; }
  }

  /** DELETE /api/favorites/:cruise_id — remove from favorites */
  @Delete(':cruise_id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('cruise_id') cruiseId: string,
    @Req() req: Request & { user: any },
  ) {
    try {
      await this.favoritesService.removeFavorite(req.user.userId, cruiseId);
      return { status: true, message: CommonMessages.deleted_data('Favorite') };
    } catch (e: any) { return { status: false, message: e.message }; }
  }
}
