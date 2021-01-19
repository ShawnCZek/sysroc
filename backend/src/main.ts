import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const environment = process.env.NODE_ENV || '';
const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: data.APP_URL,
  });
  app.use(cookieParser());
  await app.listen(4444);
}
bootstrap();
