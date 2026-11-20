import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Input } from '@/components/Input';
import { Text } from '@/components/Text';
import { skills32, type SkillArtName } from '@/theme/art';
import { colors, iconSizes, radius, space } from '@/theme/tokens';

export type SkillFormValue = {
  name: string;
  areaId: string;
  art: SkillArtName;
};

export type SkillFormProps = {
  initial: SkillFormValue;
  areas: readonly { id: string; name: string }[];
  arts: readonly SkillArtName[];
  submitLabel: string;
  nameError?: (name: string) => string | undefined;
  lockArt?: boolean;
  onSubmit: (value: SkillFormValue) => void;
};

export function SkillForm({ initial, areas, arts, submitLabel, nameError, lockArt = false, onSubmit }: SkillFormProps) {
  const [name, setName] = useState(initial.name);
  const [areaId, setAreaId] = useState(initial.areaId);
  const [art, setArt] = useState<SkillArtName>(initial.art);
  const [touched, setTouched] = useState(false);
  const error = name.trim() === '' ? 'Dê um nome à skill.' : nameError?.(name);

  const submit = () => {
    setTouched(true);
    if (error) return;
    onSubmit({ name: name.trim(), areaId, art });
  };

  return (
    <View style={styles.root}>
      <Input
        label="Nome da skill"
        value={name}
        onChangeText={setName}
        placeholder="Ex.: Violão, Python, Oratória"
        error={touched ? error : undefined}
      />

      <View style={styles.group}>
        <Text variant="label" tone="muted" uppercase>
          Área
        </Text>
        <View style={styles.wrap}>
          {areas.map((area) => (
            <Chip key={area.id} label={area.name} selected={area.id === areaId} onPress={() => setAreaId(area.id)} />
          ))}
        </View>
      </View>

      {lockArt ? null : (
        <View style={styles.group}>
          <Text variant="label" tone="muted" uppercase>
            Ícone
          </Text>
          <View style={styles.wrap}>
            {arts.map((item) => (
              <Pressable
                key={item}
                onPress={() => setArt(item)}
                accessibilityRole="radio"
                accessibilityLabel={'Ícone ' + item}
                accessibilityState={{ checked: item === art }}
                style={[styles.artCell, item === art ? styles.artSelected : null]}
              >
                <Image source={skills32[item]} style={styles.art} contentFit="contain" accessible={false} />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <Button label={submitLabel} variant="gold" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: space.s6 },
  group: { gap: space.s2 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 },
  artCell: {
    width: space.ctlHeight,
    height: space.ctlHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  artSelected: { borderColor: colors.rune },
  art: { width: iconSizes.ui, height: iconSizes.ui },
});
