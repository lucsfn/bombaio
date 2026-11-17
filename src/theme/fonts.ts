import { Jersey15_400Regular } from '@expo-google-fonts/jersey-15';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import {
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
} from '@expo-google-fonts/atkinson-hyperlegible';
import { fontFamilies } from '@/theme/typography';

export const fontSources = {
  [fontFamilies.display]: Jersey15_400Regular,
  [fontFamilies.label]: VT323_400Regular,
  [fontFamilies.body]: AtkinsonHyperlegible_400Regular,
  [fontFamilies.bodyBold]: AtkinsonHyperlegible_700Bold,
};
