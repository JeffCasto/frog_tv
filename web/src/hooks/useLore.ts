import { useState, useEffect } from 'react';
import { subscribeLore } from '@/lib/firebase';
import { LoreEvent } from '@/types';

/**
 * Hook to subscribe to lore events in real-time
 */
export const useLore = () => {
  const [loreEvents, setLoreEvents] = useState<LoreEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeLore((data) => {
        if (data) {
          // Convert Firebase object to array and sort by timestamp (newest first)
          const eventsArray = Object.entries(data).map(([id, event]: [string, any]) => ({
            id,
            ...event,
          }));
          eventsArray.sort((a, b) => b.timestamp - a.timestamp);
          setLoreEvents(eventsArray);
        } else {
          setLoreEvents([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  return {
    loreEvents,
    loading,
    error,
  };
};
