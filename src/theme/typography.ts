import type { TextStyle } from 'react-native';

export const fontFamilies = {
  display: 'Jersey15_400Regular',
  label: 'VT323_400Regular',
  body: 'AtkinsonHyperlegible_400Regular',
  bodyBold: 'AtkinsonHyperlegible_700Bold',
} as const;

export const typography = {
  display1: { fontFamily: fontFamilies.display, fontSize: 34, lineHeight: 36 },
  display2: { fontFamily: fontFamilies.display, fontSize: 28, lineHeight: 28 },
  display3: { fontFamily: fontFamilies.display, fontSize: 24, lineHeight: 24 },
  display4: { fontFamily: fontFamilies.display, fontSize: 20, lineHeight: 22 },
  display5: { fontFamily: fontFamilies.display, fontSize: 18, lineHeight: 18 },
  label: { fontFamily: fontFamilies.label, fontSize: 18, lineHeight: 20 },
  labelSm: { fontFamily: fontFamilies.label, fontSize: 16, lineHeight: 16 },
  body: { fontFamily: fontFamilies.body, fontSize: 16, lineHeight: 24 },
  bodySm: { fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 20 },
  bodyStrong: { fontFamily: fontFamilies.bodyBold, fontSize: 16, lineHeight: 24 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
