export interface Frog {
  id: string;
  name: string;
  mood: "happy" | "sleepy" | "excited" | "surprised" | "hungry" | "content";
  position: { x: number; y: number };
  color: string;
  boopCount: number;
  lastBoopTime: number | null;
}

export interface Fly {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  isEaten: boolean;
}

export type RoomStyle = "cozy" | "neon" | "forest" | "space" | "cosmic" | "zen" | "void";