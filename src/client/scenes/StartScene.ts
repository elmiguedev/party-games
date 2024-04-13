import Phaser from "phaser";
import { SocketManager } from "../sockets/SocketManager";
import { UiTextField } from "../entities/ui/UiTextField";

export class StartScene extends Phaser.Scene {
  private socketManager: SocketManager;
  private txtName: UiTextField;
  private title: Phaser.GameObjects.Image;
  private puffTitle: Phaser.GameObjects.Image;


  constructor() {
    super("StartScene");
  }

  // Scene methods
  // ---------------------------------------------------
  public create() {
    this.createSocketManager()
    this.createBackground();
    this.createStartButton();
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
    const centerScreenY = this.cameras.main.centerY + 150;
    this.txtName = new UiTextField(this, centerScreenX, centerScreenY - 100);
    this.txtName.setText(this.getRandomName())
  }

  private createStartButton() {
    const x = this.cameras.main.centerX;
    const y = this.cameras.main.centerY + 200;

    const startButton = this.add.image(x, y, "start_button");
    startButton.setScale(6);
    startButton.setInteractive({ cursor: "pointer" });
    startButton.on("pointerdown", () => {
      startButton.setVisible(false);
      this.title.setVisible(false);
      // this.puffTitle.setVisible(false);
      this.createButtons();
      this.createInput();
    });
  }

  private createButtons() {
    const x = this.cameras.main.centerX;
    const y = this.cameras.main.centerY + 200;

    const createRoomButton = this.add.image(x, y, "create_button");
    createRoomButton.setScale(6);
    createRoomButton.setInteractive({ cursor: "pointer" });
    createRoomButton.on("pointerdown", () => {
      const name = this.txtName.getText();
      if (name) {
        this.scene.start("LobbyScene", { name });
      }
    });

    const joinRoomButton = this.add.image(x, y, "join_button");
    joinRoomButton.setScale(6);
    joinRoomButton.setInteractive({ cursor: "pointer" });
    joinRoomButton.on("pointerdown", () => {
      const room = this.getRoomKey();
      const name = this.txtName.getText();
      if (name && room) {
        this.scene.start("LobbyScene", { name, room });
      }
    });

    const roomKey = this.getRoomKey();
    if (roomKey) {
      createRoomButton.setVisible(false);
      joinRoomButton.setVisible(true);
    } else {
      createRoomButton.setVisible(true);
      joinRoomButton.setVisible(false);
    }

  }

  private createBackground() {
    this.add.image(0, 0, "balloons")
      .setScale(6)
      .setOrigin(0, 0);

    this.puffTitle = this.add.image(0, 0, "puff_puff_title")
      .setScale(6)
      .setOrigin(0, 0);

    this.title = this.add.image(0, 0, "title")
      .setScale(6)
      .setOrigin(0, 0);
  }

  private getRandomName() {
    const names = [
      "Luna",
      "Milo",
      "Nala",
      "Kai",
      "Aria",
      "Leo",
      "Nova",
      "Zara",
      "Finn",
      "Esme",
      "Max",
      "Willow",
      "Nico",
      "Maya",
      "Dex",
      "Elara",
      "Rio",
      "Cleo",
      "Jax",
      "Ivy"
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  private getRoomKey() {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("room");
  }
}