import { Scene } from "phaser";
import { SocketManager } from "../sockets/SocketManager";
import { Player } from "../../states/Player";
import { Room } from "../../states/Room";
import { PlayerLabel } from "../entities/lobby/PlayerLabel";

export class LobbyScene extends Scene {
  private socketManager: SocketManager;
  private room: Room;
  private txtRoom: Phaser.GameObjects.Text;
  private playerLabels: Record<string, PlayerLabel> = {};
  private playButton: Phaser.GameObjects.Image;
  private waitingLabel: Phaser.GameObjects.Image;

  public constructor() {
    super("LobbyScene");
  }

  // Scene methods
  // ---------------------------------------------------

  public create(data: any) {
    this.createRoomInfo();
    this.createSocketManager(data.name, data.room);
    this.createInitGameButton();
  }

  // creation and initialization methods
  // ---------------------------------------------------

  private createSocketManager(name: string, room?: string) {
    this.socketManager = SocketManager.getInstance();
    this.socketManager.onRoomState = (roomState: any) => {
      this.room = roomState;
      this.updateRoom();
    };

    this.socketManager.onPlayerDisconnect = (playerId: string) => {
      console.log("PLAYER DISCCONECTED", playerId)
      this.playerLabels[playerId].destroy();
      delete this.playerLabels[playerId];
    }

    this.socketManager.onRoomReady = () => {
      this.scene.start("GameScene");
    }

    this.socketManager.joinRoom(name, room);
  }

  private createRoomInfo() {
    const centerX = this.cameras.main.centerX;
    this.txtRoom = this.add.text(
      centerX,
      50,
      "",
      {
        fontSize: "64px",
        fontFamily: "half_bold_pixel",
        padding: { x: 10, y: 5 },
      }).setOrigin(0.5)
  }

  private updateRoom() {
    const centerX = this.cameras.main.centerX;

    this.txtRoom.setText("Room: " + this.room.id);
    let count = 0;
    Object.values(this.room.players).forEach((player: Player) => {
      if (!this.playerLabels[player.id]) {
        const y = 150 + (count * 100);
        const playerLabel = new PlayerLabel(this, centerX, y, player);
        this.playerLabels[player.id] = playerLabel;
      } else {
        this.playerLabels[player.id].setPlayer(player);
      }
      count++;

    })
  }

  private createInitGameButton() {
    const x = this.cameras.main.centerX;
    const y = this.cameras.main.centerY + 200;

    this.waitingLabel = this.add.image(x, y, "waiting_button");
    this.waitingLabel.setScale(6);
    this.waitingLabel.setVisible(false);

    this.playButton = this.add.image(x, y, "play_button");
    this.playButton.setInteractive({ cursor: "pointer" });
    this.playButton.setScale(6);
    this.playButton.on("pointerdown", () => {
      this.socketManager.playerReady();
      this.playButton.setVisible(false);
      this.waitingLabel.setVisible(true);
    });
  }

}