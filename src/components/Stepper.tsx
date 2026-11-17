import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { colors, gameSizes, space } from '@/theme/tokens';

export type StepperProps = {
  steps: readonly string[];
  current: number;
};

export function Stepper({ steps, current }: StepperProps) {
  return (
    <View
      style={styles.root}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={'Etapa ' + (current + 1) + ' de ' + steps.length + ': ' + (steps[current] ?? '')}
    >
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <View key={step} style={styles.step}>
            <View style={styles.track}>
              <View style={[styles.bar, index === 0 ? styles.hidden : null, index <= current ? styles.barDone : null]} />
              <View style={[styles.dot, done ? styles.dotDone : null, active ? styles.dotActive : null]}>
                <Text variant="labelSm" tone={done ? 'onGold' : active ? 'gold' : 'dim'}>
                  {index + 1}
                </Text>
              </View>
              <View
                style={[
                  styles.bar,
                  index === steps.length - 1 ? styles.hidden : null,
                  index < current ? styles.barDone : null,
                ]}
              />
            </View>
            <Text variant="labelSm" tone={active ? 'ink' : 'dim'} align="center" numberOfLines={2}>
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignSelf: 'stretch' },
  step: { flex: 1, alignItems: 'center', gap: space.s1 },
  track: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' },
  bar: { flex: 1, height: space.px, backgroundColor: colors.surface3 },
  barDone: { backgroundColor: colors.gold },
  hidden: { opacity: 0 },
  dot: {
    width: gameSizes.stepDot,
    height: gameSizes.stepDot,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderColor: colors.bevel,
  },
  dotDone: { backgroundColor: colors.gold, borderColor: colors.goldDeep },
  dotActive: { borderColor: colors.gold },
});
