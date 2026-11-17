import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { XPBar } from '@/components/XPBar';
import { colors, gameSizes, space } from '@/theme/tokens';

export type TreeHeaderProps = {
  name: string;
  variant: number;
  score: number;
  nextThreshold?: number;
};

const cells = Array.from({ length: gameSizes.treeCount }, (_, index) => index + 1);

export function TreeHeader({ name, variant, score, nextThreshold }: TreeHeaderProps) {
  const power = variant > gameSizes.naturalTreeCount;
  const position = power
    ? 'Poder ' + (variant - gameSizes.naturalTreeCount)
    : String(variant).padStart(2, '0') + '/' + gameSizes.naturalTreeCount;

  return (
    <View style={styles.root}>
      <View style={styles.titleRow}>
        <Text variant="display3" accessibilityRole="header">
          {name}
        </Text>
        <Text variant="label" tone={power ? 'arcane' : 'gold'}>
          {position}
        </Text>
      </View>
      <View
        style={styles.ruler}
        accessible
        accessibilityRole="text"
        accessibilityLabel={'Árvore ' + variant + ' de ' + gameSizes.treeCount}
      >
        {cells.map((cell) => (
          <View
            key={cell}
            style={[
              styles.cell,
              cell > gameSizes.naturalTreeCount ? styles.cellPower : null,
              cell < variant ? styles.cellPassed : null,
              cell === variant ? styles.cellCurrent : null,
            ]}
          />
        ))}
      </View>
      {nextThreshold !== undefined ? (
        <XPBar value={score} max={nextThreshold} label="Domínio até a próxima" />
      ) : (
        <Text variant="label" tone="gold">
          Domínio {score} · árvore final
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'stretch', gap: space.s2 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: space.s2 },
  ruler: { flexDirection: 'row', gap: space.px },
  cell: {
    flex: 1,
    height: gameSizes.treeRulerCell,
    backgroundColor: colors.surface3,
  },
  cellPower: { backgroundColor: colors.arcaneDeep },
  cellPassed: { backgroundColor: colors.leaf },
  cellCurrent: { backgroundColor: colors.gold },
});
