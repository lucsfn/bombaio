import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Panel } from '@/components/Panel';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Stepper } from '@/components/Stepper';
import { Text } from '@/components/Text';
import { ValidationBadge } from '@/components/ValidationBadge';
import { skillCatalog } from '@/data/catalog';
import { useGame } from '@/state/GameProvider';
import { skills32 } from '@/theme/art';
import { colors, iconSizes, radius, space } from '@/theme/tokens';

const steps = ['Como funciona', 'Primeiras skills', 'Pronto'] as const;
const maxStarters = 5;

export default function OnboardingScreen() {
  const { state, actions } = useGame();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (art: string) =>
    setPicked((current) =>
      current.includes(art)
        ? current.filter((item) => item !== art)
        : current.length >= maxStarters
          ? current
          : [...current, art],
    );

  const finish = () => {
    actions.completeOnboarding(skillCatalog.filter((skill) => picked.includes(skill.art)));
    router.replace('/');
  };

  return (
    <Screen header={<ScreenHeader title={'Olá, ' + state.hero.name} subtitle="Vamos montar sua árvore" />}>
      <Stepper steps={steps} current={step} />

      {step === 0 ? (
        <>
          <Text variant="body" tone="muted">
            Cadastre habilidades reais, pratique para ganhar XP e suba de nível quando a habilidade for validada.
          </Text>
          <Panel title="Quem valida cada nível">
            <ValidationBadge kind="ai" />
            <ValidationBadge kind="peer" />
            <ValidationBadge kind="expert" />
          </Panel>
          <Text variant="bodySm" tone="dim">
            Missões dão XP de prática. Só a validação sobe o nível da skill.
          </Text>
          <Button label="Escolher skills" variant="gold" onPress={() => setStep(1)} />
        </>
      ) : null}

      {step === 1 ? (
        <>
          <Text variant="body" tone="muted">
            {'Escolha até ' + maxStarters + ' skills para começar. Dá para cadastrar outras depois.'}
          </Text>
          <View style={styles.grid}>
            {skillCatalog.map((skill) => {
              const selected = picked.includes(skill.art);
              return (
                <View key={skill.art} style={styles.cell}>
                  <Pressable
                    onPress={() => toggle(skill.art)}
                    accessibilityRole="checkbox"
                    accessibilityLabel={skill.name}
                    accessibilityState={{ checked: selected }}
                    style={[styles.option, selected ? styles.optionSelected : null]}
                  >
                    <Image source={skills32[skill.art]} style={styles.art} contentFit="contain" accessible={false} />
                    <Text variant="label" tone={selected ? 'rune' : 'ink'} numberOfLines={1}>
                      {skill.name}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          <Text variant="label" tone="gold">
            {picked.length + '/' + maxStarters + ' escolhidas'}
          </Text>
          <Button label="Continuar" variant="gold" disabled={picked.length === 0} onPress={() => setStep(2)} />
          <Button label="Voltar" onPress={() => setStep(0)} />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Panel title="Sua árvore nasceu" emphasis="legendary">
            <Text variant="body" tone="muted">
              {picked.length +
                (picked.length === 1 ? ' skill plantada. ' : ' skills plantadas. ') +
                'Conclua missões para praticar e peça a primeira validação quando estiver pronto.'}
            </Text>
          </Panel>
          <Button label="Começar" variant="gold" onPress={finish} />
          <Button label="Voltar" onPress={() => setStep(1)} />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -space.s1 },
  cell: { width: '50%', padding: space.s1 },
  option: {
    minHeight: space.ctlHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    paddingHorizontal: space.s2,
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  optionSelected: { borderColor: colors.rune },
  art: { width: iconSizes.ui, height: iconSizes.ui },
});
