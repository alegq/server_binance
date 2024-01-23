import { Module } from '@nestjs/common';
import { ConnectBinanceApiService } from './connect-binance-api.service';
import { ConnectBinanceApiController } from './connect-binance-api.controller';
import { HttpModule } from '@nestjs/axios';
import { ConnectBinanceApiGateway } from './connect-binance-api.gateway';
import { ConnectBinanceApiServiceWebsocket } from './connect-binance-api-websocket.service';

@Module({
  imports: [HttpModule],
  providers: [
    ConnectBinanceApiService,
    ConnectBinanceApiGateway,
    ConnectBinanceApiServiceWebsocket,
  ],
  controllers: [ConnectBinanceApiController],
})
export class ConnectBinanceApiModule {}
