// Shared content types, defaults and theme presets for the portfolio.

export type AccentColor = 'cyan' | 'magenta' | 'purple' | 'green';

export interface ProjectRow {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image_url: string | null;
  video_id: string | null;
  video_url: string | null;
  tech: string[];
  color: string;
  status: string;
  layout: string;
  hover_effect: string;
  glow: number;
  featured: boolean;
  visible: boolean;
  cta_label: string | null;
  cta_url: string | null;
  likes: number;
  views: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineRow {
  id: string;
  year: string;
  codename: string;
  title: string;
  description: string;
  status: string;
  color: string;
  progress: number;
  sort_order: number;
}

export interface ReviewRow {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  rating: number;
  content: string;
  approved: boolean;
  sort_order: number;
  created_at: string;
}

export interface ActivityRow {
  id: string;
  action: string;
  detail: string;
  created_at: string;
}

export interface SkillItem { name: string; level: number; color: AccentColor }
export interface StatItem { label: string; value: string; suffix: string }
export interface NavItem { name: string; href: string }
export interface FooterLink { label: string; url: string }

export interface ThemeTokens {
  background: string;
  foreground: string;
  card: string;
  border: string;
  cyan: string;
  magenta: string;
  purple: string;
  green: string;
}

export interface SiteSettings {
  meta: { title: string; description: string };
  hero: {
    kicker: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    cta1Label: string;
    cta1Href: string;
    cta2Label: string;
    cta2Href: string;
  };
  about: {
    bio: string;
    avatarUrl: string;
    skills: SkillItem[];
    stats: StatItem[];
  };
  nav: { logo: string; logoAccent: string; statusText: string; items: NavItem[] };
  footer: { note: string; links: FooterLink[] };
  ticker: { enabled: boolean; text: string };
  sections: {
    projectsKicker: string;
    projectsTitle: string;
    timelineKicker: string;
    timelineTitle: string;
    timelineNote: string;
    reviewsKicker: string;
    reviewsTitle: string;
    aboutKicker: string;
    aboutTitle: string;
  };
  theme: {
    name: string;
    tokens: ThemeTokens;
    fontPair: string;
    backgroundEffect: 'scene3d' | 'particles' | 'grid' | 'none';
    glow: number;
    mode: 'light' | 'dark';
  };
  fx: { intro: boolean; sound: boolean; volume: number; pageSize: number };
  background: BackgroundSettings;
  roblox: {
    enabled: boolean;
    userId: string;
    profileUrl: string;
    useLiveGroups: boolean;
    groups: RobloxGroupItem[];
  };
}

export type BackgroundPreset =
  | 'paper'
  | 'doodle'
  | 'dots'
  | 'confetti'
  | 'aurora'
  | 'mesh'
  | 'stripes'
  | 'rainbow'
  | 'plain'
  | 'image';

export interface BackgroundSettings {
  preset: BackgroundPreset;
  colorA: string;
  colorB: string;
  colorC: string;
  opacity: number;
  speed: number;
  animated: boolean;
  blobs: boolean;
  grain: boolean;
  imageUrl: string;
  imageBlur: number;
  imageDim: number;
}

/** The authored backdrop shipped with the portfolio. Admin reset always returns here. */
export const SYSTEM_ORIGINAL_BACKGROUND: BackgroundSettings = Object.freeze({
  preset: 'confetti',
  colorA: '38 90% 62%',
  colorB: '332 78% 70%',
  colorC: '196 78% 62%',
  opacity: 55,
  speed: 100,
  animated: true,
  blobs: true,
  grain: true,
  imageUrl: '',
  imageBlur: 0,
  imageDim: 20,
});

export const BACKGROUND_PRESETS: { id: BackgroundPreset; label: string; hint: string }[] = [
  { id: 'paper', label: 'Paper grain', hint: 'Soft sketchbook paper with a faint dot grid.' },
  { id: 'doodle', label: 'Doodle grid', hint: 'Hand-drawn graph paper lines that drift slowly.' },
  { id: 'dots', label: 'Polka dots', hint: 'Big friendly dots in your accent colours.' },
  { id: 'confetti', label: 'Confetti', hint: 'Scattered colourful sprinkles floating upward.' },
  { id: 'aurora', label: 'Aurora', hint: 'Large glowing colour clouds slowly swirling.' },
  { id: 'mesh', label: 'Gradient mesh', hint: 'Layered gradients blending across the page.' },
  { id: 'stripes', label: 'Candy stripes', hint: 'Diagonal pastel stripes that slide.' },
  { id: 'rainbow', label: 'Rainbow wash', hint: 'A full-colour animated wash across the page.' },
  { id: 'plain', label: 'Plain', hint: 'Just the flat theme background colour.' },
  { id: 'image', label: 'Custom image', hint: 'Use your own image or GIF as the page background.' },
];


export interface RobloxGroupItem {
  name: string;
  role: string;
  members: number;
  hidden: boolean;
}

export const FONT_PAIRS: Record<string, { heading: string; body: string; label: string }> = {
  orbitron: { heading: "'Baloo 2', cursive", body: "'Nunito', sans-serif", label: 'Baloo / Nunito' },
  soft: { heading: "'Patrick Hand', cursive", body: "'Nunito', sans-serif", label: 'Patrick Hand / Nunito' },
  mono: { heading: "'Baloo 2', cursive", body: "'Patrick Hand', cursive", label: 'Baloo / Patrick Hand' },
  grotesk: { heading: "'Nunito', sans-serif", body: "'Nunito', sans-serif", label: 'Nunito only' },
};

export const DEFAULT_THEME: ThemeTokens = {
  background: '42 44% 94%',
  foreground: '25 30% 16%',
  card: '40 60% 98%',
  border: '25 30% 16%',
  cyan: '38 72% 52%',
  magenta: '8 78% 62%',
  purple: '262 45% 58%',
  green: '158 42% 42%',
};

/** Night-sketchbook counterpart applied when dark mode is on. */
export const DARK_THEME: ThemeTokens = {
  background: '232 24% 11%',
  foreground: '40 40% 94%',
  card: '232 22% 15%',
  border: '40 30% 90%',
  cyan: '42 90% 62%',
  magenta: '8 80% 66%',
  purple: '262 60% 72%',
  green: '158 50% 55%',
};


type ThemeTuple = [string, string, string, string, string, string, string, string, string];

const THEME_TUPLES: ThemeTuple[] = [
  ['Pastel Dream', '0 100% 99%', '250 28% 22%', '0 0% 100%', '8 45% 92%', '252 56% 59%', '22 85% 72%', '286 60% 74%', '165 55% 62%'],
  ['Peach Sorbet', '37 100% 99%', '287 28% 22%', '0 0% 100%', '45 45% 92%', '289 56% 59%', '59 85% 72%', '323 60% 74%', '202 55% 62%'],
  ['Lilac Mist', '74 100% 99%', '324 28% 22%', '0 0% 100%', '82 45% 92%', '326 56% 59%', '96 85% 72%', '0 60% 74%', '239 55% 62%'],
  ['Mint Cream', '111 100% 99%', '1 28% 22%', '0 0% 100%', '119 45% 92%', '3 56% 59%', '133 85% 72%', '37 60% 74%', '276 55% 62%'],
  ['Sky Cotton', '148 100% 99%', '38 28% 22%', '0 0% 100%', '156 45% 92%', '40 56% 59%', '170 85% 72%', '74 60% 74%', '313 55% 62%'],
  ['Rose Quartz', '185 100% 99%', '75 28% 22%', '0 0% 100%', '193 45% 92%', '77 56% 59%', '207 85% 72%', '111 60% 74%', '350 55% 62%'],
  ['Butter Bloom', '222 100% 99%', '112 28% 22%', '0 0% 100%', '230 45% 92%', '114 56% 59%', '244 85% 72%', '148 60% 74%', '27 55% 62%'],
  ['Sea Glass', '259 100% 99%', '149 28% 22%', '0 0% 100%', '267 45% 92%', '151 56% 59%', '281 85% 72%', '185 60% 74%', '64 55% 62%'],
  ['Lavender Fog', '296 100% 99%', '186 28% 22%', '0 0% 100%', '304 45% 92%', '188 56% 59%', '318 85% 72%', '222 60% 74%', '101 55% 62%'],
  ['Blush Sand', '333 100% 99%', '223 28% 22%', '0 0% 100%', '341 45% 92%', '225 56% 59%', '355 85% 72%', '259 60% 74%', '138 55% 62%'],
  ['Periwinkle', '10 100% 99%', '260 28% 22%', '0 0% 100%', '18 45% 92%', '262 56% 59%', '32 85% 72%', '296 60% 74%', '175 55% 62%'],
  ['Honeydew', '47 100% 99%', '297 28% 22%', '0 0% 100%', '55 45% 92%', '299 56% 59%', '69 85% 72%', '333 60% 74%', '212 55% 62%'],
  ['Coral Cloud', '84 100% 99%', '334 28% 22%', '0 0% 100%', '92 45% 92%', '336 56% 59%', '106 85% 72%', '10 60% 74%', '249 55% 62%'],
  ['Powder Blue', '121 100% 99%', '11 28% 22%', '0 0% 100%', '129 45% 92%', '13 56% 59%', '143 85% 72%', '47 60% 74%', '286 55% 62%'],
  ['Vanilla Lilac', '158 100% 99%', '48 28% 22%', '0 0% 100%', '166 45% 92%', '50 56% 59%', '180 85% 72%', '84 60% 74%', '323 55% 62%'],
  ['Apricot Haze', '195 100% 99%', '85 28% 22%', '0 0% 100%', '203 45% 92%', '87 56% 59%', '217 85% 72%', '121 60% 74%', '0 55% 62%'],
  ['Seafoam', '232 100% 99%', '122 28% 22%', '0 0% 100%', '240 45% 92%', '124 56% 59%', '254 85% 72%', '158 60% 74%', '37 55% 62%'],
  ['Wisteria', '269 100% 99%', '159 28% 22%', '0 0% 100%', '277 45% 92%', '161 56% 59%', '291 85% 72%', '195 60% 74%', '74 55% 62%'],
  ['Petal Pink', '306 100% 99%', '196 28% 22%', '0 0% 100%', '314 45% 92%', '198 56% 59%', '328 85% 72%', '232 60% 74%', '111 55% 62%'],
  ['Sage Linen', '343 100% 99%', '233 28% 22%', '0 0% 100%', '351 45% 92%', '235 56% 59%', '5 85% 72%', '269 60% 74%', '148 55% 62%'],
  ['Bubblegum', '20 100% 99%', '270 28% 22%', '0 0% 100%', '28 45% 92%', '272 56% 59%', '42 85% 72%', '306 60% 74%', '185 55% 62%'],
  ['Iris Bloom', '57 100% 99%', '307 28% 22%', '0 0% 100%', '65 45% 92%', '309 56% 59%', '79 85% 72%', '343 60% 74%', '222 55% 62%'],
  ['Almond Milk', '94 100% 99%', '344 28% 22%', '0 0% 100%', '102 45% 92%', '346 56% 59%', '116 85% 72%', '20 60% 74%', '259 55% 62%'],
  ['Aqua Whisper', '131 100% 99%', '21 28% 22%', '0 0% 100%', '139 45% 92%', '23 56% 59%', '153 85% 72%', '57 60% 74%', '296 55% 62%'],
  ['Mauve Morning', '168 100% 99%', '58 28% 22%', '0 0% 100%', '176 45% 92%', '60 56% 59%', '190 85% 72%', '94 60% 74%', '333 55% 62%'],
  ['Sunbeam', '205 100% 99%', '95 28% 22%', '0 0% 100%', '213 45% 92%', '97 56% 59%', '227 85% 72%', '131 60% 74%', '10 55% 62%'],
  ['Cloudberry', '242 100% 99%', '132 28% 22%', '0 0% 100%', '250 45% 92%', '134 56% 59%', '264 85% 72%', '168 60% 74%', '47 55% 62%'],
  ['Frosted Plum', '279 100% 99%', '169 28% 22%', '0 0% 100%', '287 45% 92%', '171 56% 59%', '301 85% 72%', '205 60% 74%', '84 55% 62%'],
  ['Melon Fizz', '316 100% 99%', '206 28% 22%', '0 0% 100%', '324 45% 92%', '208 56% 59%', '338 85% 72%', '242 60% 74%', '121 55% 62%'],
  ['Opal', '353 100% 99%', '243 28% 22%', '0 0% 100%', '1 45% 92%', '245 56% 59%', '15 85% 72%', '279 60% 74%', '158 55% 62%'],
  ['Tulip Field', '30 100% 99%', '280 28% 22%', '0 0% 100%', '38 45% 92%', '282 56% 59%', '52 85% 72%', '316 60% 74%', '195 55% 62%'],
  ['Pistachio', '67 100% 99%', '317 28% 22%', '0 0% 100%', '75 45% 92%', '319 56% 59%', '89 85% 72%', '353 60% 74%', '232 55% 62%'],
  ['Orchid Silk', '104 100% 99%', '354 28% 22%', '0 0% 100%', '112 45% 92%', '356 56% 59%', '126 85% 72%', '30 60% 74%', '269 55% 62%'],
  ['Marshmallow', '141 100% 99%', '31 28% 22%', '0 0% 100%', '149 45% 92%', '33 56% 59%', '163 85% 72%', '67 60% 74%', '306 55% 62%'],
  ['Lagoon Light', '178 100% 99%', '68 28% 22%', '0 0% 100%', '186 45% 92%', '70 56% 59%', '200 85% 72%', '104 60% 74%', '343 55% 62%'],
  ['Peony', '215 100% 99%', '105 28% 22%', '0 0% 100%', '223 45% 92%', '107 56% 59%', '237 85% 72%', '141 60% 74%', '20 55% 62%'],
  ['Dusty Rose', '252 100% 99%', '142 28% 22%', '0 0% 100%', '260 45% 92%', '144 56% 59%', '274 85% 72%', '178 60% 74%', '57 55% 62%'],
  ['Moonstone', '289 100% 99%', '179 28% 22%', '0 0% 100%', '297 45% 92%', '181 56% 59%', '311 85% 72%', '215 60% 74%', '94 55% 62%'],
  ['Citrus Cream', '326 100% 99%', '216 28% 22%', '0 0% 100%', '334 45% 92%', '218 56% 59%', '348 85% 72%', '252 60% 74%', '131 55% 62%'],
  ['Hyacinth', '3 100% 99%', '253 28% 22%', '0 0% 100%', '11 45% 92%', '255 56% 59%', '25 85% 72%', '289 60% 74%', '168 55% 62%'],
  ['Sorbet Sky', '40 100% 99%', '290 28% 22%', '0 0% 100%', '48 45% 92%', '292 56% 59%', '62 85% 72%', '326 60% 74%', '205 55% 62%'],
  ['Linen Lilac', '77 100% 99%', '327 28% 22%', '0 0% 100%', '85 45% 92%', '329 56% 59%', '99 85% 72%', '3 60% 74%', '242 55% 62%'],
  ['Cotton Candy', '114 100% 99%', '4 28% 22%', '0 0% 100%', '122 45% 92%', '6 56% 59%', '136 85% 72%', '40 60% 74%', '279 55% 62%'],
  ['Soft Slate', '151 100% 99%', '41 28% 22%', '0 0% 100%', '159 45% 92%', '43 56% 59%', '173 85% 72%', '77 60% 74%', '316 55% 62%'],
];

export const THEMES = THEME_TUPLES.map(([name, background, foreground, card, border, cyan, magenta, purple, green]) => ({
  name,
  tokens: { background, foreground, card, border, cyan, magenta, purple, green } as ThemeTokens,
}));

export const DEFAULT_SETTINGS: SiteSettings = {
  meta: {
    title: 'EdwardDEV — Roblox Systems, UI & Cybersecurity',
    description:
      'Portfolio of Edward: Roblox scripter and UI designer building gliding systems, custom UI, gameplay mechanics and support bots.',
  },
  hero: {
    kicker: 'Roblox developer & UI designer',
    title: 'Edward',
    titleAccent: 'DEV',
    subtitle: 'I design and script beautiful, high-performance Roblox experiences — from UI systems to gameplay mechanics.',
    cta1Label: 'View my work',
    cta1Href: '#projects',
    cta2Label: 'About me',
    cta2Href: '#about',
  },
  about: {
    bio: 'Roblox developer and UI designer with 5+ years of experience creating high quality, immersive experiences. I have worked with the Blox Fruits team, focusing on intuitive UI, optimized systems, and interactive features that enhance gameplay. I combine creative design with solid scripting to bring ideas from concept to polished in game experiences.',
    avatarUrl: 'https://thumbs.metrik.app/headshot/5811359021',
    skills: [
      { name: 'Lua', level: 100, color: 'cyan' },
      { name: 'UI Designing', level: 98, color: 'magenta' },
      { name: 'Python', level: 94, color: 'purple' },
      { name: 'Node.js', level: 84, color: 'green' },
      { name: 'Web Development', level: 82, color: 'cyan' },
      { name: 'AI Mechanics', level: 76, color: 'magenta' },
      { name: 'Animations', level: 73, color: 'purple' },
    ],
    stats: [
      { label: 'Years Experience', value: '5', suffix: '+' },
      { label: 'Projects Completed', value: '800', suffix: '+' },
      { label: 'Happy Clients', value: '600', suffix: '+' },
      { label: 'Lines of Code', value: '2.1M', suffix: '+' },
    ],
  },
  nav: {
    logo: 'Edward',
    logoAccent: 'DEV',
    statusText: 'Available for work',
    items: [
      { name: 'Home', href: '#home' },
      { name: 'Projects', href: '#projects' },
      { name: 'Timeline', href: '#timeline' },
      { name: 'Roblox', href: '#roblox' },
      { name: 'Reviews', href: '#reviews' },
      { name: 'About', href: '#about' },
    ],
  },
  footer: {
    note: 'Designed and built with care, coffee and a lot of pastel.',
    links: [
      { label: 'Roblox', url: 'https://www.roblox.com/' },
      { label: 'Discord', url: 'https://discord.com/' },
    ],
  },
  ticker: { enabled: false, text: 'AVAILABLE FOR COMMISSIONS — DM ON DISCORD' },
  sections: {
    projectsKicker: 'Selected work',
    projectsTitle: 'Projects',
    timelineKicker: 'The journey',
    timelineTitle: 'Timeline',
    timelineNote: 'A short history of what I have built and where.',
    reviewsKicker: 'Kind words',
    reviewsTitle: 'Reviews',
    aboutKicker: 'A little about me',
    aboutTitle: 'About',
  },
  theme: {
    name: 'Cream Sketchbook',
    tokens: DEFAULT_THEME,
    fontPair: 'orbitron',
    backgroundEffect: 'none',
    glow: 100,
    mode: 'light',
  },
  fx: { intro: true, sound: true, volume: 0.7, pageSize: 6 },
  background: SYSTEM_ORIGINAL_BACKGROUND,
  roblox: {
    enabled: true,
    userId: '5811359021',
    profileUrl: 'https://www.roblox.com/users/5811359021/profile',
    useLiveGroups: true,
    groups: [],
  },

};

// Deep-ish merge so new default keys appear for saved settings.
export function mergeSettings(saved: unknown): SiteSettings {
  const base = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as SiteSettings;
  if (!saved || typeof saved !== 'object') return base;
  const s = saved as Record<string, unknown>;
  for (const key of Object.keys(base) as (keyof SiteSettings)[]) {
    const incoming = s[key];
    if (incoming && typeof incoming === 'object' && !Array.isArray(incoming)) {
      (base[key] as Record<string, unknown>) = {
        ...(base[key] as Record<string, unknown>),
        ...(incoming as Record<string, unknown>),
      };
    } else if (incoming !== undefined) {
      (base[key] as unknown) = incoming;
    }
  }
  return base;
}

export const ACCENT_HSL: Record<string, string> = {
  cyan: 'var(--neon-cyan)',
  magenta: 'var(--neon-magenta)',
  purple: 'var(--neon-purple)',
  green: 'var(--neon-green)',
};

export function accentColor(name: string): string {
  return `hsl(${ACCENT_HSL[name] ?? ACCENT_HSL.cyan})`;
}

export const STATUS_LABELS: Record<string, string> = {
  live: 'Live',
  beta: 'Beta',
  wip: 'In progress',
  archived: 'Archived',
};

export interface RobloxProfile {
  userId: number;
  username: string;
  displayName: string;
  description: string;
  avatarUrl: string;
  followers: number;
  following: number;
  friends: number;
  created: string;
  isPremium: boolean;
  groups: { name: string; role: string; memberCount: number }[];
}
