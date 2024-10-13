import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import base from 'src/config/base';
export const NATS_CLIENT = 'NATS_CLIENT';
const baseNatsConfig = ClientsModule.registerAsync([
  {
    name: NATS_CLIENT,
    imports: [ConfigModule.forFeature(base)],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      transport: Transport.NATS,
      options: {
        servers: configService.get<string[]>('base.NATS_SERVERS'),
      },
    }),
  },
]);
@Module({
  imports: [baseNatsConfig],

  exports: [baseNatsConfig],
})
export class NatsModule {}
