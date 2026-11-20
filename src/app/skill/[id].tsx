import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Panel } from '@/components/Panel';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Segmented } from '@/components/Segmented';
import { SkillMedallion } from '@/components/SkillMedallion';
import { Text } from '@/components/Text';
import { ValidationBadge } from '@/components/ValidationBadge';
import { XPBar } from '@/components/XPBar';
import { validatorLabels } from '@/data/labels';
import { MAX_SKILL_LEVEL } from '@/game/constants';
import { practiceXpForLevel } from '@/game/levels';
import { validatorForLevel } from '@/game/validation';
import { useGame } from '@/state/GameProvider';
import { selectArea, selectPendingAssessment, selectSkill } from '@/state/selectors';
import { space } from '@/theme/tokens';

type Tab = 'overview' | 'assessment' | 'history';

const tabs: readonly { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Visão geral' },
  { key: 'assessment', label: 'Avaliação' },
  { key: 'history', label: 'Evolução' },
];

export default function SkillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useGame();
  const [tab, setTab] = useState<Tab>('overview');
  const skill = selectSkill(state, id ?? '');
  const goBack = () => router.back();

  if (!skill) {
    return (
      <Screen header={<ScreenHeader title="Skill" onBack={goBack} />}>
        <EmptyState icon="lock" title="Skill não encontrada" message="Ela pode ter sido removida." />
      </Screen>
    );
  }

  const area = selectArea(state, skill.areaId);
  const pending = selectPendingAssessment(state, skill.id);
  const targetLevel = skill.level + 1;
  const maxed = skill.level >= MAX_SKILL_LEVEL;
  const nextValidator = maxed ? null : validatorForLevel(targetLevel);
  const practiceGoal = practiceXpForLevel(targetLevel);
  const history = state.levelHistory.filter((record) => record.skillId === skill.id).reverse();
  const assessments = state.assessments.filter((item) => item.skillId === skill.id).reverse();

  return (
    <Screen header={<ScreenHeader title={skill.name} subtitle={area?.name} onBack={goBack} />}>
      <View style={styles.hero}>
        <SkillMedallion skill={skill.art} name={skill.name} state={skill.status} level={skill.level} size="large" />
        {skill.validation ? <ValidationBadge kind={skill.validation} /> : null}
      </View>

      {maxed ? (
        <Text variant="label" tone="gold">
          Nível máximo alcançado
        </Text>
      ) : (
        <XPBar value={skill.practiceXp} max={practiceGoal} label={'Prática rumo ao nível ' + targetLevel} />
      )}

      <Segmented items={tabs} value={tab} onChange={setTab} />

      {tab === 'overview' ? (
        pending ? (
          <Panel title="Avaliação em andamento">
            <Text variant="body" tone="muted">
              {'Seu nível ' + pending.targetLevel + ' está com ' + validatorLabels[pending.validator].who + '. A resposta aparece aqui.'}
            </Text>
          </Panel>
        ) : nextValidator ? (
          <Panel title="Próxima validação">
            <Text variant="body" tone="muted">
              {'Nível ' + targetLevel + ' é validado por ' + validatorLabels[nextValidator].who + '.'}
            </Text>
            <Checkbox
              label={practiceGoal + ' XP de prática'}
              value={skill.practiceXp >= practiceGoal}
              onChange={() => undefined}
              disabled
            />
          </Panel>
        ) : null
      ) : null}

      {tab === 'assessment' ? (
        assessments.length > 0 ? (
          <View style={styles.list}>
            {assessments.map((item) => (
              <ListRow
                key={item.id}
                title={'Nível ' + item.targetLevel}
                subtitle={validatorLabels[item.validator].band + ' · ' + item.evidence}
                leading={{ kind: 'icon', name: 'scroll' }}
                value={item.status === 'pending' ? 'Aguardando' : item.status === 'approved' ? 'Aprovado' : 'Refazer'}
              />
            ))}
          </View>
        ) : (
          <EmptyState icon="scroll" title="Nenhuma avaliação" message="Quando você enviar uma, ela aparece aqui." />
        )
      ) : null}

      {tab === 'history' ? (
        history.length > 0 ? (
          <View style={styles.list}>
            {history.map((record) => (
              <ListRow
                key={record.id}
                title={'Nível ' + record.level}
                subtitle={validatorLabels[record.validator].band + ' · ' + record.date}
                leading={{ kind: 'icon', name: 'check' }}
              />
            ))}
          </View>
        ) : (
          <EmptyState icon="star" title="Sem histórico ainda" message="Cada nível validado entra nesta linha do tempo." />
        )
      ) : null}

      <View style={styles.actions}>
        <Button label="Praticar agora" icon="sword" variant="gold" onPress={() => router.navigate('/missoes')} />
        {nextValidator ? (
          <Button
            label={pending ? 'Avaliação enviada' : 'Iniciar avaliação'}
            disabled={pending !== undefined}
            onPress={() => router.push({ pathname: '/avaliacao/[id]', params: { id: skill.id } })}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: space.s3 },
  list: { gap: space.s2 },
  actions: { gap: space.s3 },
});
