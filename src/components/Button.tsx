import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import type { IconName } from '@/theme/art';
import { colors, controlSizes, pressedOffset, radius, space } from '@/theme/tokens';

export type ButtonVariant = 'gold' | 'iron';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  variant = 'iron',
  icon,
  disabled = false,
  loading = false,
  accessibilityHint,
}: ButtonProps) {
  const inactive = disabled || loading;
  const faceStyle = inactive ? styles.faceDisabled : variant === 'gold' ? styles.faceGold : styles.faceIron;
  const tone = inactive ? 'muted' : variant === 'gold' ? 'onGold' : 'ink';

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={styles.root}
    >
      {({ pressed }) => (
        <>
          {inactive ? null : <View style={styles.shadow} />}
          <View style={[styles.face, faceStyle, pressed && !inactive ? styles.facePressed : null]}>
            {loading ? (
              <ActivityIndicator color={colors.inkMuted} />
            ) : icon ? (
              <Icon name={icon} size={32} />
            ) : null}
            <Text variant="display5" tone={tone}>
              {label}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    height: space.ctlHeight + controlSizes.hardShadow,
    alignSelf: 'stretch',
  },
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: controlSizes.hardShadow,
    height: space.ctlHeight,
    backgroundColor: colors.outline,
    borderRadius: radius.sm,
  },
  face: {
    height: space.ctlHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.s2,
    paddingHorizontal: space.s4,
    borderWidth: space.px,
    borderBottomWidth: space.s1,
    borderColor: colors.outline,
    borderRadius: radius.sm,
  },
  faceGold: {
    backgroundColor: colors.gold,
    borderBottomColor: colors.goldDeep,
  },
  faceIron: {
    backgroundColor: colors.slate,
    borderColor: colors.iron,
    borderBottomColor: colors.ironDeep,
  },
  faceDisabled: {
    backgroundColor: colors.surface3,
    borderColor: colors.bevel,
    transform: [{ translateY: controlSizes.hardShadow }],
  },
  facePressed: {
    transform: [{ translateY: pressedOffset }],
  },
});
