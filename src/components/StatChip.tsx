import { StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Text, type TextTone } from '@/components/Text';
import type { IconName } from '@/theme/art';
import { colors, radius, space } from '@/theme/tokens';

export type StatKind = 'streak' | 'xp' | 'title';

export type StatChipProps = {
  kind: StatKind;
  value: string;
  label: string;
};

const kinds: Record<StatKind, { icon: IconName; tone: TextTone; color: string }> = {
  streak: { icon: 'flame', tone: 'ember', color: colors.ember },
  xp: { icon: 'star', tone: 'gold', color: colors.gold },
  title: { icon: 'trophy', tone: 'arcane', color: colors.arcaneGlow },
};

export function StatChip({ kind, value, label }: StatChipProps) {
  const spec = kinds[kind];

  return (
    <View style={styles.chip} accessible accessibilityRole="text" accessibilityLabel={value + ' ' + label}>
      <View style={[styles.stripe, { backgroundColor: spec.color }]} />
      <Icon name={spec.icon} size={32} />
      <View style={styles.text}>
        <Text variant="display4" tone={spec.tone}>
          {value}
        </Text>
        <Text variant="labelSm" tone="muted" numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    paddingVertical: space.s2,
    paddingRight: space.s2,
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  stripe: { alignSelf: 'stretch', width: space.s1 },
  text: { flexShrink: 1 },
});
