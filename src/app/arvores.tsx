import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Text } from '@/components/Text';
import { TreeEvolution } from '@/components/TreeEvolution';
import { useGame } from '@/state/GameProvider';
import { selectTree } from '@/state/selectors';

export default function TreeEvolutionScreen() {
  const { state } = useGame();
  const tree = selectTree(state);

  return (
    <Screen
      header={<ScreenHeader title="Evolução da árvore" subtitle={'Domínio ' + tree.score} onBack={() => router.back()} />}
    >
      <Text variant="body" tone="muted">
        A árvore cresce com a soma dos quadrados dos níveis validados. Depois da 20, os poderes pedem skills no nível 10
        em áreas diferentes.
      </Text>
      <TreeEvolution current={tree.variant} />
    </Screen>
  );
}
