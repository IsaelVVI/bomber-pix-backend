import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway({cors: true})
export class BomberpixGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("WebsocketGateway")

  @SubscribeMessage('newMessage')
  async handleMessage(client: Socket, payload: any) {
    this.server.emit('messageClient', 'olá')
  }

  @SubscribeMessage("join")
  async joinRoom(client: Socket, payload: any){
    client.join(payload)
    console.log(`cliente: ${client.id}` , `message: ${payload}`);
    this.server.to(payload).emit("messageClient", `${client.id}`)

    const clients = await this.server.in('room01').fetchSockets()

    for (const temp_client of clients) {
      if(client.id !== temp_client.id){
        this.server.to(temp_client.id).emit("messageClient", `${client.id}`)
        this.server.to(client.id).emit("messageClient", `${temp_client.id}`)
      }
    }
  }

  @SubscribeMessage('movement')
  async movementPlayers(client: Socket, payload: any) {


    let x = payload.x
    let y = payload.y

    this.server.to('room01').emit('playerMovements', {
      x,
      y,
      id: client.id
    })
  }

  @SubscribeMessage('anim')
  async changeAnimations(client: Socket, payload: string){
    this.server.to('room01').emit('changeAnimation', {id: client.id, anim: payload})
  }




  afterInit(server: Server): any {
    this.logger.log('Init')
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Client connected: ${client.id}`)
  }


  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected: ${client.id}`)
  }


}
