import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BomberpixGateway } from './bomberpix/bomberpix.gateway';
import { PeerServerService } from './peer-server/peer-server.service';
import { PeerServerController } from './peer-server/peer-server.controller';
import { MyRoomService } from "./rooms/myroom.service";
import { ColyseusService } from './colyseus/colyseus.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, BomberpixGateway, MyRoomService, ColyseusService],
})
export class AppModule {}
