import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { SkillTree, type SkillTreeArea, type SkillTreeSkill } from '@/components/SkillTree/SkillTree';
import { Toast } from '@/components/Toast';
import { TreeHeader } from '@/components/TreeHeader';
import { useGame } from '@/state/GameProvider';
import { selectTree } from '@/state/selectors';
import { treeSpecs } from '@/theme/trees';

export default function SkillsScreen() {
  const { state, actions } = useGame();
  const [seedName, setSeedName] = useState<string | null>(null);
  const tree = selectTree(state);
  const spec = treeSpecs[tree.variant - 1];

  const skills = useMemo<SkillTreeSkill[]>(
    () =>
      state.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        area: skill.areaId,
        art: skill.art,
        state: skill.status,
        level: skill.level,
        parentId: skill.parentId,
      })),
    [state.skills],
  );

  const areas = useMemo<SkillTreeArea[]>(
    () => state.areas.map((area) => ({ id: area.id, name: area.name, leading: area.icon })),
    [state.areas],
  );

  const selectSkill = (skillId: string) => {
    const skill = state.skills.find((item) => item.id === skillId);
    if (!skill) return;
    if (skill.status === 'seed') {
      setSeedName(skill.name);
      return;
    }
    router.push({ pathname: '/skill/[id]', params: { id: skillId } });
  };

  return (
    <View style={styles.root}>
      <Screen bottomInset="none">
        <TreeHeader
          name={spec.name}
          variant={tree.variant}
          score={tree.score}
          nextThreshold={tree.nextThreshold ?? undefined}
        />
        <SectionHeader title="Sua árvore" action={{ label: 'Ver evolução', onPress: () => router.push('/arvores') }} />
        {skills.length > 0 ? (
          <SkillTree
            skills={skills}
            areas={areas}
            variant={tree.variant}
            openArea={state.openArea}
            onOpenAreaChange={actions.setOpenArea}
            onSelectSkill={selectSkill}
          />
        ) : (
          <EmptyState
            icon="star"
            title="Nenhuma skill ainda"
            message="Cadastre a primeira habilidade para ela aparecer na árvore."
          />
        )}
        <Button label="Nova skill" icon="star" onPress={() => router.push('/nova-skill')} />
      </Screen>
      <Toast
        visible={seedName !== null}
        tone="ok"
        title={'Semente: ' + (seedName ?? '')}
        subtitle="Disponível para começar a praticar."
        onDismiss={() => setSeedName(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
