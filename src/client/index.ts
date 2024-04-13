import { BootloaderScene } from "./scenes/BootloaderScene";
import { GameScene } from "./scenes/GameScene";
import { LobbyScene } from "./scenes/LobbyScene";
import { StartScene } from "./scenes/StartScene";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 720,
  height: 720,
  scene: [
    BootloaderScene,
    StartScene,
    LobbyScene,
    GameScene
  ],
  scale: {
    width: 720,
    height: 720,
  },
  backgroundColor: "#e7cfb6",
  render: {
    pixelArt: true,
  },
  dom: {
    createContainer: true
  }
});

export default game;