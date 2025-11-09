// ============================================================================
// FROG TYPES
// ============================================================================

export type FrogMood =
  | 'stoned'        // Chill, laid-back (green hue)
  | 'excited'       // Energetic, hyped (yellow hue)
  | 'sleepy'        // Drowsy, tired (blue hue)
  | 'hungry'        // Food-focused (red hue)
  | 'philosophical' // Deep in thought (purple hue)

export type FrogAction =
  | 'idle'              // Default state, gentle floating
  | 'croak'             // Ribbit animation (scale + rotate)
  | 'throw'             // Toss something animation
  | 'catch'             // Catch fly animation (jump + scale)
  | 'summonToadfather'  // Ritual animation (dramatic spin + scale)
  | 'walkOff'           // Departure animation (walk off screen, fade)

export interface GenreWeights {
  mukbang: number;     // 0-1, preference for eating videos
  sports: number;      // 0-1, preference for sports content
  asmr: number;        // 0-1, preference for ASMR
  philosophy: number;  // 0-1, preference for deep content
}

export interface Frog {
  id: string;                    // e.g., "frog1", "frog2", "frog3"
  mood: FrogMood;                // Current emotional state
  genreWeights: GenreWeights;    // Content preferences
  action: FrogAction;            // Current animation/action
  targetX: number;               // X position on stage (pixels)
  targetY: number;               // Y position on stage (pixels)
  thought?: string;              // Current thought bubble text (optional)
}

// ============================================================================
// CHAT TYPES
// ============================================================================

export interface ChatMessage {
  id: string;          // Auto-generated push key
  user: string;        // Username/display name
  text: string;        // Message content
  ts: number;          // Timestamp (Date.now())
}

// ============================================================================
// TRIGGER TYPES
// ============================================================================

export interface Triggers {
  ribbitCount: number;           // Current count of "ribbit" in chat
  lastRibbitReset: number;       // Timestamp of last reset (Date.now())
  toadfatherSummoned: boolean;   // Whether ritual completed recently
  frogsWalkedOff: string[];      // Array of frog IDs that have departed
}

// ============================================================================
// LORE TYPES
// ============================================================================

export interface LoreEvent {
  id: string;              // Auto-generated push key
  frogName: string;        // Which frog is involved
  event: string;           // Short event title
  timestamp: number;       // When it happened (Date.now())
  description: string;     // Longer narrative description
}

// ============================================================================
// DATABASE STRUCTURE TYPES
// ============================================================================

export interface FrogDatabase {
  frogs: {
    [frogId: string]: Frog;
  };
  chat: {
    [messageId: string]: ChatMessage;
  };
  triggers: Triggers;
  lore: {
    [eventId: string]: LoreEvent;
  };
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface FrogProps {
  frog: Frog;
}

export interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export interface ActionButtonsProps {
  onThrowFly: () => void;
  onTriggerCroak: () => void;
  ribbitCount: number;
}

export interface MoodIndicatorProps {
  mood: FrogMood;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface MoodStyle {
  filter: string;
  color: string;
  glow: string;
}

export const MOOD_STYLES: Record<FrogMood, MoodStyle> = {
  stoned: {
    filter: 'hue-rotate(90deg) saturate(0.7)',
    color: '#90EE90',
    glow: 'rgba(144, 238, 144, 0.5)',
  },
  excited: {
    filter: 'hue-rotate(45deg) saturate(1.5)',
    color: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.5)',
  },
  sleepy: {
    filter: 'hue-rotate(240deg) saturate(0.5)',
    color: '#4682B4',
    glow: 'rgba(70, 130, 180, 0.5)',
  },
  hungry: {
    filter: 'hue-rotate(0deg) saturate(1.2)',
    color: '#FF6347',
    glow: 'rgba(255, 99, 71, 0.5)',
  },
  philosophical: {
    filter: 'hue-rotate(270deg) saturate(0.8)',
    color: '#9370DB',
    glow: 'rgba(147, 112, 219, 0.5)',
  },
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const FROG_IDS = ['frog1', 'frog2', 'frog3'] as const;

export const DEFAULT_FROG_STATE: Omit<Frog, 'id'> = {
  mood: 'stoned',
  genreWeights: {
    mukbang: 0.25,
    sports: 0.25,
    asmr: 0.25,
    philosophy: 0.25,
  },
  action: 'idle',
  targetX: 300,
  targetY: 400,
  thought: undefined,
};

export const DEFAULT_TRIGGERS: Triggers = {
  ribbitCount: 0,
  lastRibbitReset: Date.now(),
  toadfatherSummoned: false,
  frogsWalkedOff: [],
};

// ============================================================================
// KEYWORD MAPPINGS FOR CHAT PROCESSING
// ============================================================================

export const PHILOSOPHY_KEYWORDS = [
  'reality',
  'consciousness',
  'existence',
  'meaning',
  'purpose',
  'universe',
  'truth',
  'enlightenment',
  'zen',
  'metaphysical',
];

export const FOOD_KEYWORDS = [
  'food',
  'hungry',
  'eat',
  'snack',
  'fly',
  'flies',
  'bug',
  'bugs',
  'insect',
  'meal',
];

export const EXCITEMENT_KEYWORDS = [
  'wow',
  'amazing',
  'awesome',
  'incredible',
  'hype',
  'energy',
  'party',
  'dance',
];

export const SLEEP_KEYWORDS = [
  'sleep',
  'tired',
  'sleepy',
  'nap',
  'rest',
  'zzz',
  'goodnight',
];
