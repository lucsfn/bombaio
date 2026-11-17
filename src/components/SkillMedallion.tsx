import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { ornaments, skills128, skills32, type SkillArtName } from '@/theme/art';
import { colors, gameSizes, radius, shadows, space } from '@/theme/tokens';

export type SkillState = 'validated' | 'current' | 'available' | 'seed';

export type SkillMedallionProps = {
  skill: SkillArtName;
  name: string;
  state: SkillState;
  level?: number;
  size?: 'small' | 'large';
  onPress?: () => void;
};

const rings = {
  validated: ornaments.nodeValidated,
  current: ornaments.nodeCurrent,
  available: ornaments.nodeAvailable,
  seed: ornaments.nodeLocked,
} as const;

const stateLabels: Record<SkillState, string> = {
  validated: 'validada',
  current: 'em foco',
  available: 'disponível',
  seed: 'semente',
};

export function SkillMedallion({ skill, name, state, level, size = 'small', onPress }: SkillMedallionProps) {
  const large = size === 'large';
  const dimension = large ? gameSizes.medallionLarge : gameSizes.medallionSmall;
  const glow = state === 'validated' ? shadows.glowRune : state === 'current' ? shadows.glowGold : null;
  const label = name + ', ' + stateLabels[state] + (level !== undefined ? ', nível ' + level : '');

  const body = (
    <View style={[{ width: dimension, height: dimension }, glow]}>
      <Image source={rings[state]} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
      <View style={[styles.center, state === 'seed' ? styles.seed : null]}>
        <Image
          source={large ? skills128[skill] : skills32[skill]}
          style={large ? styles.artLarge : styles.artSmall}
          contentFit="contain"
          accessible={false}
        />
      </View>
      {state === 'seed' ? (
        <View style={styles.lock}>
          <Icon name="lock" size={32} />
        </View>
      ) : null}
      {level !== undefined && state !== 'seed' ? (
        <View style={[styles.level, state === 'validated' ? styles.levelValidated : null]}>
          <Text variant="labelSm" tone={state === 'validated' ? 'ink' : 'onGold'}>
            {level}
          </Text>
        </View>
      ) : null}
      {state === 'validated' ? (
        <View style={styles.check}>
          <Icon name="check" size={32} />
        </View>
      ) : null}
    </View>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityRole="image" accessibilityLabel={label}>
        {body}
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={space.s1}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  seed: { opacity: gameSizes.seedOpacity },
  artSmall: { width: gameSizes.medallionSmall / 2, height: gameSizes.medallionSmall / 2 },
  artLarge: { width: gameSizes.medallionLarge / 2, height: gameSizes.medallionLarge / 2 },
  lock: { position: 'absolute', right: -space.s1, bottom: -space.s1 },
  level: {
    position: 'absolute',
    left: -space.px,
    bottom: -space.px,
    minWidth: gameSizes.levelBadge,
    height: gameSizes.levelBadge,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    borderWidth: space.px,
    borderColor: colors.outline,
    borderRadius: radius.sm,
  },
  levelValidated: { backgroundColor: colors.runeDeep },
  check: { position: 'absolute', right: -space.s2, top: -space.s2, transform: [{ scale: 0.75 }] },
});
