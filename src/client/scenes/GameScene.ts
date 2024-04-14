import { Scene } from "phaser";
import { SocketManager } from "../sockets/SocketManager";
import { Room } from "../../states/Room";
import { RobotMiniGame } from "../minigames/Robot/RobotMiniGame";

export class GameScene extends Scene {
  private robotMiniGame: RobotMiniGame;
  private socketManager: SocketManager;
  private roomState: Room;


  public constructor() {
    super("GameScene");
  }

  init() {
  }

  create() {
    this.robotMiniGame = new RobotMiniGame(this);
    this.robotMiniGame.onFinish = () => {
      this.robotMiniGame.destroy();
      this.scene.start("WinnerScene");
    }
  }
}