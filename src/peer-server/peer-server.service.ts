import { Injectable, Logger } from "@nestjs/common";
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressPeerServer, PeerServerEvents } from 'peer';
import { Express } from 'express';



@Injectable()
export class PeerServerService {
  private logger: Logger = new Logger("PeerServerService")

  peerServer: Express & PeerServerEvents;
  enablePeerServer(app: NestExpressApplication) {

    this.peerServer = ExpressPeerServer(app.getHttpServer(), {
      path: '/peer-server'
    })

    app.use(this.peerServer)


    this.peerServer.on('connection', (client) => {
      console.log('cliente: ', client.getSocket());
    })

    this.logger.log("Peer Server Initialized")
  }
}