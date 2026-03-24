import { useAudioStore } from '../../stores/audioStore';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioBar() {
  const { isPlaying, isPaused, currentTitle, stop, togglePause } = useAudioStore();

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          className="fixed bottom-16 right-0 left-0 z-40 px-4 pb-2"
        >
          <div
            className="max-w-md mx-auto rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              boxShadow: '0 8px 32px rgba(30, 58, 52, 0.3)',
            }}
          >
            <Volume2 size={18} className="text-white opacity-80 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white arabic-text text-sm truncate">{currentTitle || 'جارٍ الاستماع...'}</p>
              {/* Waveform animation */}
              <div className="flex items-end gap-[2px] h-3 mt-1">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full"
                    style={{ background: 'var(--color-gold)' }}
                    animate={isPaused ? { height: 4 } : { height: [4, 12, 4, 8, 3, 10, 5, 4][i % 8] }}
                    transition={{ duration: 0.6 + i * 0.07, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePause}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                {isPaused ? <Play size={14} fill="white" /> : <Pause size={14} />}
              </button>
              <button
                onClick={stop}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <Square size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
