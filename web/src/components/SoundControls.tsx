import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export const SoundControls: React.FC = () => {
  const { isMuted, volume, setMuted, setVolume, play } = useSoundEffects();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setMuted(!isMuted);
    if (isMuted) {
      // Play a test sound when unmuting
      play('ribbit');
    }
  };

  const VolumeIcon = isMuted ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-4 shadow-xl">
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className={`p-2 rounded-lg transition-colors ${
            isMuted
              ? 'bg-red-500/20 text-red-400'
              : 'bg-frog-green/20 text-frog-green'
          }`}
          title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          <VolumeIcon size={20} />
        </motion.button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            disabled={isMuted}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
              isMuted ? 'bg-gray-700' : 'bg-gray-700'
            }`}
            style={{
              background: isMuted
                ? '#374151'
                : `linear-gradient(to right, #90EE90 0%, #90EE90 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`,
            }}
          />
        </div>

        <span className="text-xs text-gray-400 w-10 text-right">
          {isMuted ? 'OFF' : `${Math.round(volume * 100)}%`}
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        🔊 Frog sounds & ambient audio
      </p>
    </div>
  );
};
