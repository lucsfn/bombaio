import { useCallback, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Image } from 'expo-image';
import { GestureDetector, usePanGesture, usePinchGesture, useSimultaneousGestures } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { G, Line } from 'react-native-svg';
import type { SkillState } from '@/components/SkillMedallion';
import { TreeNode } from '@/components/SkillTree/TreeNode';
import { ZoomButton } from '@/components/SkillTree/ZoomButton';
import type { PlacedSkill, TreeSkill } from '@/components/SkillTree/layout';
import { useReducedMotion } from '@/components/useReducedMotion';
import { ornaments, trees, type SkillArtName } from '@/theme/art';
import { colors, durations, gameSizes, space } from '@/theme/tokens';
import { treeViewBox, type TreeSpec } from '@/theme/trees';

export type CanvasSkill = TreeSkill & { art: SkillArtName };

export type TreeCanvasProps = {
  tree: TreeSpec;
  nodes: PlacedSkill<CanvasSkill>[];
  slotSize: number;
  openArea: string | null;
  onSelectSkill: (id: string) => void;
};

const minZoom = 1;
const maxZoom = 4;
const zoomStep = 1.5;
const heroSize = 34;

const veinColors: Record<SkillState, string> = {
  validated: colors.rune,
  current: colors.gold,
  available: colors.arcane,
  seed: colors.inkDim,
};

function clampZoom(value: number) {
  'worklet';
  return Math.min(maxZoom, Math.max(minZoom, value));
}

function clampOffset(offset: number, zoom: number, size: number) {
  'worklet';
  return Math.min(0, Math.max(size - zoom * size, offset));
}

