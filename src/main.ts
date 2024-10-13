import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './config/main';
import { Logger } from '@nestjs/common';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Payments-MS');
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: serverConfig.NATS_SERVERS,
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
  await app.listen(serverConfig.PORT);
  logger.log(`Server running on port ${serverConfig.PORT}`);
}
bootstrap();
