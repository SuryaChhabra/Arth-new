'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useArthStore } from '@/lib/store';
import { BOOTHS } from '@/lib/booths';

export default function HUD() {
  const started = useArthStore((s) => s.started);
  const activeBooth = useArthStore((s) => s.activeBooth);
  const setActiveBooth = useArthStore((s) => s.setActiveBooth);
  const muted = useArthStore((s) => s.muted);
  const setMuted = useArthStore((s) => s.setMuted);
  const joinedCircles = useArthStore((s) => s.joinedCircles);

  if (!started) return null;
  const booth = activeBooth ? BOOTHS[activeBooth] : null;

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-5 flex items-start justify-between pointer-events-none">
        <motion.div
          key={activeBooth || 'lobby'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl px-4 py-3 shadow-soft pointer-events-auto"
          style={{ borderLeft: `4px solid ${booth ? booth.palette.accent : '#F08A5D'}` }}
        >
          <p
            className="uppercase text-[10px] tracking-[0.32em] font-semibold"
            style={{ color: booth ? booth.palette.accent : '#F08A5D' }}
          >
            {booth ? 'inside room' : 'central lobby'}
          </p>
          <p className="title-display text-xl text-arth-plum leading-tight">
            {booth ? booth.title : 'Arth Party'}
          </p>
          {booth && <p className="text-xs italic text-arth-plum/75 mt-0.5">{booth.tagline}</p>}
          {!booth && (
            <p className="text-xs italic text-arth-plum/75 mt-0.5">
              Women’s health, but make it a vibe.
            </p>
          )}
        </motion.div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {booth && (
            <button
              onClick={() => setActiveBooth(null)}
              className="glass rounded-full px-4 py-2 text-xs font-semibold text-arth-plum hover:bg-white/95 transition shadow-soft inline-flex items-center gap-2"
            >
              <span>←</span> Back to plaza
            </button>
          )}
          <button
            onClick={() => setMuted(!muted)}
            className="glass rounded-xl px-3 py-2 text-sm shadow-soft hover:bg-white/95 transition"
            title={muted ? 'Sound off' : 'Sound on'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          {joinedCircles.length > 0 && (
            <div
              className="rounded-xl px-3 py-2 text-xs font-semibold shadow-soft"
              style={{ background: '#F08A5D', color: '#FBF4EC' }}
            >
              ✓ {joinedCircles.length} circle{joinedCircles.length > 1 ? 's' : ''} joined
            </div>
          )}
        </div>
      </div>

      {/* Subtle drag-to-look hint when in lobby */}
      <AnimatePresence>
        {!booth && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 text-arth-cream/85 text-xs tracking-wider uppercase pointer-events-none"
          >
            tap any portal to enter · drag to look around
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
