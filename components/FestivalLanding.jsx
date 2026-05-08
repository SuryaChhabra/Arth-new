'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FESTIVAL_BOOTHS, FESTIVAL_HERO } from '@/lib/festivalBooths';

/* =====================================================================
 * FESTIVAL LANDING — 2D illustrated nighttime women's wellness festival
 *
 * The hero illustration sits at /public/festival-hero.png (or .svg as a
 * fallback placeholder). Clickable hotspots are positioned over the
 * illustration as percentages of its 3:2 aspect frame, so they scale
 * cleanly across breakpoints.
 * ===================================================================== */

export default function FestivalLanding() {
  const [activeBooth, setActiveBooth] = useState(null);
  const cardsRef = useRef(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (activeBooth) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeBooth]);

  const open = (booth) => setActiveBooth(booth);
  const close = () => setActiveBooth(null);

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="relative min-h-screen bg-arth-ink text-arth-cream overflow-x-hidden">
      <Hero onExplore={scrollToCards} onOpen={open} />
      <BoothCardsSection onOpen={open} cardsRef={cardsRef} />
      <FindYourCircleSection onOpen={open} />
      <Footer />

      <AnimatePresence>
        {activeBooth && <BoothModal booth={activeBooth} onClose={close} />}
      </AnimatePresence>
    </main>
  );
}

/* =========================== HERO =========================== */

