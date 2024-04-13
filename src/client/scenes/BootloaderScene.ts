import { Scene } from "phaser";
import PikachuBasePng from "../assets/sprites/pikachu/pikachu_base.png";
import PikachuTailPng from "../assets/sprites/pikachu/pikachu_tail.png";
import CreateRoomButtonPng from "../assets/sprites/buttons/create_room_button.png";
import JoinRoomButtonPng from "../assets/sprites/buttons/join_room_button.png";
import PlayButtonPng from "../assets/sprites/buttons/play_button.png";
import PlayWaitingButtonPng from "../assets/sprites/buttons/play_waiting_button.png";
import BalloonsPng from "../assets/sprites/balloons/balloons.png";
import TitlePng from "../assets/sprites/titles/main_title.png";
import PuffPuffTitlePng from "../assets/sprites/titles/puff_puff_title.png";
import StartButtonPng from "../assets/sprites/buttons/start_button.png";
import JoinButtonPng from "../assets/sprites/buttons/join_button.png";
import CreateButtonPng from "../assets/sprites/buttons/create_button.png";
import InputPng from "../assets/sprites/ui/input.png";

export class BootloaderScene extends Scene {

  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.cameras.main.setBackgroundColor("#e7cfb6");
    this.load.image("pikachu_base", PikachuBasePng);
    this.load.image("pikachu_tail", PikachuTailPng);
    this.load.image("create_room_button", CreateRoomButtonPng);
    this.load.image("join_room_button", JoinRoomButtonPng);
    this.load.image("play_button", PlayButtonPng);
    this.load.image("play_waiting_button", PlayWaitingButtonPng);
    this.load.image("balloons", BalloonsPng);
    this.load.image("title", TitlePng);
    this.load.image("puff_puff_title", PuffPuffTitlePng);
    this.load.image("start_button", StartButtonPng);
    this.load.image("join_button", JoinButtonPng);
    this.load.image("create_button", CreateButtonPng);
    this.load.image("input", InputPng);

    this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("StartScene"));
  }

  create() {
  }
}