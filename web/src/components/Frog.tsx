import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Frog as FrogType, MOOD_STYLES } from '@/types';
import { useSoundEffects, getSoundForAction } from '@/hooks/useSoundEffects';

interface FrogProps {
  frog: FrogType;
}

export const Frog: React.FC<FrogProps> = ({ frog }) => {
  const moodStyle = MOOD_STYLES[frog.mood];
  const { play } = useSoundEffects();
  const prevActionRef = useRef<string>(frog.action);

  // Play sound when action changes
  useEffect(() => {
    if (frog.action !== prevActionRef.current) {
      const sound = getSoundForAction(frog.action);
      if (sound) {
        play(sound);
      }
      prevActionRef.current = frog.action;
    }
  }, [frog.action, play]);

  // Animation variants based on action
  const actionVariants = {
    idle: {
      y: [0, -10, 0],
      scale: 1,
      rotate: 0,
      transition: {
        y: {
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        },
      },
    },
    croak: {
      scale: [1, 1.2, 1.2, 1],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    throw: {
      rotate: [0, -30, 20, 0],
      x: [0, -20, 10, 0],
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    catch: {
      y: [0, -30, 0],
      scale: [1, 1.3, 1],
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
    summonToadfather: {
      scale: [1, 1.5, 2],
      rotate: [0, 180, 360],
      opacity: [1, 0.5, 0],
      transition: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
    walkOff: {
      x: [0, -200],
      opacity: [1, 0],
      transition: {
        duration: 3,
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.div
      className="absolute"
      style={{
        left: frog.targetX,
        top: frog.targetY,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Frog Container */}
      <motion.div
        className="relative"
        variants={actionVariants}
        animate={frog.action}
      >
        {/* Glow effect based on mood */}
        <div
          className="absolute inset-0 blur-xl opacity-50 -z-10"
          style={{
            background: `radial-gradient(circle, ${moodStyle.glow} 0%, transparent 70%)`,
            width: '150%',
            height: '150%',
            left: '-25%',
            top: '-25%',
          }}
        />

        {/* Frog SVG */}
        <motion.svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          style={{ filter: moodStyle.filter }}
          className="drop-shadow-lg"
        >
          {/* Frog body */}
          <ellipse cx="50" cy="60" rx="35" ry="30" fill="#32CD32" />

          {/* Frog head */}
          <ellipse cx="50" cy="40" rx="40" ry="35" fill="#32CD32" />

          {/* Eyes */}
          <g>
            {/* Left eye */}
            <ellipse cx="35" cy="30" rx="12" ry="15" fill="#90EE90" />
            <ellipse cx="35" cy="30" rx="8" ry="10" fill="#000" />
            <ellipse cx="33" cy="27" rx="3" ry="4" fill="#FFF" />

            {/* Right eye */}
            <ellipse cx="65" cy="30" rx="12" ry="15" fill="#90EE90" />
            <ellipse cx="65" cy="30" rx="8" ry="10" fill="#000" />
            <ellipse cx="63" cy="27" rx="3" ry="4" fill="#FFF" />
          </g>

          {/* Mouth */}
          <path
            d="M 35 50 Q 50 55 65 50"
            stroke="#2F4F2F"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Nostrils */}
          <circle cx="42" cy="45" r="2" fill="#2F4F2F" />
          <circle cx="58" cy="45" r="2" fill="#2F4F2F" />

          {/* Front legs */}
          <ellipse cx="30" cy="80" rx="8" ry="12" fill="#32CD32" />
          <ellipse cx="70" cy="80" rx="8" ry="12" fill="#32CD32" />

          {/* Back legs (partially hidden) */}
          <ellipse cx="20" cy="70" rx="10" ry="8" fill="#2F4F2F" opacity="0.6" />
          <ellipse cx="80" cy="70" rx="10" ry="8" fill="#2F4F2F" opacity="0.6" />
        </motion.svg>

        {/* Thought bubble */}
        {frog.thought && (
          <motion.div
            className="absolute left-full ml-4 top-0 bg-white text-black px-3 py-2 rounded-lg shadow-lg thought-bubble"
            style={{ minWidth: '120px', maxWidth: '200px' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="text-sm font-medium">{frog.thought}</div>

            {/* Bubble tail */}
            <div className="absolute -left-2 top-4 w-0 h-0">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <div className="absolute -left-4 top-6 w-0 h-0">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </motion.div>
        )}

        {/* Mood indicator text (for debugging/display) */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wide opacity-70"
             style={{ color: moodStyle.color }}>
          {frog.mood}
        </div>
      </motion.div>
    </motion.div>
  );
};
