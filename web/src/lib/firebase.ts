import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, update, get } from 'firebase/database';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const functions = getFunctions(app);

// ============================================================================
// DATABASE REFERENCES
// ============================================================================

export const dbRefs = {
  frogs: () => ref(database, 'frogs'),
  frog: (frogId: string) => ref(database, `frogs/${frogId}`),
  chat: () => ref(database, 'chat'),
  chatMessage: (messageId: string) => ref(database, `chat/${messageId}`),
  triggers: () => ref(database, 'triggers'),
  lore: () => ref(database, 'lore'),
  loreEvent: (eventId: string) => ref(database, `lore/${eventId}`),
};

// ============================================================================
// CLOUD FUNCTIONS
// ============================================================================

export const cloudFunctions = {
  throwFly: httpsCallable(functions, 'throwFly'),
  triggerCroak: httpsCallable(functions, 'triggerCroak'),
};

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Subscribe to frog state changes
 */
export const subscribeFrogs = (callback: (data: any) => void) => {
  return onValue(dbRefs.frogs(), (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Subscribe to chat messages
 */
export const subscribeChat = (callback: (data: any) => void) => {
  return onValue(dbRefs.chat(), (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Subscribe to triggers
 */
export const subscribeTriggers = (callback: (data: any) => void) => {
  return onValue(dbRefs.triggers(), (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Subscribe to lore events
 */
export const subscribeLore = (callback: (data: any) => void) => {
  return onValue(dbRefs.lore(), (snapshot) => {
    callback(snapshot.val());
  });
};

/**
 * Send a chat message
 */
export const sendChatMessage = async (user: string, text: string) => {
  const messageRef = push(dbRefs.chat());
  await set(messageRef, {
    user,
    text,
    ts: Date.now(),
  });
  return messageRef.key;
};

/**
 * Update frog state
 */
export const updateFrog = async (frogId: string, updates: Partial<any>) => {
  await update(dbRefs.frog(frogId), updates);
};

/**
 * Add lore event
 */
export const addLoreEvent = async (frogName: string, event: string, description: string) => {
  const loreRef = push(dbRefs.lore());
  await set(loreRef, {
    frogName,
    event,
    description,
    timestamp: Date.now(),
  });
  return loreRef.key;
};

/**
 * Initialize database with default values (run once on setup)
 */
export const initializeDatabase = async () => {
  const frogsRef = dbRefs.frogs();
  const frogsSnapshot = await get(frogsRef);

  if (!frogsSnapshot.exists()) {
    // Initialize with default frog states
    await set(frogsRef, {
      frog1: {
        id: 'frog1',
        mood: 'stoned',
        genreWeights: { mukbang: 0.8, sports: 0.1, asmr: 0.5, philosophy: 0.3 },
        action: 'idle',
        targetX: 200,
        targetY: 400,
        thought: null,
      },
      frog2: {
        id: 'frog2',
        mood: 'philosophical',
        genreWeights: { mukbang: 0.2, sports: 0.3, asmr: 0.6, philosophy: 0.9 },
        action: 'idle',
        targetX: 500,
        targetY: 420,
        thought: null,
      },
      frog3: {
        id: 'frog3',
        mood: 'excited',
        genreWeights: { mukbang: 0.9, sports: 0.7, asmr: 0.2, philosophy: 0.1 },
        action: 'idle',
        targetX: 800,
        targetY: 400,
        thought: null,
      },
    });
  }

  const triggersRef = dbRefs.triggers();
  const triggersSnapshot = await get(triggersRef);

  if (!triggersSnapshot.exists()) {
    // Initialize triggers
    await set(triggersRef, {
      ribbitCount: 0,
      lastRibbitReset: Date.now(),
      toadfatherSummoned: false,
      frogsWalkedOff: [],
    });
  }

  console.log('Database initialized successfully');
};

export { database, functions, app };
