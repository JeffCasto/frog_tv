import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { Fly as FlyType } from "@/types/terrarium";

interface FlyProps {
  fly: FlyType;
}

export function Fly({ fly }: FlyProps) {
  const positionAnim = useRef(new Animated.ValueXY({ x: fly.position.x, y: fly.position.y })).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();

    // Flying animation
    Animated.parallel([
      Animated.timing(positionAnim, {
        toValue: {
          x: fly.position.x + fly.velocity.x * 100,
          y: fly.position.y + fly.velocity.y * 100,
        },
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Exit animation
    setTimeout(() => {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 2800);
  }, [fly.position.x, fly.position.y, fly.velocity.x, fly.velocity.y, positionAnim, rotateAnim, scaleAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.fly,
        {
          transform: [
            { translateX: positionAnim.x },
            { translateY: positionAnim.y },
            { rotate: rotation },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Text style={styles.flyEmoji}>🪰</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fly: {
    position: "absolute",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  flyEmoji: {
    fontSize: 16,
  },
});