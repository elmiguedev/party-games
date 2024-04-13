import { Scene } from "phaser";
import { PikachuMiniGame } from "../minigames/Pikachu/PikachuMiniGame";
import { SocketManager } from "../sockets/SocketManager";
import { Room } from "../../states/Room";

export class GameScene extends Scene {
  private pikachuMiniGame: PikachuMiniGame;
  private socketManager: SocketManager;
  private roomState: Room;


  public constructor() {
    super("GameScene");
  }

  init() {
  }

  create() {
    this.pikachuMiniGame = new PikachuMiniGame(this);
  }
}