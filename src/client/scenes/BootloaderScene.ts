import { Scene } from "phaser";
import PikachuBasePng from "../assets/sprites/pikachu/pikachu_base.png";
import PikachuTailPng from "../assets/sprites/pikachu/pikachu_tail.png";
import CreateRoomButtonPng from "../assets/sprites/buttons/create_room_button.png";
import JoinRoomButtonPng from "../assets/sprites/buttons/join_room_button.png";
import PlayButtonPng from "../assets/sprites/buttons/play_button.png";
import PlayWaitingButtonPng from "../assets/sprites/buttons/play_waiting_button.png";

export class BootloaderScene extends Scene {

  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.load.image("pikachu_base", PikachuBasePng);
    this.load.image("pikachu_tail", PikachuTailPng);
    this.load.image("create_room_button", CreateRoomButtonPng);
    this.load.image("join_room_button", JoinRoomButtonPng);
    this.load.image("play_button", PlayButtonPng);
    this.load.image("play_waiting_button", PlayWaitingButtonPng);

    this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("StartScene"));
  }
}