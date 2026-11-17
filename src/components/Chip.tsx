import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import type { IconName } from '@/theme/art';
import { colors, pressedOffset, radius, space } from '@/theme/tokens';

export type ChipProps = {
  label: string;
  selected?: boolean;
  icon?: IconName;
  onPress?: () => void;
};

export function Chip({ label, selected = false, icon, onPress }: ChipProps) {
  const content = (
    <>
      {icon ? <Icon name={icon} size={32} /> : null}
      <Text variant="label" tone={selected ? 'rune' : 'ink'}>
        {label}
      </Text>
    </>
  );

  if (!onPress) {
    return <View style={[styles.chip, selected ? styles.selected : null]}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.chip, selected ? styles.selected : null, pressed ? styles.pressed : null]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: space.tapMin,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.s1,
    paddingHorizontal: space.s3,
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  selected: { borderColor: colors.rune },
  pressed: { transform: [{ translateY: pressedOffset }] },
});
