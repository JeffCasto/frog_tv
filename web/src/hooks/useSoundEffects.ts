import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Howl } from 'howler';

// ============================================================================
// SOUND DEFINITIONS
// ============================================================================

export type SoundName =
  | 'ribbit'
  | 'ribbitChorus'
  | 'catch'
  | 'munch'
  | 'splash'
  | 'mystery'
  | 'summon'
  | 'walkOff'
  | 'ambient';

interface SoundConfig {
  src: string[];
  volume: number;
  loop?: boolean;
}

const SOUND_CONFIGS: Record<SoundName, SoundConfig> = {
  ribbit: {
    src: ['/sounds/ribbit.mp3', '/sounds/ribbit.webm'],
    volume: 0.6,
  },
  ribbitChorus: {
    src: ['/sounds/ribbit-chorus.mp3', '/sounds/ribbit-chorus.webm'],
    volume: 0.8,
  },
  catch: {
    src: ['/sounds/catch.mp3', '/sounds/catch.webm'],
    volume: 0.7,
  },
  munch: {
    src: ['/sounds/munch.mp3', '/sounds/munch.webm'],
    volume: 0.5,
  },
  splash: {
    src: ['/sounds/splash.mp3', '/sounds/splash.webm'],
    volume: 0.4,
  },
  mystery: {
    src: ['/sounds/mystery.mp3', '/sounds/mystery.webm'],
    volume: 0.5,
  },
  summon: {
    src: ['/sounds/summon.mp3', '/sounds/summon.webm'],
    volume: 0.8,
  },
  walkOff: {
    src: ['/sounds/walk-off.mp3', '/sounds/walk-off.webm'],
    volume: 0.4,
  },
  ambient: {
    src: ['/sounds/swamp-ambient.mp3', '/sounds/swamp-ambient.webm'],
    volume: 0.15,
    loop: true,
  },
};

// ============================================================================
// SOUND CONTEXT
// ============================================================================

interface SoundContextValue {
  play: (name: SoundName) => void;
  stop: (name: SoundName) => void;
  stopAll: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  volume: number;
  isLoaded: boolean;
}

const SoundContext = createContext<SoundContextValue | null>(null);

// ============================================================================
// SOUND PROVIDER
// ============================================================================

interface SoundProviderProps {
  children: ReactNode;
}

export function SoundProvider({ children }: SoundProviderProps) {
  const [sounds, setSounds] = useState<Record<string, Howl>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize sounds on mount
  useEffect(() => {
    const loadedSounds: Record<string, Howl> = {};

    Object.entries(SOUND_CONFIGS).forEach(([name, config]) => {
      loadedSounds[name] = new Howl({
        src: config.src,
        volume: config.volume * volume,
        loop: config.loop || false,
        preload: true,
        onloaderror: (id, error) => {
          console.warn(`Failed to load sound "${name}":`, error);
        },
      });
    });

    setSounds(loadedSounds);
    setIsLoaded(true);

    // Load muted preference from localStorage
    const savedMuted = localStorage.getItem('frogtv_muted');
    if (savedMuted === 'true') {
      setIsMuted(true);
    }

    const savedVolume = localStorage.getItem('frogtv_volume');
    if (savedVolume) {
      setVolumeState(parseFloat(savedVolume));
    }

    // Cleanup on unmount
    return () => {
      Object.values(loadedSounds).forEach(sound => sound.unload());
    };
  }, []);

  // Update all sound volumes when master volume changes
  useEffect(() => {
    Object.entries(sounds).forEach(([name, sound]) => {
      const config = SOUND_CONFIGS[name as SoundName];
      sound.volume(isMuted ? 0 : config.volume * volume);
    });
  }, [sounds, volume, isMuted]);

  const play = useCallback((name: SoundName) => {
    if (sounds[name] && !isMuted) {
      sounds[name].play();
    }
  }, [sounds, isMuted]);

  const stop = useCallback((name: SoundName) => {
    if (sounds[name]) {
      sounds[name].stop();
    }
  }, [sounds]);

  const stopAll = useCallback(() => {
    Object.values(sounds).forEach(sound => sound.stop());
  }, [sounds]);

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
    localStorage.setItem('frogtv_muted', String(muted));
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    localStorage.setItem('frogtv_volume', String(clampedVolume));
  }, []);

  return (
    <SoundContext.Provider
      value={{
        play,
        stop,
        stopAll,
        setMuted,
        setVolume,
        isMuted,
        volume,
        isLoaded,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useSoundEffects() {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error('useSoundEffects must be used within a SoundProvider');
  }

  return context;
}

// ============================================================================
// ACTION TO SOUND MAPPING
// ============================================================================

export function getSoundForAction(action: string): SoundName | null {
  switch (action) {
    case 'croak':
      return 'ribbit';
    case 'catch':
      return 'catch';
    case 'summonToadfather':
      return 'summon';
    case 'walkOff':
      return 'walkOff';
    default:
      return null;
  }
}
