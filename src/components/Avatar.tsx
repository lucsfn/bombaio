import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { ornaments } from '@/theme/art';
import { colors, gameSizes, radius, space } from '@/theme/tokens';

export type AvatarSize = 64 | 96 | 128;

export type AvatarProps = {
  name: string;
  size?: AvatarSize;
  level?: number;
};

export function Avatar({ name, size = 96, level }: AvatarProps) {
  return (
    <View
      style={[styles.frame, { width: size, height: size }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={name + (level !== undefined ? ', nível ' + level : '')}
    >
      <Image source={ornaments.avatarHero} style={styles.art} contentFit="cover" accessible={false} />
      {level !== undefined ? (
        <View style={styles.level}>
          <Text variant="labelSm" tone="onGold">
            {level}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.arcaneDeep,
    borderWidth: space.px,
    borderColor: colors.brass,
    borderRadius: radius.sm,
  },
  art: { width: '100%', height: '100%' },
  level: {
    position: 'absolute',
    right: -space.s1,
    bottom: -space.s1,
    minWidth: gameSizes.levelBadge,
    height: gameSizes.levelBadge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.s1,
    backgroundColor: colors.gold,
    borderWidth: space.px,
    borderColor: colors.outline,
    borderRadius: radius.sm,
  },
});
