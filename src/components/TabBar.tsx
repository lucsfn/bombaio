import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import type { IconName } from '@/theme/art';
import { colors, layout, space } from '@/theme/tokens';

export type TabBarItem<Key extends string> = {
  key: Key;
  label: string;
  icon: IconName;
  hasNews?: boolean;
};

export type TabBarProps<Key extends string> = {
  items: readonly TabBarItem<Key>[];
  activeKey: Key;
  onSelect: (key: Key) => void;
};

export function TabBar<Key extends string>({ items, activeKey, onSelect }: TabBarProps<Key>) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]} accessibilityRole="tablist">
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            accessibilityRole="tab"
            accessibilityLabel={item.hasNews ? `${item.label}, novidade` : item.label}
            accessibilityState={{ selected: active }}
            style={styles.tab}
          >
            <View style={[styles.indicator, active ? styles.indicatorActive : null]} />
            <View style={active ? null : styles.inactiveIcon}>
              <Icon name={item.icon} size={32} />
            </View>
            {item.hasNews ? <View style={styles.dot} /> : null}
            <Text variant="labelSm" tone={active ? 'gold' : 'dim'}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface1,
    borderTopWidth: space.px,
    borderTopColor: colors.iron,
  },
  tab: {
    flex: 1,
    minHeight: layout.tabBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.px,
    paddingBottom: space.s1,
  },
  indicator: {
    alignSelf: 'stretch',
    height: layout.tabIndicator,
    marginBottom: space.s1,
  },
  indicatorActive: { backgroundColor: colors.gold },
  inactiveIcon: { opacity: layout.inactiveIconOpacity },
  dot: {
    position: 'absolute',
    top: space.s2,
    right: '30%',
    width: space.s2,
    height: space.s2,
    backgroundColor: colors.blood,
    borderWidth: space.px / 2,
    borderColor: colors.outline,
  },
});
