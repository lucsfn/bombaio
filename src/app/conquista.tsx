import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AchievementMedal } from '@/components/AchievementMedal';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Panel } from '@/components/Panel';
import { Text } from '@/components/Text';
import { useGame } from '@/state/GameProvider';
import { space } from '@/theme/tokens';

export default function AchievementScreen() {
  const { state, actions } = useGame();
  const achievement = state.achievements.find((item) => item.id === state.pendingAchievementId);
  const title = state.titles.find((item) => item.id === achievement?.titleId);

  const close = () => {
    actions.dismissAchievement();
    router.back();
  };

  const equip = () => {
    if (title) actions.equipTitle(title.id);
    close();
  };

  return (
    <View style={styles.root}>
      <Panel material="obsidian" emphasis="legendary">
        {achievement ? (
          <View style={styles.content} accessibilityViewIsModal>
            <Text variant="label" tone="gold" uppercase align="center">
              Conquista desbloqueada
            </Text>
            <View style={styles.medal}>
              <AchievementMedal tier={achievement.tier} icon={achievement.icon} title={achievement.title} showTitle={false} />
            </View>
            <Text variant="display1" align="center" accessibilityRole="header">
              {achievement.title}
            </Text>
            <Text variant="body" tone="muted" align="center">
              {achievement.description}
            </Text>
            <View style={styles.rewards}>
              {achievement.xp > 0 ? (
                <Text variant="label" tone="gold">
                  +{achievement.xp} XP
                </Text>
              ) : null}
              {title ? (
                <Text variant="label" tone="arcane">
                  Título: {title.name}
                </Text>
              ) : null}
            </View>
            {title ? <Button label="Equipar título" variant="gold" onPress={equip} /> : null}
            <Button label={title ? 'Agora não' : 'Continuar'} variant={title ? 'iron' : 'gold'} onPress={close} />
          </View>
        ) : (
          <EmptyState
            icon="trophy"
            title="Nada por aqui"
            message="Nenhuma conquista nova."
            action={{ label: 'Voltar', onPress: close }}
          />
        )}
      </Panel>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', padding: space.s4 },
  content: { alignItems: 'stretch', gap: space.s3 },
  medal: { alignItems: 'center' },
  rewards: { flexDirection: 'row', justifyContent: 'center', gap: space.s4 },
});
