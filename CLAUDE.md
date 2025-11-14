# CLAUDE.md - Frog TV Development Guide

## Project Overview

**Frog TV** is an interactive React Native entertainment app featuring a virtual terrarium with animated frogs, a retro TV interface, and a chat command system. Built with Expo for cross-platform deployment (iOS, Android, Web), it combines whimsical animations, user interactions, and achievement tracking into a delightful experience.

### Core Features
- **Interactive Terrarium**: 3 frogs with dynamic moods, tap-to-throw flies, animated bubbles and particles
- **Retro TV**: 14 channels with CRT effects, scanlines, and video playback (YouTube embeds, livestreams)
- **Chat Command System**: 12+ chat events triggering animations and environment changes
- **Achievement System**: 19 unlockable trophies with persistent tracking
- **Room Themes**: 7 customizable aesthetic styles with gradient backgrounds
- **Haptic Feedback**: Native haptic responses for user interactions

---

## Technology Stack

### Core Framework
- **Expo 54**: Cross-platform React Native framework with managed workflow
- **React Native 0.73.4**: Mobile UI framework
- **React 18.3.1**: UI library with hooks
- **TypeScript 5.8**: Type-safe JavaScript
- **Bun**: Modern package manager (faster than npm/yarn)

### Navigation & Routing
- **Expo Router v6**: File-based routing system (similar to Next.js)
  - Routes defined by files in `/app` directory
  - `_layout.tsx` files define nested layouts
  - Navigation stack with modal support

### State Management
- **Zustand v5**: Lightweight state management (not currently used but available)
- **React Context API**: Primary state management via custom providers
- **@tanstack/react-query v5**: Server state management (currently minimal usage)
- **AsyncStorage**: Persistent local storage for frogs, achievements, room preferences

### UI & Styling
- **NativeWind v4.1.23**: Tailwind CSS for React Native (utility-first styling)
- **expo-linear-gradient**: Gradient backgrounds for room themes
- **lucide-react-native**: Modern icon library
- **@expo/vector-icons**: Comprehensive icon set
- **react-native-svg**: SVG support for custom graphics

### Native Features
- **expo-av**: Audio/video playback for TV channels
- **expo-haptics**: Haptic feedback on interactions
- **expo-location**: Location services (available but not actively used)
- **expo-image-picker**: File/image selection capabilities
- **react-native-gesture-handler**: Advanced gesture recognition
- **react-native-webview**: Embedded web content for YouTube/livestreams

---

## Architecture & Code Organization

### Directory Structure

```
/home/user/frog_tv/
├── app/                          # Expo Router screens (file-based routing)
│   ├── _layout.tsx              # Root layout with provider hierarchy
│   ├── index.tsx                # Main terrarium screen
│   ├── achievements.tsx         # Achievement/trophy modal screen
│   └── +not-found.tsx           # 404 fallback
│
├── components/                   # Reusable UI components
│   ├── TV.tsx                   # TV component with CRT effects
│   ├── Fly.tsx                  # Animated fly with physics
│   ├── Frog.tsx                 # TODO: Frog character component
│   └── ChatOverlay.tsx          # TODO: Chat interface overlay
│
├── providers/                    # React Context providers (state management)
│   ├── FrogTerrariumProvider.tsx # Frogs, flies, room styles state
│   ├── ChatProvider.tsx          # Chat messages and event system
│   └── AchievementProvider.tsx   # Achievement tracking and unlocking
│
├── constants/                    # Configuration and data definitions
│   ├── achievements.ts          # 19 achievement definitions
│   ├── colors.ts                # Color palette
│   ├── roomStyles.ts            # 7 room theme configurations
│   └── tvChannels.ts            # 14 TV channel definitions
│
├── types/                        # TypeScript type definitions
│   ├── terrarium.ts             # Frog, Fly, RoomStyle interfaces
│   └── chat.ts                  # ChatMessage interface
│
├── package.json                  # Dependencies and scripts
├── app.json                      # Expo configuration
├── tsconfig.json                # TypeScript configuration
└── bun.lock                      # Package lock file
```

### Provider Hierarchy (app/_layout.tsx)

