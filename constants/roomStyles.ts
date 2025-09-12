import { RoomStyle } from "../types/terrarium";

export interface RoomStyleConfig {
  gradient: string[];
  ambientColor: string;
  lampColor: string;
}

export const ROOM_STYLES: Record<RoomStyle, RoomStyleConfig> = {
  cozy: {
    gradient: ["#1A0E0A", "#2C1810", "#3D2817", "#4A3426"],
    ambientColor: "#FFE4B5",
    lampColor: "#FF8C00",
  },
  neon: {
    gradient: ["#000000", "#0F0F0F", "#1A0033", "#330066"],
    ambientColor: "#FF00FF",
    lampColor: "#00FFFF",
  },
  forest: {
    gradient: ["#051A05", "#0B3D0B", "#145214", "#1F6B1F"],
    ambientColor: "#90EE90",
    lampColor: "#ADFF2F",
  },
  space: {
    gradient: ["#000000", "#0A0A1A", "#0F0C29", "#24243E"],
    ambientColor: "#8A2BE2",
    lampColor: "#9400D3",
  },
  cosmic: {
    gradient: ["#000000", "#1A0033", "#330066", "#4B0082"],
    ambientColor: "#FF1493",
    lampColor: "#00FFFF",
  },
  zen: {
    gradient: ["#F0F8FF", "#E6F3FF", "#D1E7DD", "#B8E6B8"],
    ambientColor: "#98FB98",
    lampColor: "#FFE4B5",
  },
  void: {
    gradient: ["#000000", "#0D0D0D", "#1A1A1A", "#2D2D2D"],
    ambientColor: "#8B0000",
    lampColor: "#FF0000",
  },
};