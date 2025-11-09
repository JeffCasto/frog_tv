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
      {/* Couch background (optional - can be removed if you have a separate scene for the couch) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px]">
        <svg viewBox="0 0 900 300" className="w-full h-full">
          {/* Couch body */}
          <rect x="50" y="100" width="800" height="150" fill="#8B4513" rx="20" />

          {/* Couch cushions */}
          <rect x="70" y="90" width="240" height="120" fill="#A0522D" rx="15" />
          <rect x="330" y="90" width="240" height="120" fill="#A0522D" rx="15" />
          <rect x="590" y="90" width="240" height="120" fill="#A0522D" rx="15" />

          {/* Couch backrest */}
          <rect x="50" y="50" width="800" height="60" fill="#8B4513" rx="10" />

          {/* Couch arms */}
          <rect x="20" y="70" width="60" height="150" fill="#8B4513" rx="15" />
          <rect x="820" y="70" width="60" height="150" fill="#8B4513" rx="15" />

          {/* Couch legs */}
          <rect x="80" y="250" width="30" height="40" fill="#654321" rx="5" />
          <rect x="250" y="250" width="30" height="40" fill="#654321" rx="5" />
          <rect x="620" y="250" width="30" height="40" fill="#654321" rx="5" />
          <rect x="790" y="250" width="30" height="40" fill="#654321" rx="5" />
        </svg>
      </div>

      {/* Frogs */}
      <AnimatePresence>
        {frogsArray.map((frog) => (
          <Frog key={frog.id} frog={frog} />
        ))}
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
