import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserGuard } from '../../authGuard/user.guard';
import { CommonMessages } from '../../common/common-message';
import { Request } from 'express';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/signup
  @Post('signup')
  async signup(@Body() body: {
    email: string;
    password: string;
    device_token?: string;
    device_type?: string;
    device_name?: string;
  }) {
    try {
      const result = await this.authService.signup(body);
      const messages = {
        exists:  CommonMessages.already_exist('Email'),
        resent:  CommonMessages.REGISTER_SUCCESS,
        created: CommonMessages.REGISTER_SUCCESS,
      };
      return { status: true, message: messages[result] };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // GET /api/auth/verify-email?token=...
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      const result = await this.authService.verifyEmail(token);
      const message = result === 'already_verified'
        ? CommonMessages.already_exist('Email verification')
        : CommonMessages.GET_DATA('Email verification');
      return { status: true, message };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // POST /api/auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: {
    email: string;
    password: string;
    device_token?: string;
    device_type?: string;
    device_name?: string;
  }) {
    try {
      const data = await this.authService.login(body);
      return { status: true, message: CommonMessages.LOGIN_SUCCESS, data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // POST /api/auth/logout  (protected)
  @UseGuards(UserGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request & { user: any },
    @Body() body: { device_token?: string },
  ) {
    try {
      const message = await this.authService.logout(req.user.userId, body?.device_token);
      return { status: true, message };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // GET /api/auth/profile  (protected)
  @UseGuards(UserGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: any }) {
    try {
      const data = await this.authService.getProfile(req.user.userId);
      return { status: true, message: CommonMessages.GET_DATA('Profile'), data };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // POST /api/auth/forgot/password
  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    try {
      await this.authService.forgotPassword(body);
      return { status: true, message: CommonMessages.FORGET_PASSWORD };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // POST /api/auth/reset/password
  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; new_password: string }) {
    try {
      await this.authService.resetPassword(body);
      return { status: true, message: CommonMessages.RESET_PASSWORD };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // PUT /api/auth/edit/profile  (protected)
  @UseGuards(UserGuard)
  @Put('edit/profile')
  @HttpCode(HttpStatus.OK)
  async editProfile(
    @Req() req: Request & { user: any },
    @Body() body: {
      first_name?: string;
      last_name?: string;
      profile_image?: string;
      street?: string;
      city?: string;
      birth_date?: string;
      country?: string;
      nationality?: string;
    },
  ) {
    try {
      await this.authService.updateProfile(req.user.userId, body, req);
      return { status: true, message: CommonMessages.updated_data('Profile') };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  // POST /api/auth/change-password  (protected)
  @UseGuards(UserGuard)
  @Put('change/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Req() req: Request & { user: any },
    @Body() body: { current_password: string; new_password: string },
  ) {
    try {
      await this.authService.changePassword(req.user.userId, body);
      return { status: true, message: CommonMessages.PWD_CHANGE };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }
}
