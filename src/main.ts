import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {PeerServerService} from "./peer-server/peer-server.service";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Server } from "colyseus";
import { MyRoomService } from "./rooms/myroom.service";
import { ColyseusService } from "./colyseus/colyseus.service";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  /*app.enableCors({
    origin: "*"
  })*/

  const colyseusService = app.get(ColyseusService)

  await colyseusService.enableColyseusServer(app)

 /* const peerServerService = app.get(PeerServerService)
  peerServerService.enablePeerServer(app)*/

  await app.listen(3002);
}
bootstrap();
