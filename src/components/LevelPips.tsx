import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { colors, gameSizes, space } from '@/theme/tokens';

export type LevelPipsTone = 'leaf' | 'rune' | 'gold' | 'arcane' | 'locked';

export type LevelPipsProps = {
  level: number;
  tone?: LevelPipsTone;
  showNext?: boolean;
  showNumber?: boolean;
};

const toneColors: Record<LevelPipsTone, string> = {
  leaf: colors.leaf,
  rune: colors.rune,
  gold: colors.gold,
  arcane: colors.arcane,
  locked: colors.locked,
};

const slots = Array.from({ length: gameSizes.pipCount }, (_, index) => index);

export function LevelPips({ level, tone = 'leaf', showNext = true, showNumber = true }: LevelPipsProps) {
  const filled = Math.max(0, Math.min(gameSizes.pipCount, Math.floor(level)));

  return (
    <View
      style={styles.root}
      accessible
      accessibilityRole="text"
      accessibilityLabel={'Nível ' + filled + ' de ' + gameSizes.pipCount}
    >
      <View style={styles.pips}>
        {slots.map((index) => (
          <View
            key={index}
            style={[
              styles.pip,
              index < filled ? { backgroundColor: toneColors[tone] } : null,
              showNext && index === filled ? styles.next : null,
            ]}
          />
        ))}
      </View>
      {showNumber ? (
        <Text variant="labelSm" tone="muted">
          {filled}/{gameSizes.pipCount}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  pips: { flexDirection: 'row', gap: space.px },
  pip: {
    width: gameSizes.pip,
    height: gameSizes.pip,
    backgroundColor: colors.surface3,
    borderWidth: space.px / 2,
    borderColor: colors.outline,
  },
  next: { borderWidth: space.px, borderColor: colors.gold },
});
