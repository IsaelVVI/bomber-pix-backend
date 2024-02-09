import { Controller, Get } from "@nestjs/common";
import { PeerServerService } from "./peer-server.service";

@Controller('peer-server')
export class PeerServerController {
  constructor(private readonly peerServerService: PeerServerService) {}

  @Get('connect')
  teste() {
    console.log(this.peerServerService.peerServer.on('connection', (client) => {
      const id = client.getId()
      console.log(`id: `, id.toLowerCase());
    }));
  }
}