function Hero({ onExplore, onOpen }) {
  return (
    <section className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden bg-arth-ink">
      {/* deep ambient bg behind the illustration */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 50% 70%, #5B3A55 0%, #2A1828 55%, #0F0814 100%)',
        }}
      />

      {/* Illustrated festival frame — preserves aspect ratio of the artwork */}
      <div className="relative w-full mx-auto" style={{ maxWidth: '1700px' }}>
        <div className="relative w-full" style={{ aspectRatio: '3 / 2' }}>
          {/* The illustration */}
          <img
            src="/festival-hero.png"
            alt="Arth Party — illustrated nighttime women's wellness festival"
            className="absolute inset-0 w-full h-full object-cover rounded-none md:rounded-3xl shadow-2xl"
            onError={(e) => {
              // Fall back to the SVG placeholder if the PNG isn't there yet
              if (!e.currentTarget.dataset.fallback) {
                e.currentTarget.dataset.fallback = '1';
                e.currentTarget.src = '/festival-hero.svg';
              }
            }}
          />

          {/* gentle vignette so the overlay text reads cleanly */}
          <div
            className="absolute inset-0 rounded-none md:rounded-3xl pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(15,8,20,0.45) 0%, rgba(15,8,20,0) 22%, rgba(15,8,20,0) 70%, rgba(15,8,20,0.55) 100%)',
            }}
          />

          {/* Header overlay */}
          <header className="absolute top-0 left-0 right-0 p-5 md:p-8 flex items-start justify-between gap-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-md"
            >
              <p className="uppercase text-[10px] md:text-[11px] tracking-[0.4em] text-arth-peach">
                {FESTIVAL_HERO.brand}
              </p>
              <h1 className="title-display mt-1 text-3xl md:text-5xl lg:text-6xl text-arth-cream leading-none drop-shadow-lg">
                {FESTIVAL_HERO.title}
              </h1>
              <p className="title-display italic mt-2 text-sm md:text-base text-arth-peach drop-shadow">
                {FESTIVAL_HERO.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="hidden md:flex items-center gap-3 pt-1"
            >
              <button
                onClick={onExplore}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-arth-plum bg-arth-cream/95 hover:bg-arth-cream shadow-soft transition"
              >
                {FESTIVAL_HERO.ctaPrimary}
              </button>
              <button
                onClick={() => onOpen(FESTIVAL_BOOTHS[3])}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-arth-cream border border-arth-cream/35 bg-arth-plum/40 hover:bg-arth-plum/60 backdrop-blur transition"
              >
                {FESTIVAL_HERO.ctaSecondary}
              </button>
            </motion.div>
          </header>

          {/* Mobile CTA bar */}
          <div className="md:hidden absolute left-0 right-0 bottom-4 px-4 flex gap-2 z-10">
            <button
              onClick={onExplore}
              className="flex-1 rounded-full px-4 py-2.5 text-xs font-semibold text-arth-plum bg-arth-cream/95 shadow-soft"
            >
              {FESTIVAL_HERO.ctaPrimary}
            </button>
            <button
              onClick={() => onOpen(FESTIVAL_BOOTHS[3])}
              className="flex-1 rounded-full px-4 py-2.5 text-xs font-semibold text-arth-cream border border-arth-cream/35 bg-arth-plum/50 backdrop-blur"
            >
              {FESTIVAL_HERO.ctaSecondary}
            </button>
          </div>

          {/* Stage label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute z-10 hidden lg:block"
            style={{ left: '50%', top: '46%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="px-3 py-1 rounded-full bg-arth-plum/55 backdrop-blur border border-arth-cream/25 text-[10px] uppercase tracking-[0.3em] text-arth-cream/85">
              live · arth main stage
            </div>
          </motion.div>

          {/* Booth hotspots */}
          {FESTIVAL_BOOTHS.map((booth, i) => (
            <BoothHotspot key={booth.id} booth={booth} index={i} onClick={() => onOpen(booth)} />
          ))}

          {/* Bottom hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:block z-10">
            <p className="text-[11px] uppercase tracking-[0.32em] text-arth-cream/65">
              tap any booth to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== BOOTH HOTSPOT BUTTON ===================== */

function BoothHotspot({ booth, index, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.1, type: 'spring', damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="absolute group cursor-pointer focus:outline-none"
      style={{
        left: `${booth.hotspot.x}%`,
        top: `${booth.hotspot.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={booth.title}
    >
      <div className="relative">
        {/* Pulsing soft glow */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full -z-10 blur-md"
          style={{
            background: `radial-gradient(circle, ${booth.glow}cc 0%, ${booth.color}55 50%, transparent 75%)`,
          }}
          animate={{ scale: [0.95, 1.4, 0.95], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
        />
        {/* Marker */}
        <div
          className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-arth-cream/95 flex items-center justify-center shadow-xl ring-2 transition"
          style={{
            boxShadow: `0 10px 30px -10px ${booth.color}cc, 0 0 0 4px ${booth.color}55`,
            ringColor: booth.color,
            color: booth.color,
          }}
        >
          <span className="text-xl md:text-2xl select-none">{booth.icon}</span>
        </div>
      </div>

      {/* Hover label */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 whitespace-nowrap pointer-events-none"
          >
            <div
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide shadow-lg"
              style={{
                background: 'rgba(31,18,40,0.92)',
                color: '#FFE7B8',
                border: `1px solid ${booth.color}88`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="opacity-80 mr-1">{booth.icon}</span>
              {booth.title}
              <span className="ml-2 opacity-60 font-normal">tap to enter →</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ===================== BOOTH CARDS SECTION ===================== */

function BoothCardsSection({ onOpen, cardsRef }) {
  return (
    <section
      ref={cardsRef}
      className="relative bg-arth-cream py-20 md:py-28 px-5 md:px-10"
    >
      {/* soft top wash */}
      <div
        className="absolute inset-x-0 top-0 h-24 -translate-y-full pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(251,244,236,1) 100%)',
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="uppercase text-[10px] md:text-[11px] tracking-[0.4em] text-arth-coral font-bold">
            step into each booth
          </p>
          <h2 className="title-display text-arth-plum text-3xl md:text-5xl mt-3 leading-tight">
            Five conversations, <span className="italic">five rooms.</span>
          </h2>
          <p className="text-arth-plum/70 text-sm md:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Every booth is a different topic women rarely get to talk about — sleep, fatigue,
            brain fog, menopause, the things we were told to live with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FESTIVAL_BOOTHS.map((booth, i) => (
            <BoothCard key={booth.id} booth={booth} index={i} onClick={() => onOpen(booth)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BoothCard({ booth, index, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="group text-left rounded-3xl p-6 transition shadow-soft hover:shadow-xl relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${booth.glow}55 0%, #FBF4EC 60%)`,
        borderTop: `4px solid ${booth.color}`,
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-2xl pointer-events-none"
        style={{ background: booth.color }}
      />
      <div className="relative">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-xl"
          style={{ background: booth.color, color: '#FBF4EC' }}
        >
          {booth.icon}
        </div>
        <p
          className="mt-4 uppercase text-[10px] tracking-[0.32em] font-bold"
          style={{ color: booth.color }}
        >
          {booth.eyebrow}
        </p>
        <h3 className="title-display text-arth-plum text-2xl mt-1 leading-tight">
          {booth.title}
        </h3>
        <p className="italic text-arth-plum/70 text-sm mt-1">{booth.subtitle}</p>
        <p className="text-arth-plum/85 text-sm mt-4 leading-relaxed line-clamp-3">
          {booth.short}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition group-hover:gap-3"
          style={{ color: booth.color }}
        >
          Enter the booth
          <span aria-hidden>→</span>
        </div>
      </div>
    </motion.button>
  );
}

/* ===================== BOOTH MODAL ===================== */

function BoothModal({ booth, onClose }) {
  // Close on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
    >
      {/* Backdrop — keeps the festival visible behind */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-arth-ink/55 backdrop-blur-sm"
      />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', damping: 24, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:max-w-2xl bg-arth-cream rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
        style={{ borderTop: `5px solid ${booth.color}` }}
      >
        {/* Header */}
        <div
          className="p-6 md:p-8 pr-14"
          style={{
            background: `linear-gradient(135deg, ${booth.glow}55 0%, transparent 60%)`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl text-2xl shrink-0"
              style={{ background: booth.color, color: '#FBF4EC' }}
            >
              {booth.icon}
            </div>
            <div>
              <p
                className="uppercase text-[10px] tracking-[0.4em] font-bold"
                style={{ color: booth.color }}
              >
                {booth.eyebrow}
              </p>
              <h2 className="title-display text-2xl md:text-3xl text-arth-plum mt-1 leading-tight">
                {booth.title}
              </h2>
              <p className="italic text-arth-plum/70 text-sm mt-1">{booth.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-arth-plum/10 hover:bg-arth-plum/20 text-arth-plum text-lg flex items-center justify-center transition"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 md:px-8 py-2 md:py-4 overflow-y-auto">
          <Section title="What happens here">
            <p className="text-arth-plum/85 text-sm md:text-base leading-relaxed">{booth.what}</p>
          </Section>

          <Section title="Activities">
            <ul className="space-y-1.5">
              {booth.activities.map((a, i) => (
                <li key={i} className="text-arth-plum/85 text-sm leading-relaxed flex gap-2">
                  <span aria-hidden style={{ color: booth.color }}>
                    ✦
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Women are saying…">
            <ul className="space-y-2">
              {booth.community.map((q, i) => (
                <li
                  key={i}
                  className="rounded-2xl px-4 py-3 text-sm italic text-arth-plum/85 leading-relaxed"
                  style={{ background: `${booth.glow}33`, borderLeft: `3px solid ${booth.color}` }}
                >
                  “{q}”
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Next step">
            <p className="text-arth-plum/85 text-sm leading-relaxed">{booth.next}</p>
          </Section>
        </div>

        {/* Sticky CTA */}
        <div className="p-5 md:p-6 border-t border-arth-plum/10 bg-arth-cream">
          <button
            onClick={onClose}
            className="w-full rounded-full py-3.5 font-semibold text-arth-cream tracking-wide shadow-soft transition hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${booth.color} 0%, ${booth.accent} 100%)`,
            }}
          >
            {booth.cta} →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <div className="py-3.5 border-b border-arth-plum/8 last:border-b-0">
      <p className="uppercase text-[10px] tracking-[0.32em] font-bold text-arth-plum/55 mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

/* ===================== FIND YOUR CIRCLE ===================== */

function FindYourCircleSection({ onOpen }) {
  return (
    <section className="relative px-5 md:px-10 py-20 md:py-28 overflow-hidden bg-arth-plum text-arth-cream">
      <div
        className="absolute inset-0 -z-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(243,166,176,0.35) 0%, transparent 45%),' +
            'radial-gradient(circle at 75% 70%, rgba(255,184,107,0.28) 0%, transparent 50%)',
        }}
      />
      <div className="relative max-w-4xl mx-auto text-center">
        <p className="uppercase text-[11px] tracking-[0.4em] text-arth-peach font-bold">
          after the booths
        </p>
        <h2 className="title-display text-3xl md:text-5xl mt-3 leading-tight">
          Find your circle.
        </h2>
        <p className="text-arth-cream/80 text-sm md:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          Real women. Real talks. Real support. Every booth lands in a circle —
          a small group of women figuring it out together.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
          {FESTIVAL_BOOTHS.map((b) => (
            <button
              key={b.id}
              onClick={() => onOpen(b)}
              className="rounded-full px-4 py-2 text-xs md:text-sm font-semibold text-arth-cream/95 transition hover:scale-105"
              style={{
                background: `${b.color}22`,
                border: `1px solid ${b.color}66`,
              }}
            >
              <span className="mr-1">{b.icon}</span>
              {b.cta.replace('Join the ', '').replace('Find your circle', 'The Wall')}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== FOOTER ===================== */

function Footer() {
  return (
    <footer className="bg-arth-ink text-arth-cream/65 px-5 md:px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <p className="title-display text-arth-cream text-xl">Arth Party</p>
          <p className="text-xs italic">Women’s health, but make it a vibe.</p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.32em]">by Arth · Emcure</p>
      </div>
    </footer>
  );
}
