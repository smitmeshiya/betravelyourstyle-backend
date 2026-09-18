import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonapiService } from './common_api.service';
import { CommonapiController } from './common_api.controller';
import { AuthGuardService } from 'src/authGuard/jwt.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '7d' },
        }),
      }),
  ],
  controllers: [CommonapiController],
  providers: [CommonapiService,AuthGuardService],
  exports: [CommonapiService], 
})
export class CommonapiModule {}
