import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './config/db.config';
import { AuthModule } from './user/auth/auth.module';
import { GuardModule } from './authGuard/guard.module';
import { CommonapiModule } from './common_api/common_api.module';

import { RecommendationsModule } from './user/recommendations/recommendations.module';
import { ShippingCompanyModule } from './user/shipping_company/shipping_company.module';
import { ShipsModule } from './user/ships/ships.module';
import { CruisesModule } from './user/cruises/cruises.module';
import { BookingsModule } from './user/bookings/bookings.module';
import { FavoritesModule } from './user/favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),

    GuardModule, // global — AuthGuardService, UserGuard, AdminGuard available everywhere
    AuthModule,
    CommonapiModule,
    RecommendationsModule,
    ShippingCompanyModule,
    ShipsModule,
    CruisesModule,
    BookingsModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
