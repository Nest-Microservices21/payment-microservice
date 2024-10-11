import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PaymentSessionItem {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
export class CreatePaymentSessionDto {

  @IsNumber()
  @IsPositive()
  orderId: number;

  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentSessionItem)
  items: PaymentSessionItem[];
}
