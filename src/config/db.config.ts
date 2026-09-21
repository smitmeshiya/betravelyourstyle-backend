import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [__dirname + '/../schema/*.schema{.ts,.js}'],
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
  }),
);
