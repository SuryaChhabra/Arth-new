'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useArthStore } from '@/lib/store';
import { DECODER_OPTIONS, BOOTHS } from '@/lib/booths';

export default function BodyDecoder() {
  const open = useArthStore((s) => s.decoderOpen);
  const setOpen = useArthStore((s) => s.setDecoderOpen);
  const setRecommendation = useArthStore((s) => s.setRecommendation);
  const setActiveBooth = useArthStore((s) => s.setActiveBooth);
  const recommendation = useArthStore((s) => s.recommendation);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="decoder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(26,15,28,0.55)', backdropFilter: 'blur(3px)' }} />
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full glass rounded-3xl p-7 md:p-9 shadow-soft"
            style={{ borderTop: '4px solid #F08A5D' }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="uppercase text-[10px] tracking-[0.32em] text-arth-coral font-semibold">
                  Body Decoder
                </p>
                <h3 className="title-display text-3xl text-arth-plum mt-1">
                  What feels off today?
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-arth-plum/60 hover:text-arth-plum text-xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DECODER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setRecommendation(opt.booth);
                  }}
                  className={`text-left p-4 rounded-2xl border transition ${
                    recommendation === opt.booth
                      ? 'bg-arth-coral text-white border-arth-coral'
                      : 'bg-white/80 text-arth-plum border-arth-plum/10 hover:bg-arth-peach/40'
                  }`}
                >
                  <p className="font-semibold text-base">{opt.label}</p>
                  <p className="text-[11px] opacity-80 mt-1">{opt.line}</p>
                </button>
              ))}
            </div>

            {recommendation && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 rounded-2xl bg-arth-cream/80 border border-arth-plum/10"
              >
                <p className="text-xs uppercase tracking-widest text-arth-coral font-bold">Suggested booth</p>
                <p className="title-display text-xl text-arth-plum mt-1">
                  {BOOTHS[recommendation].title}
                </p>
                <p className="text-sm text-arth-plum/75 italic mt-1">{BOOTHS[recommendation].tagline}</p>
                <button
                  onClick={() => {
                    setOpen(false);
                    setActiveBooth(recommendation);
                  }}
                  className="mt-3 px-4 py-2 rounded-full bg-arth-coral text-white text-sm font-semibold hover:bg-arth-orange transition"
                >
                  Take me there →
                </button>
              </motion.div>
            )}

            <p className="mt-5 text-[11px] text-arth-plum/60 italic">
              The Body Decoder is a soft starter, not a diagnosis. Every booth has women who get it.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
