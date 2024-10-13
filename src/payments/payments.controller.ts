import {  Controller, Get, HttpCode, HttpStatus, Post, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @MessagePattern({ cmd:'payments.create_session' })
  async createPayment(@Payload() createPaymentDto: CreatePaymentSessionDto) {
    return this.paymentsService.createPaymentSession(createPaymentDto);
  }
  @Get('success')
  
  async success() {
    return 'paymentSuccess';
  }
  @Get('cancelled')
  async cancel() {
    return 'paymentCancelled';
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(@Req() req: RawBodyRequest<Request>) {
   
    return this.paymentsService.stripeWebhook(req)
  }
}
