// Use v2 providers (no v1 import)
import { onCall, type CallableRequest, type CallableResponse } from 'firebase-functions/v2/https';
// Use v2 database and scheduler providers for typed handlers
import { onValueCreated, type DatabaseEvent, type DataSnapshot } from 'firebase-functions/v2/database';
import { onSchedule, type ScheduledEvent } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.database();

// ============================================================================
// TYPES
// ============================================================================

type FrogMood = 'stoned' | 'excited' | 'sleepy' | 'hungry' | 'philosophical';
type FrogAction = 'idle' | 'croak' | 'throw' | 'catch' | 'summonToadfather' | 'walkOff';
interface Frog {
  id: string;
  mood: FrogMood;
  action: FrogAction;
  targetX: number;
  targetY: number;
  thought?: string | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const PHILOSOPHY_KEYWORDS = ['reality', 'consciousness', 'existence', 'meaning', 'purpose', 'universe', 'truth', 'enlightenment', 'zen', 'metaphysical'];
const FOOD_KEYWORDS = ['food', 'hungry', 'eat', 'snack', 'fly', 'flies', 'bug', 'bugs', 'insect', 'meal'];
const EXCITEMENT_KEYWORDS = ['wow', 'amazing', 'awesome', 'incredible', 'hype', 'energy', 'party', 'dance'];
const SLEEP_KEYWORDS = ['sleep', 'tired', 'sleepy', 'nap', 'rest', 'zzz', 'goodnight'];

/**
 * Add a lore event to the database
 */
async function addLoreEvent(frogName: string, event: string, description: string) {
  const loreRef = db.ref('lore').push();
  await loreRef.set({
    frogName,
    event,
    description,
    timestamp: Date.now(),
  });
}

/**
 * Update a frog's state
 */
async function updateFrog(frogId: string, updates: Partial<Frog>) {
  await db.ref(`frogs/${frogId}`).update(updates);
}

/**
 * Reset frog action to idle after a delay.
 * @param frogId - The ID of the frog to reset.
 * @param delayMs - The delay in milliseconds before resetting.
 * @returns Promise that resolves after the delay and reset.
 */
async function resetFrogAction(frogId: string, delayMs: number = 2500): Promise<true> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      await updateFrog(frogId, { action: 'idle', thought: undefined });
      resolve(true);
    }, delayMs);
  });
}

/**
 * Pick a random frog ID
 */
function randomFrogId(): string {
  const frogs = ['frog1', 'frog2', 'frog3'];
  return frogs[Math.floor(Math.random() * frogs.length)];
}

// ============================================================================
// CLOUD FUNCTION: onChatCreate
// ============================================================================

/**
/**
 * Triggered whenever a new chat message is created.
 * Processes the message for keywords and triggers appropriate frog reactions.
 */
