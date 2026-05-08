'use client';

import { motion } from 'framer-motion';
import { useArthStore } from '@/lib/store';
import { BOOTHS, BOOTH_ORDER } from '@/lib/booths';

const MAP_RANGE = 65; // total world span shown
const MAP_SIZE = 280;

function toMap(x, z) {
  const cx = MAP_SIZE / 2;
  const cz = MAP_SIZE / 2;
  return [cx + (x / MAP_RANGE) * MAP_SIZE, cz + (z / MAP_RANGE) * MAP_SIZE];
}

export default function Minimap() {
  const setActiveBooth = useArthStore((s) => s.setActiveBooth);
  const activeBooth = useArthStore((s) => s.activeBooth);
  const avatarPos = useArthStore((s) => s.avatarPos);
  const setMapOpen = useArthStore((s) => s.setMapOpen);
  const [ax, , az] = avatarPos;
  const [px, py] = toMap(ax, az);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-5 top-24 z-30 glass rounded-2xl shadow-soft p-4"
      style={{ width: MAP_SIZE + 24 }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="title-display text-arth-plum text-base">Party Map</p>
        <button
          onClick={() => setMapOpen(false)}
          className="text-xs text-arth-plum/60 hover:text-arth-plum"
        >
          ✕
        </button>
      </div>
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          width: MAP_SIZE,
          height: MAP_SIZE,
          background:
            'radial-gradient(circle at 50% 50%, #FBE2C2 0%, #F3DCC4 60%, #E9C9AB 100%)',
        }}
      >
        {/* plaza ring */}
        <div
          className="absolute rounded-full border-2 border-arth-coral/60"
          style={{
            left: MAP_SIZE / 2 - 40,
            top: MAP_SIZE / 2 - 40,
            width: 80,
            height: 80,
          }}
        />
        {/* booth markers */}
        {BOOTH_ORDER.map((id) => {
          const b = BOOTHS[id];
          const [bx, bz] = toMap(b.door.position[0], b.door.position[2]);
          return (
            <button
              key={id}
              onClick={() => {
                setActiveBooth(id);
                setMapOpen(false);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full text-[10px] font-semibold uppercase tracking-wider px-2 py-1 whitespace-nowrap transition ${
                activeBooth === id
                  ? 'bg-arth-plum text-arth-cream'
                  : 'bg-white/90 text-arth-plum hover:bg-arth-coral hover:text-white'
              }`}
              style={{
                left: bx,
                top: bz,
                boxShadow: '0 2px 6px rgba(91,58,85,0.25)',
                color: activeBooth === id ? undefined : b.palette.accent,
              }}
            >
              {b.title}
            </button>
          );
        })}
        {/* avatar dot */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-arth-coral ring-2 ring-white"
          style={{ left: px, top: py }}
        />
      </div>
      <p className="text-[10px] mt-2 text-arth-plum/70">
        Tap any booth to teleport. Walk through arches in the plaza for the full experience.
      </p>
    </motion.div>
  );
}
