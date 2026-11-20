import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { Panel } from '@/components/Panel';
import { QuestCard } from '@/components/QuestCard';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Segmented } from '@/components/Segmented';
import { Text } from '@/components/Text';
import { Toast } from '@/components/Toast';
import { XPBar } from '@/components/XPBar';
import type { MissionKind } from '@/data/types';
import { weeklyChestProgress } from '@/game/missions';
import { useGame } from '@/state/GameProvider';
import { space } from '@/theme/tokens';

const segments: readonly { key: MissionKind; label: string }[] = [
  { key: 'daily', label: 'Diárias' },
  { key: 'weekly', label: 'Semanais' },
  { key: 'main', label: 'Principais' },
];

const kickers: Record<MissionKind, string> = {
  daily: 'Missão diária',
  weekly: 'Missão semanal',
  main: 'Missão principal',
};

const emptyTitles: Record<MissionKind, string> = {
  daily: 'Nenhuma missão diária',
  weekly: 'Nenhuma missão semanal',
  main: 'Nenhuma missão principal',
};

export default function MissionsScreen() {
  const { state, actions } = useGame();
  const [kind, setKind] = useState<MissionKind>('daily');
  const [gained, setGained] = useState<{ xp: number; title: string } | null>(null);
  const open = state.missions.filter((mission) => !mission.done).length;
  const done = state.missions.length - open;
  const visible = state.missions.filter((mission) => mission.kind === kind);
  const chest = weeklyChestProgress(state.hero.weeklyXp);

  const complete = (missionId: string) => {
    const mission = state.missions.find((item) => item.id === missionId);
    if (!mission || mission.done) return;
    const isFirst = state.missions.every((item) => !item.done);
    actions.completeMission(missionId);
    if (!isFirst) setGained({ xp: mission.xp, title: mission.title });
  };

  return (
    <View style={styles.root}>
      <Screen
        bottomInset="none"
        header={<ScreenHeader title="Missões" subtitle={open + ' abertas · ' + done + ' concluídas'} />}
      >
        <Segmented items={segments} value={kind} onChange={setKind} />

        {visible.length > 0 ? (
          <View style={styles.list}>
            {visible.map((mission) => (
              <QuestCard
                key={mission.id}
                kicker={mission.done ? 'Concluída' : kickers[mission.kind] + ' · toque para concluir'}
                title={mission.title}
                description={mission.done ? undefined : mission.description}
                skill={mission.done ? undefined : state.skills.find((skill) => skill.id === mission.skillId)?.art}
                xp={mission.xp}
                done={mission.done}
                onPress={() => complete(mission.id)}
              />
            ))}
          </View>
        ) : (
          <EmptyState icon="scroll" title={emptyTitles[kind]} message="Volte depois: novas missões aparecem aqui." />
        )}

        <Panel title="Baú da semana">
          <XPBar value={chest.current} max={chest.goal} label="XP semanal" />
          <Text variant="body" tone="muted">
            {chest.open ? 'Baú liberado!' : 'Faltam ' + chest.remaining + ' XP para abrir o baú.'}
          </Text>
        </Panel>
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
  list: { gap: space.s3 },
});
