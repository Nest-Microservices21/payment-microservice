import { registerAs } from '@nestjs/config';
export const BASE ="base"
export default registerAs(BASE, () => ({
  BASE_URL: process.env.BASE_URL,
}));
