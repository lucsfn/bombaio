import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SkillTree, type SkillTreeArea, type SkillTreeSkill } from '@/components/SkillTree/SkillTree';
import { Text } from '@/components/Text';
import { TreeEvolution } from '@/components/TreeEvolution';
import { TreeHeader } from '@/components/TreeHeader';
import { gameSizes, space } from '@/theme/tokens';
import { treeSpecs } from '@/theme/trees';

const sampleAreas: readonly SkillTreeArea[] = [
  { id: 'tec', name: 'Tecnologia', leading: { kind: 'icon', name: 'code' } },
  { id: 'idi', name: 'Idiomas', leading: { kind: 'skill', name: 'idiomas' } },
  { id: 'com', name: 'Comunicação', leading: { kind: 'skill', name: 'oratoria' } },
  { id: 'ges', name: 'Gestão', leading: { kind: 'skill', name: 'lideranca' } },
  { id: 'mus', name: 'Música', leading: { kind: 'skill', name: 'violao' } },
  { id: 'cor', name: 'Corpo', leading: { kind: 'skill', name: 'exercicio' } },
];

const sampleSkills: readonly SkillTreeSkill[] = [
  { id: 'logica', area: 'tec', name: 'Lógica', art: 'logica', level: 6, state: 'validated' },
  { id: 'ingles', area: 'idi', name: 'Inglês', art: 'idiomas', level: 3, state: 'validated' },
  { id: 'python', area: 'tec', parentId: 'logica', name: 'Python', art: 'python', level: 5, state: 'validated' },
  { id: 'violao', area: 'mus', name: 'Violão', art: 'violao', level: 1, state: 'available' },
  { id: 'web', area: 'tec', parentId: 'logica', name: 'Web', art: 'htmlCss', level: 4, state: 'validated' },
  { id: 'escrita', area: 'com', name: 'Escrita', art: 'escrita', level: 2, state: 'validated' },
  { id: 'algo', area: 'tec', parentId: 'logica', name: 'Algoritmos', art: 'matematica', level: 3, state: 'current' },
  { id: 'leitura', area: 'idi', parentId: 'ingles', name: 'Leitura', art: 'escrita', level: 2, state: 'validated' },
  { id: 'projetos', area: 'ges', name: 'Projetos', art: 'projetos', level: 1, state: 'available' },
  { id: 'dados', area: 'tec', parentId: 'python', name: 'Dados', art: 'dados', level: 2, state: 'available' },
  { id: 'js', area: 'tec', parentId: 'web', name: 'JavaScript', art: 'javascript', level: 2, state: 'available' },
  { id: 'escuta', area: 'idi', parentId: 'ingles', name: 'Escuta', art: 'idiomas', level: 2, state: 'available' },
  { id: 'oratoria', area: 'com', name: 'Oratória', art: 'oratoria', level: 1, state: 'available' },
  { id: 'exercicio', area: 'cor', name: 'Exercício', art: 'exercicio', level: 1, state: 'available' },
  { id: 'react', area: 'tec', parentId: 'js', name: 'React', art: 'react', level: 1, state: 'available' },
  { id: 'ml', area: 'tec', parentId: 'dados', name: 'ML', art: 'logica', state: 'seed' },
  { id: 'git', area: 'tec', parentId: 'web', name: 'Git', art: 'git', state: 'seed' },
  { id: 'conversa', area: 'idi', parentId: 'escuta', name: 'Conversa', art: 'oratoria', state: 'seed' },
  { id: 'espanhol', area: 'idi', name: 'Espanhol', art: 'idiomas', state: 'seed' },
  { id: 'lideranca', area: 'ges', parentId: 'projetos', name: 'Liderança', art: 'lideranca', state: 'seed' },
  { id: 'teoria', area: 'mus', parentId: 'violao', name: 'Teoria', art: 'matematica', state: 'seed' },
];

export default function TreeShowcase() {
  const [variant, setVariant] = useState(12);
  const [openArea, setOpenArea] = useState<string | null>('tec');
  const [selected, setSelected] = useState('Nenhuma skill tocada.');
  const tree = treeSpecs[variant - 1];
  const next = treeSpecs[variant];

  const selectSkill = (skillId: string) => {
    const skill = sampleSkills.find((item) => item.id === skillId);
    setSelected(skill ? 'Tocou: ' + skill.name : 'Tocou: ' + skillId);
  };

  return (
    <Screen header={<ScreenHeader title="Árvore" subtitle="Fase A5 · vitrine" onBack={() => router.back()} />}>
      <TreeHeader name={tree.name} variant={variant} score={tree.min} nextThreshold={next ? next.min : undefined} />
      <View style={styles.row}>
        <View style={styles.cell}>
          <Button label="Anterior" onPress={() => setVariant((value) => Math.max(1, value - 1))} />
        </View>
        <View style={styles.cell}>
          <Button
            label="Próxima"
            onPress={() => setVariant((value) => Math.min(gameSizes.treeCount, value + 1))}
          />
        </View>
      </View>
      <Text variant="bodySm" tone="muted">
        {selected}
      </Text>
      <SkillTree
        skills={sampleSkills}
        areas={sampleAreas}
        variant={variant}
        openArea={openArea}
        onOpenAreaChange={setOpenArea}
        onSelectSkill={selectSkill}
      />
      <Text variant="display4" tone="gold">
        TreeEvolution
      </Text>
      <TreeEvolution current={variant} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.s2 },
  cell: { flex: 1 },
});
