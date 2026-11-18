import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { SkillMedallion, type SkillState } from '@/components/SkillMedallion';
import type { SkillArtName } from '@/theme/art';
import { gameSizes } from '@/theme/tokens';

export type TreeNodeProps = {
  id: string;
  name: string;
  art: SkillArtName;
  state: SkillState;
  level?: number;
  left: number;
  top: number;
  baseScale: number;
  dimmed: boolean;
  zoom: SharedValue<number>;
  onSelect: (id: string) => void;
};

const zoomDamping = 0.8;
const dimmedOpacity = 0.25;
const half = gameSizes.medallionSmall / 2;

export const TreeNode = memo(function TreeNode({
  id,
  name,
  art,
  state,
  level,
  left,
  top,
  baseScale,
  dimmed,
  zoom,
  onSelect,
}: TreeNodeProps) {
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: baseScale * Math.pow(zoom.get(), -zoomDamping) }],
  }));

  return (
    <Animated.View
      style={[styles.node, { left: left - half, top: top - half }, dimmed ? styles.dimmed : null, scaleStyle]}
    >
      <SkillMedallion
        skill={art}
        name={name}
        state={state}
        level={state === 'seed' ? undefined : level}
        onPress={() => onSelect(id)}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  node: { position: 'absolute', width: gameSizes.medallionSmall, height: gameSizes.medallionSmall },
  dimmed: { opacity: dimmedOpacity },
});
