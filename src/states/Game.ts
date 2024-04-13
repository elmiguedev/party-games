import { Player } from "./Player";
export type GameType = "pikachu" | "race"
export type GameState = "playing" | "finished"

export interface Game {
  type: GameType;
  state: GameState;
  winner?: Player;
  answer: any;
}