import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingCompany } from '../../schema/shipping-companies.schema';
import { ShippingCompanyService } from './shipping_company.service';
import { ShippingCompanyController } from './shipping_company.controller';
import { AuthGuardService } from 'src/authGuard/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingCompany]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '7d' },
    }),
  }),],
  controllers: [ShippingCompanyController],
  providers: [ShippingCompanyService,AuthGuardService],
  exports:[AuthGuardService]
})
export class ShippingCompanyModule { }
