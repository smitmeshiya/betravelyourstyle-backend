import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../schema/users.schema';
import { DeviceToken } from '../../schema/device-tokens.schema';
import { sendMail } from '../../common/common.utils';
import {
  emailVerificationTemplate,
  passwordResetTemplate,
  passwordChangedTemplate,
  welcomeTemplate,
} from '../../common/templates';
import { CommonMessages } from '../../common/common-message';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepo: Repository<DeviceToken>,
    private readonly jwtService: JwtService,
  ) { }

  private async saveDeviceToken(
    userId: string,
    email: string,
    deviceToken?: string,
  ): Promise<void> {
    if (!deviceToken) return;

    const exists = await this.deviceTokenRepo.findOne({
      where: { user_id: userId, device_token: deviceToken },
    });

    if (!exists) {
      await this.deviceTokenRepo.save(
        this.deviceTokenRepo.create({
          user_id: userId,
          email,
          device_token: deviceToken,
        }),
      );
    }
  }

  async signup(body: {
    email: string;
    password: string;
    device_token?: string;
    device_type?: string;
    device_name?: string;
  }): Promise<'exists' | 'resent' | 'created'> {
    try {
      if (!body.email || !body.password) {
        throw new BadRequestException('email and password are required.');
      }

      const existing = await this.userRepo.findOne({
        where: { email: body.email },
      });

      if (existing) {
        if (existing.email_verified_at) {
          await this.saveDeviceToken(existing.id, existing.email, body.device_token);
          return 'exists';
        }

        // Not yet verified → re-send verification mail
        const token = this.jwtService.sign(
          { sub: existing.id, email: existing.email },
          { expiresIn: '24h' },
        );
        await this.userRepo.update(existing.id, { email_verification_token: token });

        const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
        sendMail(
          existing.email,
          'Your registration – confirm now',
          emailVerificationTemplate(existing.firstname ?? 'there', verifyUrl),
        ).catch((err) => console.error('Background mail error (resend):', err));

        return 'resent';
      }

      // New user
      const hashed = await bcrypt.hash(body.password, 10);
      const user = this.userRepo.create({ email: body.email, password: hashed });
      await this.userRepo.save(user);

      // Save device token for new user
      await this.saveDeviceToken(user.id, user.email, body.device_token);

      const token = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '24h' },
      );
      await this.userRepo.update(user.id, { email_verification_token: token });

      const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
      sendMail(
        user.email,
        'Your registration – confirm now',
        emailVerificationTemplate('there', verifyUrl),
      ).catch((err) => console.error('Background mail error (new user):', err));

      return 'created';
    } catch (error: any) {
      console.error('Error in signup:', error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<'already_verified' | 'verified'> {
    try {
      let payload: { sub: string; email: string };
      try {
        payload = this.jwtService.verify(token);
      } catch {
        throw new BadRequestException(CommonMessages.INVALID_TOKEN);
      }

      const user = await this.userRepo.findOne({
        where: { id: payload.sub, email_verification_token: token },
      });

      if (!user) {
        throw new BadRequestException(CommonMessages.INVALID_TOKEN);
      }

      if (user.email_verified_at) {
        return 'already_verified';
      }

      await this.userRepo.update(user.id, {
        email_verified_at: new Date(),
        email_verification_token: null,
      });

      const loginUrl = `${process.env.APP_URL}/login`;
      sendMail(
        user.email,
        'Welcome to Finest Cruise Moments!',
        welcomeTemplate(user.firstname ?? 'there', loginUrl),
      ).catch((err) => console.error('Background mail error (welcome):', err));

      return 'verified';
    } catch (error: any) {
      console.error('Error in verifyEmail:', error);
      throw error;
    }
  }

  async login(body: {
    email: string;
    password: string;
    device_token?: string;
    device_type?: string;
    device_name?: string;
  }) {
    try {
      const user = await this.userRepo.findOne({ where: { email: body.email } });

      if (!user) {
        throw new UnauthorizedException(CommonMessages.INVALID_CREDENTIALS);
      }

      if (!user.email_verified_at) {
        throw new UnauthorizedException(CommonMessages.not_found('Verified email'));
      }

      const passwordMatch = await bcrypt.compare(body.password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException(CommonMessages.INVALID_CREDENTIALS);
      }

      // Save device token if provided
      await this.saveDeviceToken(user.id, user.email, body.device_token);

      const payload = { sub: user.id, email: user.email, role: user.role };
      const access_token = this.jwtService.sign(payload);

      const { password, ...userData } = user;
      return { access_token, user: userData };
    } catch (error: any) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException(CommonMessages.USER_NOT_FOUND);
      const { password, ...result } = user;

      // Prepend full URL if a profile image path is stored
      if (result.profile_image) {
        const serverBase = (process.env.BASE_URL ?? '').replace(/\/api$/, '');
        result.profile_image = `${serverBase}/${result.profile_image}`;
      }

      return result;
    } catch (error: any) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

   async updateProfile(user_id: string, body: any, req: any) {
    try {
        const user = await this.userRepo.findOne({ where: { id: user_id } });
        if (!user) throw new NotFoundException(CommonMessages.USER_NOT_FOUND);

        user.firstname = body.first_name;
        user.lastname = body.last_name;
        user.profile_image = body.profile_image,
        user.street = body.street;
        user.city = body.city;
        user.birth_date = body.birth_date;
        user.county = body.country;
        user.nationality = body.nationality;

        await this.userRepo.save(user);

      return true;

    } catch (error) {
      console.error('Account Setup Error:', error);
      throw error;
    }
  }

  async logout(userId: string, deviceToken?: string): Promise<string> {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException(CommonMessages.USER_NOT_FOUND);

      const token = await this.deviceTokenRepo.findOne({
        where: { user_id: userId, device_token: deviceToken },
      });

      if (!token) {
        throw new NotFoundException(CommonMessages.not_found('Device token'));
      }

      await this.deviceTokenRepo.softRemove(token);

      return CommonMessages.LOGOUT_SUCCESS;
    } catch (error: any) {
      console.error('Error in logout:', error);
      throw error;
    }
  }

  async forgotPassword(body: { email: string }): Promise<void> {
    try {
      const user = await this.userRepo.findOne({ where: { email: body.email } });

      if (!user || !user.email_verified_at) return; // silent — prevent enumeration

      const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });

      await this.userRepo.update(user.id, {
        reset_password_token: token,
        reset_password_expires_at: new Date(Date.now() + 60 * 60 * 1000),
      });

      const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${token}`;
      sendMail(
        user.email,
        'Reset your password',
        passwordResetTemplate(user.firstname ?? 'there', resetUrl),
      ).catch((err) => console.error('Background mail error (forgot password):', err));
    } catch (error: any) {
      console.error('Error in forgotPassword:', error);
      throw error;
    }
  }

  async resetPassword(body: { token: string; new_password: string }): Promise<void> {
    try {
      let payload: { sub: string };
      try {
        payload = this.jwtService.verify(body.token);
      } catch {
        throw new UnauthorizedException(CommonMessages.INVALID_TOKEN);
      }

      const user = await this.userRepo.findOne({
        where: { id: payload.sub, reset_password_token: body.token },
      });

      if (!user || !user.reset_password_expires_at) {
        throw new UnauthorizedException(CommonMessages.INVALID_TOKEN);
      }

      if (user.reset_password_expires_at < new Date()) {
        throw new UnauthorizedException(CommonMessages.INVALID_TOKEN);
      }

      const hashed = await bcrypt.hash(body.new_password, 10);
      await this.userRepo.update(user.id, {
        password: hashed,
        reset_password_token: null,
        reset_password_expires_at: null,
      });
    } catch (error: any) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  }

  async changePassword(
    userId: string,
    body: { current_password: string; new_password: string },
  ): Promise<void> {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException(CommonMessages.USER_NOT_FOUND);

      const match = await bcrypt.compare(body.current_password, user.password);
      if (!match) throw new UnauthorizedException(CommonMessages.OLD_PWD_WRONG);

      const hashed = await bcrypt.hash(body.new_password, 10);
      await this.userRepo.update(userId, { password: hashed });

      sendMail(
        user.email,
        'Your password has been changed',
        passwordChangedTemplate(user.firstname ?? 'there'),
      ).catch((err) => console.error('Background mail error (change password):', err));
    } catch (error: any) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  }
}
