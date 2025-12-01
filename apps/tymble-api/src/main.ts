import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors({
    origin: [
      'http://app.local.tymble.xyz:3001',
    ],
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '0.0.0.0';
  const publicUrl =
    process.env.API_PUBLIC_URL ?? `http://api.local.tymble.xyz:${port}`;
  console.log(`Application is running on: ${publicUrl}`);

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Tymble API')
      .setDescription('Tymble API description')
      .setVersion('1.0')
      .setContact(
        'Théophile Wallez',
        'https://theophilewallez.com',
        'theophile.wall@gmail.com'
      )
      .build()
  );
  const theme = new SwaggerTheme();
  const options = {
    explorer: false,
    customSiteTitle: 'Tymble Docs',
    useGlobalPrefix: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    jsonDocumentUrl: '/docs/openapi.json',
    yamlDocumentUrl: '/docs/openapi.yaml',
  } satisfies SwaggerCustomOptions;
  SwaggerModule.setup('docs', app, cleanupOpenApiDoc(openApiDoc), options);

  await app.listen(port, host);
}
bootstrap();
