import { Scene } from "phaser";

export class GameScene extends Scene {

  public constructor() {
    super("GameScene");
  }

  create() {
    this.add.text(20, 20, "A JUGAR")
  }
}