import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from '../../schema/recommendations.schema';
import { CruiseRecommendation } from '../../schema/cruise-recommendations.schema';
import { Cruise } from '../../schema/cruises.schema';
import { CruiseImage } from '../../schema/cruise-images.schema';
import { Ship } from '../../schema/ships.schema';
import { ShipImage } from '../../schema/ship-images.schema';
import { ShippingCompany } from '../../schema/shipping-companies.schema';
import { CruiseItinerary } from '../../schema/cruise-itinerary.schema';
import { Port } from '../../schema/ports.schema';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { AuthGuardService } from 'src/authGuard/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recommendation,
      CruiseRecommendation,
      Cruise,
      CruiseImage,
      Ship,
      ShipImage,
      ShippingCompany,
      CruiseItinerary,
      Port,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService, AuthGuardService],
  exports: [AuthGuardService]
})
export class RecommendationsModule { }
