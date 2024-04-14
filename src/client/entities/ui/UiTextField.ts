import Phaser from "phaser";

export class UiTextField {
  private txt: HTMLInputElement;
  private dom: Phaser.GameObjects.DOMElement;
  private scene: Phaser.Scene;
  private background: Phaser.GameObjects.Image;
  private x: number;
  private y: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.createBackground();
    this.createTextInput();
    this.createDom();
  }

  public getText() {
    return this.txt.value;
  }

  public setText(text: string) {
    this.txt.value = text;
  }

  private createBackground() {
    this.background = this.scene.add.image(this.x, this.y, "input");
    // this.background.setOrigin(0, 0);
    this.background.setScale(6);
  }

  private createTextInput() {
    this.txt = document.createElement("input");
    this.txt.type = "text";
    this.txt.style.fontFamily = "half_bold_pixel";
    this.txt.style.fontSize = "64px";
    this.txt.style.border = "none";
    this.txt.style.outline = "none";
    this.txt.style.width = `${this.background.displayWidth - 80}px`;
    this.txt.style.backgroundColor = "transparent";
  }

  private createDom() {
    this.dom = this.scene.add.dom(this.x + 10, this.y, this.txt);
    // this.dom.setOrigin(0, 0);

  }
}