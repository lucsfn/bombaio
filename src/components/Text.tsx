import type { ReactNode } from 'react';
import { Text as NativeText, StyleSheet, type TextProps as NativeTextProps } from 'react-native';
import { colors } from '@/theme/tokens';
import { typography, type TypographyVariant } from '@/theme/typography';

export type TextTone =
  | 'ink'
  | 'muted'
  | 'dim'
  | 'onGold'
  | 'gold'
  | 'rune'
  | 'arcane'
  | 'ember'
  | 'leaf'
  | 'mana'
  | 'blood';

export type TextProps = Pick<
  NativeTextProps,
  'numberOfLines' | 'accessibilityRole' | 'accessibilityLabel' | 'accessible' | 'selectable'
> & {
  variant?: TypographyVariant;
  tone?: TextTone;
  align?: 'left' | 'center' | 'right';
  uppercase?: boolean;
  children: ReactNode;
};

const toneColors: Record<TextTone, string> = {
  ink: colors.ink,
  muted: colors.inkMuted,
  dim: colors.inkDim,
  onGold: colors.inkOnGold,
  gold: colors.gold,
  rune: colors.rune,
  arcane: colors.arcane,
  ember: colors.ember,
  leaf: colors.leaf,
  mana: colors.mana,
  blood: colors.blood,
};

export function Text({
  variant = 'body',
  tone = 'ink',
  align = 'left',
  uppercase = false,
  children,
  ...rest
}: TextProps) {
  return (
    <NativeText
      {...rest}
      style={[
        typography[variant],
        { color: toneColors[tone], textAlign: align },
        uppercase ? styles.uppercase : null,
      ]}
    >
      {children}
    </NativeText>
  );
}

const styles = StyleSheet.create({
  uppercase: { textTransform: 'uppercase' },
});
