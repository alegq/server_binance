import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { WebSocket } from 'ws';
import * as crypto from 'crypto';
import { OrderDto } from '../dto/order.tdo';

@Injectable()
export class ConnectBinanceApiService {
  private binanceApiUrl = 'https://testnet.binancefuture.com';
  private apiKey =
    'f3d4b960ad1aae82fd6ff4cbfe3db79b40408f9bcb81069dccf64e27f775dd57';
  private apiSecret =
    'ae8e0cc9234da231d0ca6aefc71ace094e1104e830938ec1d18c1a405a17ea0c';
  private socket: Server;
  private async fetchTimeOffset(): Promise<number> {
    const serverTime = await this.httpService
      .get('https://api.binance.com/api/v3/time')
      .toPromise();

    const localTime = Date.now();
    const serverTimeOffset = serverTime.data.serverTime - localTime;
    return serverTimeOffset;
  }

  constructor(private readonly httpService: HttpService) {}

  setSocket(socket: Server) {
    this.socket = socket;
  }

  async placeLimitOrder1(
    symbol: string,
    quantity: number,
    price: number,
  ): Promise<any> {
    const endpoint = '/fapi/v1/order';

    const timeOffset = await this.fetchTimeOffset();
    const timestamp = Date.now() + timeOffset;

    const data = {
      symbol,
      side: 'BUY',
      type: 'LIMIT',
      quantity,
      price,
      timeInForce: 'GTC',
      recvWindow: 5000,
      timestamp,
    };

    const queryString = Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');
    console.log(queryString);
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(queryString)
      .digest('hex');
    // const signature = CryptoJS.HmacSHA256(
    //   queryString,
    //   this.apiSecret,
    // ).toString();
    const url = `${this.binanceApiUrl}${endpoint}`;

    try {
      const response = await this.httpService
        .post(
          url,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'X-MBX-APIKEY': this.apiKey,
            },
            params: {
              ...data,
              signature,
            },
          },
        )
        .toPromise();

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || error.message || 'Unknown error';
      console.error('Ошибка при размещении ордера:', errorMessage);
      throw errorMessage;
    }
  }

  async placeLimitOrder(orderData: OrderDto): Promise<any> {
    const endpoint = '/fapi/v1/order';

    const timeOffset = await this.fetchTimeOffset();
    const timestamp = Date.now() + timeOffset;

    const data = {
      ...orderData,
      timestamp,
    };
    console.log(data);

    const queryString = Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');

    // const signature = CryptoJS.HmacSHA256(
    //   queryString,
    //   this.apiSecret,
    // ).toString();

    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(queryString)
      .digest('hex');

    const url = `${this.binanceApiUrl}${endpoint}?${queryString}&signature=${signature}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MBX-APIKEY': this.apiKey,
        },
        // body: JSON.stringify({}),
      });

      const fullUrl = response.url;
      console.log('Full Request URL:', fullUrl);

      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      console.error('Ошибка при размещении ордера:', errorMessage);
      throw errorMessage;
    }
  }

  //-----------------------------------------------------------------------------------------------------------
  async getAccountInfo(): Promise<any> {
    console.log('connect AccountInfo');
    const endpoint = '/fapi/v2/account';
    const timeOffset = await this.fetchTimeOffset();
    const timestamp = Date.now() + timeOffset;
    const queryString = `timestamp=${timestamp}`;
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(queryString)
      .digest('hex');
    const url = `${this.binanceApiUrl}${endpoint}?${queryString}&signature=${signature}`;

    try {
      const response = await this.httpService
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            'X-MBX-APIKEY': this.apiKey,
          },
        })
        .toPromise();
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async fetchDataFromExternalApi(): Promise<AxiosResponse> {
    const externalApiUrl = 'http://localhost:3005/';

    const response = await this.httpService.get(externalApiUrl).toPromise();
    return response.data;
  }

  async getDataChartCandles(
    symbol: string,
    interval: string,
    limit: number,
  ): Promise<AxiosResponse> {
    const response = await this.httpService
      .get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      )
      .toPromise();

    return response.data;
  }

  fetchTrades(): Observable<any[]> {
    const symbol = 'BTCUSDT';
    return this.httpService
      .get(`https://api.binance.com/api/v3/trades?symbol=${symbol}`)
      .pipe(map((response) => response.data));
  }

  async fetchOrderBook(): Promise<AxiosResponse> {
    const symbol = 'BTCUSDT';
    const limit = 10;

    const response = await this.httpService
      .get(
        `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`,
      )
      .toPromise();

    return response.data;
  }

  async getPriceMarket(): Promise<AxiosResponse> {
    // const symbol = 'BTCUSDT';
    // const limit = 10;

    const response = await this.httpService
      .get(
        `https://testnet.binancefuture.com/fapi/v1/ticker/price?symbol=BTCUSDT`,
      )
      .toPromise();

    return response.data;
  }

  findAll(): string {
    return 'This action returns all binance 3';
  }

  private connectWebSocket(subscribeUrl: string, eventName: string) {
    const subscribeSocket = new WebSocket(subscribeUrl);

    subscribeSocket.onmessage = (event) => {
      const data = JSON.parse(event.data.toString());
      this.socket.emit(eventName, data);
    };

    subscribeSocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    subscribeSocket.onclose = () => {
      console.log('WebSocket Closed');
    };
  }

  subscribeToBinanceData(symbol: string) {
    console.log('connect to Order Book');
    const subscribeUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`;
    this.connectWebSocket(subscribeUrl, 'updateOrderBook');
  }

  subscribeTrades(symbol: string) {
    console.log('connect to Trades');
    const subscribeUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`;
    this.connectWebSocket(subscribeUrl, 'updateTrades');
  }
}
