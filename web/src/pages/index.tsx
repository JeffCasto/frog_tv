import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChatBox } from '@/components/ChatBox';
import { ActionButtons } from '@/components/ActionButtons';
import { SoundControls } from '@/components/SoundControls';
import { Frog } from '@/components/Frog';
import { useFrogs } from '@/hooks/useFrogs';
import { useChat } from '@/hooks/useChat';
import { useTriggers } from '@/hooks/useTriggers';
import { useUsername } from '@/hooks/useUsername';
import { cloudFunctions } from '@/lib/firebase';

// Use YouTube live embed via iframe instead of Mux player

export default function Home() {
  const { frogsArray, loading: frogsLoading } = useFrogs();
  const { messages, sendMessage } = useChat();
  const { ribbitCount } = useTriggers();
  const { username, isReady } = useUsername();

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (isReady && username) {
        await sendMessage(username, text);
      }
    },
    [username, isReady, sendMessage]
  );

  const handleThrowFly = async () => {
    try {
      await cloudFunctions.throwFly();
    } catch (error) {
      console.error('Error throwing fly:', error);
    }
  };

  const handleTriggerCroak = async () => {
    try {
      await cloudFunctions.triggerCroak();
    } catch (error) {
      console.error('Error triggering croak:', error);
    }
  };

  const youtubeVideoId = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🐸</span>
              <div>
                <h1 className="text-2xl font-bold text-frog-green">FrogTV Live</h1>
                <p className="text-xs text-gray-400">Frogs watching TV. You watching them.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-400">Signed in as:</span>{' '}
                <span className="text-frog-green font-semibold">{username}</span>
              </div>
              <Link
                href="/lore"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
              >
                📜 Lore
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden shadow-2xl"
            >
              <div className="aspect-video bg-black relative">
                {youtubeVideoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}/live`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <p className="text-xl mb-2">📺 Stream Offline</p>
                      <p className="text-sm">Configure NEXT_PUBLIC_YOUTUBE_VIDEO_ID in .env.local</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-700">
                <h2 className="text-lg font-bold mb-2">🎬 Currently Watching</h2>
                <p className="text-sm text-gray-400">
                  Three frogs on a couch, watching the tiny TV, reacting to your chat messages
                </p>
                <div className="flex gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-gray-400">LIVE</span>
                  </div>
                  <div className="text-gray-400">
                    👁️ {messages.length > 0 ? Math.floor(messages.length / 3) : 0} viewers
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Living Room with Frogs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6 shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4 text-frog-green">Meet the Frogs</h2>
              {frogsLoading ? (
                <p className="text-gray-400">Loading frogs...</p>
              ) : frogsArray.length > 0 ? (
                <div className="relative w-full h-[300px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                  {/* Living Room Background */}
                  <div className="absolute inset-0">
                    {/* Floor */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-900/30 to-transparent" />

                    {/* Lamp */}
                    <div className="absolute top-4 right-8">
                      <div className="w-8 h-12 bg-yellow-200/20 rounded-t-full blur-sm" />
                      <div className="w-1 h-16 bg-gray-600 mx-auto" />
                    </div>
                  </div>

                  {/* Couch */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[500px] h-[140px]">
                    <svg viewBox="0 0 500 140" className="w-full h-full">
                      {/* Couch body */}
                      <rect x="25" y="45" width="450" height="75" fill="#8B4513" rx="10" />

                      {/* Couch cushions */}
                      <rect x="35" y="40" width="135" height="60" fill="#A0522D" rx="8" />
                      <rect x="182" y="40" width="135" height="60" fill="#A0522D" rx="8" />
                      <rect x="330" y="40" width="135" height="60" fill="#A0522D" rx="8" />

                      {/* Couch backrest */}
                      <rect x="25" y="20" width="450" height="30" fill="#8B4513" rx="5" />

                      {/* Couch arms */}
                      <rect x="10" y="30" width="30" height="75" fill="#8B4513" rx="8" />
                      <rect x="460" y="30" width="30" height="75" fill="#8B4513" rx="8" />

                      {/* Couch legs */}
                      <rect x="45" y="120" width="15" height="18" fill="#654321" rx="3" />
                      <rect x="140" y="120" width="15" height="18" fill="#654321" rx="3" />
                      <rect x="345" y="120" width="15" height="18" fill="#654321" rx="3" />
                      <rect x="440" y="120" width="15" height="18" fill="#654321" rx="3" />
                    </svg>
                  </div>

                  {/* Frogs on the couch */}
                  <AnimatePresence>
                    {frogsArray.map((frog, index) => {
                      // Position frogs on each cushion
                      const xPositions = [100, 250, 400]; // Left, center, right cushions
                      const frogX = xPositions[index] || 250;
                      const frogY = 100; // Sitting on cushions

                      return (
                        <Frog
                          key={frog.id}
                          frog={{
                            ...frog,
                            targetX: frogX,
                            targetY: frogY
                          }}
                        />
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <p className="text-gray-400">No frogs found. Initialize Firebase database!</p>
              )}
            </motion.div>
          </div>

          {/* Right Column - Chat & Actions */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ActionButtons
                onThrowFly={handleThrowFly}
                onTriggerCroak={handleTriggerCroak}
                ribbitCount={ribbitCount}
              />
            </motion.div>

            {/* Sound Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <SoundControls />
            </motion.div>

            {/* Chat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="h-[600px]"
            >
              <ChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                username={username}
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              🐸 FrogTV Live - A surreal interactive experience
            </p>
            <p>
              Built with Next.js, Firebase, Framer Motion, and an unhealthy obsession with amphibians
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
