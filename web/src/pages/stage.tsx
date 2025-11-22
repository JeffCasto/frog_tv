import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Frog } from '@/components/Frog';
import { useFrogs } from '@/hooks/useFrogs';

/**
 * OBS Browser Source Page
 *
 * This page is designed to be used as a browser source in OBS Studio.
 * It has a transparent background and displays only the frogs with their animations.
 *
 * OBS Configuration:
 * - URL: http://localhost:3000/stage (or your deployed URL)
 * - Width: 1920
 * - Height: 1080
 * - FPS: 30
 * - Custom CSS: body { background-color: rgba(0,0,0,0); margin: 0px auto; overflow: hidden; }
 */
export default function Stage() {
  const { frogsArray } = useFrogs();

  useEffect(() => {
    // Add transparent class to body for OBS
    document.body.classList.add('transparent');

    return () => {
      document.body.classList.remove('transparent');
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent">
      {/* Couch positioned at bottom third of screen */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[900px] h-[280px]">
        <svg viewBox="0 0 900 280" className="w-full h-full">
          {/* Couch body */}
          <rect x="50" y="90" width="800" height="150" fill="#8B4513" rx="20" />

          {/* Couch cushions */}
          <rect x="70" y="80" width="240" height="120" fill="#A0522D" rx="15" />
          <rect x="330" y="80" width="240" height="120" fill="#A0522D" rx="15" />
          <rect x="590" y="80" width="240" height="120" fill="#A0522D" rx="15" />

          {/* Couch backrest */}
          <rect x="50" y="40" width="800" height="60" fill="#8B4513" rx="10" />

          {/* Couch arms */}
          <rect x="20" y="60" width="60" height="150" fill="#8B4513" rx="15" />
          <rect x="820" y="60" width="60" height="150" fill="#8B4513" rx="15" />

          {/* Couch legs */}
          <rect x="80" y="240" width="30" height="35" fill="#654321" rx="5" />
          <rect x="250" y="240" width="30" height="35" fill="#654321" rx="5" />
          <rect x="620" y="240" width="30" height="35" fill="#654321" rx="5" />
          <rect x="790" y="240" width="30" height="35" fill="#654321" rx="5" />
        </svg>
      </div>

      {/* Frogs - positioned to sit ON the couch cushions */}
      <AnimatePresence>
        {frogsArray.map((frog, index) => {
          // Override frog positions to sit properly on couch
          // Couch is centered, so calculate positions relative to center
          const couchCenterX = typeof window !== 'undefined' ? window.innerWidth / 2 : 960;
          const couchY = typeof window !== 'undefined' ? window.innerHeight - 240 : 840;
          
          // Position frogs on each cushion (left, center, right)
          const frogX = couchCenterX + (index === 0 ? -280 : index === 1 ? 0 : 280);
          const frogY = couchY - 80; // Sit on cushions, not floor
          
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

      {/* Stage info overlay (only visible in dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono">
          <div className="font-bold mb-2">OBS Stage View</div>
          <div>Frogs loaded: {frogsArray.length}</div>
          <div className="mt-2 opacity-50">
            Add this URL to OBS as a Browser Source
          </div>
        </div>
      )}
    </div>
  );
}
