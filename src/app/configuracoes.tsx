import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionHeader } from '@/components/SectionHeader';
import { Text } from '@/components/Text';
import { Toggle } from '@/components/Toggle';
import { useGame } from '@/state/GameProvider';
import { space } from '@/theme/tokens';

export default function SettingsScreen() {
  const { state, actions } = useGame();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const signOut = () => {
    setConfirmOpen(false);
    actions.signOut();
    router.replace('/login');
  };

  return (
    <Screen header={<ScreenHeader title="Configurações" onBack={() => router.back()} />}>
      <View style={styles.section}>
        <SectionHeader title="Conta" />
        <ListRow title={state.hero.name} subtitle={state.session.email || 'Perfil de exemplo'} leading={{ kind: 'icon', name: 'user' }} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Notificações e privacidade" />
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
      </View>

      <View style={styles.section}>
        <SectionHeader title="Acessibilidade" />
        <Text variant="body" tone="muted">
          As animações seguem a opção “reduzir movimento” do aparelho.
        </Text>
      </View>

      <Button label="Sair da conta" onPress={() => setConfirmOpen(true)} />

      <Dialog
        visible={confirmOpen}
        title="Sair da conta?"
        message="Nesta versão de demonstração, o progresso do perfil de exemplo é mantido enquanto o app estiver aberto."
        confirmLabel="Sair"
        onConfirm={signOut}
        onCancel={() => setConfirmOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.s2 },
});
