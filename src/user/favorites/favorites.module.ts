import { Module }          from '@nestjs/common';
import { TypeOrmModule }   from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule }       from '@nestjs/jwt';
import { UserFavorite }    from '../../schema/user-favorites.schema';
import { Cruise }          from '../../schema/cruises.schema';
import { CruiseImage }     from '../../schema/cruise-images.schema';
import { Ship }            from '../../schema/ships.schema';
import { ShippingCompany } from '../../schema/shipping-companies.schema';
import { FavoritesService }    from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { AuthGuardService }    from '../../authGuard/jwt.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserFavorite, Cruise, CruiseImage, Ship, ShippingCompany]),
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      inject:     [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret:      cs.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [FavoritesController],
  providers:   [FavoritesService, AuthGuardService],
})
export class FavoritesModule {}
