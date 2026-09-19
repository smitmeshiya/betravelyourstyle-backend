import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS.
  // Production: set CORS_ORIGIN in Render env vars to your Netlify URL
  //   e.g.  CORS_ORIGIN=https://betravelyourstyle-frontend.netlify.app
  // Multiple origins are comma-separated:
  //   e.g.  CORS_ORIGIN=https://betravelyourstyle-frontend.netlify.app,https://www.betravelyourstyle.com
  // Development fallback: Vite dev server on localhost:5173
  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
      : ['http://localhost:5173', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Serve everything inside ./uploads at the /uploads URL path
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
