import {
  BadRequestException,
  Inject,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import base from 'src/config/base';
import payment from 'src/config/payment';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { type Request } from 'express';
import { NATS_CLIENT } from 'src/nats-config/nats.module';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    @Inject(payment.KEY) private paymentConfig: ConfigType<typeof payment>,
    @Inject(base.KEY) private baseConfig: ConfigType<typeof base>,
    @Inject(NATS_CLIENT) private natsClient: ClientProxy,
  ) {
    this.stripe = new Stripe(paymentConfig.STRIPE_SECRET_KEY);
  }

  async createPaymentSession(createPaymentDto: CreatePaymentSessionDto) {
    const { currency, items, orderId } = createPaymentDto;
    const lineItems = items.map<Stripe.Checkout.SessionCreateParams.LineItem>(
      (item) => {
        const formattedAmount = parseFloat(item.price.toFixed(2));
        const unitAmountInCents = Math.round(formattedAmount * 100);
        return {
          price_data: {
            currency,
            product_data: {
              name: item.name,
            },
            unit_amount: unitAmountInCents,
          },
          quantity: item.quantity,
        };
      },
    );
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: { orderId },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${this.baseConfig.BASE_URL}/payments/success`,
      cancel_url: `${this.baseConfig.BASE_URL}/payments/cancelled`,
    });
    return {
      type: session.object,
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
      url: session.url,
    };
  }
  async stripeWebhook(req: RawBodyRequest<Request>) {
    const signature = req.headers?.['stripe-signature'];
    const body = req.rawBody;
    if (!signature)
      throw new BadRequestException('Missing Stripe signature header');

    this.stripe.webhooks
      .constructEventAsync(
        body,
        signature,
        this.paymentConfig.STRIPE_WEBHOOK_SECRET,
      )
      .then((event) => {
        if (event.type === 'charge.succeeded') {
          const chargedSuccedded = event.data.object;
          const payload = {
            stripePaymentId: chargedSuccedded.id,
            orderId: chargedSuccedded.metadata.orderId,
            receiptUrl: chargedSuccedded.receipt_url,
          };
          this.natsClient.emit('payments.succedded', payload);
        }
        return { signature };
      })
      .catch((err: Error) => {
        throw new BadRequestException(
          `Webhook signature verification failed ${err.message}`,
        );
      });
  }
}
