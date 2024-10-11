import { Module, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ConfigModule } from '@nestjs/config';
import payment from 'src/config/payment';
import base from 'src/config/base';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [payment, base],
    }),
  ],

  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        always: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class PaymentsModule {}
