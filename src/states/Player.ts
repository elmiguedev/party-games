export type PlayerState = "lobby" | "ready" | "playing";
export interface Player {
  id: string;
  name: string;
  room: string;
  state: PlayerState;
  gameState?: any;
}