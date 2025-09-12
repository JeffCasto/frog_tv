import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Text, TouchableOpacity, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Video, ResizeMode } from "expo-av";

import { TV_CHANNELS } from "@/constants/tvChannels";
import { Play, Pause, Volume2, VolumeX, Radio, Wifi } from "lucide-react-native";

interface TVProps {
  currentChannel: number;
  onChangeChannel: () => void;
}

export function TV({ currentChannel, onChangeChannel }: TVProps) {
  const staticAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scanlineAnim = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    // TV glow effect based on channel mood
    const channel = TV_CHANNELS[currentChannel];
    const glowColors = {
      chill: [0.2, 0.4],
      energetic: [0.4, 0.8],
      mysterious: [0.1, 0.3],
      cozy: [0.3, 0.6]
    };
    const [min, max] = glowColors[channel.mood || 'chill'];
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: max,
          duration: channel.mood === 'energetic' ? 1000 : 3000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: min,
          duration: channel.mood === 'energetic' ? 1000 : 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Scanline effect
    Animated.loop(
      Animated.timing(scanlineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Static noise animation when changing channels
    Animated.sequence([
      Animated.timing(staticAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(staticAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentChannel, glowAnim, staticAnim, scanlineAnim]);

  const channel = TV_CHANNELS[currentChannel];
  const glowOpacity = glowAnim;
  const scanlineTranslateY = scanlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const getVideoSource = () => {
    if (channel.videoUrl) return channel.videoUrl;
    if (channel.streamUrl) return channel.streamUrl;
    return null;
  };

  const renderVideoContent = () => {
    // YouTube content
    if (channel.type === 'youtube' && channel.youtubeId) {
      if (Platform.OS === 'web') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
            dangerouslySetInnerHTML={{
              __html: `<iframe
                src="https://www.youtube.com/embed/${channel.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${channel.youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                style="width: 100%; height: 100%; border: none;"
                allow="autoplay; encrypted-media"
                allowfullscreen
              ></iframe>`
            }}
          />
        );
      } else {
        // For mobile, show YouTube placeholder with link
        return (
          <LinearGradient
            colors={channel.colors as [string, string, ...string[]]}
            style={styles.fallbackScreen}
          >
            <View style={styles.content}>
              <Text style={styles.channelEmoji}>{channel.emoji}</Text>
              <Text style={styles.channelName}>{channel.name}</Text>
              <Text style={styles.channelDesc}>{channel.description}</Text>
              <View style={styles.youtubeIndicator}>
                <Text style={styles.youtubeText}>📺 YouTube</Text>
                <Text style={styles.youtubeNote}>Tap to watch on YouTube</Text>
              </View>
            </View>
          </LinearGradient>
        );
      }
    }

    // Direct video or stream content
    const videoSource = getVideoSource();
    if (videoSource) {
      if (Platform.OS === 'web') {
        // Use HTML5 video for web
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
            dangerouslySetInnerHTML={{
              __html: `<video
                src="${videoSource}"
                style="width: 100%; height: 100%; object-fit: cover;"
                autoplay
                muted
                loop
                playsinline
                controls="false"
              ></video>`
            }}
          />
        );
      } else {
        // Use expo-av Video for mobile
        return (
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: videoSource }}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isPlaying}
            isLooping={channel.type !== 'stream'}
            isMuted={isMuted}
            volume={0.3}
            onPlaybackStatusUpdate={(status) => {
              if ('isLoaded' in status && status.isLoaded) {
                setIsPlaying(status.isPlaying || false);
              }
            }}
          />
        );
      }
    }

    // Fallback content with enhanced visuals
    return (
      <LinearGradient
        colors={channel.colors as [string, string, ...string[]]}
        style={styles.fallbackScreen}
      >
        <View style={styles.content}>
          <Text style={styles.channelEmoji}>{channel.emoji}</Text>
          <Text style={styles.channelName}>{channel.name}</Text>
          <Text style={styles.channelDesc}>{channel.description}</Text>
          {channel.isLive && (
            <View style={styles.liveIndicator}>
              <Radio size={12} color="#FF0000" />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
          {(channel.type === 'stream' || channel.type === 'video') && (
            <View style={styles.streamingIndicator}>
              <Wifi size={12} color="#4A90E2" />
              <Text style={styles.streamingText}>STREAMING</Text>
            </View>
          )}
          <View style={styles.noSignalText}>
            <Text style={styles.noSignalLabel}>Loading content...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      {/* TV Frame with enhanced styling */}
      <View style={styles.tvFrame}>
        {/* Screen bezel */}
        <View style={styles.screenBezel}>
          {/* Video or fallback content */}
          <View style={styles.screen}>
            {renderVideoContent()}

            {/* CRT Effects */}
            <View style={styles.crtEffects}>
              {/* Scanlines */}
              <Animated.View
                style={[
                  styles.scanline,
                  {
                    transform: [{ translateY: scanlineTranslateY }],
                  },
                ]}
              />
              
              {/* Static overlay */}
              <Animated.View
                style={[
                  styles.static,
                  {
                    opacity: staticAnim,
                  },
                ]}
              />

              {/* Screen curvature overlay */}
              <View style={styles.curvature} />
            </View>

            {/* Controls overlay */}
            {showControls && (channel.videoUrl || channel.streamUrl) && Platform.OS !== 'web' && (
              <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton} onPress={togglePlayPause}>
                  {isPlaying ? <Pause size={16} color="#FFF" /> : <Play size={16} color="#FFF" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
                  {isMuted ? <VolumeX size={16} color="#FFF" /> : <Volume2 size={16} color="#FFF" />}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* TV body and details */}
        <View style={styles.tvBody}>
          <View style={styles.speaker}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={styles.speakerHole} />
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.channelButton} 
            onPress={onChangeChannel}
            activeOpacity={0.7}
          >
            <Text style={styles.channelButtonText}>CH</Text>
          </TouchableOpacity>
        </View>

        {/* TV Stand */}
        <View style={styles.stand} />
        
        {/* Channel indicator */}
        <View style={styles.channelIndicator}>
          <Text style={styles.channelNumber}>CH {currentChannel + 1}</Text>
          {channel.isLive && <View style={styles.liveDot} />}
        </View>

        {/* Screen glow */}
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              shadowColor: channel.colors[1] || '#4A90E2',
            },
          ]}
        />
      </View>

      {/* Touch area for controls */}
      <TouchableOpacity
        style={styles.touchArea}
        onPress={() => setShowControls(!showControls)}
        activeOpacity={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  tvFrame: {
    width: 240,
    height: 180,
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  screenBezel: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    borderRadius: 8,
    padding: 4,
  },
  screen: {
    flex: 1,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  fallbackScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 10,
  },
  channelEmoji: {
    fontSize: 32,
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  channelName: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  channelDesc: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 9,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "rgba(255,0,0,0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveText: {
    color: "#FF0000",
    fontSize: 8,
    fontWeight: "bold",
    marginLeft: 2,
  },
  crtEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  static: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  curvature: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  controls: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    padding: 4,
  },
  controlButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  tvBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  speaker: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 40,
  },
  speakerHole: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#333",
    margin: 1,
  },
  channelButton: {
    backgroundColor: "#333",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#555",
  },
  channelButtonText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  glow: {
    position: "absolute",
    top: -25,
    left: -25,
    right: -25,
    bottom: -25,
    borderRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 0,
  },
  stand: {
    width: 80,
    height: 12,
    backgroundColor: "#0F0F0F",
    alignSelf: "center",
    marginTop: 8,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  channelIndicator: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  channelNumber: {
    color: "#00FF00",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF0000",
    marginLeft: 4,
  },
  touchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  streamingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  streamingText: {
    color: "#4A90E2",
    fontSize: 8,
    fontWeight: "bold",
    marginLeft: 2,
  },
  noSignalText: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
  },
  noSignalLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  youtubeIndicator: {
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(255,0,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  youtubeText: {
    color: "#FF0000",
    fontSize: 10,
    fontWeight: "bold",
  },
  youtubeNote: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 8,
    marginTop: 2,
    textAlign: "center",
  },
});