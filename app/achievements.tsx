import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAchievements } from "@/providers/AchievementProvider";
import { Trophy, Lock } from "lucide-react-native";
import { ACHIEVEMENTS } from "@/constants/achievements";

export default function AchievementsScreen() {
  const { achievements } = useAchievements();

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = achievements.includes(achievement.id);
            
            return (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  isUnlocked && styles.unlockedCard,
                ]}
              >
                <View style={styles.iconContainer}>
                  {isUnlocked ? (
                    <Trophy size={32} color="#FFD700" />
                  ) : (
                    <Lock size={32} color="#666" />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.title, !isUnlocked && styles.lockedText]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.description, !isUnlocked && styles.lockedText]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  achievementCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  unlockedCard: {
    backgroundColor: "rgba(255,215,0,0.1)",
    borderColor: "rgba(255,215,0,0.3)",
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  lockedText: {
    color: "rgba(255,255,255,0.3)",
  },
});