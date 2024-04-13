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
    this.txtRoom = this.add.text(20, 20, "Room: ");
  }

  private updateRoom() {
    console.log("SE UPDATEA LA VISTA", this.room, this.room.id)
    this.txtRoom.setText("Room: " + this.room.id);
    let count = 0;
    Object.values(this.room.players).forEach((player: Player) => {
      if (!this.playerLabels[player.id]) {
        const y = 100 + (count * 100);
        const playerLabel = new PlayerLabel(this, 20, y, player);
        this.playerLabels[player.id] = playerLabel;
      } else {
        this.playerLabels[player.id].setPlayer(player);
      }
      count++;

    })
  }

  private createInitGameButton() {
    this.waitingLabel = this.add.image(400, 400, "play_waiting_button");
    this.waitingLabel.setVisible(false);

    this.playButton = this.add.image(400, 400, "play_button");
    this.playButton.setInteractive({ cursor: "pointer" });
    this.playButton.on("pointerdown", () => {
      this.socketManager.playerReady();
      this.playButton.setVisible(false);
      this.waitingLabel.setVisible(true);
    });
  }

}