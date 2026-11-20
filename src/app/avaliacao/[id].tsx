import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/Input';
import { Panel } from '@/components/Panel';
import { Radio } from '@/components/Radio';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Stepper } from '@/components/Stepper';
import { Text } from '@/components/Text';
import { validatorLabels } from '@/data/labels';
import { VALIDATION_BANDS } from '@/game/constants';
import { validatorForLevel, type Validator } from '@/game/validation';
import { useGame } from '@/state/GameProvider';
import { selectPendingAssessment, selectSkill } from '@/state/selectors';
import { space } from '@/theme/tokens';

const bandOrder: Validator[] = ['ai', 'peer', 'expert'];
const steps = ['Faixa', 'Evidência', 'Envio'] as const;

function bandNote(validator: Validator, current: Validator, level: number) {
  if (validator === current) return 'Faixa desta avaliação.';
  const band = VALIDATION_BANDS[validator];
  return band.to <= level ? 'Concluída no nível ' + band.to + '.' : 'Libera no nível ' + band.from + '.';
}

export default function AssessmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = useGame();
  const [evidence, setEvidence] = useState('');
  const [summary, setSummary] = useState('');
  const [authored, setAuthored] = useState(true);
  const skill = selectSkill(state, id ?? '');
  const goBack = () => router.back();
  const validator = skill ? validatorForLevel(skill.level + 1) : null;

  if (!skill || !validator || selectPendingAssessment(state, skill.id)) {
    return (
      <Screen header={<ScreenHeader title="Avaliação" onBack={goBack} />}>
        <EmptyState
          icon="lock"
          title="Avaliação indisponível"
          message="Esta skill já tem uma avaliação em andamento ou chegou ao nível máximo."
        />
      </Screen>
    );
  }

  const targetLevel = skill.level + 1;
  const evidenceMissing = evidence.trim() === '';
  const step = evidenceMissing ? 1 : 2;

  const send = () => {
    actions.submitAssessment({ skillId: skill.id, evidence, summary });
    router.back();
  };

  return (
    <Screen
      header={
        <ScreenHeader title="Avaliação" subtitle={skill.name + ' · rumo ao nível ' + targetLevel} onBack={goBack} />
      }
    >
      <Stepper steps={steps} current={step} />

      <Panel title="Faixa de avaliação">
        {bandOrder.map((band) => (
          <View key={band} style={styles.band}>
            <Radio
              label={validatorLabels[band].band}
              value={band === validator}
              onChange={() => undefined}
              disabled={band !== validator}
            />
            <Text variant="bodySm" tone="dim">
              {bandNote(band, validator, skill.level)}
            </Text>
          </View>
        ))}
      </Panel>

      <Input
        label="Link do projeto"
        value={evidence}
        onChangeText={setEvidence}
        placeholder="github.com/você/projeto"
        helper="Obrigatório para enviar."
      />
      <Input
        label="O que ele resolve?"
        value={summary}
        onChangeText={setSummary}
        placeholder="Em uma frase"
        helper="Os revisores leem isto primeiro."
      />
      <Checkbox label="Este trabalho é meu" value={authored} onChange={setAuthored} />

      <Button label={validatorLabels[validator].send} variant="gold" disabled={!authored || evidenceMissing} onPress={send} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  band: { gap: space.px },
});
