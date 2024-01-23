import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Server } from 'socket.io';
import { WebSocket } from 'ws';

@Injectable()
export class ConnectBinanceApiServiceWebsocket {
  private binanceApiUrl = 'https://testnet.binancefuture.com';

  private socket: Server;

  constructor(private readonly httpService: HttpService) {}

  setSocket(socket: Server) {
    this.socket = socket;
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

  subscribeToKline(symbol: string, interval: string) {
    console.log('connect to Kline');
    const subscribeUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;
    this.connectWebSocket(subscribeUrl, 'updateKline');
  }
}
