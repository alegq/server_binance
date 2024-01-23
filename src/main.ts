import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { EnvVariable } from './enum/evn-variable.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  await app.listen(configService.get<number>(EnvVariable.Port));
}
bootstrap();
