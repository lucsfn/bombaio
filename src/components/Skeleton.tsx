import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '@/components/useReducedMotion';
import { colors, layout, radius, space } from '@/theme/tokens';

export type SkeletonShape = 'line' | 'block' | 'row';

export type SkeletonProps = {
  shape?: SkeletonShape;
};

export function Skeleton({ shape = 'line' }: SkeletonProps) {
  const reducedMotion = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reducedMotion) {
      opacity.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: layout.disabledOpacity,
          duration: layout.skeletonPulse,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, { toValue: 1, duration: layout.skeletonPulse, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [reducedMotion, opacity]);

  return (
    <Animated.View
      style={[styles.base, shapes[shape], { opacity }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando"
    >
      {shape === 'row' ? (
        <>
          <View style={styles.socket} />
          <View style={styles.rowLines}>
            <View style={styles.rowLine} />
            <View style={[styles.rowLine, styles.rowLineShort]} />
          </View>
        </>
      ) : null}
    </Animated.View>
  );
}

const shapes = StyleSheet.create({
  line: { height: space.s4, width: '70%' },
  block: { height: space.s8 * 4 },
  row: {
    height: space.ctlHeight + space.s4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.gapIcon,
    padding: space.s3,
  },
});

const styles = StyleSheet.create({
  base: { alignSelf: 'stretch', backgroundColor: colors.surface2, borderRadius: radius.sm },
  socket: { width: layout.socket, height: layout.socket, backgroundColor: colors.surface3 },
  rowLines: { flex: 1, gap: space.s2 },
  rowLine: { height: space.s3, backgroundColor: colors.surface3 },
  rowLineShort: { width: '50%' },
});
