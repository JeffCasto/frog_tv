import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Frog, Fly, RoomStyle } from "@/types/terrarium";

interface FrogTerrariumState {
  frogs: Frog[];
  flies: Fly[];
  roomStyle: RoomStyle;
  currentChannel: number;
  boopFrog: (frogId: string) => void;
  throwFly: (x: number, y: number) => void;
  changeChannel: () => void;
  changeRoomStyle: (style: RoomStyle) => void;
}

export const [FrogTerrariumProvider, useFrogTerrarium] = createContextHook<FrogTerrariumState>(() => {
  const [frogs, setFrogs] = useState<Frog[]>([
    {
      id: "frog1",
      name: "Ribberto",
      mood: "content",
      position: { x: 50, y: 200 },
      color: "#4CAF50",
      boopCount: 0,
      lastBoopTime: null,
    },
    {
      id: "frog2",
      name: "Croaksworth",
      mood: "sleepy",
      position: { x: 150, y: 200 },
      color: "#8BC34A",
      boopCount: 0,
      lastBoopTime: null,
    },
    {
      id: "frog3",
      name: "Hopscotch",
      mood: "excited",
      position: { x: 250, y: 200 },
      color: "#689F38",
      boopCount: 0,
      lastBoopTime: null,
    },
  ]);

  const [flies, setFlies] = useState<Fly[]>([]);
  const [roomStyle, setRoomStyle] = useState<RoomStyle>("cozy");
  const [currentChannel, setCurrentChannel] = useState(0);

  // Load saved state
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedFrogs = await AsyncStorage.getItem("frogs");
        const savedRoom = await AsyncStorage.getItem("roomStyle");
        
        if (savedFrogs) {
          setFrogs(JSON.parse(savedFrogs));
        }
        if (savedRoom) {
          setRoomStyle(savedRoom as RoomStyle);
        }
      } catch (error) {
        console.error("Failed to load state:", error);
      }
    };
    loadState();
  }, []);

  // Save frogs when they change
  useEffect(() => {
    AsyncStorage.setItem("frogs", JSON.stringify(frogs));
  }, [frogs]);

  const boopFrog = useCallback((frogId: string) => {
    setFrogs((prev) =>
      prev.map((frog) => {
        if (frog.id === frogId) {
          const moods: Frog["mood"][] = ["happy", "excited", "surprised", "content"];
          const newMood = moods[Math.floor(Math.random() * moods.length)];
          
          return {
            ...frog,
            mood: newMood,
            boopCount: frog.boopCount + 1,
            lastBoopTime: Date.now(),
          };
        }
        return frog;
      })
    );
  }, []);

  const throwFly = useCallback((x: number, y: number) => {
    const newFly: Fly = {
      id: `fly-${Date.now()}`,
      position: { x, y },
      velocity: { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 },
      isEaten: false,
    };
    
    setFlies((prev) => [...prev, newFly]);
    
    // Remove fly after animation
    setTimeout(() => {
      setFlies((prev) => prev.filter((f) => f.id !== newFly.id));
    }, 3000);
  }, []);

  const changeChannel = useCallback(() => {
    setCurrentChannel((prev) => (prev + 1) % 10);
  }, []);

  const changeRoomStyle = useCallback((style: RoomStyle) => {
    setRoomStyle(style);
    AsyncStorage.setItem("roomStyle", style);
  }, []);

  return {
    frogs,
    flies,
    roomStyle,
    currentChannel,
    boopFrog,
    throwFly,
    changeChannel,
    changeRoomStyle,
  };
});