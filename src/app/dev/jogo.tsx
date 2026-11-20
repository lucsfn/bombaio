import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AchievementMedal } from '@/components/AchievementMedal';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { LevelPips } from '@/components/LevelPips';
import { Panel } from '@/components/Panel';
import { ProgressRing } from '@/components/ProgressRing';
import { QuestCard } from '@/components/QuestCard';
import { RadarChart } from '@/components/RadarChart';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { Segmented } from '@/components/Segmented';
import { SkillMedallion } from '@/components/SkillMedallion';
import { StatChip } from '@/components/StatChip';
import { Stepper } from '@/components/Stepper';
import { Text } from '@/components/Text';
import { TreeHeader } from '@/components/TreeHeader';
import { ValidationBadge } from '@/components/ValidationBadge';
import { XPBar } from '@/components/XPBar';
import { space } from '@/theme/tokens';

const radarAxes = [
  { label: 'Técnica', value: 7 },
  { label: 'Criativa', value: 4 },
  { label: 'Social', value: 5 },
  { label: 'Idiomas', value: 3 },
  { label: 'Corpo', value: 6 },
] as const;

const assessmentSteps = ['Faixa', 'Evidência', 'Revisão', 'Resultado'] as const;

export default function GameShowcase() {
  const [questDone, setQuestDone] = useState(false);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('Nenhuma ação ainda.');
  const [segment, setSegment] = useState<'geral' | 'avaliacao' | 'evolucao'>('geral');

  return (
    <Screen header={<ScreenHeader title="Jogo" subtitle="Fase A4 · vitrine" onBack={() => router.back()} />}>
      <Text variant="bodySm" tone="muted">
        {message}
      </Text>

      <Panel title="Avatar">
        <View style={styles.row}>
          <Avatar name="Herói" size={64} level={3} />
          <Avatar name="Herói" size={96} level={12} />
          <Avatar name="Herói" size={128} />
        </View>
      </Panel>

      <SectionHeader title="Suas skills" action={{ label: 'Ver árvore', onPress: () => setMessage('Ver árvore tocado') }} />
      <Segmented
        items={[
          { key: 'geral', label: 'Visão geral' },
          { key: 'avaliacao', label: 'Avaliação' },
          { key: 'evolucao', label: 'Evolução' },
        ]}
        value={segment}
        onChange={setSegment}
      />

      <Panel title="XPBar e LevelPips">
        <XPBar value={740} max={1000} level={12} label="Nível geral" />
        <XPBar value={180} max={400} label="Python · rumo ao nível 4" />
        <LevelPips level={3} />
        <LevelPips level={6} tone="rune" />
        <LevelPips level={0} tone="locked" />
      </Panel>

      <Panel title="ValidationBadge">
        <ValidationBadge kind="ai" />
        <ValidationBadge kind="peer" />
        <ValidationBadge kind="expert" />
        <ValidationBadge kind="pending" />
        <ValidationBadge kind="failed" />
      </Panel>

      <View style={styles.row}>
        <StatChip kind="streak" value="7" label="dias" />
        <StatChip kind="xp" value="8" label="skills" />
        <StatChip kind="title" value="3" label="títulos" />
      </View>

      <QuestCard
        kicker={questDone ? 'Concluída' : 'Missão diária'}
        title="Praticar violão"
        description="Sessão focada de 30 min."
        skill="violao"
        xp={40}
        done={questDone}
        onPress={() => setQuestDone(true)}
      />
      <Button
        label={questDone ? 'Reabrir missão' : 'Concluir missão'}
        variant="gold"
        onPress={() => setQuestDone((done) => !done)}
      />

      <Panel title="AchievementMedal">
        <View style={styles.wrap}>
          <AchievementMedal tier="bronze" icon="book" title="Primeira Página" />
          <AchievementMedal tier="silver" icon="note" title="Acordes" />
          <AchievementMedal tier="gold" icon="flame" title="Chama Acesa" />
          <AchievementMedal tier="obsidian" icon="check" title="Validado" />
          <AchievementMedal tier="locked" title="Mestre" hint="Nível 10" />
        </View>
      </Panel>

      <Panel title="SkillMedallion">
        <View style={styles.wrap}>
          <SkillMedallion skill="logica" name="Lógica" state="validated" level={4} onPress={() => setMessage('Lógica tocada')} />
          <SkillMedallion skill="python" name="Python" state="current" level={3} onPress={() => setMessage('Python tocado')} />
          <SkillMedallion skill="htmlCss" name="Web" state="available" level={2} />
          <SkillMedallion skill="dados" name="Dados" state="seed" />
        </View>
        <SkillMedallion skill="python" name="Python" state="current" level={3} size="large" />
      </Panel>

      <Panel title="TreeHeader">
        <TreeHeader name="Broto do saber" variant={2} score={14} nextThreshold={30} />
        <TreeHeader name="Poder III" variant={23} score={620} />
      </Panel>

      <Panel title="RadarChart">
        <RadarChart axes={radarAxes} max={10} />
      </Panel>

      <Panel title="ProgressRing">
        <View style={styles.row}>
          <ProgressRing value={3} max={5} label="Missões da semana" size={64} />
          <ProgressRing value={320} max={500} label="XP semanal" tone="ember" />
          <ProgressRing value={9} max={10} label="Domínio" tone="rune" size={128} />
        </View>
      </Panel>

      <Panel title="Stepper">
        <Stepper steps={assessmentSteps} current={step} />
        <Button
          label="Próxima etapa"
          onPress={() => setStep((current) => (current + 1) % assessmentSteps.length)}
        />
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s4 },
});
