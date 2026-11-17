import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { colors, gameSizes, radius, space } from '@/theme/tokens';

export type XPBarProps = {
  value: number;
  max: number;
  label?: string;
  level?: number;
};

export function XPBar({ value, max, label = 'XP', level }: XPBarProps) {
  const safeMax = max > 0 ? max : 1;
  const ratio = Math.max(0, Math.min(1, value / safeMax));

  return (
    <View
      style={styles.root}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: safeMax, now: Math.min(value, safeMax), text: value + ' de ' + max + ' XP' }}
    >
      <View style={styles.header}>
        <Text variant="label" tone="muted" uppercase>
          {label}
        </Text>
        <Text variant="label" tone="gold">
          {value}/{max}
        </Text>
      </View>
      <View style={styles.line}>
        {level !== undefined ? (
          <View style={styles.levelBadge}>
            <Text variant="labelSm" tone="onGold">
              {level}
            </Text>
          </View>
        ) : null}
        <View style={styles.track}>
          <View style={[styles.fill, { flex: ratio }]} />
          <View style={{ flex: 1 - ratio }} />
          {gameSizes.xpTicks.map((tick) => (
            <View key={tick} style={[styles.tick, { left: tick * 100 + '%' }]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'stretch', gap: space.s1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  line: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  levelBadge: {
    minWidth: gameSizes.levelBadge,
    height: gameSizes.levelBadge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.s1,
    backgroundColor: colors.gold,
    borderWidth: space.px,
    borderColor: colors.goldDeep,
    borderRadius: radius.sm,
  },
  track: {
    flex: 1,
    height: gameSizes.xpBarHeight,
    flexDirection: 'row',
    backgroundColor: colors.surface3,
    borderWidth: space.px,
    borderColor: colors.outline,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.gold,
    borderBottomWidth: space.px,
    borderBottomColor: colors.goldDeep,
  },
  tick: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: space.px / 2,
    backgroundColor: colors.outline,
  },
});
