import { Injectable, Logger } from "@nestjs/common";
import { NestExpressApplication } from '@nestjs/platform-express';
import { Express } from 'express';
import { Server } from "colyseus";
import { MyRoomService } from "../rooms/myroom.service";

@Injectable()
export class ColyseusService {
  private logger: Logger = new Logger("PeerServerService")

  colyseus: Server

  async enableColyseusServer(app: NestExpressApplication) {

    this.colyseus = new Server()

    // Rooms definidas
    this.colyseus.define("my_room", MyRoomService)

    await this.colyseus.listen(3030)

    this.logger.log("Colyseus Server Initialized")
  }

}