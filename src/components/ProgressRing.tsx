import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '@/components/Text';
import { colors, gameSizes } from '@/theme/tokens';

export type ProgressRingTone = 'gold' | 'rune' | 'ember' | 'arcane';

export type ProgressRingProps = {
  value: number;
  max: number;
  label: string;
  size?: 64 | 96 | 128;
  tone?: ProgressRingTone;
};

const toneColors: Record<ProgressRingTone, string> = {
  gold: colors.gold,
  rune: colors.rune,
  ember: colors.ember,
  arcane: colors.arcane,
};

export function ProgressRing({ value, max, label, size = 96, tone = 'gold' }: ProgressRingProps) {
  const safeMax = max > 0 ? max : 1;
  const ratio = Math.max(0, Math.min(1, value / safeMax));
  const radiusValue = (size - gameSizes.ringStroke) / 2;
  const circumference = 2 * Math.PI * radiusValue;
  const center = size / 2;

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: safeMax, now: Math.min(value, safeMax) }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radiusValue}
          stroke={colors.surface3}
          strokeWidth={gameSizes.ringStroke}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radiusValue}
          stroke={toneColors[tone]}
          strokeWidth={gameSizes.ringStroke}
          strokeDasharray={circumference + ' ' + circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          strokeLinecap="butt"
          fill="none"
          transform={'rotate(-90 ' + center + ' ' + center + ')'}
        />
      </Svg>
      <View style={styles.center}>
        <Text variant={size === 64 ? 'labelSm' : 'display4'}>{Math.round(ratio * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
