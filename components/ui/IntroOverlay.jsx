'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useArthStore } from '@/lib/store';

export default function IntroOverlay() {
  const started = useArthStore((s) => s.started);
  const setStarted = useArthStore((s) => s.setStarted);
  return (
    <AnimatePresence>
      {!started && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            background:
              'radial-gradient(70% 70% at 50% 40%, rgba(243,166,176,0.45) 0%, rgba(91,58,85,0.85) 60%, rgba(26,15,28,0.98) 100%)',
          }}
        >
          <div className="max-w-xl mx-6 text-center text-arth-cream">
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="uppercase tracking-[0.4em] text-xs text-arth-peach"
            >
              Arth · Emcure presents
            </motion.p>
            <motion.h1
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="title-display text-6xl md:text-7xl mt-4 leading-none"
            >
              Arth Party
            </motion.h1>
            <motion.p
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="title-display italic text-lg md:text-xl mt-3 text-arth-peach"
            >
              Women’s health, but make it a vibe.
            </motion.p>
            <motion.p
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-sm md:text-base mt-6 text-arth-cream/85 leading-relaxed"
            >
              Step into a walkable world of booths, real women’s voices, and gentle next steps.
              Move with <kbd className="kbd">W A S D</kbd>, drag the mouse to look around,
              and walk through any glowing arch to enter a booth.
            </motion.p>

            <motion.button
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => setStarted(true)}
              className="mt-10 inline-flex items-center gap-3 px-8 py-3 bg-arth-coral text-white rounded-full font-semibold tracking-wide shadow-soft hover:bg-arth-orange transition"
            >
              Enter the party →
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-xs text-arth-cream/55"
            >
              best on desktop · headphones welcome · this is a pitch demo
            </motion.p>
          </div>

          <style jsx>{`
            .kbd {
              display: inline-block;
              border: 1px solid rgba(255, 255, 255, 0.4);
              border-bottom-width: 2px;
              padding: 1px 6px;
              border-radius: 6px;
              font-size: 0.75rem;
              letter-spacing: 0.1em;
              margin: 0 2px;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
