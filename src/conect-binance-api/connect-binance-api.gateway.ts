import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConnectBinanceApiServiceWebsocket } from './connect-binance-api-websocket.service';

@WebSocketGateway({
  cors: {
    original: '*',
  },
})
export class ConnectBinanceApiGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly binanceApiServiceWebsocket: ConnectBinanceApiServiceWebsocket,
  ) {}

  @SubscribeMessage('subscribeToBinanceData')
  handleSubscribeToBinanceData(@MessageBody() symbol: string) {
    this.binanceApiServiceWebsocket.setSocket(this.server);
    this.binanceApiServiceWebsocket.subscribeToBinanceData(symbol);
    return symbol;
  }

  @SubscribeMessage('subscribeTrades')
  subscribeTrades(@MessageBody() symbol: string) {
    this.binanceApiServiceWebsocket.setSocket(this.server);
    this.binanceApiServiceWebsocket.subscribeTrades(symbol);
    return symbol;
  }

  @SubscribeMessage('subscribeKline')
  subscribeKline(
    @MessageBody() { symbol, interval }: { symbol: string; interval: string },
  ) {
    this.binanceApiServiceWebsocket.setSocket(this.server);
    this.binanceApiServiceWebsocket.subscribeToKline(symbol, interval);
    return symbol;
  }

  @SubscribeMessage('event')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
