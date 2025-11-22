import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChatBox } from '@/components/ChatBox';
import { ActionButtons } from '@/components/ActionButtons';
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

            {/* Frog Info */}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {frogsArray.map((frog) => (
                    <div
                      key={frog.id}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="text-4xl mb-2">🐸</div>
                      <h3 className="font-bold capitalize mb-1">{frog.id}</h3>
                      <div className="text-sm space-y-1">
                        <p className="text-gray-400">
                          Mood: <span className="text-frog-green capitalize">{frog.mood}</span>
                        </p>
                        <p className="text-gray-400">
                          Action: <span className="text-frog-lime capitalize">{frog.action}</span>
                        </p>
                        {frog.thought && (
                          <p className="text-xs italic text-purple-300 mt-2">
                            💭 “{frog.thought}”
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
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
