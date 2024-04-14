import { Player } from "../../../states/Player";

export class PlayerLabel extends Phaser.GameObjects.Container {
  private player: Player;
  private txtName: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.player = player;
    this.createBackground();
    this.createName();
  }

  public setPlayer(player: Player) {
    this.player = player;
    this.updateName();
  }

  private createBackground() {
    this.background = this.scene.add.image(0, 0, "player_label");
    this.background.setScale(6);
    this.add(this.background);
  }

  private createName() {
    this.txtName = this.scene.add.text(0, 0, this.player.name, {
      fontSize: "64px",
      fontFamily: "half_bold_pixel",
      color: "#ffffff",
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);
    this.add(this.txtName);
  }

  private updateName() {
    this.txtName.setText(this.player.name);
  }
}