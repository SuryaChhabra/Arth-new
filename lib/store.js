'use client';

import { create } from 'zustand';

export const useArthStore = create((set) => ({
  started: false,
  setStarted: (v) => set({ started: v }),

  // current room (null = lobby)
  activeBooth: null,
  setActiveBooth: (id) => set({ activeBooth: id, openHotspot: null }),

  // booth modal hotspot id currently open
  openHotspot: null,
  setOpenHotspot: (h) => set({ openHotspot: h }),

  // body decoder
  decoderOpen: false,
  setDecoderOpen: (v) => set({ decoderOpen: v }),

  // recommended booth from decoder
  recommendation: null,
  setRecommendation: (r) => set({ recommendation: r }),

  // circles user has joined (mock)
  joinedCircles: [],
  joinCircle: (c) =>
    set((s) =>
      s.joinedCircles.includes(c)
        ? s
        : { joinedCircles: [...s.joinedCircles, c] }
    ),

  // sound
  muted: true,
  setMuted: (v) => set({ muted: v }),

  // selected ambient mood (for So Jao Lounge mood/sleep sounds)
  selectedMood: 'warm',
  setSelectedMood: (m) => set({ selectedMood: m }),
}));
