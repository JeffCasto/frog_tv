import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { ChatMessage } from '@/types';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  username: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage, username }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/50">
        <h2 className="text-lg font-bold text-frog-green flex items-center gap-2">
          <span className="text-2xl">💬</span>
          Live Chat
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Try typing “ribbit” to summon the Toadfather...
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col gap-1 ${
                msg.user === username ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  msg.user === username
                    ? 'bg-frog-green text-gray-900'
                    : 'bg-gray-800 text-white'
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm">{msg.user}</span>
                  <span className="text-xs opacity-60">{formatTime(msg.ts)}</span>
                </div>
                <div className="mt-1 break-words">{msg.text}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message... (ribbit?)"
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-frog-green focus:border-transparent text-white placeholder-gray-500"
            maxLength={200}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-frog-green text-gray-900 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-frog-lime transition-colors"
          >
            <Send size={18} />
            Send
          </motion.button>
        </div>
      </form>
    </div>
  );
};
