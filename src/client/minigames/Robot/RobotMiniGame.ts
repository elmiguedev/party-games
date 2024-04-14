import Phaser from "phaser";
import { SocketManager } from "../../sockets/SocketManager";
import { Room } from "../../../states/Room";
import { Game } from "../../../states/Game";
import { Player } from "../../../states/Player";

export class RobotMiniGame extends Phaser.GameObjects.Container {
  private socketManager: SocketManager;
  private robotBase: Phaser.GameObjects.Image;
  private robotAntenna: Phaser.GameObjects.Image;
  private winnerText: Phaser.GameObjects.Text;
  private counterText: Phaser.GameObjects.Text;
  private ready: boolean = false;

  public onFinish: Function;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.socketManager = SocketManager.getInstance();

    this.socketManager.onPlayerUpdate = (player: Player) => {
      console.log("PLAYER UPDATE", player)
      this.createPlayerAntenna(player);
    }

    this.socketManager.onGameFinished = (game: Game) => {
      if (this.winnerText) {
        this.finishGame(game.winner!);
      }
    }

    this.createRobot();
    this.createWinnerText();
    this.createTimer();
  }

  private createRobot() {
    this.robotBase = this.scene.add.image(200, 200, "robot_base");
    this.robotBase.setScale(6)
    this.robotBase.setOrigin(0)
    this.robotAntenna = this.scene.add.image(200, 200, "robot_antenna");
    this.robotAntenna.setScale(6)
    this.robotAntenna.setVisible(false);

    this.add(this.robotBase);
    this.add(this.robotAntenna);
  }

  private createWinnerText() {
    this.winnerText = this.scene.add.text(0, 0, "Winner: ");
    this.winnerText.setVisible(false);
    this.add(this.winnerText);
  }



  private createTimer() {
    const x = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
    const y = 40
    this.counterText = this.scene.add.text(x, y, "", {
      fontSize: "96px",
      align: "center",
      fontFamily: "half_bold_pixel",
      color: "#944c90"
    })
      .setWordWrapWidth(this.scene.cameras.main.width - 40)
      .setOrigin(0.5, 0);

    let counter = 2;
    const game = this.socketManager.room.game
    const positions = game!.data.fakePositions
    const answer = game!.answer
    this.createRobotRandomPositions(positions, answer);
    this.counterText.setText("3");

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        switch (counter) {
          case 2:
            this.counterText.setText("2");
            break;
          case 1:
            this.counterText.setText("1");
            break;
          case 0:
            this.counterText.setText("put the antenna on the robot!");
            break;
          case -1:
            this.counterText.setVisible(false);
            this.robotBase.setVisible(false);
            this.createAntennaCursor();
            break;

          default:
            break;
        }
        counter--;
      },
      repeat: 3
    });
  }

  private createRobotRandomPositions(positions: any[], answer: any) {
    console.log(positions, answer);
    const randomPositions = [...positions]
    randomPositions.shift();
    this.scene.time.addEvent({
      delay: 500,
      repeat: 8,
      callback: () => {
        const position = randomPositions.shift();
        if (position) {
          this.robotBase.setPosition(position.x, position.y);
        }
      },
    })
  }

  private checkWinnerText() {
    const gameState = this.socketManager.room.game;
    if (gameState && gameState.state === "finished") {

    }
  }

  private createAntennaCursor() {
    this.robotAntenna.setVisible(true);
    this.scene.input.on("pointermove", (e) => {
      if (!this.ready) {
        const mousePosition = this.scene.input.activePointer.position;
        this.robotAntenna.setPosition(mousePosition.x, mousePosition.y);
      }
    });

    this.scene.input.on("pointerdown", (e) => {
      if (this.ready) return;
      const mousePosition = this.scene.input.activePointer.position;
      this.robotAntenna.setPosition(mousePosition.x, mousePosition.y);
      this.robotBase.setVisible(true);
      this.ready = true;
      this.socketManager.playerUpdate({
        position: mousePosition,
        ready: true
      });
    });
  }

  private createPlayerAntenna(player: Player) {
    const position = player.gameState.position;
    const ready = player.gameState.ready;
    if (position && ready) {
      const playerAntenna = this.scene.add.image(position.x, position.y, "robot_antenna");
      playerAntenna.setScale(6);
      playerAntenna.setAlpha(player.id === this.socketManager.playerId ? 1 : 0.5);
      const playerName = this.scene.add.text(position.x, position.y - 20, player.name, {
        fontSize: "32px",
        fontFamily: "half_bold_pixel",
        fontStyle: "bold",
        color: "#292640"
      }).setOrigin(0.5);
      this.add(playerAntenna);
      this.add(playerName);
    }
  }

  private finishGame(player: Player) {
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.onFinish) this.onFinish();
      }
    })

  }



}