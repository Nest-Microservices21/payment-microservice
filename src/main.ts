import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './config/main';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Payments-MS');
  const app = await NestFactory.create(AppModule,{ rawBody:true});
  await app.listen(serverConfig.PORT);
  logger.log(`Server running on port ${serverConfig.PORT}`);
}
bootstrap();
