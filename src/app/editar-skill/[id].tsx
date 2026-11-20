import { router, useLocalSearchParams } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SkillForm } from '@/components/SkillForm';
import { useGame } from '@/state/GameProvider';
import { selectSkill } from '@/state/selectors';

export default function EditSkillScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = useGame();
  const skill = selectSkill(state, id ?? '');
  const goBack = () => router.back();

  if (!skill) {
    return (
      <Screen header={<ScreenHeader title="Editar skill" onBack={goBack} />}>
        <EmptyState icon="lock" title="Skill não encontrada" message="Ela pode ter sido removida." />
      </Screen>
    );
  }

  const nameTaken = (name: string) =>
    state.skills.some((item) => item.id !== skill.id && item.name.toLowerCase() === name.trim().toLowerCase())
      ? 'Você já tem uma skill com esse nome.'
      : undefined;

  return (
    <Screen header={<ScreenHeader title="Editar skill" subtitle={skill.name} onBack={goBack} />}>
      <SkillForm
        initial={{ name: skill.name, areaId: skill.areaId, art: skill.art }}
        areas={state.areas}
        arts={[skill.art]}
        lockArt
        submitLabel="Salvar"
        nameError={nameTaken}
        onSubmit={(value) => {
          actions.editSkill({ skillId: skill.id, name: value.name, areaId: value.areaId });
          goBack();
        }}
      />
    </Screen>
  );
}
