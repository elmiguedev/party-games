import { Player } from "./Player";

export interface Room {
  id: string;
  players: Record<string, Player>;
}