'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useArthStore } from '@/lib/store';
import { BOOTHS, BOOTH_ORDER } from '@/lib/booths';

const ROOM_BLURB = {
  null: 'A warm Arth Party lobby. Six rooms. Six conversations women rarely get to have.',
  sojao: 'A dreamy lavender ritual room about sleep. Tap a glow to listen.',
  iron: 'A coral juice-bar that reframes fatigue. Tap a glow to learn.',
  brainfog: 'A playful mind-chaos room. Tap any sticky thought.',
  hotflash: 'A cool peach sanctuary for moms and daughters.',
  normalized: 'A wall of things women were told to live with. Tap any note.',
  hub: 'A community café where every booth lands. Pick a circle.',
};

export default function BottomInfoBar() {
  const started = useArthStore((s) => s.started);
  const activeBooth = useArthStore((s) => s.activeBooth);
  const setActiveBooth = useArthStore((s) => s.setActiveBooth);

  if (!started) return null;
  const booth = activeBooth ? BOOTHS[activeBooth] : null;
  const blurb = ROOM_BLURB[activeBooth || 'null'];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-5 pb-5 pointer-events-none">
      <div className="max-w-5xl mx-auto flex items-end justify-between gap-4">
        {/* Blurb */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBooth || 'lobby'}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.35 }}
            className="glass rounded-2xl px-5 py-3 shadow-soft pointer-events-auto max-w-md"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: booth ? booth.palette.accent : '#F08A5D' }}>
              {booth ? 'about this room' : 'about this lobby'}
            </p>
            <p className="text-sm text-arth-plum mt-1 leading-snug">{blurb}</p>
          </motion.div>
        </AnimatePresence>

        {/* Bottom room navigator */}
        <div className="glass rounded-2xl px-3 py-2 shadow-soft pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={() => setActiveBooth(null)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
              activeBooth === null
                ? 'bg-arth-plum text-arth-cream'
                : 'text-arth-plum hover:bg-arth-peach/40'
            }`}
            title="Lobby"
          >
            ★ Lobby
          </button>
          {BOOTH_ORDER.map((id) => {
            const b = BOOTHS[id];
            const active = activeBooth === id;
            return (
              <button
                key={id}
                onClick={() => setActiveBooth(id)}
                className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                  active ? 'text-arth-cream' : 'text-arth-plum hover:bg-arth-peach/40'
                }`}
                style={active ? { background: b.palette.accent } : undefined}
                title={b.title}
              >
                {b.title.replace(' Lounge', '').replace(' Booth', '').replace(' Bar', '').replace(' Chill Room', '')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
