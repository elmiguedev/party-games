import Phaser from "phaser";
import { SocketManager } from "../sockets/SocketManager";
import { UiTextField } from "../entities/ui/UiTextField";

export class StartScene extends Phaser.Scene {
  private socketManager: SocketManager;
  private txtName: UiTextField;
  private txtRoom: UiTextField;

  constructor() {
    super("StartScene");
  }

  // Scene methods
  // ---------------------------------------------------
  public create() {
    this.createSocketManager()
    this.createInput();
    this.createButtons();
  }

  public update() {

  }


  // creation and initialization methods
  // ---------------------------------------------------
  private createSocketManager() {
    this.socketManager = SocketManager.getInstance();
  }

  private createInput() {
    const centerScreenX = this.cameras.main.centerX;
    const centerScreenY = this.cameras.main.centerY;
    this.txtName = new UiTextField(this, centerScreenX, centerScreenY - 100);
    this.txtRoom = new UiTextField(this, centerScreenX, centerScreenY + 150);
  }

  private createButtons() {
    const centerScreenX = this.cameras.main.centerX;
    const centerScreenY = this.cameras.main.centerY;
    const createRoomButton = this.add.image(centerScreenX, centerScreenY, "create_room_button");
    const joinRoomButton = this.add.image(centerScreenX, centerScreenY + 300, "join_room_button");

    createRoomButton.setInteractive({ cursor: "pointer" });
    joinRoomButton.setInteractive({ cursor: "pointer" });

    createRoomButton.on("pointerdown", () => {
      const name = this.txtName.getText();
      if (name) {
        this.scene.start("LobbyScene", { name });
      }
    });

    joinRoomButton.on("pointerdown", () => {
      const name = this.txtName.getText();
      const room = this.txtRoom.getText();
      if (name && room) {
        this.scene.start("LobbyScene", { name, room });
      }
    });
  }

}