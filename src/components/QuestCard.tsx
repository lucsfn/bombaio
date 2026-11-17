import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { skills32, type SkillArtName } from '@/theme/art';
import { colors, iconSizes, pressedOffset, radius, space } from '@/theme/tokens';

export type QuestCardProps = {
  kicker: string;
  title: string;
  xp: number;
  description?: string;
  skill?: SkillArtName;
  done?: boolean;
  onPress?: () => void;
};

export function QuestCard({ kicker, title, xp, description, skill, done = false, onPress }: QuestCardProps) {
  const content = (
    <>
      <View style={[styles.stripe, done ? styles.stripeDone : null]} />
      {skill ? (
        <Image source={skills32[skill]} style={styles.art} contentFit="contain" accessible={false} />
      ) : done ? (
        <Icon name="check" size={32} />
      ) : null}
      <View style={styles.text}>
        <Text variant="labelSm" tone={done ? 'leaf' : 'ember'} uppercase>
          {kicker}
        </Text>
        <Text variant="display5">{title}</Text>
        {description ? (
          <Text variant="bodySm" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      {xp > 0 ? (
        <View style={[styles.reward, done ? styles.rewardDone : null]}>
          <Text variant="label" tone={done ? 'muted' : 'onGold'}>
            +{xp} XP
          </Text>
        </View>
      ) : null}
    </>
  );

  const spoken = kicker + ': ' + title + (xp > 0 ? ', mais ' + xp + ' XP' : '') + (done ? ', concluída' : '');

  if (!onPress || done) {
    return (
      <View style={styles.card} accessible accessibilityLabel={spoken}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={spoken}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: space.gapIcon,
    paddingRight: space.s3,
    paddingVertical: space.s3,
    backgroundColor: colors.surface1,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  stripe: { alignSelf: 'stretch', width: space.s1, backgroundColor: colors.ember, marginVertical: -space.s3 },
  stripeDone: { backgroundColor: colors.leaf },
  art: { width: iconSizes.ui, height: iconSizes.ui },
  text: { flex: 1, gap: space.px },
  reward: {
    paddingHorizontal: space.s2,
    paddingVertical: space.px,
    backgroundColor: colors.gold,
    borderWidth: space.px,
    borderColor: colors.goldDeep,
    borderRadius: radius.sm,
  },
  rewardDone: { backgroundColor: colors.surface3, borderColor: colors.bevel },
  pressed: { transform: [{ translateY: pressedOffset }] },
});
