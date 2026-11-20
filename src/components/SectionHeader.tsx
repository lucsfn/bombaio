import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { space } from '@/theme/tokens';

export type SectionHeaderProps = {
  title: string;
  action?: { label: string; onPress: () => void };
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.root}>
      <Text variant="display4" accessibilityRole="header">
        {title}
      </Text>
      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="link"
          accessibilityLabel={action.label}
          hitSlop={space.s3}
          style={styles.action}
        >
          <Text variant="label" tone="mana">
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s2 },
  action: { minHeight: space.tapMin, justifyContent: 'center' },
});
