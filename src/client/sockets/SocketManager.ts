import io, { Socket } from "socket.io-client";

export class SocketManager {

  private static instance: SocketManager;
  private socket: Socket;

  public onRoomState: Function;

  private constructor() {
    this.socket = io("localhost:3000");

    this.socket.on("connect", () => {
      console.log("connected");
    });

    this.socket.on("room:state", (roomState: any) => {
      if (this.onRoomState) this.onRoomState(roomState);
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
}