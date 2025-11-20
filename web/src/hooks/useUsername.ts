import { useState, useEffect } from 'react';

/**
 * Hook to manage user's display name in localStorage
 */
export const useUsername = () => {
  const [username, setUsername] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Generate or retrieve username from localStorage
    const stored = localStorage.getItem('frogtv_username');
    if (stored) {
      setUsername(stored);
    } else {
      // Generate random username
      const adjectives = ['Wise', 'Happy', 'Sleepy', 'Hungry', 'Mystical', 'Cosmic', 'Ancient', 'Noble'];
      const nouns = ['Frog', 'Toad', 'Tadpole', 'Newt', 'Amphibian', 'Croaker', 'Hopper', 'Lily'];
      const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNum = Math.floor(Math.random() * 1000);
      const generated = `${randomAdj}${randomNoun}${randomNum}`;
      setUsername(generated);
      localStorage.setItem('frogtv_username', generated);
    }
    setIsReady(true);
  }, []);

  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('frogtv_username', newUsername);
  };

  return {
    username,
    updateUsername,
    isReady,
  };
};
