// Spatial layout of booths around the plaza, plus all booth content.
// Coordinates are in world units. The plaza is centered at (0,0,0).

export const BOOTHS = {
  sojao: {
    id: 'sojao',
    title: 'So Jao Lounge',
    tagline: 'Sleep ko lecture nahi, ritual banao.',
    palette: {
      base: '#2A1B3D',
      accent: '#C9B8E0',
      glow: '#F3A6B0',
      floor: '#3A2750',
    },
    // door is the entry point in plaza, room is where booth interior sits
    door: { position: [-22, 0, -16], rotation: 0.4, label: 'So Jao Lounge', sub: 'Sleep • Rituals' },
    room: { position: [-46, 0, -34], rotation: 0.4 },
    decoderHint: 'cantsleep',
    circle: 'Sleep Circle',
    productLabel: 'Sleep support',
    productCopy: 'A gentle next step for women building calmer night routines.',
    quotes: [
      'I say I’ll sleep early and suddenly it’s 1:47 am.',
      'I feel tired all day but my brain wakes up at night.',
      'I thought my bad sleep was just a me problem.',
      'Main so jaungi… bas ek aur reel.',
    ],
    chips: ['Same, sis', 'Trying this tonight', 'So real'],
    hotspots: [
      {
        id: 'doomscroll',
        title: 'Doomscrolling Trap',
        body: 'You opened it for a 2-min break. It’s 47 minutes later. Bedtime scrolling tricks the brain into staying alert long after the screen is off.',
        tag: 'Tiny ritual',
        ritual: 'Park your phone outside the room, not on the pillow.',
      },
      {
        id: 'ritual',
        title: 'Wind-down Ritual Table',
        body: 'Water by the bed. A two-line journal. A warm lamp instead of the ceiling light. Your brain reads cues, not commands.',
        tag: 'Tiny ritual',
        ritual: 'Pick one cue your body can repeat every night.',
      },
      {
        id: 'voices',
        title: 'What women say at night',
        body: '“The second the lights go off, my brain starts thinking.” “I feel sleepy in meetings, awake at 1 am.” “I forgot what real sleep feels like.”',
        tag: 'Community',
      },
      {
        id: 'myth',
        title: 'Sleep Myth Corner',
        body: 'Poor sleep is not just bad discipline. Sleep starts hours before you get into bed — light, food, screens, stress.',
        tag: 'Reframe',
      },
    ],
  },

  iron: {
    id: 'iron',
    title: 'Iron Energy Bar',
    tagline: 'Thakaan ko personality mat banao.',
    palette: {
      base: '#FFE2C2',
      accent: '#F08A5D',
      glow: '#FFB36B',
      floor: '#FFD7A8',
    },
    door: { position: [22, 0, -16], rotation: -0.4, label: 'Iron Energy Bar', sub: 'Fatigue • Energy' },
    room: { position: [46, 0, -34], rotation: -0.4 },
    decoderHint: 'tired',
    circle: 'Energy Circle',
    productLabel: 'Iron Support',
    productCopy: 'For women exploring fatigue, low energy, and iron awareness.',
    quotes: [
      'I thought adulting just feels like this.',
      'I kept calling myself lazy.',
      'I never connected fatigue with iron.',
      'I need coffee just to function.',
    ],
    chips: ['Same, sis', 'Needed this', 'I thought it was just me'],
    hotspots: [
      {
        id: 'crash',
        title: '4 PM Crash Meter',
        body: 'That afternoon nosedive isn’t laziness. For many women, low iron quietly steals focus, mood, and energy long before anyone names it.',
        tag: 'Reframe',
      },
      {
        id: 'pairing',
        title: 'Food Pairing Counter',
        body: 'Pair iron-rich foods with vitamin C — lemon on your saag, orange after dal. Skip chai right after a meal; it blocks absorption.',
        tag: 'Tiny ritual',
        ritual: 'Squeeze lemon on one iron-rich meal a day.',
      },
      {
        id: 'stories',
        title: 'Fatigue Stories Board',
        body: '“Did anyone else think they were just lazy?” “Why do I wake up tired?” “How do you deal with the 4 pm wall?”',
        tag: 'Community',
      },
      {
        id: 'feels',
        title: 'What low energy feels like',
        body: 'Dragging through the day. Foggy mornings. Dizziness on standing. Low-grade exhaustion that everyone calls “normal.”',
        tag: 'Symptom map',
      },
    ],
  },

  brainfog: {
    id: 'brainfog',
    title: 'Brain Fog Booth',
    tagline: 'Brain fog is not your personality.',
    palette: {
      base: '#DDF1E6',
      accent: '#7FBDA6',
      glow: '#C9B8E0',
      floor: '#CDE7DA',
    },
    door: { position: [-26, 0, 14], rotation: 2.6, label: 'Brain Fog Booth', sub: 'Focus • Clarity' },
    room: { position: [-50, 0, 34], rotation: 2.6 },
    decoderHint: 'buffering',
    circle: 'Focus Circle',
    productLabel: 'Focus Support',
    productCopy: 'For women navigating brain fog and clarity dips.',
    quotes: [
      'I opened the fridge and forgot why.',
      'I reread the same line five times.',
      'My brain buffers before my period.',
      'Everyone keeps calling this laziness.',
    ],
    chips: ['Brain buffering', 'So real', 'I thought it was just me'],
    hotspots: [
      {
        id: 'fridge',
        title: 'Forgot Why I Opened the Fridge',
        body: 'It happens to almost everyone with a hormonal cycle, a stressful week, or four hours of sleep. Brain fog is a symptom, not a flaw.',
        tag: 'Reframe',
      },
      {
        id: 'tabs',
        title: 'Too Many Tabs',
        body: 'When working memory is full, even simple tasks feel heavy. Closing two tabs — meta and mental — buys back attention.',
        tag: 'Tiny ritual',
        ritual: 'Close all tabs once a day. Restart your brain with one task at a time.',
      },
      {
        id: 'reread',
        title: 'Read The Same Line 5 Times',
        body: 'Reading without retaining is a known fog signal. It’s not “bad at focus.” It’s under-fuelled, under-slept, under-iron, or under-supported.',
        tag: 'Symptom map',
      },
      {
        id: 'buffer',
        title: 'Buffering Brain Display',
        body: 'You’re not slow. You’re processing twelve things at once with no breaks. Even your phone needs to charge.',
        tag: 'Reframe',
      },
    ],
  },

  hotflash: {
    id: 'hotflash',
    title: 'Hot Flash Chill Room',
    tagline: 'Moms are not dramatic. They’re under-explained.',
    palette: {
      base: '#FFD8CB',
      accent: '#F08A8A',
      glow: '#BFE3D7',
      floor: '#FFCDBE',
    },
    door: { position: [26, 0, 14], rotation: -2.6, label: 'Hot Flash Chill Room', sub: 'Menopause • Mom + Daughter' },
    room: { position: [50, 0, 34], rotation: -2.6 },
    decoderHint: 'menopause',
    circle: 'Menopause Circle',
    productLabel: 'Menopause Support',
    productCopy: 'For mothers and daughters making menopause less of a mystery.',
    quotes: [
      'I didn’t know this was menopause.',
      'My family thought I was overreacting.',
      'Nobody explained why I suddenly couldn’t sleep.',
      'I wish I knew how to support my mom better.',
    ],
    chips: ['Sending this to mom', 'Under-explained', 'This helps'],
    hotspots: [
      {
        id: 'flash',
        title: 'What Hot Flashes Feel Like',
        body: 'A wave that starts in the chest, rushes up the neck, and leaves you fanning yourself in a freezing room. It’s real, common, and rarely explained.',
        tag: 'Symptom map',
      },
      {
        id: 'momtalk',
        title: 'Mother–Daughter Conversation Corner',
        body: 'Try: “Mumma, is this happening to you too? I read it’s common — let’s figure it out together.” Curiosity beats correction.',
        tag: 'Tiny ritual',
        ritual: 'Send one menopause article to your mom this week.',
      },
      {
        id: 'sweats',
        title: 'Night Sweats & Sleep Disruption',
        body: 'Sleep gets harder before menopause is even confirmed. Waking up drenched at 3 am isn’t weakness — it’s hormonal weather.',
        tag: 'Symptom map',
      },
      {
        id: 'said',
        title: 'What families often say',
        body: '“She’s being dramatic.” → reframe → “She’s under-explained.” “Mood swings.” → reframe → “Hormonal shifts she was never warned about.”',
        tag: 'Reframe',
      },
    ],
  },

  normalized: {
    id: 'normalized',
    title: 'Normal? Ya Normalized?',
    tagline: 'The wall of things women were told to live with.',
    palette: {
      base: '#FFE6E1',
      accent: '#F08A5D',
      glow: '#C9B8E0',
      floor: '#FBD7D0',
    },
    door: { position: [0, 0, -28], rotation: 0, label: 'Normal? Ya Normalized?', sub: 'The Wall' },
    room: { position: [0, 0, -56], rotation: 0 },
    decoderHint: null,
    circle: 'Find Your Circle',
    productLabel: '',
    productCopy: 'Find the circle that gets it.',
    quotes: [
      'I thought it was just me.',
      'If everyone feels this, why does nobody talk about it?',
      'I kept hearing “it’s normal,” but that didn’t make it easier.',
      'This was the first time I saw my exact issue written down.',
    ],
    chips: ['Same, sis', 'Normal? Ya normalized?', 'Needed this', 'Seen'],
    hotspots: [
      {
        id: 'tired',
        title: 'Being tired all the time',
        body: 'Not your personality. Often iron, sleep, stress, or thyroid. Walk to the Iron Energy Bar.',
        tag: 'Goes with',
        link: 'iron',
      },
      {
        id: 'fog',
        title: 'Brain fog before my period',
        body: 'Cyclical and real. The Brain Fog Booth has the receipts.',
        tag: 'Goes with',
        link: 'brainfog',
      },
      {
        id: 'mom',
        title: 'My mom not sleeping',
        body: 'Likely menopause-adjacent. Hot Flash Chill Room is for both of you.',
        tag: 'Goes with',
        link: 'hotflash',
      },
      {
        id: 'mood',
        title: 'Mood swings people joke about',
        body: 'Hormonal cycles aren’t a punchline. Hormone Circle starts in the Circle Hub.',
        tag: 'Goes with',
        link: 'hub',
      },
      {
        id: 'intimate',
        title: 'Intimate discomfort I never ask about',
        body: 'Comfort deserves conversation. Find the Intimate Care Circle in the Hub.',
        tag: 'Goes with',
        link: 'hub',
      },
      {
        id: 'off',
        title: 'Feeling “off” and saying nothing',
        body: 'You don’t need a diagnosis to be heard. Start in any circle.',
        tag: 'Goes with',
        link: 'hub',
      },
    ],
  },

  hub: {
    id: 'hub',
    title: 'Find Your Circle',
    tagline: 'Real women. Real talks. Real support.',
    palette: {
      base: '#FBF4EC',
      accent: '#F08A5D',
      glow: '#F3A6B0',
      floor: '#F4E3D0',
    },
    door: { position: [0, 0, 22], rotation: Math.PI, label: 'Circle Hub', sub: 'Community Café' },
    room: { position: [0, 0, 50], rotation: Math.PI },
    decoderHint: null,
    circle: null,
    productLabel: '',
    productCopy: '',
    quotes: [
      'The circle made the symptom feel small.',
      'I joined to listen. I stayed because I felt seen.',
      'I finally have somewhere to ask the embarrassing question.',
    ],
    chips: ['Joined', 'Bringing my mom', 'Seen'],
    circles: [
      { id: 'energy', name: 'Energy Circle', icon: '⚡', quote: 'I kept calling myself lazy.', color: '#F08A5D' },
      { id: 'sleep', name: 'Sleep Circle', icon: '🌙', quote: 'My brain wakes up at night.', color: '#C9B8E0' },
      { id: 'focus', name: 'Focus Circle', icon: '🧠', quote: 'I reread the same line five times.', color: '#7FBDA6' },
      { id: 'hormone', name: 'Hormone Circle', icon: '🌸', quote: 'Mood swings aren’t a punchline.', color: '#F3A6B0' },
      { id: 'menopause', name: 'Menopause Circle', icon: '🔥', quote: 'I didn’t know this was menopause.', color: '#F08A8A' },
      { id: 'intimate', name: 'Intimate Care Circle', icon: '🌷', quote: 'Comfort deserves conversation.', color: '#FFB36B' },
    ],
    hotspots: [],
  },
};

export const BOOTH_ORDER = ['sojao', 'iron', 'brainfog', 'hotflash', 'normalized', 'hub'];

// Body decoder options → recommended booth
export const DECODER_OPTIONS = [
  { id: 'tired', label: 'Always tired', booth: 'iron', line: 'Start at the Iron Energy Bar.' },
  { id: 'cantsleep', label: 'Can’t sleep', booth: 'sojao', line: 'Try the So Jao Lounge.' },
  { id: 'buffering', label: 'Brain buffering', booth: 'brainfog', line: 'The Brain Fog Booth gets it.' },
  { id: 'hormones', label: 'Hormones chaotic', booth: 'normalized', line: 'See the Normal? Ya Normalized? Wall.' },
  { id: 'menopause', label: 'Mom’s menopause', booth: 'hotflash', line: 'Walk into the Hot Flash Chill Room.' },
  { id: 'intimate', label: 'Intimate care', booth: 'hub', line: 'Find the Intimate Care Circle in the Hub.' },
];

// Plaza floating quotes
export const PLAZA_QUOTES = [
  'Same, sis.',
  'You’re not alone.',
  'I thought it was just me.',
  'Sending this to mom.',
  'Normal? Ya normalized?',
  'Comfort deserves conversation.',
];
