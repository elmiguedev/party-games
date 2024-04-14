import { Scene } from "phaser";
import { SocketManager } from "../sockets/SocketManager";
import { PlayerLabel } from "../entities/lobby/PlayerLabel";

export class WinnerScene extends Scene {
  private socketManager: SocketManager;


  constructor() {
    super("WinnerScene");
    this.socketManager = SocketManager.getInstance();
  }

  create() {
    this.createBackground();
    this.createWinnerLabel();
    this.createPlayButton();
  }

  createBackground() {
    const bg = this.add.image(0, 0, "balloons").setOrigin(0, 0);
    bg.setScale(6);
    bg.setAlpha(0.5);

    const winnerTitle = this.add.image(0, 40, "winner")
      .setOrigin(0, 0)
      .setScale(6);
  }

  createWinnerLabel() {
    const winner = this.socketManager.room.game?.winner
    const x = this.cameras.main.centerX;
    const y = this.cameras.main.centerY;
    const winnerLabel = new PlayerLabel(this, x, y, winner!);

  }

  createPlayButton() {
    const x = this.cameras.main.centerX;
    const y = this.cameras.main.centerY + 200;

    const playButton = this.add.image(x, y, "play_button");
    playButton.setInteractive({ cursor: "pointer" });
    playButton.setScale(6);
    playButton.on("pointerdown", () => {
      location.reload();
    });
  }

}