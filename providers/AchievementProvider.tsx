import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

interface AchievementState {
  achievements: string[];
  unlockAchievement: (id: string) => void;
}

export const [AchievementProvider, useAchievements] = createContextHook<AchievementState>(() => {
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const saved = await AsyncStorage.getItem("achievements");
        if (saved) {
          setAchievements(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load achievements:", error);
      }
    };
    loadAchievements();
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      if (prev.includes(id)) return prev;
      
      const updated = [...prev, id];
      AsyncStorage.setItem("achievements", JSON.stringify(updated));
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      return updated;
    });
  }, []);

  return {
    achievements,
    unlockAchievement,
  };
});