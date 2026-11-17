import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, pressedOffset, radius, space } from '@/theme/tokens';

export type CardAccent = 'none' | 'gold' | 'rune' | 'ember' | 'leaf' | 'blood' | 'arcane';

export type CardProps = {
  children: ReactNode;
  accent?: CardAccent;
} & ({ onPress?: undefined; accessibilityLabel?: string } | { onPress: () => void; accessibilityLabel: string });

const accentColors: Record<Exclude<CardAccent, 'none'>, string> = {
  gold: colors.gold,
  rune: colors.rune,
  ember: colors.ember,
  leaf: colors.leaf,
  blood: colors.blood,
  arcane: colors.arcane,
};

export function Card({ children, accent = 'none', onPress, accessibilityLabel }: CardProps) {
  const stripe = accent === 'none' ? null : <View style={[styles.stripe, { backgroundColor: accentColors[accent] }]} />;

  if (!onPress) {
    return (
      <View style={styles.card}>
        {stripe}
        <View style={styles.body}>{children}</View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      {stripe}
      <View style={styles.body}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  stripe: { width: space.s1 },
  body: { flex: 1, padding: space.s3, gap: space.s2 },
  pressed: { transform: [{ translateY: pressedOffset }] },
});
