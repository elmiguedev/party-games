import Phaser from "phaser";
import { SocketManager } from "../../sockets/SocketManager";
import { Room } from "../../../states/Room";
import { Game } from "../../../states/Game";

export class PikachuMiniGame extends Phaser.GameObjects.Container {
  private socketManager: SocketManager;
  private pikachuBase: Phaser.GameObjects.Image;
  private pikachuTail: Phaser.GameObjects.Image;
  private winnerText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.socketManager = SocketManager.getInstance();

    this.socketManager.onGameFinished = (game: Game) => {
      if (this.winnerText) {
        this.winnerText.setVisible(true);
        this.winnerText.setText("Winner: " + game.winner?.name);
      }
    }

    this.createPikachu();
    this.createControls();
    this.createWinnerText();

  }

  private createPikachu() {
    this.pikachuBase = this.scene.add.image(200, 200, "pikachu_base");
    this.pikachuTail = this.scene.add.image(200, 200, "pikachu_tail");
    this.pikachuTail.setVisible(false);

    this.add(this.pikachuBase);
    this.add(this.pikachuTail);
  }

  private createWinnerText() {
    this.winnerText = this.scene.add.text(0, 0, "Winner: ");
    this.winnerText.setVisible(false);
    this.add(this.winnerText);
  }

  private createControls() {
    this.scene.input.on("pointerdown", (e) => {
      if (this.socketManager.player.gameState.ready === true) return;
      const mousePosition = this.scene.input.activePointer.position;
      this.pikachuTail.setPosition(mousePosition.x, mousePosition.y);
      this.socketManager.playerUpdate({
        position: mousePosition,
        ready: true
      });
      this.pikachuTail.setVisible(true);
    });
  }

  private checkWinnerText() {
    const gameState = this.socketManager.room.game;
    if (gameState && gameState.state === "finished") {

    }
  }


}