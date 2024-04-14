import { Player } from "./Player";
export type GameType = "robot" | "race"
export type GameState = "playing" | "finished"

export interface Game {
  type: GameType;
  state: GameState;
  winner?: Player;
  answer: any;
  data: any;
}