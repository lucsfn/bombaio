import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import type { IconName } from '@/theme/art';
import { space } from '@/theme/tokens';

export type EmptyStateProps = {
  icon: IconName;
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.root}>
      <Icon name={icon} size={128} />
      <Text variant="display4" align="center">
        {title}
      </Text>
      <Text variant="body" tone="muted" align="center">
        {message}
      </Text>
      {action ? (
        <View style={styles.action}>
          <Button label={action.label} onPress={action.onPress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: space.s3, paddingVertical: space.s6, paddingHorizontal: space.s4 },
  action: { alignSelf: 'stretch', marginTop: space.s2 },
});
