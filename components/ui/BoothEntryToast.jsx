'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArthStore } from '@/lib/store';
import { BOOTHS } from '@/lib/booths';

// Booth intro card that shows briefly when entering a booth.
export default function BoothEntryToast() {
  const activeBooth = useArthStore((s) => s.activeBooth);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!activeBooth) {
      setShow(false);
      return;
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 4200);
    return () => clearTimeout(t);
  }, [activeBooth]);

  const booth = activeBooth ? BOOTHS[activeBooth] : null;

  return (
    <AnimatePresence>
      {show && booth && (
        <motion.div
          key={booth.id}
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ type: 'spring', damping: 18 }}
          className="absolute z-30 left-1/2 top-24 -translate-x-1/2 glass rounded-2xl shadow-soft px-6 py-4 max-w-sm text-center"
          style={{ borderBottom: `4px solid ${booth.palette.accent}` }}
        >
          <p
            className="uppercase text-[10px] tracking-[0.4em] font-semibold"
            style={{ color: booth.palette.accent }}
          >
            you’ve entered
          </p>
          <p className="title-display text-2xl text-arth-plum mt-1 leading-tight">
            {booth.title}
          </p>
          <p className="text-sm italic text-arth-plum/75 mt-1">{booth.tagline}</p>
          <p className="text-[11px] text-arth-plum/60 mt-2">
            click any glowing ring to listen in.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
