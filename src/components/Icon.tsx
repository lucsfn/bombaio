import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { icons128, icons32, type IconName } from '@/theme/art';
import { iconSizes } from '@/theme/tokens';

export type IconSize = 32 | 128;

export type IconProps = {
  name: IconName;
  size?: IconSize;
};

export function Icon({ name, size = iconSizes.ui }: IconProps) {
  const source = size === iconSizes.art ? icons128[name] : icons32[name];
  return (
    <Image
      source={source}
      style={size === iconSizes.art ? styles.art : styles.ui}
      contentFit="contain"
      accessible={false}
    />
  );
}

const styles = StyleSheet.create({
  ui: { width: iconSizes.ui, height: iconSizes.ui },
  art: { width: iconSizes.art, height: iconSizes.art },
});