export const onChatCreate = onValueCreated('/chat/{pushId}', async (event: DatabaseEvent<DataSnapshot, { pushId: string }>) => {
  const snapshot = event.data;
  const message = snapshot && typeof (snapshot as any).val === 'function' ? (snapshot as any).val() : snapshot;
  const text = (message?.text || '').toString().toLowerCase();
    // Check for "ribbit" - increment counter and potentially summon Toadfather
    if (text.includes('ribbit')) {
      const triggersRef = db.ref('triggers');
      const triggersSnapshot = await triggersRef.once('value');
      const triggers = triggersSnapshot.val();

      const currentCount = triggers.ribbitCount || 0;
      const lastReset = triggers.lastRibbitReset || Date.now();
      const timeSinceReset = Date.now() - lastReset;

      // Reset counter if more than 30 seconds have passed
      if (timeSinceReset > 30000) {
        await triggersRef.update({
          ribbitCount: 1,
          lastRibbitReset: Date.now(),
        });
      } else {
        const newCount = currentCount + 1;
        await triggersRef.update({
          ribbitCount: newCount,
        });

        // Summon Toadfather at 30 ribbits
        if (newCount >= 30 && !triggers.toadfatherSummoned) {
          await summonToadfather();
          await triggersRef.update({
            toadfatherSummoned: true,
            ribbitCount: 0,
            lastRibbitReset: Date.now(),
          });

          // Reset summon flag after 5 minutes
          setTimeout(() => {
            (async () => {
              try {
                await triggersRef.update({ toadfatherSummoned: false });
              } catch (error) {
                console.error('Error resetting toadfatherSummoned:', error);
              }
            })();
          }, 300000);
        }
      }
    }

    // Check for philosophy keywords
    const hasPhilosophyKeyword = PHILOSOPHY_KEYWORDS.some(keyword => text.includes(keyword));
    if (hasPhilosophyKeyword) {
      await updateFrog('frog2', {
        mood: 'philosophical',
        action: 'croak',
        thought: 'What is the nature of existence?',
      });
      await resetFrogAction('frog2', 4000);
    }

    // Check for food keywords
    const hasFoodKeyword = FOOD_KEYWORDS.some(keyword => text.includes(keyword));
    if (hasFoodKeyword) {
      await updateFrog('frog3', {
        mood: 'hungry',
        action: 'croak',
        thought: 'I could really go for some flies right now...',
      });
      await resetFrogAction('frog3', 3000);
    }

    // Check for excitement keywords
    const hasExcitementKeyword = EXCITEMENT_KEYWORDS.some(keyword => text.includes(keyword));
    if (hasExcitementKeyword) {
      const frogId = randomFrogId();
      await updateFrog(frogId, {
        mood: 'excited',
        action: 'croak',
        thought: 'THIS IS AMAZING!',
      });
      await resetFrogAction(frogId, 2500);
    }

    // Check for sleep keywords
    const hasSleepKeyword = SLEEP_KEYWORDS.some(keyword => text.includes(keyword));
    if (hasSleepKeyword) {
      await updateFrog('frog1', {
        mood: 'sleepy',
        action: 'idle',
        thought: '*yawn* ...zzz...',
      });
      await resetFrogAction('frog1', 5000);
    }

    return null;
  });

// ============================================================================
// CLOUD FUNCTION: throwFly (Callable)
// ============================================================================

/**
 * Callable function to throw a fly to the frogs.
 * A random frog will catch it.
 */
export const throwFly = onCall(async (req: CallableRequest<any>, res?: CallableResponse<any>) => {
  const frogId = randomFrogId();

  await updateFrog(frogId, {
    action: 'catch',
    mood: 'excited',
    thought: 'Yum! A fly!',
  });

  await addLoreEvent(
    frogId,
    'Fly Caught',
    `${frogId} successfully caught a fly thrown by a viewer. Delicious!`
  );

  await resetFrogAction(frogId, 3000);

  return { success: true, frogId };
});

// ============================================================================
// CLOUD FUNCTION: triggerCroak (Callable)
// ============================================================================

/**
 * Callable function to make all frogs croak simultaneously.
 */
export const triggerCroak = onCall(async (req: CallableRequest<any>, res?: CallableResponse<any>) => {
  // data is available via req.data if needed
  const promises = ['frog1', 'frog2', 'frog3'].map(frogId =>
    updateFrog(frogId, {
      action: 'croak',
    })
  );

  await Promise.all(promises);

  setTimeout(async () => {
    try {
      const resetPromises = ['frog1', 'frog2', 'frog3'].map(frogId =>
        updateFrog(frogId, { action: 'idle' })
      );
      await Promise.all(resetPromises);
    } catch (error) {
      console.error('Error resetting frogs after croak:', error);
    }
  }, 1500);

  return { success: true };
});

// ============================================================================
/**
 * INTERNAL: Summon the mysterious Toadfather when 30 ribbits are reached.
 * All frogs perform a ritual animation.
 * This function is intended for internal use only.
 */
async function summonToadfather() {
  // All frogs perform summon ritual
  const promises = ['frog1', 'frog2', 'frog3'].map(frogId =>
    updateFrog(frogId, {
      action: 'summonToadfather',
      mood: 'philosophical',
      thought: 'The Toadfather arrives...',
    })
  );

  await Promise.all(promises);

  // Add dramatic lore event
  await addLoreEvent(
    'all',
    'Toadfather Summoned',
    'The Toadfather has been summoned in a chorus of ancient ribbits.'
  );

  // Reset frogs after ritual (longer delay for dramatic effect)
  setTimeout(async () => {
    try {
      const resetPromises = ['frog1', 'frog2', 'frog3'].map(frogId =>
        updateFrog(frogId, {
          action: 'idle',
          mood: 'stoned',
          thought: undefined,
        })
      );
      await Promise.all(resetPromises);
    } catch (error) {
      console.error('Error resetting frogs after ritual:', error);
    }
  }, 5000);
}

