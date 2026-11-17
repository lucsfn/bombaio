import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Input } from '@/components/Input';
import { ListRow } from '@/components/ListRow';
import { Radio } from '@/components/Radio';
import { Text } from '@/components/Text';
import { Toggle } from '@/components/Toggle';
import { colors, space, type ColorToken } from '@/theme/tokens';
import type { TypographyVariant } from '@/theme/typography';

const typeSamples: TypographyVariant[] = [
  'display1',
  'display2',
  'display3',
  'display4',
  'display5',
  'label',
  'labelSm',
  'body',
  'bodySm',
  'bodyStrong',
];

const swatches: ColorToken[] = [
  'void',
  'surface1',
  'surface2',
  'surface3',
  'ink',
  'inkMuted',
  'gold',
  'rune',
  'arcane',
  'ember',
  'leaf',
  'mana',
  'blood',
  'locked',
];

const bands = ['IA (níveis 1–3)', 'Pares (níveis 4–6)', 'Especialista (7–10)'];
const categories = [
  { label: 'Técnica', icon: 'code' },
  { label: 'Criativa', icon: 'palette' },
  { label: 'Social', icon: 'chat' },
  { label: 'Idiomas', icon: 'globe' },
] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="display4" tone="gold">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function DevShowcase() {
  const [skillName, setSkillName] = useState('');
  const [hours, setHours] = useState('abc');
  const [password, setPassword] = useState('segredo');
  const [authored, setAuthored] = useState(true);
  const [practiced, setPracticed] = useState(false);
  const [band, setBand] = useState(1);
  const [reminder, setReminder] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [category, setCategory] = useState(0);
  const [pressCount, setPressCount] = useState(0);

  const press = () => setPressCount((count) => count + 1);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="display1">Vitrine</Text>
        <Text variant="bodySm" tone="muted">
          Toques registrados: {pressCount}
        </Text>
        <ListRow
          title="Superfícies e layout"
          subtitle="Fase A3: Screen, Panel, Card, ListRow, TabBar, Dialog, Toast…"
          leading={{ kind: 'icon', name: 'book' }}
          onPress={() => router.push('/dev/superficies')}
        />

        <Section title="Text">
          {typeSamples.map((variant) => (
            <Text key={variant} variant={variant}>
              {variant} · Bombaio
            </Text>
          ))}
          <View style={styles.row}>
            <Text tone="muted">muted</Text>
            <Text tone="dim">dim</Text>
            <Text tone="gold">gold</Text>
            <Text tone="rune">rune</Text>
            <Text tone="blood">blood</Text>
          </View>
        </Section>

        <Section title="Cores">
          <View style={styles.wrap}>
            {swatches.map((token) => (
              <View key={token} style={styles.swatchItem}>
                <View style={[styles.swatch, { backgroundColor: colors[token] }]} />
                <Text variant="labelSm" tone="muted">
                  {token}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Button">
          <Button label="Praticar agora" icon="sword" variant="gold" onPress={press} />
          <Button label="Iniciar avaliação" onPress={press} />
          <Button label="Enviando" loading onPress={press} />
          <Button label="Bloqueado" disabled onPress={press} />
        </Section>

        <Section title="IconButton">
          <View style={styles.row}>
            <IconButton icon="back" accessibilityLabel="Voltar" onPress={press} />
            <IconButton icon="scroll" accessibilityLabel="Histórico" onPress={press} />
            <IconButton icon="lock" accessibilityLabel="Bloqueado" disabled onPress={press} />
          </View>
        </Section>

        <Section title="Icon">
          <View style={styles.row}>
            <Icon name="star" size={32} />
            <Icon name="flame" size={32} />
            <Icon name="trophy" size={32} />
          </View>
          <Icon name="trophy" size={128} />
        </Section>

        <Section title="Input">
          <Input
            label="Nome da skill"
            value={skillName}
            onChangeText={setSkillName}
            placeholder="Ex.: Violão, Python, Oratória"
            icon="star"
          />
          <Input
            label="Horas praticadas"
            value={hours}
            onChangeText={setHours}
            error={/^\d*$/.test(hours) ? undefined : 'Use só números.'}
            helper="Quanto tempo você praticou hoje."
          />
          <Input label="Senha" value={password} onChangeText={setPassword} secure />
          <Input label="Evidência" value="github.com/eu/projeto" onChangeText={setSkillName} editable={false} />
        </Section>

        <Section title="Checkbox">
          <Checkbox label="Este trabalho é meu" value={authored} onChange={setAuthored} />
          <Checkbox label="400 XP de prática" value={practiced} onChange={setPracticed} />
          <Checkbox label="Indisponível" value={false} onChange={setPracticed} disabled />
        </Section>

        <Section title="Radio">
          {bands.map((label, index) => (
            <Radio key={label} label={label} value={band === index} onChange={() => setBand(index)} />
          ))}
        </Section>

        <Section title="Toggle">
          <Toggle label="Lembrete diário de missão" value={reminder} onChange={setReminder} />
          <Toggle label="Perfil público na guilda" value={publicProfile} onChange={setPublicProfile} />
          <Toggle label="Indisponível" value={false} onChange={setPublicProfile} disabled />
        </Section>

        <Section title="Chip">
          <View style={styles.wrap}>
            {categories.map((item, index) => (
              <Chip
                key={item.label}
                label={item.label}
                icon={item.icon}
                selected={category === index}
                onPress={() => setCategory(index)}
              />
            ))}
          </View>
          <Chip label="Só leitura" />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.void },
  content: { padding: space.s4, gap: space.s6 },
  section: { gap: space.s3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 },
  swatchItem: { alignItems: 'center', gap: space.s1 },
  swatch: {
    width: space.ctlHeight,
    height: space.ctlHeight,
    borderWidth: space.px,
    borderColor: colors.outline,
  },
});
