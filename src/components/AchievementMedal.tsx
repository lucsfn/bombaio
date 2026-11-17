import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { ornaments, type IconName } from '@/theme/art';
import { gameSizes, space } from '@/theme/tokens';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'obsidian' | 'locked';

export type AchievementMedalProps = {
  tier: AchievementTier;
  title: string;
  icon?: IconName;
  hint?: string;
};

const medals = {
  bronze: ornaments.achBronze,
  silver: ornaments.achSilver,
  gold: ornaments.achGold,
  obsidian: ornaments.achObsidian,
  locked: ornaments.achLocked,
} as const;

const tierLabels: Record<AchievementTier, string> = {
  bronze: 'bronze',
  silver: 'prata',
  gold: 'ouro',
  obsidian: 'obsidiana',
  locked: 'bloqueada',
};

export function AchievementMedal({ tier, title, icon, hint }: AchievementMedalProps) {
  const locked = tier === 'locked';
  const spoken = title + ', conquista ' + tierLabels[tier] + (locked && hint ? ', ' + hint : '');

  return (
    <View style={styles.root} accessible accessibilityRole="image" accessibilityLabel={spoken}>
      <View style={styles.medal}>
        <Image source={medals[tier]} style={StyleSheet.absoluteFill} contentFit="contain" accessible={false} />
        {!locked && icon ? (
          <View style={styles.coin}>
            <Icon name={icon} size={32} />
          </View>
        ) : null}
      </View>
      <Text variant="label" tone={locked ? 'dim' : 'ink'} align="center" numberOfLines={2}>
        {title}
      </Text>
      {locked && hint ? (
        <Text variant="labelSm" tone="dim" align="center">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: gameSizes.medal, alignItems: 'center', gap: space.s1 },
  medal: { width: gameSizes.medal, height: gameSizes.medal },
  coin: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: gameSizes.medal * 0.4,
    height: gameSizes.medal * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
