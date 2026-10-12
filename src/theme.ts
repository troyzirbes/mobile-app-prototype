export const colors = {
  background: '#F4E2CE',
  backgroundDeep: '#E8C7A6',
  ink: '#2A1C14',
  inkLine: '#3A2A22',
  muted: '#7C5E4C',
  card: '#FFF8F0',
  line: '#E4CDB8',
  coral: '#E25B32',
  coralDeep: '#B84324',
  pass: '#3E5348',
  likeStamp: '#2E6B48',
  passStamp: '#C44734',
  chip: '#F6D7B8',
  white: '#FFF8F0',
  gold: '#E09A3A',
  night: '#241910',
  scrim: 'rgba(36, 25, 16, 0.72)',
  scrimClear: 'rgba(36, 25, 16, 0)',
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
  shadowColor: '#3A2A22',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 3,
} as const;

export const drawn = {
  borderWidth: 2,
  borderColor: colors.inkLine,
} as const;
