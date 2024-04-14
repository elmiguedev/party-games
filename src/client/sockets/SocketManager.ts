import io, { Socket } from "socket.io-client";
import { Room } from "../../states/Room";
import { Player } from "../../states/Player";
import { Game } from "../../states/Game";

export class SocketManager {

  private static instance: SocketManager;
  private socket: Socket;

  public room: Room;
  public player: Player;
  public playerId?: string;

  public onRoomState: Function;
  public onPlayerDisconnect: Function;
  public onRoomReady: Function;
  public onGameFinished: Function;
  public onPlayerUpdate: Function;

  private constructor() {
    this.socket = io("");

    this.socket.on("connect", () => {
      console.log("connected");
      this.playerId = this.socket.id;
    });

    this.socket.on("room:state", (roomState: any) => {
      this.room = roomState;

      if (this.playerId)
        this.player = roomState.players[this.socket.id!];

      console.log(roomState, this.playerId)

      if (this.onRoomState) this.onRoomState(roomState);
    })

    this.socket.on("player:disconnect", (playerId: string) => {
      if (this.onPlayerDisconnect) this.onPlayerDisconnect(playerId);
    })

    this.socket.on("room:ready", () => {
      if (this.onRoomReady) this.onRoomReady();
    })

    this.socket.on("game:finished", (game: Game) => {
      if (this.onGameFinished) this.onGameFinished(game);
    })

    this.socket.on("player:update", (player: any) => {
      if (this.onPlayerUpdate) this.onPlayerUpdate(player);
    })
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public joinRoom(name: string, room?: string) {
    this.socket.emit("join", { name, room });
  }

  public playerReady() {
    this.socket.emit("player:ready");
  }

  public playerUpdate(gameState: any) {
    this.socket.emit("player:update", gameState);
  }
}