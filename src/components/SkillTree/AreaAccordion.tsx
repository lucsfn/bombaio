import { memo } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { LevelPips, type LevelPipsTone } from '@/components/LevelPips';
import type { ListRowLeading } from '@/components/ListRow';
import type { SkillState } from '@/components/SkillMedallion';
import type { CanvasSkill } from '@/components/SkillTree/TreeCanvas';
import type { AreaSummary } from '@/components/SkillTree/layout';
import { Text } from '@/components/Text';
import { skills32 } from '@/theme/art';
import { colors, gameSizes, iconSizes, layout, pressedOffset, radius, space } from '@/theme/tokens';


export type AreaAccordionProps = {
  summaries: AreaSummary<CanvasSkill>[];
  leadingById: ReadonlyMap<string, ListRowLeading>;
  openArea: string | null;
  onToggleArea: (id: string) => void;
  onSelectSkill: (id: string) => void;
};

const pipTones: Record<SkillState, LevelPipsTone> = {
  validated: 'rune',
  current: 'gold',
  available: 'arcane',
  seed: 'locked',
};

const SkillCard = memo(function SkillCard({
  skill,
  onSelect,
}: {
  skill: CanvasSkill;
  onSelect: (id: string) => void;
}) {
  return (
    <Pressable
      onPress={() => onSelect(skill.id)}
      accessibilityRole="button"
      accessibilityLabel={skill.name + ', nível ' + (skill.level ?? 0)}
      style={({ pressed }) => [
        styles.card,
        skill.state === 'current' ? styles.cardCurrent : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Image source={skills32[skill.art]} style={styles.art} contentFit="contain" accessible={false} />
      <View style={styles.cardText}>
        <Text variant="display5" numberOfLines={1}>
          {skill.name}
        </Text>
        <LevelPips level={skill.level ?? 0} tone={pipTones[skill.state]} showNext={false} showNumber={false} />
      </View>
      <Text variant="label" tone="gold">
        {skill.level ?? 0}
      </Text>
    </Pressable>
  );
});

function AreaLeading({ leading }: { leading: ListRowLeading | undefined }) {
  if (!leading) return null;
  return (
    <View style={styles.socket}>
      {leading.kind === 'icon' ? (
        <Icon name={leading.name} size={32} />
      ) : (
        <Image source={skills32[leading.name]} style={styles.art} contentFit="contain" accessible={false} />
      )}
    </View>
  );
}

export function AreaAccordion({ summaries, leadingById, openArea, onToggleArea, onSelectSkill }: AreaAccordionProps) {
  return (
    <View style={styles.root}>
      {summaries.map((summary) => {
        const open = summary.area.id === openArea;
        const detail =
          summary.skills.length +
          (summary.skills.length === 1 ? ' skill · ' : ' skills · ') +
          summary.validated +
          (summary.validated === 1 ? ' validada' : ' validadas') +
          (summary.inFocus ? ' · em foco' : '');
        return (
          <View key={summary.area.id} style={styles.area}>
            <Pressable
              onPress={() => onToggleArea(summary.area.id)}
              accessibilityRole="button"
              accessibilityLabel={summary.area.name + ', ' + detail}
              accessibilityState={{ expanded: open }}
              style={({ pressed }) => [styles.row, open ? styles.rowOpen : null, pressed ? styles.pressed : null]}
            >
              <AreaLeading leading={leadingById.get(summary.area.id)} />
              <View style={styles.rowText}>
                <Text variant="display5">{summary.area.name}</Text>
                <Text variant="bodySm" tone="muted">
                  {detail}
                </Text>
                <View style={styles.avgTrack}>
                  <View style={[styles.avgFill, { flex: summary.averageLevel / gameSizes.pipCount }]} />
                  <View style={{ flex: 1 - summary.averageLevel / gameSizes.pipCount }} />
                </View>
              </View>
              <Text variant="label" tone="gold">
                nv {summary.averageLevel.toFixed(1)}
              </Text>
            </Pressable>
            {open ? (
              <View style={styles.body}>
                <View style={styles.grid}>
                  {summary.skills.map((skill) => (
                    <View key={skill.id} style={styles.cell}>
                      <SkillCard skill={skill} onSelect={onSelectSkill} />
                    </View>
                  ))}
                </View>
                {summary.seeds.length > 0 ? (
                  <View style={styles.seeds}>
                    <Text variant="labelSm" tone="dim" uppercase>
                      Próximas
                    </Text>
                    <View style={styles.seedChips}>
                      {summary.seeds.map((seed) => (
                        <Chip key={seed.id} label={seed.name} onPress={() => onSelectSkill(seed.id)} />
                      ))}
                    </View>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: space.s2, alignSelf: 'stretch' },
  area: { gap: space.s2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.gapIcon,
    padding: space.s3,
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  rowOpen: { borderColor: colors.gold },
  rowText: { flex: 1, gap: space.px },
  socket: {
    width: layout.socket,
    height: layout.socket,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface3,
    borderWidth: space.px,
    borderColor: colors.outline,
    borderRadius: radius.sm,
  },
  art: { width: iconSizes.ui, height: iconSizes.ui },
  avgTrack: {
    flexDirection: 'row',
    height: space.s1,
    marginTop: space.s1,
    backgroundColor: colors.surface3,
  },
  avgFill: { backgroundColor: colors.leaf },
  body: { gap: space.s3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -space.s1 },
  cell: { width: '50%', padding: space.s1 },
  card: {
    minHeight: space.ctlHeight + space.s4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    padding: space.s2,
    backgroundColor: colors.surface1,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  cardCurrent: { borderColor: colors.gold },
  cardText: { flex: 1, gap: space.s1 },
  seeds: {
    gap: space.s2,
    padding: space.s3,
    borderWidth: space.px,
    borderStyle: 'dashed',
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  seedChips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 },
  pressed: { transform: [{ translateY: pressedOffset }] },
});
