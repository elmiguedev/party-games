import Phaser from "phaser";

export class UiTextField {
  private txt: HTMLInputElement;
  private dom: Phaser.GameObjects.DOMElement;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    this.createTextInput();
    this.createDom();

    this.dom.setPosition(x, y);

  }

  public getText() {
    return this.txt.value;
  }

  private createTextInput() {
    this.txt = document.createElement("input");
    this.txt.type = "text";
    this.txt.style.fontSize = "32px";
  }

  private createDom() {
    this.dom = this.scene.add.dom(0, 0, this.txt);

  }
}