Providers are nested in this specific order:
```tsx
<QueryClientProvider>           // React Query for server state
  <GestureHandlerRootView>      // Gesture system root
    <AchievementProvider>        // Achievement tracking (outermost app state)
      <FrogTerrariumProvider>    // Terrarium state (frogs, flies, room)
        <ChatProvider>           // Chat and events (depends on terrarium)
          <RootLayoutNav />      // Navigation stack
```

**Why this order?**
- `AchievementProvider` is outermost because achievements can be unlocked from any context
- `FrogTerrariumProvider` comes before `ChatProvider` because chat events modify terrarium state
- `QueryClientProvider` wraps everything for potential API calls
- `GestureHandlerRootView` enables gestures throughout the app

---

## State Management Patterns

### Provider Pattern with Custom Hook

This project uses `@nkzw/create-context-hook` to create type-safe context providers:

```typescript
// Pattern used in providers/FrogTerrariumProvider.tsx
export const [FrogTerrariumProvider, useFrogTerrarium] = createContextHook<State>(() => {
  const [state, setState] = useState(initialState);

  const method = useCallback(() => {
    // State mutation logic
  }, [dependencies]);

  return {
    state,
    method,
  };
});
```

**Usage in components:**
```typescript
import { useFrogTerrarium } from "@/providers/FrogTerrariumProvider";

function MyComponent() {
  const { frogs, boopFrog } = useFrogTerrarium();
  // Use state and methods
}
```

### AsyncStorage Persistence Pattern

State is persisted to AsyncStorage following this pattern:

```typescript
// Load on mount
useEffect(() => {
  const loadState = async () => {
    const saved = await AsyncStorage.getItem("key");
    if (saved) setState(JSON.parse(saved));
  };
  loadState();
}, []);

// Save on state change
useEffect(() => {
  AsyncStorage.setItem("key", JSON.stringify(state));
}, [state]);
```

**Persisted Data:**
- Frog states (mood, boopCount, lastBoopTime)
- Room style preference
- Unlocked achievements

---

## TypeScript Conventions

### Type Definitions (types/ directory)

All shared types are defined in `/types`:

```typescript
// types/terrarium.ts
export interface Frog {
  id: string;              // Unique identifier
  name: string;            // Display name
  mood: "happy" | "sleepy" | "excited" | "surprised" | "hungry" | "content";
  position: { x: number; y: number };
  color: string;           // Hex color code
  boopCount: number;       // Total boops received
  lastBoopTime: number | null; // Timestamp of last boop
}

export interface Fly {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  isEaten: boolean;
}

export type RoomStyle = "cozy" | "neon" | "forest" | "space" | "cosmic" | "zen" | "void";
```

### Constants Pattern

Configuration is extracted into typed constants:

```typescript
// constants/roomStyles.ts
export const ROOM_STYLES: Record<RoomStyle, { colors: string[], ambient: string }> = {
  cozy: {
    colors: ["#2C1810", "#8B4513"],
    ambient: "#FFD700",
  },
  // ... more styles
};

// Usage
const style = ROOM_STYLES[roomStyle];
```

### Import Aliases

The project uses `@/` as an alias for root imports:
```typescript
import { Frog } from "@/types/terrarium";
import { useFrogTerrarium } from "@/providers/FrogTerrariumProvider";
import { ROOM_STYLES } from "@/constants/roomStyles";
```

---

## React Native Animation Patterns

### Animated API Usage

The project uses React Native's `Animated` API extensively:

```typescript
import { Animated, Easing } from "react-native";

// Create animated value
const animatedValue = useRef(new Animated.Value(0)).current;

// Animate
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 1000,
  easing: Easing.ease,
  useNativeDriver: true,  // IMPORTANT: Use native driver when possible
}).start();

// Interpolate for transforms
const opacity = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 1],
});
```

**Key Animations in This Project:**
- **Fly trajectory**: Spring animation with velocity and damping
- **Bubble rise**: Loop with random delays
- **TV scanlines**: Continuous scrolling effect
- **Lamp flicker**: Random opacity changes
- **Glass reflection**: Shimmer effect with transforms

### useNativeDriver Guidelines

