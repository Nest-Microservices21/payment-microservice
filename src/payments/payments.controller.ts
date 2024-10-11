import { Body, Controller, Get, Post, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('create-session')
  async createPayment(@Body() createPaymentDto: CreatePaymentSessionDto) {
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
  async stripeWebhook(@Req() req: RawBodyRequest<Request>) {
   
    return this.paymentsService.stripeWebhook(req)
  }
}
