import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { controlSizes, space } from '@/theme/tokens';

export type ChoiceRowProps = {
  label: string;
  checked: boolean;
  onPress: () => void;
  role: 'checkbox' | 'radio' | 'switch';
  art: ImageSource;
  artPlacement: 'start' | 'end';
  artSize: 'square' | 'wide';
  disabled?: boolean;
};

export function ChoiceRow({
  label,
  checked,
  onPress,
  role,
  art,
  artPlacement,
  artSize,
  disabled = false,
}: ChoiceRowProps) {
  const image = (
    <Image
      source={art}
      style={artSize === 'wide' ? styles.artWide : styles.artSquare}
      contentFit="contain"
      accessible={false}
    />
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      style={[styles.root, disabled ? styles.disabled : null]}
    >
      {artPlacement === 'start' ? image : null}
      <View style={styles.label}>
        <Text variant="body" tone={disabled ? 'dim' : 'ink'}>
          {label}
        </Text>
      </View>
      {artPlacement === 'end' ? image : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: space.tapMin,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.gapIcon,
    alignSelf: 'stretch',
  },
  label: { flexShrink: 1, flexGrow: 1 },
  artSquare: { width: controlSizes.check, height: controlSizes.check },
  artWide: { width: controlSizes.toggleWidth, height: controlSizes.toggleHeight },
  disabled: { opacity: 0.5 },
});
