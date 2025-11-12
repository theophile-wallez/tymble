import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors({
    origin: [
      'http://local.tymble.com',
      'https://local.tymble.com',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  });
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  const publicUrl = process.env.API_PUBLIC_URL ?? `http://api.local.tymble.com:${port}`;
  console.log(`Application is running on: ${publicUrl}`);
}
bootstrap();
