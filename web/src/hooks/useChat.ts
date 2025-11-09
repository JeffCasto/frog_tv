import { useState, useEffect, useCallback } from 'react';
import { subscribeChat, sendChatMessage } from '@/lib/firebase';
import { ChatMessage } from '@/types';

/**
 * Hook to subscribe to chat messages and send new messages
 */
export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeChat((data) => {
        if (data) {
          // Convert Firebase object to array and sort by timestamp
          const messagesArray = Object.entries(data).map(([id, msg]: [string, any]) => ({
            id,
            ...msg,
          }));
          messagesArray.sort((a, b) => a.ts - b.ts);
          setMessages(messagesArray);
        } else {
          setMessages([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (user: string, text: string) => {
    try {
      await sendChatMessage(user, text);
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
};
