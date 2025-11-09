import { useState, useEffect } from 'react';
import { subscribeTriggers } from '@/lib/firebase';
import { Triggers, DEFAULT_TRIGGERS } from '@/types';

/**
 * Hook to subscribe to trigger states in real-time
 */
export const useTriggers = () => {
  const [triggers, setTriggers] = useState<Triggers>(DEFAULT_TRIGGERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeTriggers((data) => {
        setTriggers(data || DEFAULT_TRIGGERS);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  return {
    triggers,
    loading,
    error,
    ribbitCount: triggers.ribbitCount,
    toadfatherSummoned: triggers.toadfatherSummoned,
    frogsWalkedOff: triggers.frogsWalkedOff,
  };
};
