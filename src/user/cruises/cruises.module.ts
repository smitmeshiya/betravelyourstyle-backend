import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { Cruise }                   from '../../schema/cruises.schema';
import { CruiseImage }              from '../../schema/cruise-images.schema';
import { Ship }                     from '../../schema/ships.schema';
import { ShipImage }                from '../../schema/ship-images.schema';
import { ShippingCompany }          from '../../schema/shipping-companies.schema';
import { CruiseItinerary }          from '../../schema/cruise-itinerary.schema';
import { Port }                     from '../../schema/ports.schema';
import { CruiseService as CruiseSvc } from '../../schema/cruise-services.schema';
import { CruiseEntryRequirement }   from '../../schema/cruise-entry-requirements.schema';
import { Review }                   from '../../schema/reviews.schema';
import { CabinCategory }            from '../../schema/cabin-categories.schema';
import { CruiseCabinOffer }         from '../../schema/cruise-cabin-offers.schema';

import { CruisesService }    from './cruises.service';
import { CruisesController } from './cruises.controller';
import { AuthGuardService }  from '../../authGuard/jwt.guard';
import { CabinCategory, CruiseCabinOffer } from 'src/schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cruise,
      CruiseImage,
      Ship,
      ShipImage,
      ShippingCompany,
      CruiseItinerary,
      Port,
      CruiseSvc,
      CruiseEntryRequirement,
      Review,
      CabinCategory,
      CruiseCabinOffer,
      CabinCategory,
      CruiseCabinOffer
    ]),
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      inject:     [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:        configService.get<string>('JWT_SECRET'),
        signOptions:   { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [CruisesController],
  providers:   [CruisesService, AuthGuardService],
  exports:     [CruisesService],
})
export class CruisesModule {}
