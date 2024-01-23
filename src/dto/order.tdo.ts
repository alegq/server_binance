import { IsNumber, IsString } from 'class-validator';

export class OrderDto {
  @IsString()
  symbol: string;
  @IsNumber()
  quantity: number;
  @IsNumber()
  price?: number;
  @IsNumber()
  stopPrice?: number;
  side: 'BUY' | 'SELL';
  type: 'LIMIT';
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
  @IsNumber()
  recvWindow: number;
}
