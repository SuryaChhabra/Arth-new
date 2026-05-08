'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useArthStore } from '@/lib/store';
import { BOOTHS } from '@/lib/booths';

export default function HotspotModal() {
  const openHotspot = useArthStore((s) => s.openHotspot);
  const setOpenHotspot = useArthStore((s) => s.setOpenHotspot);
  const setActiveBooth = useArthStore((s) => s.setActiveBooth);

  const data =
    openHotspot && BOOTHS[openHotspot.boothId]
      ? BOOTHS[openHotspot.boothId].hotspots.find((h) => h.id === openHotspot.hotspotId)
      : null;
  const booth = openHotspot ? BOOTHS[openHotspot.boothId] : null;

  return (
    <AnimatePresence>
      {data && booth && (
        <motion.div
          key="hs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-end md:items-center justify-center p-4 md:p-8"
          onClick={() => setOpenHotspot(null)}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(26,15,28,0.45)', backdropFilter: 'blur(2px)' }}
          />
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', damping: 22, stiffness: 230 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full glass rounded-3xl p-6 md:p-8 shadow-soft"
            style={{ borderTop: `4px solid ${booth.palette.accent}` }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p
                  className="uppercase text-[10px] tracking-[0.32em] font-semibold"
                  style={{ color: booth.palette.accent }}
                >
                  {booth.title} · {data.tag || 'Insight'}
                </p>
                <h3 className="title-display text-2xl md:text-3xl text-arth-plum mt-1 leading-tight">
                  {data.title}
                </h3>
              </div>
              <button
                onClick={() => setOpenHotspot(null)}
                className="text-arth-plum/60 hover:text-arth-plum text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-arth-plum/85 leading-relaxed text-base">{data.body}</p>

            {data.ritual && (
              <div className="mt-5 rounded-2xl p-4" style={{ background: booth.palette.glow + '40' }}>
                <p className="uppercase text-[10px] tracking-[0.3em] font-bold text-arth-plum/70">
                  Tiny ritual
                </p>
                <p className="text-arth-plum mt-1 italic">{data.ritual}</p>
              </div>
            )}

            {data.link && (
              <button
                onClick={() => {
                  setOpenHotspot(null);
                  setActiveBooth(data.link);
                }}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-soft hover:opacity-90 transition"
                style={{ background: booth.palette.accent }}
              >
                Walk into the {BOOTHS[data.link].title} →
              </button>
            )}

            {!data.link && booth.circle && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs text-arth-plum/65">Gentle next step:</span>
                <button
                  onClick={() => setOpenHotspot(null)}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: booth.palette.accent }}
                >
                  Join the {booth.circle}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