/**
 * SCHEDULED FUNCTION: mysteriousEvent
 * Runs every day at 3:33 AM America/Los_Angeles time.
 * Runs every day at 3:33 AM America/Los_Angeles time.
 */
export const mysteriousEvent = onSchedule({ schedule: '33 3 * * *', timeZone: 'America/Los_Angeles' },
  async (event: ScheduledEvent) => {
    const roll = Math.random();

    if (roll < 0.3) {
      // One frog walks off
      const frogId = randomFrogId();
      await updateFrog(frogId, {
        action: 'walkOff',
        mood: 'philosophical',
        thought: 'I must go... my people need me...',
      });

      await addLoreEvent(
        frogId,
        'The Midnight Departure',
        `At exactly 3:33 AM, ${frogId} stood up from the couch and walked off screen without explanation. The other frogs did not react. This is normal.`
      );

      // Mark frog as walked off
      const triggersRef = db.ref('triggers/frogsWalkedOff');
      const snapshot = await triggersRef.once('value');
      const walkedOff = snapshot.val() || [];
      walkedOff.push(frogId);
      await triggersRef.set(walkedOff);

      // Frog returns after 10 minutes
      setTimeout(async () => {
        await updateFrog(frogId, {
          action: 'idle',
          mood: 'stoned',
          thought: undefined,
          targetX: 200 + Math.random() * 600,
          targetY: 400,
        });

        const walkedOffSnapshot = await triggersRef.once('value');
        const currentWalkedOff = walkedOffSnapshot.val() || [];
        const filtered = currentWalkedOff.filter((id: string) => id !== frogId);
        await triggersRef.set(filtered);
      }, 600000);
    } else if (roll < 0.6) {
      // All frogs have synchronized philosophical thoughts
      const thoughts = [
        'We are all connected...',
        'Time is a flat circle',
        'The TV watches us too',
        'What if we are the content?',
      ];
      const thought = thoughts[Math.floor(Math.random() * thoughts.length)];

      const promises = ['frog1', 'frog2', 'frog3'].map(frogId =>
        updateFrog(frogId, {
          mood: 'philosophical',
          thought,
        })
      );

      await Promise.all(promises);

      await addLoreEvent(
        'all',
        'Collective Consciousness',
        `At 3:33 AM, all three frogs simultaneously shared the same thought: "${thought}". Coincidence? The researchers say yes. The frogs know better.`
      );
    } else {
      // Just a mood change to mysterious
      await updateFrog('frog2', {
        mood: 'philosophical',
        thought: '...do you feel that?',
      });

      await addLoreEvent(
        'frog2',
        'The Witching Hour',
        'At 3:33 AM, frog2 sensed something. What was it? We may never know.'
      );
    }

  return;
  });

// ============================================================================
// SCHEDULED FUNCTION: monthlyExodus
// ============================================================================

/**
 * Runs on the first day of every month.
 * All frogs walk off and are replaced by new frogs.
 */
export const monthlyExodus = onSchedule({ schedule: '0 0 1 * *', timeZone: 'America/Los_Angeles' },
  async (event: ScheduledEvent) => {
    const walkOffPromises = ['frog1', 'frog2', 'frog3'].map(frogId =>
      updateFrog(frogId, {
        action: 'walkOff',
        thought: 'Our time here is complete...',
      })
    );

    await Promise.all(walkOffPromises);

    await addLoreEvent(
      'all',
      'The Exodus Begins',
      'All frogs have departed briefly; something strange stirs behind the couch.'
    );

    // Reset the frogs after a delay and declare the new generation
    setTimeout(async () => {
      try {
        const resetPromises = [
          updateFrog('frog1', {
            mood: 'stoned',
            action: 'idle',
            targetX: 200,
            targetY: 400,
            thought: undefined,
          }),
          updateFrog('frog2', {
            mood: 'philosophical',
            action: 'idle',
            targetX: 500,
            targetY: 420,
            thought: undefined,
          }),
          updateFrog('frog3', {
            mood: 'excited',
            action: 'idle',
            targetX: 800,
            targetY: 400,
            thought: undefined,
          }),
        ];

        await Promise.all(resetPromises);

        await addLoreEvent(
          'all',
          'The New Generation',
          'New frogs have arrived to take their place on the couch. They know nothing of what came before. They know only the TV.'
        );
      } catch (error) {
        console.error('Error during frog reset in monthlyExodus:', error);
      }
    }, 30000);

  return;
  });
