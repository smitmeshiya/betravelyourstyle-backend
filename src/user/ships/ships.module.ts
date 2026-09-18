import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ship } from '../../schema/ships.schema';
import { ShipContentSection } from '../../schema/ship-content-sections.schema';
import { ShipDeck } from '../../schema/ship-decks.schema';
import { CabinCategory } from '../../schema/cabin-categories.schema';
import { Review } from '../../schema/reviews.schema';
import { Cruise } from '../../schema/cruises.schema';
import { ShippingCompany } from '../../schema/shipping-companies.schema';
import { ShipsService } from './ships.service';
import { ShipsController } from './ships.controller';
import { AuthGuardService } from 'src/authGuard/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ship,
      ShipContentSection,
      ShipDeck,
      CabinCategory,
      Review,
      Cruise,
      ShippingCompany,
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
  controllers: [ShipsController],
  providers: [ShipsService, AuthGuardService],
  exports: [AuthGuardService],
})
export class ShipsModule {}
