import React from 'react';
import { motion } from 'framer-motion';
import { useLore } from '@/hooks/useLore';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export default function Lore() {
  const { loreEvents, loading } = useLore();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📜</span>
              <div>
                <h1 className="text-2xl font-bold text-purple-400">FrogTV Lore</h1>
                <p className="text-xs text-gray-400">The chronicles of the couch-dwelling amphibians</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Stream
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">The Sacred Timeline</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every significant event in FrogTV history is recorded here. From the mundane to the
              mystical, from the philosophical to the absurd. This is the official chronicle of what
              happens when frogs watch TV and viewers watch frogs.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-frog-green to-purple-500 rounded-full" />

            {/* Events */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-2xl mb-4">🐸</div>
                <p className="text-gray-400">Loading the ancient texts...</p>
              </div>
            ) : loreEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-purple-700/50 p-8 ml-8 text-center"
              >
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-bold mb-2">The Timeline Awaits</h3>
                <p className="text-gray-400">
                  No lore events have been recorded yet. Be patient, young tadpole. History is being
                  written as we speak.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {loreEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative ml-8 pl-8"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 w-4 h-4 bg-frog-green rounded-full border-4 border-gray-900 shadow-lg shadow-frog-green/50 -translate-x-[calc(2rem+2px)]" />

                    {/* Event card */}
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-purple-700/50 p-6 hover:border-purple-500 transition-colors">
                      {/* Event header */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-purple-400">{event.event}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User size={14} />
                          <span className="capitalize">{event.frogName}</span>
                        </div>
                      </div>

                      {/* Event description */}
                      <p className="text-gray-300 mb-4 leading-relaxed">{event.description}</p>

                      {/* Event timestamp */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{formatDate(event.timestamp)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Mysterious footer message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center text-sm text-purple-400/50 italic"
          >
            "The frogs remember everything. Do you?"
          </motion.div>
        </div>
      </main>
    </div>
  );
}
