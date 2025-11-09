import { useState, useEffect } from 'react';
import { subscribeFrogs } from '@/lib/firebase';
import { Frog } from '@/types';

/**
 * Hook to subscribe to all frog states in real-time
 */
export const useFrogs = () => {
  const [frogs, setFrogs] = useState<Record<string, Frog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeFrogs((data) => {
        setFrogs(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  return {
    frogs,
    loading,
    error,
    frogsArray: frogs ? Object.values(frogs) : [],
  };
};
