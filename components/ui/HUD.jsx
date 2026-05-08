'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useArthStore } from '@/lib/store';
import { BOOTHS } from '@/lib/booths';
import Minimap from './Minimap';

export default function HUD() {
  const started = useArthStore((s) => s.started);
  const activeBooth = useArthStore((s) => s.activeBooth);
  const setActiveBooth = useArthStore((s) => s.setActiveBooth);
  const mapOpen = useArthStore((s) => s.mapOpen);
  const setMapOpen = useArthStore((s) => s.setMapOpen);
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl px-4 py-3 shadow-soft pointer-events-auto"
        >
          <p className="uppercase text-[10px] tracking-[0.32em] text-arth-coral font-semibold">
            {booth ? 'inside booth' : 'central plaza'}
          </p>
          <p className="title-display text-xl text-arth-plum leading-tight">
            {booth ? booth.title : 'Arth Party'}
          </p>
          {booth && <p className="text-xs italic text-arth-plum/75 mt-0.5">{booth.tagline}</p>}
        </motion.div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setMapOpen(!mapOpen)}
            className="glass rounded-xl px-3 py-2 text-xs font-semibold text-arth-plum hover:bg-white/95 transition shadow-soft"
          >
            {mapOpen ? 'Close map' : 'Map'}
          </button>
          <button
            onClick={() => setMuted(!muted)}
            className="glass rounded-xl px-3 py-2 text-xs font-semibold text-arth-plum hover:bg-white/95 transition shadow-soft"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          {joinedCircles.length > 0 && (
            <div className="glass-dark rounded-xl px-3 py-2 text-xs font-semibold shadow-soft">
              {joinedCircles.length} circle{joinedCircles.length > 1 ? 's' : ''} joined
            </div>
          )}
        </div>
      </div>

      {/* Booth exit + intro card */}
      <AnimatePresence>
        {booth && (
          <motion.div
            key={booth.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-auto"
          >
            <button
              onClick={() => setActiveBooth(null)}
              className="glass rounded-full px-5 py-3 text-sm font-semibold text-arth-plum hover:bg-white shadow-soft transition"
            >
              ← Back to plaza
            </button>
            {booth.circle && (
              <div className="glass-dark rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                Next: {booth.circle === 'Find Your Circle' ? booth.circle : `Join the ${booth.circle}`}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls hint */}
      <ControlsHint />

      {/* Minimap */}
      <AnimatePresence>{mapOpen && <Minimap />}</AnimatePresence>
    </>
  );
}

function ControlsHint() {
  const activeBooth = useArthStore((s) => s.activeBooth);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute bottom-6 left-6 z-20 glass rounded-2xl px-4 py-3 shadow-soft text-arth-plum text-xs space-y-1 max-w-[220px]"
    >
      <p className="uppercase tracking-[0.3em] text-[9px] text-arth-coral font-bold">Controls</p>
      <p>
        <Key>W</Key>
        <Key>A</Key>
        <Key>S</Key>
        <Key>D</Key>
        <span className="ml-1">walk</span>
      </p>
      <p>
        <Key>drag</Key>
        <span className="ml-1">look around</span>
      </p>
      <p>
        <Key>scroll</Key>
        <span className="ml-1">zoom</span>
      </p>
      <p>
        <Key>click</Key>
        <span className="ml-1">arch / hotspot</span>
      </p>
      {!activeBooth && (
        <p className="text-arth-plum/70 italic mt-1">walk through any glowing arch to enter</p>
      )}
    </motion.div>
  );
}

function Key({ children }) {
  return (
    <span className="inline-block mx-0.5 px-1.5 py-0.5 rounded bg-arth-cream border border-arth-plum/20 text-[10px] font-semibold uppercase tracking-wide">
      {children}
    </span>
  );
}