**Always use `useNativeDriver: true` when animating:**
- `opacity`
- `transform` (translateX, translateY, scale, rotate)

**Cannot use native driver for:**
- Layout properties (width, height, margin, padding)
- Colors
- Text properties

---

## Component Patterns

### Component Structure Template

```typescript
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSomeContext } from "@/providers/SomeProvider";

interface MyComponentProps {
  id: string;
  onPress?: () => void;
  style?: object;
}

export function MyComponent({ id, onPress, style }: MyComponentProps) {
  const { state, method } = useSomeContext();
  const [localState, setLocalState] = useState(false);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handlePress = useCallback(() => {
    method();
    onPress?.();
  }, [method, onPress]);

  return (
    <View style={[styles.container, style]}>
      <Text>{state.value}</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text>Press Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### Styling Approach

This project uses **StyleSheet.create** for component styles:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
});
```

**Note:** NativeWind (Tailwind) is available but not heavily used in existing code. Prefer StyleSheet for consistency.

---

## Key Concepts & Domain Logic

### Frog System

**Three Frogs:**
- **Ribberto** (id: frog1, color: #4CAF50)
- **Croaksworth** (id: frog2, color: #8BC34A)
- **Hopscotch** (id: frog3, color: #689F38)

**Moods:** `happy`, `sleepy`, `excited`, `surprised`, `hungry`, `content`

**Boop Interaction:**
- Tap a frog to "boop" it
- Randomly changes mood to happy/excited/surprised/content
- Increments `boopCount`
- Updates `lastBoopTime`
- Triggers haptic feedback
- Unlocks achievements at milestones (1, 10, 100 boops)

### Fly System

**Fly Lifecycle:**
1. Created by tap on terrarium or chat events
2. Flies with random velocity (x: ±2, y: ±2)
3. Animated entry with spring
4. Auto-removed after 3 seconds

**Fly Spawning:**
- Single fly: `throwFly(x, y)`
- Rain flies event: 8 flies
- Feed frenzy event: 12 flies

### Chat Event System

Chat events are triggered by message patterns (providers/ChatProvider.tsx):

```typescript
const events = [
  {
    id: "boop-all",
    patterns: ["boop all", "mass boop"],
    cooldown: 30000, // 30 seconds
    action: () => {
      // Boop all frogs
    },
  },
  // ... more events
];
```

**Key Events:**
- `boop all` / `mass boop`: Boop all frogs
- `rain flies` / `fly storm`: Spawn 8 flies
- `party mode`: Change to neon room + effects
- `summon toadfather`: Special 3:33 AM event
- `zen mode`: Change to zen room
- `feed frenzy`: Spawn 12 flies
- `chaos` / `mayhem`: Multi-action event

**Event Cooldown System:**
Each event has a cooldown period to prevent spam. Last trigger time is tracked per event.

### Achievement System

19 achievements tracked in constants/achievements.ts:

```typescript
export const ACHIEVEMENTS = [
  {
    id: "first-boop",
    icon: "👆",
    title: "First Boop",
    description: "Boop a frog for the first time",
  },
  // ... more achievements
];
```

**Achievement Unlocking:**
```typescript
const { unlockAchievement } = useAchievements();

// Check and unlock
if (condition) {
  unlockAchievement("achievement-id");
}
```

**Unlocking triggers:**
- Haptic success feedback
- Persistent save to AsyncStorage

### Room Themes

7 room styles with gradient backgrounds (constants/roomStyles.ts):
- **cozy**: Warm browns and golds
- **neon**: Vibrant pinks and purples
- **forest**: Natural greens
- **space**: Deep blues and purples
- **cosmic**: Vibrant space colors
- **zen**: Calming teals
- **void**: Deep blacks with subtle purple

### TV Channel System

14 channels with unique content (constants/tvChannels.ts):

```typescript
interface TVChannel {
  id: number;
  name: string;
  emoji: string;
  description: string;
  color: string;
  videoUrl?: string;      // Direct video URL
  youtubeId?: string;     // YouTube video ID
  isLiveStream?: boolean; // Livestream flag
}
```

**Channel Types:**
- Direct video URLs (MP4, etc.)
- YouTube embeds (via webview)
- Livestreams (24/7 streams)

**TV Component Features:**
- CRT scanline effect
- Static noise overlay
- Screen glow
- Play/pause/mute controls
- Channel switching

---

## Development Workflow

### Running the App

```bash
# Start Expo development server
bun x expo start

# Options:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Press 'w' for web browser
# - Scan QR code with Expo Go app on physical device
```

### Development Environment Setup

**Required:**
- Bun (package manager)
- Node.js 18+
- Expo CLI (installed via bun)

**For iOS:**
- macOS with Xcode
- iOS Simulator

**For Android:**
- Android Studio
- Android Emulator or physical device

**For Web:**
- Modern web browser

### Project Scripts

```json
{
  "start": "bun x expo start"
}
```

Currently minimal scripts. Consider adding:
- `"test"`: Run tests
- `"lint"`: Linting
- `"build:ios"`: iOS build
- `"build:android"`: Android build

### Hot Reloading

Expo provides automatic hot reloading:
- Save any file to see changes instantly
- CMD+D (iOS) or CTRL+M (Android) for dev menu
- Shake device for dev menu on physical devices

---

## Adding New Features

### Adding a New Screen

1. Create file in `/app` directory:
```typescript
// app/settings.tsx
export default function SettingsScreen() {
  return (
    <View>
      <Text>Settings</Text>
    </View>
  );
}
```

2. Add to navigation stack in `app/_layout.tsx`:
```typescript
<Stack.Screen
  name="settings"
  options={{
    presentation: "modal",
    headerShown: true,
    title: "Settings"
  }}
/>
```

3. Navigate from anywhere:
```typescript
import { router } from "expo-router";

router.push("/settings");
```

### Adding a New Component

1. Create file in `/components`:
```typescript
// components/Plant.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

interface PlantProps {
  type: "fern" | "flower" | "cactus";
  position: { x: number; y: number };
}

export function Plant({ type, position }: PlantProps) {
  return (
    <View style={[styles.plant, { left: position.x, top: position.y }]}>
      {/* Plant rendering */}
    </View>
  );
}

const styles = StyleSheet.create({
  plant: {
    position: "absolute",
    width: 50,
    height: 50,
  },
});
```

2. Import and use:
```typescript
import { Plant } from "@/components/Plant";

<Plant type="fern" position={{ x: 100, y: 300 }} />
```

### Adding a New Provider

1. Create file in `/providers`:
```typescript
// providers/SoundProvider.tsx
import createContextHook from "@nkzw/create-context-hook";
import { Audio } from "expo-av";
import { useState, useCallback } from "react";

interface SoundState {
  isPlaying: boolean;
  playSound: (soundName: string) => Promise<void>;
  stopSound: () => Promise<void>;
}

export const [SoundProvider, useSound] = createContextHook<SoundState>(() => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = useCallback(async (soundName: string) => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      require(`@/assets/sounds/${soundName}.mp3`)
    );
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
  }, []);

  const stopSound = useCallback(async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setIsPlaying(false);
    }
  }, [sound]);

  return { isPlaying, playSound, stopSound };
});
```

2. Add to provider hierarchy in `app/_layout.tsx`:
```typescript
<SoundProvider>
  {/* existing providers */}
</SoundProvider>
```

3. Use in components:
```typescript
import { useSound } from "@/providers/SoundProvider";

const { playSound } = useSound();
playSound("boop");
```

### Adding a New Achievement

1. Add definition to `constants/achievements.ts`:
```typescript
{
  id: "night-owl",
  icon: "🦉",
  title: "Night Owl",
  description: "Use the app between midnight and 3 AM",
},
```

2. Unlock in relevant code:
```typescript
const { unlockAchievement } = useAchievements();

const hour = new Date().getHours();
if (hour >= 0 && hour < 3) {
  unlockAchievement("night-owl");
}
```

### Adding a New Chat Event

1. Add to events array in `providers/ChatProvider.tsx`:
```typescript
{
  id: "rainbow-mode",
  patterns: ["rainbow", "make it rainbow"],
  cooldown: 60000, // 1 minute
  action: () => {
    // Cycle through all room styles
    const styles: RoomStyle[] = ["cozy", "neon", "forest", "space", "cosmic", "zen", "void"];
    let index = 0;
    const interval = setInterval(() => {
      changeRoomStyle(styles[index]);
      index = (index + 1) % styles.length;
      if (index === 0) clearInterval(interval);
    }, 1000);

    unlockAchievement("rainbow-master");
  },
},
```

### Adding a New Room Style

1. Add to type in `types/terrarium.ts`:
```typescript
export type RoomStyle =
  | "cozy" | "neon" | "forest" | "space" | "cosmic" | "zen" | "void"
  | "cyberpunk"; // New style
```

2. Add configuration in `constants/roomStyles.ts`:
```typescript
export const ROOM_STYLES: Record<RoomStyle, { colors: string[], ambient: string }> = {
  // ... existing styles
  cyberpunk: {
    colors: ["#0D0221", "#0F084B", "#26408B", "#A6CFD5"],
    ambient: "#00FFFF",
  },
};
```

3. Add selector in UI (e.g., settings screen or control panel)

### Adding a New TV Channel

1. Add to `constants/tvChannels.ts`:
```typescript
{
  id: 14,
  name: "Retro Gaming",
  emoji: "🎮",
  description: "Classic game playthroughs",
  color: "#FF6B6B",
  youtubeId: "example-youtube-id",
},
```

2. Update channel count in `changeChannel` logic if needed

---

## Testing Strategy (TODO)

Currently no testing infrastructure. Recommended setup:

### Unit Tests
- **Framework**: Jest with React Native preset
- **Test files**: `*.test.ts` or `*.test.tsx` alongside source files
- **Coverage**: Providers, utilities, pure functions

### Component Tests
- **Framework**: React Native Testing Library
- **Focus**: Component rendering, user interactions, state changes

### E2E Tests
- **Framework**: Detox
- **Scenarios**:
  - Boop frog flow
  - Throw fly animation
  - Channel switching
  - Achievement unlocking
  - Chat event triggers

### Test Commands (to be added)
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:e2e": "detox test"
}
```

---

## Common Pitfalls & Solutions

### AsyncStorage Timing Issues

**Problem**: State loaded from AsyncStorage may not be ready on first render.

**Solution**: Show loading state or use default values:
```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadState = async () => {
    // Load logic
    setIsLoading(false);
  };
  loadState();
}, []);

