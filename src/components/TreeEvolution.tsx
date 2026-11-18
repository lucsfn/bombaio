import { memo } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { trees } from '@/theme/art';
import { colors, gameSizes, radius, space } from '@/theme/tokens';
import { treeSpecs, type TreeSpec } from '@/theme/trees';

export type TreeEvolutionProps = {
  current: number;
};

const roman = ['I', 'II', 'III', 'IV', 'V'];

function treeLabel(tree: TreeSpec) {
  return tree.n > gameSizes.naturalTreeCount
    ? 'Poder ' + roman[tree.n - gameSizes.naturalTreeCount - 1]
    : String(tree.n).padStart(2, '0');
}

function requirement(tree: TreeSpec) {
  return tree.n > gameSizes.naturalTreeCount
    ? '≥ ' + tree.min + ' · ' + tree.level10 + '× nv10 · ' + tree.areas + ' áreas'
    : 'domínio ≥ ' + tree.min;
}

const TreeCard = memo(function TreeCard({ tree, state }: { tree: TreeSpec; state: 'past' | 'now' | 'next' }) {
  return (
    <View
      style={[styles.card, state === 'now' ? styles.cardNow : null, state === 'next' ? styles.cardNext : null]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={
        treeLabel(tree) + ', ' + tree.name + ', ' + requirement(tree) + (state === 'now' ? ', árvore atual' : '')
      }
    >
      <Image source={trees[tree.n - 1]} style={styles.art} contentFit="contain" accessible={false} />
      <Text variant="labelSm" tone={tree.n > gameSizes.naturalTreeCount ? 'arcane' : 'gold'}>
        {treeLabel(tree)}
      </Text>
      <Text variant="display5" numberOfLines={2}>
        {tree.name}
      </Text>
      <Text variant="labelSm" tone="muted">
        {requirement(tree)}
      </Text>
    </View>
  );
});

export function TreeEvolution({ current }: TreeEvolutionProps) {
  return (
    <View style={styles.grid}>
      {treeSpecs.map((tree) => (
        <View key={tree.n} style={styles.cell}>
          <TreeCard tree={tree} state={tree.n < current ? 'past' : tree.n === current ? 'now' : 'next'} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -space.s1 },
  cell: { width: '50%', padding: space.s1 },
  card: {
    gap: space.px,
    padding: space.s2,
    backgroundColor: colors.surface1,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  cardNow: { borderColor: colors.gold },
  cardNext: { opacity: 0.7 },
  art: { width: '100%', aspectRatio: 1 },
});
