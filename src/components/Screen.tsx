import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors, space } from '@/theme/tokens';

export type ScreenProps = {
  children: ReactNode;
  header?: ReactNode;
  scroll?: boolean;
  bottomInset?: 'safe' | 'none';
};

export function Screen({ children, header, scroll = true, bottomInset = 'safe' }: ScreenProps) {
  const edges: Edge[] = bottomInset === 'safe' ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right'];

  return (
    <SafeAreaView style={styles.root} edges={edges}>
      {header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  content: { padding: space.s4, gap: space.s6 },
  fill: { flex: 1 },
});
