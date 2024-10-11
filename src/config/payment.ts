import { registerAs } from '@nestjs/config';
export const PAYMENTS ="payment"
export default registerAs(PAYMENTS, () => ({
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  STRIPE_WEBHOOK_SECRET:process.env.STRIPE_WEBHOOK_SECRET
}));
