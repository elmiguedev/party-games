import { Scene } from "phaser";
import { SocketManager } from "../sockets/SocketManager";

export class LobbyScene extends Scene {
  private socketManager: SocketManager;


  public constructor() {
    super("LobbyScene");
  }

  // Scene methods
  // ---------------------------------------------------

  public create(data: any) {
    this.createSocketManager(data.name, data.room);
  }

  // creation and initialization methods
  // ---------------------------------------------------

  private createSocketManager(name: string, room?: string) {
    this.socketManager = SocketManager.getInstance();
    this.socketManager.onRoomState = (roomState: any) => {
      console.log(roomState);
    };
    this.socketManager.joinRoom(name, room);

  }

}