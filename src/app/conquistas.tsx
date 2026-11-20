import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AchievementMedal } from '@/components/AchievementMedal';
import { ListRow } from '@/components/ListRow';
import { Panel } from '@/components/Panel';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { useGame } from '@/state/GameProvider';
import { space } from '@/theme/tokens';

export default function AchievementsScreen() {
  const { state, actions } = useGame();
  const unlocked = state.achievements.filter((item) => item.unlocked).length;

  return (
    <Screen
      header={
        <ScreenHeader
          title="Conquistas e títulos"
          subtitle={unlocked + ' de ' + state.achievements.length + ' conquistas'}
          onBack={() => router.back()}
        />
      }
    >
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

      <View style={styles.section}>
        <SectionHeader title="Títulos" />
        {state.titles.map((title) => {
          const owned = state.hero.ownedTitleIds.includes(title.id);
          const equipped = title.id === state.hero.equippedTitleId;
          const source = state.achievements.find((item) => item.titleId === title.id);
          return (
            <ListRow
              key={title.id}
              title={title.name}
              subtitle={
                equipped ? 'Equipado' : owned ? 'Toque para equipar' : source ? 'Libera com: ' + source.title : 'Bloqueado'
              }
              leading={{ kind: 'icon', name: owned ? 'trophy' : 'lock' }}
              onPress={owned && !equipped ? () => actions.equipTitle(title.id) : undefined}
            />
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  medals: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: space.s4 },
  section: { gap: space.s2 },
});