if (isLoading) return <LoadingScreen />;
```

### Animation Performance

**Problem**: Animations feel janky or slow.

**Solution**:
- Always use `useNativeDriver: true` when possible
- Avoid animating layout properties
- Use `shouldComponentUpdate` or `React.memo` to prevent unnecessary re-renders
- Profile with React DevTools

### Gesture Conflicts

**Problem**: Gestures interfere with scrolling or other interactions.

**Solution**:
- Use `simultaneousHandlers` prop on gesture handlers
- Properly configure gesture priorities
- Test on physical devices (simulators can behave differently)

### Provider Access Before Mount

**Problem**: Trying to use context before provider is mounted.

**Solution**: Ensure provider hierarchy in `_layout.tsx` is correct and component is within provider tree.

### TypeScript Errors with Expo Router

**Problem**: TypeScript not recognizing route names.

**Solution**: Expo Router generates types automatically. Restart TypeScript server or rebuild:
```bash
bun x expo start --clear
```

---

## Performance Optimization

### Memoization

Use `React.memo` for expensive components:
```typescript
export const Fly = React.memo(({ id, position, velocity }: FlyProps) => {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id &&
         prevProps.position === nextProps.position;
});
```

### useCallback & useMemo

Optimize callbacks and computed values:
```typescript
const handlePress = useCallback(() => {
  // Logic
}, [dependencies]);

