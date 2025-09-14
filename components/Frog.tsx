import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Frog as FrogType } from "@/types/terrarium";

interface FrogProps {
  frog: FrogType;
}

const MOOD_EMOJIS: { [key in FrogType["mood"]]: string } = {
  happy: "😊",
  sleepy: "😴",
  excited: "🤩",
  surprised: "😮",
  hungry: "😋",
  content: "🐸",
};

export function Frog({ frog }: FrogProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const positionAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    // Gentle scaling animation for "breathing"
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Mood-based wiggle
    const wiggle = () => {
        Animated.sequence([
            Animated.timing(positionAnim, { toValue: {x: 2, y: -2}, duration: 100, useNativeDriver: true }),
            Animated.timing(positionAnim, { toValue: {x: -2, y: 2}, duration: 100, useNativeDriver: true }),
            Animated.timing(positionAnim, { toValue: {x: 0, y: 0}, duration: 100, useNativeDriver: true }),
        ]).start();
    }

    if (frog.mood === 'excited' || frog.mood === 'happy') {
        const interval = setInterval(wiggle, 2000 + Math.random() * 1000);
        return () => clearInterval(interval);
    }

  }, [frog.mood, scaleAnim, positionAnim]);

  return (
    <Animated.View
      style={[
        styles.frogContainer,
        {
          transform: [
            { scale: scaleAnim },
            { translateX: positionAnim.x },
            { translateY: positionAnim.y },
          ],
        },
      ]}
    >
      <View style={[styles.frogBody, { backgroundColor: frog.color }]} />
      <Text style={styles.emoji}>{MOOD_EMOJIS[frog.mood]}</Text>
      <Text style={styles.name}>{frog.name}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frogContainer: {
    position: "absolute",
    alignItems: "center",
    width: 60,
    height: 60,
    bottom: 20,
  },
  frogBody: {
    width: 50,
    height: 30,
    borderRadius: 15,
  },
  emoji: {
    fontSize: 24,
    position: "absolute",
    top: -15,
  },
  name: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
