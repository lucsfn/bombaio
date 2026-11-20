import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AchievementMedal } from '@/components/AchievementMedal';
import { Avatar } from '@/components/Avatar';
import { Chip } from '@/components/Chip';
import { ListRow } from '@/components/ListRow';
import { Panel } from '@/components/Panel';
import { RadarChart } from '@/components/RadarChart';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { StatChip } from '@/components/StatChip';
import { Text } from '@/components/Text';
import { Toggle } from '@/components/Toggle';
import { MAX_SKILL_LEVEL } from '@/game/constants';
import { useGame } from '@/state/GameProvider';
import { selectEquippedTitle, selectHeroLevel, selectOwnedSkills } from '@/state/selectors';
import { space } from '@/theme/tokens';

export default function ProfileScreen() {
  const { state, actions } = useGame();
  const owned = selectOwnedSkills(state);
  const validated = owned.filter((skill) => skill.status === 'validated').length;

  const radarAxes = state.areas
    .map((area) => {
      const inArea = owned.filter((skill) => skill.areaId === area.id);
      const average = inArea.length ? inArea.reduce((sum, skill) => sum + skill.level, 0) / inArea.length : 0;
      return { label: area.name, value: Math.round(average * 10) / 10 };
    })
    .filter((axis) => axis.value > 0);

  return (
    <View style={styles.root}>
      <Screen bottomInset="none">
        <View style={styles.hero}>
          <Avatar name={state.hero.name} size={128} level={selectHeroLevel(state).level} />
          <View style={styles.heroText}>
            <Text variant="display2">{state.hero.name}</Text>
            <Text variant="label" tone="gold">
              {selectEquippedTitle(state)}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <StatChip kind="streak" value={String(state.hero.streakDays)} label="dias" />
          <StatChip kind="xp" value={String(validated)} label="validadas" />
          <StatChip kind="title" value={String(state.hero.ownedTitleIds.length)} label="títulos" />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Conquistas" action={{ label: 'Ver todas', onPress: () => router.push('/conquistas') }} />
          <Panel>
            <View style={styles.medals}>
              {state.achievements.map((achievement) => (
                <AchievementMedal
                  key={achievement.id}
                  tier={achievement.unlocked ? achievement.tier : 'locked'}
                  icon={achievement.icon}
                  title={achievement.title}
                  hint={achievement.hint}
                />
              ))}
            </View>
          </Panel>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Títulos" />
          <View style={styles.chips}>
            {state.titles
              .filter((title) => state.hero.ownedTitleIds.includes(title.id))
              .map((title) => (
                <Chip
                  key={title.id}
                  label={title.name}
                  selected={title.id === state.hero.equippedTitleId}
                  onPress={() => actions.equipTitle(title.id)}
                />
              ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Radar por categoria" />
          <Panel>
            <RadarChart axes={radarAxes} max={MAX_SKILL_LEVEL} title="Nível médio por área" />
          </Panel>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Preferências" />
          <Toggle
            label="Lembrete diário de missão"
            value={state.settings.dailyReminder}
            onChange={(value) => actions.setSetting('dailyReminder', value)}
          />
          <Toggle
            label="Perfil público na guilda"
            value={state.settings.publicProfile}
            onChange={(value) => actions.setSetting('publicProfile', value)}
          />
          <ListRow
            title="Configurações"
            subtitle="Conta, notificações e privacidade"
            leading={{ kind: 'icon', name: 'shield' }}
            onPress={() => router.push('/configuracoes')}
          />
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: space.s4 },
  heroText: { flex: 1, gap: space.s1 },
  stats: { flexDirection: 'row', gap: space.s2 },
  section: { gap: space.s3 },
  medals: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: space.s4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 },
});