export function TreeCanvas({ tree, nodes, slotSize, openArea, onSelectSkill }: TreeCanvasProps) {
  const [size, setSize] = useState(0);
  const reducedMotion = useReducedMotion();
  const zoom = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const startZoom = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const unit = size / treeViewBox;
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const focusNodes = openArea ? nodes.filter((node) => node.area === openArea) : nodes;

  const onLayout = useCallback((event: LayoutChangeEvent) => setSize(event.nativeEvent.layout.width), []);

  const pinch = usePinchGesture({
    onActivate: () => {
      'worklet';
      startZoom.set(zoom.get());
      startX.set(offsetX.get());
      startY.set(offsetY.get());
    },
    onUpdate: (event) => {
      'worklet';
      const next = clampZoom(startZoom.get() * event.scale);
      const pointX = (event.focalX - startX.get()) / startZoom.get();
      const pointY = (event.focalY - startY.get()) / startZoom.get();
      zoom.set(next);
      offsetX.set(clampOffset(event.focalX - next * pointX, next, size));
      offsetY.set(clampOffset(event.focalY - next * pointY, next, size));
    },
  });

  const pan = usePanGesture({
    minPointers: 1,
    onActivate: () => {
      'worklet';
      startX.set(offsetX.get());
      startY.set(offsetY.get());
    },
    onUpdate: (event) => {
      'worklet';
      offsetX.set(clampOffset(startX.get() + event.translationX, zoom.get(), size));
      offsetY.set(clampOffset(startY.get() + event.translationY, zoom.get(), size));
    },
  });

  const gestures = useSimultaneousGestures(pinch, pan);

  const sceneStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.get() }, { translateY: offsetY.get() }, { scale: zoom.get() }],
  }));

  const animateTo = (nextZoom: number) => {
    const target = clampZoom(nextZoom);
    const count = Math.max(1, focusNodes.length);
    const pointX = (focusNodes.reduce((sum, node) => sum + node.x, 0) / count) * unit || size / 2;
    const pointY = (focusNodes.reduce((sum, node) => sum + node.y, 0) / count) * unit || size / 2;
    const nextX = target === minZoom ? 0 : clampOffset(size / 2 - target * pointX, target, size);
    const nextY = target === minZoom ? 0 : clampOffset(size / 2 - target * pointY, target, size);
    if (reducedMotion) {
      zoom.set(target);
      offsetX.set(nextX);
      offsetY.set(nextY);
      return;
    }
    const timing = { duration: durations.slow };
    zoom.set(withTiming(target, timing));
    offsetX.set(withTiming(nextX, timing));
    offsetY.set(withTiming(nextY, timing));
  };

  const baseScale = (slotSize * unit) / gameSizes.medallionSmall;

  return (
    <View style={styles.root}>
      <GestureDetector gesture={gestures}>
        <View style={styles.viewport} onLayout={onLayout} accessibilityLabel={'Árvore ' + tree.name}>
          {size > 0 ? (
            <Animated.View style={[styles.scene, { width: size, height: size }, sceneStyle]}>
              <Image
                source={trees[tree.n - 1]}
                style={StyleSheet.absoluteFill}
                contentFit="contain"
                accessible={false}
              />
              <Svg
                width={size}
                height={size}
                viewBox={'0 0 ' + treeViewBox + ' ' + treeViewBox}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              >
                {nodes.map((node) => {
                  const parent = node.parentId ? byId.get(node.parentId) : undefined;
                  if (!parent) return null;
                  const dimmed = openArea !== null && node.area !== openArea;
                  const seed = node.state === 'seed';
                  return (
                    <G key={node.id}>
                      <Line
                        x1={parent.x}
                        y1={parent.y}
                        x2={node.x}
                        y2={node.y}
                        stroke={colors.outline}
                        strokeWidth={seed ? 5 : 6}
                        strokeLinecap="round"
                        strokeOpacity={dimmed ? 0.25 : 1}
                      />
                      <Line
                        x1={parent.x}
                        y1={parent.y}
                        x2={node.x}
                        y2={node.y}
                        stroke={veinColors[node.state]}
                        strokeWidth={seed ? 2 : 3}
                        strokeDasharray={seed ? '3 5' : undefined}
                        strokeLinecap="round"
                        strokeOpacity={dimmed ? 0.25 : 1}
                      />
                    </G>
                  );
                })}
              </Svg>
              <View
                style={[
                  styles.hero,
                  { left: (treeViewBox / 2) * unit - heroSize / 2, top: (tree.ground - 4) * unit - heroSize / 2 },
                ]}
              >
                <Image source={ornaments.avatarHero} style={styles.heroArt} contentFit="cover" accessible={false} />
              </View>
              {nodes.map((node) => (
                <TreeNode
                  key={node.id}
                  id={node.id}
                  name={node.name}
                  art={node.art}
                  state={node.state}
                  level={node.level}
                  left={node.x * unit}
                  top={node.y * unit}
                  baseScale={baseScale}
                  dimmed={openArea !== null && node.area !== openArea}
                  zoom={zoom}
                  onSelect={onSelectSkill}
                />
              ))}
            </Animated.View>
          ) : null}
        </View>
      </GestureDetector>
      <View style={styles.controls}>
        <ZoomButton glyph="+" accessibilityLabel="Aproximar" onPress={() => animateTo(zoom.get() * zoomStep)} />
        <ZoomButton glyph="−" accessibilityLabel="Afastar" onPress={() => animateTo(zoom.get() / zoomStep)} />
        <ZoomButton glyph="⤢" accessibilityLabel="Ver a árvore inteira" onPress={() => animateTo(minZoom)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'stretch' },
  viewport: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: colors.void,
    borderWidth: space.px,
    borderColor: colors.bevel,
  },
  scene: { position: 'absolute', left: 0, top: 0, transformOrigin: 'left top' },
  hero: {
    position: 'absolute',
    width: heroSize,
    height: heroSize,
    borderWidth: space.px,
    borderColor: colors.gold,
    backgroundColor: colors.surface1,
    overflow: 'hidden',
  },
  heroArt: { width: '100%', height: '100%' },
  controls: { position: 'absolute', right: space.s2, top: space.s2, gap: space.s2 },
});
