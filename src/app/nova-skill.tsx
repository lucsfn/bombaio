import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SkillForm } from '@/components/SkillForm';
import { skillCatalog } from '@/data/catalog';
import { useGame } from '@/state/GameProvider';

const arts = skillCatalog.map((skill) => skill.art);

export default function NewSkillScreen() {
  const { state, actions } = useGame();

  const nameTaken = (name: string) =>
    state.skills.some((skill) => skill.name.toLowerCase() === name.trim().toLowerCase())
      ? 'Você já tem uma skill com esse nome.'
      : undefined;

  return (
    <Screen header={<ScreenHeader title="Nova skill" subtitle="Começa no nível 0" onBack={() => router.back()} />}>
      <SkillForm
        initial={{ name: '', areaId: state.areas[0]?.id ?? '', art: arts[0] ?? 'python' }}
        areas={state.areas}
        arts={arts}
        submitLabel="Cadastrar skill"
        nameError={nameTaken}
        onSubmit={(value) => {
          actions.addSkill(value);
          router.back();
        }}
      />
    </Screen>
  );
}
