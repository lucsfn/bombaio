import type { ReactNode } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { skills32, type IconName, type SkillArtName } from '@/theme/art';
import { colors, iconSizes, layout, pressedOffset, radius, space } from '@/theme/tokens';

export type ListRowLeading = { kind: 'icon'; name: IconName } | { kind: 'skill'; name: SkillArtName };

export type ListRowProps = {
  title: string;
  subtitle?: string;
  leading?: ListRowLeading;
  value?: string;
  trailing?: ReactNode;
  onPress?: () => void;
};

export function ListRow({ title, subtitle, leading, value, trailing, onPress }: ListRowProps) {
  const content = (
    <>
      {leading ? (
        <View style={styles.socket}>
          {leading.kind === 'icon' ? (
            <Icon name={leading.name} size={32} />
          ) : (
            <Image source={skills32[leading.name]} style={styles.skillArt} contentFit="contain" accessible={false} />
          )}
        </View>
      ) : null}
      <View style={styles.text}>
        <Text variant="display5" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySm" tone="muted" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {value ? (
        <Text variant="label" tone="gold">
          {value}
        </Text>
      ) : null}
      {onPress ? <Icon name="next" size={32} /> : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  const label = [title, subtitle, value].filter(Boolean).join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: space.ctlHeight + space.s4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: space.gapIcon,
    padding: space.s3,
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  socket: {
    width: layout.socket,
    height: layout.socket,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface3,
    borderWidth: space.px,
    borderColor: colors.outline,
    borderRadius: radius.sm,
  },
  skillArt: { width: iconSizes.ui, height: iconSizes.ui },
  text: { flex: 1, gap: space.px },
  pressed: { transform: [{ translateY: pressedOffset }] },
});
