import React from 'react';
import { motion } from 'framer-motion';
import { Bug, Volume2 } from 'lucide-react';

interface ActionButtonsProps {
  onThrowFly: () => void;
  onTriggerCroak: () => void;
  ribbitCount: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onThrowFly,
  onTriggerCroak,
  ribbitCount,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Ribbit Counter */}
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-frog-green">Ribbit Counter</h3>
          <span className="text-sm text-gray-400">30 to summon</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r from-frog-green to-frog-lime ${
                ribbitCount >= 30 ? 'ribbit-glow' : ''
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((ribbitCount / 30) * 100, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-2 text-center text-2xl font-bold text-frog-green">
            {ribbitCount} / 30
          </div>
          {ribbitCount >= 30 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 text-center text-yellow-400 font-bold text-sm"
            >
              🐸 TOADFATHER INCOMING! 🐸
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-4 shadow-xl">
        <h3 className="text-lg font-bold text-frog-green mb-3">Interact</h3>
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onThrowFly}
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-frog-green to-frog-lime text-gray-900 rounded-lg font-semibold shadow-lg hover:shadow-frog-green/50 transition-shadow"
          >
            <Bug size={24} />
            <div className="flex-1 text-left">
              <div className="font-bold">Throw Fly</div>
              <div className="text-xs opacity-80">Feed the frogs!</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTriggerCroak}
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-shadow"
          >
            <Volume2 size={24} />
            <div className="flex-1 text-left">
              <div className="font-bold">Trigger Croak</div>
              <div className="text-xs opacity-80">Make them ribbit!</div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-4 shadow-xl">
        <h3 className="text-sm font-bold text-gray-400 mb-2">💡 Pro Tips</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Type “ribbit” in chat to summon the Toadfather</li>
          <li>• Say philosophy words for deep thoughts</li>
          <li>• Mention food to make frogs hungry</li>
          <li>• Watch at 3:33 AM for mysteries...</li>
        </ul>
      </div>
    </div>
  );
};
