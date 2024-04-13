import { Player } from "../../../states/Player";

export class PlayerLabel extends Phaser.GameObjects.Container {
  private player: Player;
  private txtName: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.player = player;
    this.createName();
  }

  public setPlayer(player: Player) {
    this.player = player;
    this.updateName();
  }

  private createName() {
    this.txtName = this.scene.add.text(0, 0, this.player.name, {
      fontSize: "32px",
      color: "#ffffff",
      backgroundColor: "#a3a312",
      padding: { x: 10, y: 5 },
    });
    this.add(this.txtName);
  }

  private updateName() {
    this.txtName.setText(this.player.name);
  }
}