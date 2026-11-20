import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { colors, layout, radius, space } from '@/theme/tokens';

export type SegmentedProps<Key extends string> = {
  items: readonly { key: Key; label: string }[];
  value: Key;
  onChange: (key: Key) => void;
};

export function Segmented<Key extends string>({ items, value, onChange }: SegmentedProps<Key>) {
  return (
    <View style={styles.root} accessibilityRole="tablist">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            style={[styles.item, active ? styles.itemActive : null]}
          >
            <Text variant="label" tone={active ? 'gold' : 'muted'} align="center" numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: space.px,
    gap: space.px,
    backgroundColor: colors.surface1,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  item: {
    flex: 1,
    minHeight: space.ctlHeight - space.s1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.s2,
    borderBottomWidth: layout.tabIndicator,
    borderBottomColor: colors.surface1,
  },
  itemActive: { backgroundColor: colors.surface2, borderBottomColor: colors.gold },
});
