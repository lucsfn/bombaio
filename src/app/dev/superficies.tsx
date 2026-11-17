import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Dialog } from '@/components/Dialog';
import { EmptyState } from '@/components/EmptyState';
import { ListRow } from '@/components/ListRow';
import { Panel } from '@/components/Panel';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Skeleton } from '@/components/Skeleton';
import { TabBar, type TabBarItem } from '@/components/TabBar';
import { Text } from '@/components/Text';
import { Toast, type ToastTone } from '@/components/Toast';
import { space } from '@/theme/tokens';

type TabKey = 'heroi' | 'skills' | 'missoes' | 'perfil';

const tabs: readonly TabBarItem<TabKey>[] = [
  { key: 'heroi', label: 'Herói', icon: 'user' },
  { key: 'skills', label: 'Skills', icon: 'star' },
  { key: 'missoes', label: 'Missões', icon: 'scroll', hasNews: true },
  { key: 'perfil', label: 'Perfil', icon: 'shield' },
];

const toastSamples: Record<ToastTone, { title: string; subtitle: string }> = {
  xp: { title: '+40 XP', subtitle: 'Missão: Praticar violão' },
  ok: { title: 'Projeto enviado à guilda', subtitle: 'Resposta em até 48h.' },
  error: { title: 'Faixa bloqueada', subtitle: 'Especialistas avaliam a partir do nível 7.' },
};

export default function SurfacesShowcase() {
  const [tab, setTab] = useState<TabKey>('skills');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastTone, setToastTone] = useState<ToastTone | null>(null);
  const [message, setMessage] = useState('Nenhuma ação ainda.');

  return (
    <View style={styles.root}>
      <Screen
        bottomInset="none"
        header={
          <ScreenHeader
            title="Superfícies"
            subtitle="Fase A3 · vitrine"
            onBack={() => router.back()}
            action={{ icon: 'scroll', accessibilityLabel: 'Registrar ação', onPress: () => setMessage('Ação do cabeçalho') }}
          />
        }
      >
        <Text variant="bodySm" tone="muted">
          {message}
        </Text>

        <Panel title="Ardósia">
          <Text tone="muted">Painel padrão de seção, material slate.</Text>
        </Panel>
        <Panel title="Pedra" material="stone">
          <Text tone="muted">Material stone, para seções secundárias.</Text>
        </Panel>
        <Panel title="Obsidiana" material="obsidian">
          <Text tone="muted">Material obsidian, para destaque frio.</Text>
        </Panel>
        <Panel title="Lendário" emphasis="legendary">
          <Text tone="muted">Só para conquistas, nível 10 e especialista.</Text>
        </Panel>

        <Card>
          <Text variant="display5">Card neutro</Text>
          <Text variant="bodySm" tone="muted">
            Sem filete de cor.
          </Text>
        </Card>
        <Card accent="ember" onPress={() => setMessage('Card de missão tocado')} accessibilityLabel="Missão aberta">
          <Text variant="display5">Missão aberta</Text>
          <Text variant="bodySm" tone="muted">
            Filete ember, tocável.
          </Text>
        </Card>
        <Card accent="leaf">
          <Text variant="display5">Missão concluída</Text>
        </Card>

        <ListRow
          title="Python"
          subtitle="Validado por IA"
          leading={{ kind: 'skill', name: 'python' }}
          value="Nv. 3"
          onPress={() => setMessage('Python tocado')}
        />
        <ListRow title="Inglês" subtitle="Revisão por pares pendente" leading={{ kind: 'skill', name: 'idiomas' }} />
        <ListRow
          title="Configurações"
          subtitle="Conta, notificações e privacidade"
          leading={{ kind: 'icon', name: 'shield' }}
          onPress={() => setMessage('Configurações tocado')}
        />

        <Button label="Abrir diálogo" onPress={() => setDialogOpen(true)} />
        <View style={styles.row}>
          <View style={styles.cell}>
            <Button label="Toast XP" onPress={() => setToastTone('xp')} />
          </View>
          <View style={styles.cell}>
            <Button label="Toast ok" onPress={() => setToastTone('ok')} />
          </View>
          <View style={styles.cell}>
            <Button label="Toast erro" onPress={() => setToastTone('error')} />
          </View>
        </View>

        <EmptyState
          icon="scroll"
          title="Nenhuma missão hoje"
          message="Volte amanhã ou crie uma missão própria."
          action={{ label: 'Criar missão', onPress: () => setMessage('Criar missão tocado') }}
        />

        <Skeleton shape="line" />
        <Skeleton shape="row" />
        <Skeleton shape="block" />
      </Screen>

      <TabBar items={tabs} activeKey={tab} onSelect={setTab} />

      <Dialog
        visible={dialogOpen}
        title="Abandonar avaliação?"
        message="Seu progresso nesta avaliação será perdido."
        confirmLabel="Abandonar"
        onConfirm={() => {
          setDialogOpen(false);
          setMessage('Diálogo confirmado');
        }}
        onCancel={() => setDialogOpen(false)}
      />

      <Toast
        visible={toastTone !== null}
        tone={toastTone ?? 'ok'}
        title={toastSamples[toastTone ?? 'ok'].title}
        subtitle={toastSamples[toastTone ?? 'ok'].subtitle}
        onDismiss={() => setToastTone(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  row: { flexDirection: 'row', gap: space.s2 },
  cell: { flex: 1 },
});
