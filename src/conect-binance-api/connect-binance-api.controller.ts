import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConnectBinanceApiService } from './connect-binance-api.service';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { OrderDto } from '../dto/order.tdo';

@Controller('connect-binance-api')
export class ConnectBinanceApiController {
  constructor(private readonly BinanceService: ConnectBinanceApiService) {}

  @Get()
  findAll(): string {
    return this.BinanceService.findAll();
  }

  @Get('data')
  async fetchDataFromExternalApi(): Promise<AxiosResponse> {
    return this.BinanceService.fetchDataFromExternalApi();
  }

  @Get('data_bit')
  async getDataChartCandles(
    @Query('symbol') symbol: string,
    @Query('interval') interval: string,
    @Query('limit') limit: number,
  ): Promise<AxiosResponse> {
    const response = await this.BinanceService.getDataChartCandles(
      symbol,
      interval,
      limit,
    );
    return response;
  }

  @Get('data_trades')
  fetchTrades(): Observable<any[]> {
    return this.BinanceService.fetchTrades();
  }
  @Get('data_orderBook')
  fetchOrderBook(): Promise<AxiosResponse> {
    return this.BinanceService.fetchOrderBook();
  }
  @Get('account-info')
  async getAccountInfo(): Promise<AxiosResponse> {
    return this.BinanceService.getAccountInfo();
  }
  @Get('price_market')
  async getPriceMarket(): Promise<AxiosResponse> {
    return this.BinanceService.getPriceMarket();
  }

  @Post('place-order')
  async placeLimitOrder(@Body() orderDto: OrderDto): Promise<any> {
    const { symbol, quantity, price, side, type, timeInForce, recvWindow } =
      orderDto;
    try {
      const result = await this.BinanceService.placeLimitOrder(orderDto);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // @Post('set-leverage')
  // async setLeverage(): Promise<any> {
  //   try {
  //     const result = await this.BinanceService.setLeverage();
  //     return { success: true, data: result };
  //   } catch (error) {
  //     return { success: false, error: error.message };
  //   }
  // }
}
