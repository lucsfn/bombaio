import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { colors, pressedOffset, radius, space } from '@/theme/tokens';

export type ZoomButtonProps = {
  glyph: string;
  accessibilityLabel: string;
  onPress: () => void;
};

export function ZoomButton({ glyph, accessibilityLabel, onPress }: ZoomButtonProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={styles.root}>
      {({ pressed }) => (
        <View style={[styles.face, pressed ? styles.pressed : null]}>
          <Text variant="display3" align="center">
            {glyph}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { width: space.tapMin, height: space.tapMin },
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
  pressed: { transform: [{ translateY: pressedOffset }] },
});
