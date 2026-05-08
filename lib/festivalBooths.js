// Booth data for the 2D illustrated festival landing page.
// Hotspot x/y are percentages of the festival illustration container
// (which renders at a 3:2 aspect ratio matching the reference image).

export const FESTIVAL_BOOTHS = [
  {
    id: 'sojao',
    title: 'So Jao Lounge',
    subtitle: 'Sleep ko lecture nahi, ritual banao.',
    eyebrow: 'sleep · rituals',
    color: '#9B7FBF',
    accent: '#C9B8E0',
    glow: '#F3A6B0',
    icon: '🌙',
    hotspot: { x: 50, y: 22 }, // top-center big purple dome
    short: 'Phone parking, sleep sounds, wind-down rituals.',
    what:
      'A dreamy lavender lounge for the sleep-deprived: phone-parking baskets, a moon-lit chaise to actually pause for sixty seconds, and a “Pick a ritual” menu of tiny wind-down moves.',
    activities: [
      'Phone parking basket',
      'Pick a ritual: Breathe / Journal / Stretch / Sip / Dim',
      'Mood / Sleep sounds panel',
      'Sleep support shelf',
    ],
    community: [
      'I say I’ll sleep early and suddenly it’s 1:47 am.',
      'My brain wakes up the second the lights go off.',
      'I thought my bad sleep was just a me problem.',
    ],
    next: 'A gentle next step for women building calmer night routines.',
    cta: 'Join the Sleep Circle',
  },
  {
    id: 'brainfog',
    title: 'Brain Fog Booth',
    subtitle: 'Brain fog is not your personality.',
    eyebrow: 'focus · clarity',
    color: '#7FBDA6',
    accent: '#BFE3D7',
    glow: '#C9B8E0',
    icon: '🧠',
    hotspot: { x: 17, y: 30 }, // top-left teal dome
    short: 'Too many tabs. Mental loading bars. Focus resets.',
    what:
      'A playful mind-chaos room where brain fog becomes visible. “Forgot why I opened the fridge”, buffering brain displays, sticky notes everywhere — and small clarity resets that fit a real day.',
    activities: [
      'Too Many Tabs panel',
      'Forgot why I opened the fridge',
      'Buffering brain display',
      'Focus support shelf',
    ],
    community: [
      'I opened the fridge and forgot why.',
      'I reread the same line five times.',
      'My brain buffers before my period.',
    ],
    next: 'For women navigating brain fog and clarity dips.',
    cta: 'Join the Focus Circle',
  },
  {
    id: 'hotflash',
    title: 'Hot Flash Chill Room',
    subtitle: 'Moms are not dramatic. They’re under-explained.',
    eyebrow: 'menopause · mom + me',
    color: '#E08A8A',
    accent: '#F3A6B0',
    glow: '#BFE3D7',
    icon: '🌬️',
    hotspot: { x: 84, y: 30 }, // top-right coral dome
    short: 'A literal cool-down room. Mom-and-daughter friendly.',
    what:
      'A peach-and-teal sanctuary built for menopause without awkwardness. Hot flashes get explained, sleep disruption gets named, and mothers + daughters get actual conversation prompts.',
    activities: [
      'What hot flashes feel like',
      'Mother–daughter conversation corner',
      'Night sweats + sleep disruption',
      'What families often say (reframed)',
    ],
    community: [
      'I didn’t know this was menopause.',
      'My family thought I was overreacting.',
      'I wish I knew how to support my mom better.',
    ],
    next: 'For mothers and daughters making menopause less of a mystery.',
    cta: 'Join the Menopause Circle',
  },
  {
    id: 'normalized',
    title: 'Normal? Ya Normalized?',
    subtitle: 'If everyone feels it, that doesn’t mean we should ignore it.',
    eyebrow: 'community · the wall',
    color: '#E58AA0',
    accent: '#F3A6B0',
    glow: '#FFD7A8',
    icon: '📌',
    hotspot: { x: 18, y: 60 }, // bottom-left pink note wall
    short: 'A wall of things women were told to live with.',
    what:
      'A community installation where visitors tap notes — “being tired all the time”, “brain fog before my period”, “mom not sleeping” — and find the circle that gets it.',
    activities: [
      'Tap any note on the wall',
      'See community reactions',
      'Find your matching circle',
      'Add your own note',
    ],
    community: [
      'I thought it was just me.',
      'If everyone feels this, why does nobody talk about it?',
      'This was the first time I saw my exact issue written down.',
    ],
    next: 'Add a reaction. Find your circle.',
    cta: 'Find your circle',
  },
  {
    id: 'iron',
    title: 'Iron Energy Bar',
    subtitle: 'Thakaan ko personality mat banao.',
    eyebrow: 'fatigue · iron',
    color: '#F08A5D',
    accent: '#FFB36B',
    glow: '#FFD7A8',
    icon: '⚡',
    hotspot: { x: 84, y: 62 }, // bottom-right small kiosk
    short: '4 PM crash meter, food pairing, energy resets.',
    what:
      'A bright wellness juice bar that reframes fatigue. Visitors check the 4 PM Crash Meter, learn food pairings (lemon on saag, no chai right after meals), and stop calling themselves lazy.',
    activities: [
      '4 PM Crash Meter',
      'Food pairing tips',
      'Iron-rich menu',
      'Iron Support shelf',
    ],
    community: [
      'I kept calling myself lazy.',
      'I never connected fatigue with iron.',
      'I need coffee just to function.',
    ],
    next: 'For women exploring fatigue, low energy, and iron awareness.',
    cta: 'Join the Energy Circle',
  },
];

export const FESTIVAL_HERO = {
  title: 'Arth Party',
  subtitle: 'Women’s health, but make it a vibe.',
  brand: 'by Arth · Emcure',
  ctaPrimary: 'Explore the booths',
  ctaSecondary: 'Find your circle',
};
