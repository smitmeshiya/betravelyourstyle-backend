import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuardService } from '../../authGuard/jwt.guard';
import { UserGuard } from '../../authGuard/user.guard';
import { AdminGuard } from '../../authGuard/admin.guard';
import { User } from '../../schema/users.schema';
import { DeviceToken } from '../../schema/device-tokens.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DeviceToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuardService, UserGuard, AdminGuard],
  exports: [AuthService, AuthGuardService, UserGuard, AdminGuard, JwtModule],
})
export class AuthModule {}
