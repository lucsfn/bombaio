import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/theme/art';
import { colors, pressedOffset, radius, space } from '@/theme/tokens';

export type IconButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  disabled?: boolean;
};

export function IconButton({ icon, accessibilityLabel, onPress, disabled = false }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={styles.root}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.face,
            disabled ? styles.faceDisabled : null,
            pressed && !disabled ? styles.facePressed : null,
          ]}
        >
          <Icon name={icon} size={32} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: space.ctlHeight,
    height: space.ctlHeight,
  },
  face: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.slate,
    borderWidth: space.px,
    borderBottomWidth: space.s1,
    borderColor: colors.iron,
    borderBottomColor: colors.ironDeep,
    borderRadius: radius.sm,
  },
  faceDisabled: {
    backgroundColor: colors.surface3,
    borderColor: colors.bevel,
    opacity: 0.5,
  },
  facePressed: {
    transform: [{ translateY: pressedOffset }],
  },
});
