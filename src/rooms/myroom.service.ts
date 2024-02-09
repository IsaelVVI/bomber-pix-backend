import { Injectable, Logger } from "@nestjs/common";
import { Client, Room } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";


// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
  @type("number") x: number = Math.floor(Math.random() * (10 - 1 + 1));
  @type("number") y: number = Math.floor(Math.random() * (10 - 1 + 1));
  @type("string") id: string = "";
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}


const mapBlockLayer = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

const tile_size = 16;

@Injectable()
export class MyRoomService extends Room<State> {
  private logger: Logger = new Logger("MyroomService");

  onCreate(options: any): void | Promise<any> {
    this.setState(new State());

    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);

      /*console.log('y:', mapBlockLayer[data.y][data.x]);
      console.log('x:', mapBlockLayer[data.x][data.y]);*/
      if(mapBlockLayer[data.y][data.x] === 0 && mapBlockLayer[data.x][data.y] === 0){
        this.state.players.get(client.sessionId).x = data.x
        this.state.players.get(client.sessionId).y = data.y
        this.movementPlayers( {x: this.state.players.get(client.sessionId).x,
          y: this.state.players.get(client.sessionId).y}, player.id)
      }

      // console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);

    });
    this.logger.log(`Room Created`);
  }

  onJoin(client: Client, options: any, auth: any) {
    this.logger.log("cliente: ", client.id);
    this.state.players.set(client.sessionId, new Player());
    for (const interator of this.state.players.keys()) {
      this.broadcast("connect_players", {
        id: interator,
        x: this.state.players.get(interator).x,
        y: this.state.players.get(interator).y
      });
    }

    // client.send("connect_players", client.sessionId)
  }

  onLeave(client: Client, consented: boolean): void | Promise<any> {
  }


  movementPlayers(position: {x: number, y: number}, id: string) {
    for (const interator of this.state.players.keys()) {
        this.broadcast("move_player", {
          id: interator,
          position
        });
    }
  }

  /*  onDispose(): void | Promise<any> {
      return super.onDispose();
    }*/

}