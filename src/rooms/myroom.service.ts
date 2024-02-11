import { Injectable, Logger } from "@nestjs/common";
import { Client, Room } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";


interface positionsInterface {
  x: number,
  y: number,
  direction: string,
  anim: string
}

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
  @type("boolean") connected: boolean = false
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("string") id: string = "";
  @type("number") qtd_bombs = 1;

  constructor(tempx: number, tempy:number, temp_id: string, connected: boolean) {
    super();
    this.x = tempx
    this.y = tempy
    this.id = temp_id
    this.connected = connected
  }
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

/*const blocks = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 0, 0, 0, 3, 0, 0, 3, 0, 3, 0, 0, 0, 0, 2],
  [2, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 2, 0, 2],
  [2, 3, 3, 3, 3, 3, 0, 3, 0, 3, 3, 0, 3, 3, 2],
  [2, 0, 2, 3, 2, 3, 2, 0, 2, 0, 2, 0, 2, 3, 2],
  [2, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 2],
  [2, 0, 2, 0, 2, 3, 2, 3, 2, 3, 2, 0, 2, 3, 2],
  [2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 2],
  [2, 0, 2, 3, 2, 3, 2, 3, 2, 0, 2, 0, 2, 0, 2],
  [2, 3, 3, 3, 0, 3, 3, 3, 0, 3, 0, 3, 3, 3, 2],
  [2, 3, 2, 0, 2, 3, 2, 0, 2, 3, 2, 3, 2, 3, 2],
  [2, 0, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 0, 2],
  [2, 0, 2, 3, 2, 0, 2, 0, 2, 0, 2, 3, 2, 0, 2],
  [2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
]*/

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

  blocks = []

  onCreate(options: any): void | Promise<any> {

    this.blocks = [
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 0, 0, 0, 3, 0, 0, 3, 0, 3, 0, 0, 0, 0, 2],
      [2, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 2, 0, 2],
      [2, 3, 3, 3, 3, 3, 0, 3, 0, 3, 3, 0, 3, 3, 2],
      [2, 0, 2, 3, 2, 3, 2, 0, 2, 0, 2, 0, 2, 3, 2],
      [2, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 2],
      [2, 0, 2, 0, 2, 3, 2, 3, 2, 3, 2, 0, 2, 3, 2],
      [2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 2],
      [2, 0, 2, 3, 2, 3, 2, 3, 2, 0, 2, 0, 2, 0, 2],
      [2, 3, 3, 3, 0, 3, 3, 3, 0, 3, 0, 3, 3, 3, 2],
      [2, 3, 2, 0, 2, 3, 2, 0, 2, 3, 2, 3, 2, 3, 2],
      [2, 0, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 0, 2],
      [2, 0, 2, 3, 2, 0, 2, 0, 2, 0, 2, 3, 2, 0, 2],
      [2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ]

    this.setState(new State());
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId)

      console.log({
        player_id: player.id,
        x: player.x,
        y: player.y,
        newX: data.x,
        newY: data.y
      });

      // console.log('y:', mapBlockLayer[data.y][data.x]);
      // console.log('x:', mapBlockLayer[data.x][data.y]);
      /*console.log(blocks[data.y][data.x]);
      console.log(blocks[data.x][data.y]);*/


      if(mapBlockLayer[data.y][data.x] === 0 && mapBlockLayer[data.x][data.y] === 0 && this.blocks[data.y][data.x] === 0){
          player.x = data.x
          player.y = data.y
          this.movementPlayers(client, {x: player.x,
            y: player.y, direction: data.direction})
      }

      // console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);

    });
    this.bombMessage()
    this.logger.log(`Room Created`);
  }

  onJoin(client: Client, options: any, auth: any) {
    this.logger.log("cliente: ", client.id);
    this.state.players.set(client.sessionId, new Player(1, 1, client.sessionId, true));
    for (const interator of this.state.players.keys()) {
      this.broadcast("connect_players", {
        id: interator,
        x: this.state.players.get(interator).x,
        y: this.state.players.get(interator).y,
        blocks: this.blocks
      });
    }

    // client.send("connect_players", client.sessionId)
  }

  async onLeave (client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    // flag client as inactive for other users
    for (const interator of this.state.players.keys()) {
      if(interator !== client.sessionId){
        this.broadcast("disconnect_players", {
          id: client.id,
        });
      }
    }
    /*this.state.players.get(client.sessionId).connected = false;

    try {
      if (consented) {
        throw new Error("consented leave");
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);

      // client returned! let's re-activate it.
      this.state.players.get(client.sessionId).connected = true;

    } catch (e) {

      // 20 seconds expired. let's remove the client.
      this.state.players.delete(client.sessionId);
    }*/
  }


  movementPlayers(client: Client, position: {x: number, y: number, direction: string}) {
    for (const interator of this.state.players.keys()) {
      if(interator && this.state.players.get(interator).connected){
        this.clients.getById(interator).send("move_player", {
          id: client.id,
          position
        })
      }
    }
  }

  /*  onDispose(): void | Promise<any> {
      return super.onDispose();
    }*/


  bombMessage(){
    interface insertBombInterface {
      quantity: number,
      x: number,
      y: number,
    }
    this.onMessage("insert_bomb", (client: Client, data: insertBombInterface) => {
      const player = this.state.players.get(client.sessionId)
      console.log(player.qtd_bombs);
      if(player.qtd_bombs === 1){
        const positions = this.generatePositionsBomb(data.quantity, {x: data.x, y: data.y})
        const positions_return: positionsInterface[] = []
        const rock_explode: positionsInterface[] = []

        for (const position of positions) {

          if(position.x < 0 || position.x > 13 || position.y < 0 || position.y > 13) continue


          if(this.blocks[position.y][position.x] === 3){
              this.blocks[position.y][position.x] = 0
              rock_explode.push(position)
              continue
          }

          if(mapBlockLayer[position.x][position.y] === 2 || mapBlockLayer[position.y][position.x]){
            continue
          }
          positions_return.push(position)
        }

        this.sendBomb(client, positions_return, rock_explode, positions)
        player.qtd_bombs -= 1;
      }

    })

    this.onMessage("explode_bomb", (client: Client, data) => {
      for (const interator of this.state.players.keys()) {
        const temp_player = this.state.players.get(interator)
        if(interator === client.sessionId && temp_player.qtd_bombs === 0){
          temp_player.qtd_bombs = 1
        }
      }
    })
  }

  generatePositionsBomb(quantity: number, initialPos: {x: number, y: number}) {
    const positions: positionsInterface[] = [];

    // Função para verificar se uma posição já existe na lista
    function positionExist(x: number, y: number) {
      return positions.some(posicao => posicao.x === x && posicao.y === y);
    }

    // Função para adicionar uma posição em uma direção específica
    function addPos(direction: string, xOffset: number, yOffset: number, anim: string) {
      let tempX = initialPos.x + xOffset;
      let tempY = initialPos.y + yOffset;

      // Verificar se a posição já existe e ajustar
      while (positionExist(tempX, tempY)) {
        tempX += xOffset;
        tempY += yOffset;
      }

      // Adicionar a propriedade anim de acordo com as regras
      positions.push({
        x: tempX,
        y: tempY,
        direction,
        anim,
      });
    }

    // Definir o sufixo padrão para animações
    let animPadrao = '_end';
    if (quantity < 8) {
      animPadrao = '_end';
    }

    // Adicionar posições de acordo com a quantity especificada
    for (let i = 1; i <= quantity; i++) {
      let anim = (quantity <= 4 || i % 2 === 0) ? animPadrao : '';
      addPos('cima', 0, -1, 'explosion_up');
      addPos('direita', 1, 0, 'explosion_right');
      addPos('baixo', 0, 1, 'explosion_down');
      addPos('esquerda', -1, 0, 'explosion_left');
    }

    // Limitar o número de posições ao valor especificado
    positions.splice(quantity);

    let temp_pos: positionsInterface[] = []

    temp_pos = positions.map((p, i) => {
      if(positions.length == 4){
        return {
          ...p,
          anim: `${p.anim}_end`
        }
      }

      if(positions.length - i <= 4){
        return {
          ...p,
          anim: `${p.anim}_end`
        }
      }

      return p

    })

    return temp_pos;
  }


  sendBomb(client: Client, positions: positionsInterface[], explodes: positionsInterface[], temp_positions: positionsInterface[]) {
    for (const interator of this.state.players.keys()) {
      this.clients.getById(interator).send("receive_bomb", {
        id: client.id,
        positions,
        explodes,
        temp_positions
      })
    }
  }
}