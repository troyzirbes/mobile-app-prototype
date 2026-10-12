export const colors = {
  background: '#F6E6D4',
  backgroundDeep: '#F0D4BE',
  ink: '#2C2118',
  muted: '#8A6E5C',
  card: '#FFF8F1',
  line: '#E7D2BE',
  coral: '#E15A32',
  coralDeep: '#B83E22',
  pass: '#3E5348',
  likeStamp: '#2F6B4A',
  passStamp: '#C44734',
  chip: '#F8E2CC',
  white: '#FFF8F1',
  gold: '#C6922E',
  night: '#241C16',
  scrim: 'rgba(36, 28, 22, 0.72)',
  scrimClear: 'rgba(36, 28, 22, 0)',
} as const;

export const fonts = {
  display: 'Fraunces_600SemiBold',
  body: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_800ExtraBold',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
} as const;

export const radii = {
  card: 28,
  chip: 999,
  button: 999,
  stamp: 16,
} as const;

export const shadow = {
  shadowColor: '#2C2118',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 3,
} as const;
