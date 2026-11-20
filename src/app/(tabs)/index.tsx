import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { QuestCard } from '@/components/QuestCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { StatChip } from '@/components/StatChip';
import { Text } from '@/components/Text';
import { Toast } from '@/components/Toast';
import { XPBar } from '@/components/XPBar';
import { useGame } from '@/state/GameProvider';
import { selectEquippedTitle, selectHeroLevel, selectOwnedSkills } from '@/state/selectors';
import { space } from '@/theme/tokens';

const statusSubtitles = {
  ai: 'Validado por IA',
  peer: 'Validado por pares',
  expert: 'Certificado por especialista',
  pending: 'Avaliação em andamento',
  failed: 'Não aprovado, refazer',
} as const;

export default function HeroScreen() {
  const { state, actions } = useGame();
  const [gained, setGained] = useState<{ xp: number; title: string } | null>(null);
  const progress = selectHeroLevel(state);
  const nextMission = state.missions.find((mission) => !mission.done);
  const owned = selectOwnedSkills(state);
  const featured = [...owned].sort((a, b) => Number(b.status === 'current') - Number(a.status === 'current')).slice(0, 3);
  const skillCount = owned.length;

  const completeNext = () => {
    if (!nextMission) return;
    const isFirst = state.missions.every((mission) => !mission.done);
    actions.completeMission(nextMission.id);
    if (!isFirst) setGained({ xp: nextMission.xp, title: nextMission.title });
  };

  return (
    <View style={styles.root}>
      <Screen bottomInset="none">
        <View style={styles.hero}>
          <Avatar name={state.hero.name} size={96} level={progress.level} />
          <View style={styles.heroText}>
            <Text variant="display2">{state.hero.name}</Text>
            <Text variant="label" tone="gold">
              {selectEquippedTitle(state)}
            </Text>
            <Text variant="bodySm" tone="muted">
              Pronto para evoluir hoje?
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <StatChip kind="streak" value={String(state.hero.streakDays)} label="dias" />
          <StatChip kind="xp" value={String(skillCount)} label="skills" />
          <StatChip kind="title" value={String(state.hero.ownedTitleIds.length)} label="títulos" />
        </View>

        <XPBar value={progress.current} max={progress.needed} level={progress.level} label="Nível geral" />

        <View style={styles.section}>
          <SectionHeader title="Missão do dia" />
          {nextMission ? (
            <>
              <QuestCard
                kicker="Missão diária"
                title={nextMission.title}
                description={nextMission.description}
                skill={state.skills.find((skill) => skill.id === nextMission.skillId)?.art}
                xp={nextMission.xp}
              />
              <Button label="Concluir missão" icon="sword" variant="gold" onPress={completeNext} />
            </>
          ) : (
            <QuestCard kicker="Concluída" title="Todas as missões de hoje" xp={0} done />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Suas skills" action={{ label: 'Ver árvore', onPress: () => router.navigate('/skills') }} />
          {featured.length === 0 ? (
            <EmptyState
              icon="star"
              title="Nenhuma skill ainda"
              message="Cadastre uma habilidade real para começar a praticar."
              action={{ label: 'Cadastrar skill', onPress: () => router.push('/nova-skill') }}
            />
          ) : null}
          {featured.map((skill) => (
            <ListRow
              key={skill.id}
              title={skill.name}
              subtitle={skill.validation ? statusSubtitles[skill.validation] : 'Praticando'}
              leading={{ kind: 'skill', name: skill.art }}
              value={'Nv. ' + skill.level}
              onPress={() => router.push({ pathname: '/skill/[id]', params: { id: skill.id } })}
            />
          ))}
        </View>
      </Screen>
      <Toast
        visible={gained !== null}
        tone="xp"
        title={'+' + (gained?.xp ?? 0) + ' XP'}
        subtitle={gained ? 'Missão: ' + gained.title : undefined}
        onDismiss={() => setGained(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: space.s4 },
  heroText: { flex: 1, gap: space.s1 },
  stats: { flexDirection: 'row', gap: space.s2 },
  section: { gap: space.s3 },
});
