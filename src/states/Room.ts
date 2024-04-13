import { Game } from "./Game";
import { Player } from "./Player";

export type RoomState = "lobby" | "playing";

export interface Room {
  id: string;
  players: Record<string, Player>;
  state: RoomState;
  game?: Game;
}