import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  PanResponder,
  Platform,

  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFrogTerrarium } from "@/providers/FrogTerrariumProvider";
import { useChat } from "@/providers/ChatProvider";
import { useAchievements } from "@/providers/AchievementProvider";
import { Frog } from "@/components/Frog";
import { TV } from "@/components/TV";
import { Fly } from "@/components/Fly";
import { ChatOverlay } from "@/components/ChatOverlay";
import { Trophy, MessageCircle, Bug, Tv, Zap, Star, Waves } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ROOM_STYLES } from "@/constants/roomStyles";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function TerrariumScreen() {
  const { frogs, flies, roomStyle, boopFrog, throwFly, changeChannel, currentChannel } = useFrogTerrarium();
  const { messages, sendMessage, isConnected } = useChat();
  const { unlockAchievement } = useAchievements();
  const [showChat, setShowChat] = useState(false);

  const glowAnimation = useRef(new Animated.Value(0)).current;
  const lampAnimation = useRef(new Animated.Value(0)).current;
  const particleAnimations = useRef(Array.from({ length: 8 }, () => new Animated.Value(0))).current;
  const bubbleAnimations = useRef(Array.from({ length: 5 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    // Ambient glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Lamp flicker
    Animated.loop(
      Animated.sequence([
        Animated.timing(lampAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(lampAnimation, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Floating particles animation
    particleAnimations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + index * 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000 + index * 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Bubble effects
    bubbleAnimations.forEach((anim, index) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000 + index * 800,
          useNativeDriver: true,
        })
      ).start();
    });
  }, [glowAnimation, lampAnimation, particleAnimations, bubbleAnimations]);

  const handleThrowFly = (x: number, y: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    throwFly(x, y);
    
    if (flies.length === 0) {
      unlockAchievement("first_fly");
    }
    if (flies.length >= 99) {
      unlockAchievement("fly_master");
    }
  };

  const handleBoopFrog = (frogId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    boopFrog(frogId);
    
    const totalBoops = frogs.reduce((sum, f) => sum + (f.id === frogId ? f.boopCount + 1 : f.boopCount), 0);
    if (totalBoops === 1) {
      unlockAchievement("first_boop");
    }
    if (totalBoops >= 100) {
      unlockAchievement("boop_master");
    }
  };

  const handleChangeChannel = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    changeChannel();
    
    if (currentChannel === 9) {
      unlockAchievement("channel_surfer");
    }
  };



  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      handleThrowFly(locationX, locationY);
    },
  });

  const currentRoom = ROOM_STYLES[roomStyle];
  const lampOpacity = lampAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <LinearGradient
      colors={currentRoom.gradient as [string, string, ...string[]]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Glass terrarium effect */}
        <View style={styles.terrariumGlass}>
          <LinearGradient
            colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.02)"]}
            style={styles.glassReflection}
          />
          
          {/* Room interior */}
          <View style={styles.room} {...panResponder.panHandlers}>
            {/* Floating particles */}
            {particleAnimations.map((anim, index) => {
              const translateY = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [SCREEN_HEIGHT, -50],
              });
              const opacity = anim.interpolate({
                inputRange: [0, 0.1, 0.9, 1],
                outputRange: [0, 1, 1, 0],
              });
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.particle,
                    {
                      left: 20 + index * 40,
                      transform: [{ translateY }],
                      opacity,
                    },
                  ]}
                >
                  <Star size={8} color={currentRoom.ambientColor} />
                </Animated.View>
              );
            })}

            {/* Ambient bubbles */}
            {bubbleAnimations.map((anim, index) => {
              const translateY = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [SCREEN_HEIGHT * 0.8, SCREEN_HEIGHT * 0.2],
              });
              const scale = anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.5, 1, 0.3],
              });
              const opacity = anim.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [0, 0.6, 0.6, 0],
              });
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.bubble,
                    {
                      left: 50 + index * 60,
                      transform: [{ translateY }, { scale }],
                      opacity,
                    },
                  ]}
                />
              );
            })}

            {/* Enhanced ambient lamp */}
            <Animated.View style={[styles.lamp, { opacity: lampOpacity }]}>
              <LinearGradient
                colors={[currentRoom.lampColor, currentRoom.ambientColor, "rgba(255,165,0,0)"]}
                style={styles.lampGlow}
              />
              <View style={styles.lampCore}>
                <Zap size={16} color={currentRoom.lampColor} />
              </View>
            </Animated.View>

            {/* TV and couch area */}
            <View style={styles.livingArea}>
              <TV 
                currentChannel={currentChannel} 
                onChangeChannel={handleChangeChannel}
              />
              
              {/* Couches with frogs */}
              <View style={styles.couchArea}>
                {frogs.map((frog, index) => (
                  <TouchableOpacity
                    key={frog.id}
                    style={[styles.couchSpot, { left: index * 100 + 20 }]}
                    onPress={() => handleBoopFrog(frog.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.couch}>
                      <LinearGradient
                        colors={["#8B4513", "#654321"]}
                        style={styles.couchGradient}
                      />
                    </View>
                    <Frog frog={frog} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Flying flies */}
            {flies.map((fly) => (
              <Fly key={fly.id} fly={fly} />
            ))}

            {/* Enhanced plants and decorations */}
            <View style={styles.plantContainer}>
              <View style={styles.plant}>
                <LinearGradient
                  colors={["#228B22", "#006400"]}
                  style={styles.plantLeaf}
                />
                <View style={styles.plantStem} />
              </View>
              <View style={[styles.plant, { left: 60, transform: [{ scale: 0.8 }] }]}>
                <LinearGradient
                  colors={["#32CD32", "#228B22"]}
                  style={styles.plantLeaf}
                />
                <View style={styles.plantStem} />
              </View>
            </View>

            {/* Ambient water effect */}
            <View style={styles.waterEffect}>
              <Animated.View style={[styles.waterRipple, { opacity: glowAnimation }]}>
                <Waves size={20} color="rgba(100,200,255,0.3)" />
              </Animated.View>
            </View>
          </View>

          {/* Chat overlay */}
          {showChat && (
            <ChatOverlay 
              messages={messages}
              onClose={() => setShowChat(false)}
              onSendMessage={sendMessage}
            />
          )}
        </View>

        {/* Enhanced control panel */}
        <View style={styles.controlPanel}>
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.4)"]}
            style={styles.controlPanelGradient}
          />
          
          <TouchableOpacity 
            style={[styles.controlButton, styles.glowButton]}
            onPress={() => router.push("/achievements")}
          >
            <View style={styles.buttonGlow}>
              <Trophy size={24} color="#FFD700" />
            </View>
            <Text style={styles.controlButtonText}>Trophies</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, styles.glowButton]}
            onPress={() => setShowChat(!showChat)}
          >
            <View style={styles.buttonGlow}>
              <MessageCircle size={24} color="#4A90E2" />
              {isConnected && <View style={styles.onlineIndicator} />}
            </View>
            <Text style={styles.controlButtonText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, styles.glowButton]}
            onPress={handleChangeChannel}
          >
            <View style={styles.buttonGlow}>
              <Tv size={24} color="#9B59B6" />
            </View>
            <Text style={styles.controlButtonText}>Channel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, styles.glowButton]}
            onPress={() => handleThrowFly(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)}
          >
            <View style={styles.buttonGlow}>
              <Bug size={24} color="#27AE60" />
            </View>
            <Text style={styles.controlButtonText}>Feed</Text>
          </TouchableOpacity>
        </View>


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
  terrariumGlass: {
    flex: 1,
    margin: 10,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  glassReflection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    opacity: 0.4,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
  },
  room: {
    flex: 1,
    position: "relative",
  },
  particle: {
    position: "absolute",
    zIndex: 1,
  },
  bubble: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  lamp: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  lampGlow: {
    position: "absolute",
    width: "120%",
    height: "120%",
    borderRadius: 42,
    top: -7,
    left: -7,
  },
  lampCore: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  livingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  couchArea: {
    flexDirection: "row",
    position: "absolute",
    bottom: 100,
    width: "100%",
    height: 150,
  },
  couchSpot: {
    position: "absolute",
    width: 80,
    height: 100,
  },
  couch: {
    position: "absolute",
    bottom: 0,
    width: 80,
    height: 40,
    borderRadius: 10,
    overflow: "hidden",
  },
  couchGradient: {
    flex: 1,
  },
  plantContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 100,
    height: 80,
  },
  plant: {
    position: "absolute",
    width: 35,
    height: 60,
  },
  plantLeaf: {
    width: "100%",
    height: "80%",
    borderRadius: 18,
    transform: [{ rotate: "-10deg" }],
  },
  plantStem: {
    position: "absolute",
    bottom: 0,
    left: "45%",
    width: 4,
    height: 20,
    backgroundColor: "#8B4513",
    borderRadius: 2,
  },
  waterEffect: {
    position: "absolute",
    bottom: 10,
    right: 30,
    width: 50,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  waterRipple: {
    justifyContent: "center",
    alignItems: "center",
  },
  controlPanel: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 20,
    margin: 10,
    position: "relative",
    overflow: "hidden",
  },
  controlPanelGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  controlButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 15,
    minWidth: 60,
  },
  glowButton: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  buttonGlow: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonText: {
    color: "#FFF",
    fontSize: 11,
    marginTop: 6,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  onlineIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },

});