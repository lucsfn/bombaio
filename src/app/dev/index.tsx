import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space, type ColorToken } from '@/theme/tokens';
import { typography, type TypographyVariant } from '@/theme/typography';

const typeSamples: TypographyVariant[] = [
  'display1',
  'display2',
  'display3',
  'display4',
  'display5',
  'label',
  'labelSm',
  'body',
  'bodySm',
  'bodyStrong',
];

const swatches: ColorToken[] = [
  'void',
  'surface1',
  'surface2',
  'surface3',
  'ink',
  'inkMuted',
  'gold',
  'rune',
  'arcane',
  'ember',
  'leaf',
  'mana',
  'blood',
  'locked',
];

export default function DevShowcase() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.display1, styles.ink]}>Vitrine</Text>
        {typeSamples.map((variant) => (
          <Text key={variant} style={[typography[variant], styles.ink]}>
            {variant} · Bombaio
          </Text>
        ))}
        <View style={styles.swatchGrid}>
          {swatches.map((token) => (
            <View key={token} style={styles.swatchItem}>
              <View style={[styles.swatch, { backgroundColor: colors[token] }]} />
              <Text style={[typography.labelSm, styles.muted]}>{token}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.void },
  content: { padding: space.s4, gap: space.s3 },
  ink: { color: colors.ink },
  muted: { color: colors.inkMuted },
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s3 },
  swatchItem: { alignItems: 'center', gap: space.s1 },
  swatch: {
    width: space.ctlHeight,
    height: space.ctlHeight,
    borderWidth: space.px,
    borderColor: colors.outline,
  },
});