const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);
```

### Flatlist Optimization

For large lists (not heavily used in this project):
```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Item data={item} />}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Image Optimization

Use Expo Image for better performance:
```typescript
import { Image } from "expo-image";

<Image
  source={{ uri: "https://example.com/image.jpg" }}
  placeholder={blurhash}
  contentFit="cover"
  transition={1000}
/>
```

---

## Debugging Tips

### React Native Debugger

1. Enable remote debugging in dev menu
2. Open React Native Debugger app
3. Inspect component hierarchy and state

### Console Logging

Use platform-specific logging:
```typescript
console.log("Debug:", value);
console.warn("Warning:", issue);
console.error("Error:", error);
```

### Expo Dev Tools

Access at `http://localhost:19002` when running `expo start`:
- View logs
- Trigger shake gesture
- Reload app
- Toggle element inspector

### Layout Debugging

Visualize layout boundaries:
```typescript
import { View } from "react-native";

<View style={{ borderWidth: 1, borderColor: "red" }}>
  {/* Content */}
</View>
```

### Performance Monitor

Enable in dev menu:
- Shows FPS
- Displays RAM usage
- Highlights performance issues

---

## Git Workflow

### Branch Strategy

- **main**: Production-ready code
- **feature/[name]**: New features
- **fix/[name]**: Bug fixes
- **refactor/[name]**: Code improvements

