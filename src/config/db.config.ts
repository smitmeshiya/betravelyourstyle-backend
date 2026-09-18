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
    // Picks up all *.schema.ts / *.schema.js files under src/schema/
    entities: [__dirname + '/../schema/*.schema{.ts,.js}'],
    synchronize: false, // Never true in production — run schema.sql manually
    logging: process.env.NODE_ENV !== 'production',
  }),
);
