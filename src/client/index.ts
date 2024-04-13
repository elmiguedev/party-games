import { BootloaderScene } from "./scenes/BootloaderScene";
import { GameScene } from "./scenes/GameScene";
import { LobbyScene } from "./scenes/LobbyScene";
import { StartScene } from "./scenes/StartScene";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 1000,
  height: 1000,
  scene: [
    BootloaderScene,
    StartScene,
    LobbyScene,
    GameScene
  ],
  render: {
    pixelArt: true,
  },
  dom: {
    createContainer: true
  }
});

export default game;