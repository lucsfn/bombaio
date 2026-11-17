export const colors = {
  void: '#0d111b',
  surface1: '#171f2b',
  surface2: '#232d3c',
  surface3: '#303b4c',
  outline: '#070a10',
  bevel: '#3d4a5e',
  ink: '#f0eadc',
  inkMuted: '#b1bbcb',
  inkDim: '#8792a8',
  inkOnGold: '#22160a',
  arcane: '#aa9ee8',
  arcaneGlow: '#cfc6f5',
  arcaneDeep: '#2e3350',
  gold: '#f0c66b',
  goldLight: '#f8e2a8',
  goldDeep: '#775022',
  rune: '#63d9c6',
  runeDeep: '#2c8a7c',
  ember: '#f5a568',
  leaf: '#8bd181',
  mana: '#8fb8e8',
  blood: '#f18b9b',
  locked: '#727e91',
  iron: '#566172',
  ironLight: '#8792a8',
  ironDeep: '#232d3c',
  brass: '#c99a4e',
  brassDeep: '#6b4a1e',
  bronzeLight: '#f0a868',
  bronze: '#c4763a',
  bronzeDeep: '#6e3a17',
  silver: '#c3cbdb',
  silverDeep: '#5f6a82',
  slate: '#1d2633',
  bark: '#6b4428',
  barkLight: '#9b6a3f',
  barkDeep: '#3b2416',
  foliage: '#2f7a52',
  foliageLight: '#5fae74',
  foliageDeep: '#1c4a3a',
  earth: '#1d1726',
  scrim: 'rgba(7, 10, 16, 0.72)',
} as const;

export type ColorToken = keyof typeof colors;

export const space = {
  px: 2,
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s6: 24,
  s8: 32,
  ctlHeight: 48,
  tapMin: 44,
  gapIcon: 12,
} as const;

export const radius = {
  none: 0,
  sm: 2,
} as const;

export const shadows = {
  hard: {
    shadowColor: colors.outline,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  glowRune: {
    shadowColor: colors.rune,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  glowGold: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 6,
  },
} as const;

export const pressedOffset = 2;

export const durations = {
  fast: 150,
  base: 200,
  slow: 300,
} as const;

export const easing = {
  standard: [0.2, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const iconSizes = {
  ui: 32,
  art: 128,
} as const;

export const controlSizes = {
  check: 36,
  toggleWidth: 72,
  toggleHeight: 36,
  hardShadow: 4,
} as const;

export const layout = {
  tabBarHeight: 56,
  tabIndicator: 4,
  socket: 44,
  dialogMaxWidth: 360,
  toastDuration: 3000,
  skeletonPulse: 900,
  inactiveIconOpacity: 0.65,
  disabledOpacity: 0.5,
} as const;
