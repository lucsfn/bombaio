import { StyleSheet, View } from 'react-native';
import { IconButton } from '@/components/IconButton';
import { Text } from '@/components/Text';
import type { IconName } from '@/theme/art';
import { colors, space } from '@/theme/tokens';

export type ScreenHeaderAction = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
};

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: ScreenHeaderAction;
};

export function ScreenHeader({ title, subtitle, onBack, action }: ScreenHeaderProps) {
  return (
    <View style={styles.root}>
      {onBack ? <IconButton icon="back" accessibilityLabel="Voltar" onPress={onBack} /> : null}
      <View style={styles.text}>
        <Text variant="display3" numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="label" tone="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action ? (
        <IconButton icon={action.icon} accessibilityLabel={action.accessibilityLabel} onPress={action.onPress} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
    paddingHorizontal: space.s4,
    paddingVertical: space.s2,
    backgroundColor: colors.slate,
    borderBottomWidth: space.px,
    borderBottomColor: colors.iron,
  },
  text: { flex: 1, gap: space.px },
});
