'use client';

import { create } from 'zustand';

export const useArthStore = create((set) => ({
  started: false,
  setStarted: (v) => set({ started: v }),

  // current booth user is inside (null = plaza)
  activeBooth: null,
  setActiveBooth: (id) => set({ activeBooth: id }),

  // booth modal hotspot id currently open
  openHotspot: null,
  setOpenHotspot: (h) => set({ openHotspot: h }),

  // body decoder kiosk
  decoderOpen: false,
  setDecoderOpen: (v) => set({ decoderOpen: v }),

  // map open
  mapOpen: false,
  setMapOpen: (v) => set({ mapOpen: v }),

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

  // avatar position (kept here so HUD/minimap can read it)
  avatarPos: [0, 0, 0],
  setAvatarPos: (p) => set({ avatarPos: p }),

  // sound
  muted: true,
  setMuted: (v) => set({ muted: v }),
}));