### Commit Messages

Follow conventional commits:
```
feat: add new room style "cyberpunk"
fix: resolve fly animation timing issue
refactor: extract frog logic into custom hook
docs: update CLAUDE.md with testing section
chore: upgrade expo to v54
```

### Pre-commit Checklist

- [ ] Code compiles without TypeScript errors
- [ ] No console.error statements
- [ ] Animations run smoothly
- [ ] AsyncStorage changes are tested
- [ ] New features have corresponding achievements (if applicable)

---

## Future Enhancements

### Planned Features (based on TODOs)

1. **Frog.tsx Component**: Implement animated frog character with:
   - Mood-based expressions
   - Idle animations
   - Boop reaction animation
   - Tongue animation for catching flies

2. **ChatOverlay.tsx Component**: Chat interface with:
   - Message list view
   - Message input field
   - Command suggestions
   - User avatars/colors

3. **Backend Integration**:
   - Real-time chat with WebSockets
   - Multi-user terrarium
   - Leaderboards for boops/flies
   - Cloud save/sync

4. **Additional Features**:
   - Sound effects and music
   - More frog personalities and rarities
   - Frog customization (hats, accessories)
   - Mini-games
   - Day/night cycle
   - Weather effects
   - Breeding system

### Technical Debt

- Add comprehensive testing
- Set up CI/CD pipeline
- Improve error handling
- Add analytics/telemetry
- Performance profiling
- Accessibility improvements
- Internationalization (i18n)

---

## Resources & References

### Documentation
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Libraries
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [React Query](https://tanstack.com/query/latest/docs/react/overview)
- [Lucide Icons](https://lucide.dev/)

### Community
- [Expo Forums](https://forums.expo.dev/)
- [React Native Community](https://github.com/react-native-community)
- [r/reactnative](https://reddit.com/r/reactnative)

---

## AI Assistant Guidelines

When working on this codebase:

1. **Understand Context**: Review relevant provider state before making changes
2. **Follow Patterns**: Match existing code style and architecture
3. **Type Safety**: Always use TypeScript types, no `any` types
4. **Persistence**: Consider AsyncStorage impact when modifying state
5. **Performance**: Use `useNativeDriver: true` for animations
6. **Testing**: Verify changes work on both iOS and Android (or note platform-specific code)
7. **Documentation**: Update this file when making architectural changes
8. **Achievements**: Consider adding achievements for new features
9. **Haptics**: Add haptic feedback for important user interactions
10. **Gradual Changes**: Make incremental changes rather than large refactors

### Before Making Changes
- [ ] Read relevant sections of this CLAUDE.md
- [ ] Understand provider dependencies
- [ ] Check existing types and interfaces
- [ ] Review similar existing code

### After Making Changes
- [ ] Verify TypeScript compiles
- [ ] Test on at least one platform
- [ ] Check AsyncStorage persistence if applicable
- [ ] Update CLAUDE.md if architecture changed
- [ ] Consider adding achievements for new features

---

**Last Updated**: 2025-11-14
**Version**: 1.0.0
**Maintainer**: Frog TV Development Team
