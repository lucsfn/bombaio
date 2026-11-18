import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ListRowLeading } from '@/components/ListRow';
import { AreaAccordion } from '@/components/SkillTree/AreaAccordion';
import { TreeCanvas, type CanvasSkill } from '@/components/SkillTree/TreeCanvas';
import { layoutTree, summarizeAreas, type TreeArea } from '@/components/SkillTree/layout';
import { Text } from '@/components/Text';
import { colors, gameSizes, space } from '@/theme/tokens';
import { treeSpecs } from '@/theme/trees';

export type SkillTreeSkill = CanvasSkill;

export type SkillTreeArea = TreeArea & { leading: ListRowLeading };

export type SkillTreeProps = {
  skills: readonly SkillTreeSkill[];
  areas: readonly SkillTreeArea[];
  variant: number;
  openArea: string | null;
  onOpenAreaChange: (areaId: string | null) => void;
  onSelectSkill: (skillId: string) => void;
};

const legend = [
  { label: 'validada', color: colors.rune },
  { label: 'em foco', color: colors.gold },
  { label: 'praticando', color: colors.arcane },
  { label: 'semente', color: colors.locked },
] as const;

export function SkillTree({ skills, areas, variant, openArea, onOpenAreaChange, onSelectSkill }: SkillTreeProps) {
  const tree = treeSpecs[Math.min(gameSizes.treeCount, Math.max(1, Math.round(variant))) - 1];
  const layout = useMemo(() => layoutTree(tree, skills, areas), [tree, skills, areas]);
  const summaries = useMemo(() => summarizeAreas(skills, areas), [skills, areas]);
  const leadingById = useMemo(() => new Map(areas.map((area) => [area.id, area.leading])), [areas]);

  const toggleArea = (areaId: string) => onOpenAreaChange(areaId === openArea ? null : areaId);

  return (
    <View style={styles.root}>
      <TreeCanvas
        tree={tree}
        nodes={layout.nodes}
        slotSize={layout.slotSize}
        openArea={openArea}
        onSelectSkill={onSelectSkill}
      />
      <View style={styles.legend}>
        {legend.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: item.color }]} />
            <Text variant="labelSm" tone="muted">
              {item.label}
            </Text>
          </View>
        ))}
      </View>
      <AreaAccordion
        summaries={summaries}
        leadingById={leadingById}
        openArea={openArea}
        onToggleArea={toggleArea}
        onSelectSkill={onSelectSkill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'stretch', gap: space.s3 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s3 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
  legendSwatch: {
    width: space.s3,
    height: space.s3,
    borderWidth: space.px / 2,
    borderColor: colors.outline,
  },
});
