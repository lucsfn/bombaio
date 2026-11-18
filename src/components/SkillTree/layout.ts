import type { SkillState } from '@/components/SkillMedallion';
import { treeSlotSpacings, type TreeSlot, type TreeSpec } from '@/theme/trees';

export type TreeSkill = {
  id: string;
  name: string;
  area: string;
  state: SkillState;
  level?: number;
  parentId?: string;
};

export type TreeArea = {
  id: string;
  name: string;
};

export type PlacedSkill<Skill extends TreeSkill> = Skill & {
  x: number;
  y: number;
};

export type TreeLayout<Skill extends TreeSkill> = {
  nodes: PlacedSkill<Skill>[];
  slotSize: number;
};

const maxSeedsOnTree = 3;
const maxSlotSize = 44;
const crownDepth = 0.78;
const rowStep = 0.86;

function canopySlots(tree: TreeSpec, count: number): { points: TreeSlot[]; size: number } {
  for (const spacing of treeSlotSpacings) {
    const measured = tree.slots[String(spacing)];
    if (measured && measured.length >= count) {
      return { points: measured.slice(), size: Math.min(maxSlotSize, spacing - 6) };
    }
  }

  const [left, top, right] = tree.canopy;
  const bottom = Math.round(top + (tree.ground - top) * crownDepth);
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const radiusX = (right - left) / 2;
  const radiusY = (bottom - top) / 2;
  let points: TreeSlot[] = [];
  let spacing = 64;

  for (; spacing >= 36; spacing -= 2) {
    points = [];
    let row = 0;
    for (let y = top + spacing / 2; y <= bottom - spacing / 2 + 1; y += spacing * rowStep, row += 1) {
      const dy = (y - centerY) / radiusY;
      const half = radiusX * Math.sqrt(Math.max(0, 1 - dy * dy)) - spacing / 2;
      if (half < 0) continue;
      const perRow = Math.floor((half * 2) / spacing) + 1;
      const offset = ((row % 2) * spacing) / 2;
      for (let column = 0; column < perRow; column += 1) {
        const x = centerX - ((perRow - 1) * spacing) / 2 + column * spacing + (perRow > 1 ? offset - spacing / 4 : 0);
        if (Math.abs(x - centerX) <= half + 1) points.push([Math.round(x), Math.round(y)]);
      }
    }
    if (points.length >= count) break;
  }

  const distance = (point: TreeSlot) =>
    Math.abs(point[0] - centerX) / radiusX + Math.abs(point[1] - centerY) / radiusY;
  points.sort((a, b) => distance(a) - distance(b));
  return { points, size: Math.min(maxSlotSize, spacing - 4) };
}

export function layoutTree<Skill extends TreeSkill>(
  tree: TreeSpec,
  skills: readonly Skill[],
  areas: readonly TreeArea[],
): TreeLayout<Skill> {
  const areaOrder = new Map(areas.map((area, index) => [area.id, index]));
  const byId = new Map(skills.map((skill) => [skill.id, skill]));
  const depth = (skill: Skill, guard = 0): number => {
    const parent = skill.parentId ? byId.get(skill.parentId) : undefined;
    return parent && guard < skills.length ? depth(parent, guard + 1) + 1 : 0;
  };

  const owned = skills
    .filter((skill) => skill.state !== 'seed')
    .sort((a, b) => (areaOrder.get(a.area) ?? 0) - (areaOrder.get(b.area) ?? 0) || depth(a) - depth(b));
  const seeds = skills.filter((skill) => skill.state === 'seed');

  const { points, size } = canopySlots(tree, owned.length + Math.min(seeds.length, maxSeedsOnTree));
  const room = Math.max(0, points.length - owned.length);
  const shown = owned.concat(seeds.slice(0, Math.min(maxSeedsOnTree, room)));
  const used = points.slice(0, shown.length);

  const meanX = used.reduce((sum, point) => sum + point[0], 0) / Math.max(1, used.length);
  const meanY = used.reduce((sum, point) => sum + point[1], 0) / Math.max(1, used.length);
  used.sort((a, b) => Math.atan2(a[1] - meanY, a[0] - meanX) - Math.atan2(b[1] - meanY, b[0] - meanX));

  const nodes = shown.flatMap((skill, index) => {
    const point = used[index];
    return point ? [{ ...skill, x: point[0], y: point[1] }] : [];
  });

  return { nodes, slotSize: size };
}

export type AreaSummary<Skill extends TreeSkill> = {
  area: TreeArea;
  skills: Skill[];
  seeds: Skill[];
  validated: number;
  averageLevel: number;
  inFocus: boolean;
};

const cardRank: Record<SkillState, number> = { current: 0, validated: 1, available: 2, seed: 3 };

export function summarizeAreas<Skill extends TreeSkill>(
  skills: readonly Skill[],
  areas: readonly TreeArea[],
): AreaSummary<Skill>[] {
  return areas
    .map((area) => {
      const inArea = skills.filter((skill) => skill.area === area.id);
      const owned = inArea
        .filter((skill) => skill.state !== 'seed')
        .sort((a, b) => cardRank[a.state] - cardRank[b.state] || (b.level ?? 0) - (a.level ?? 0));
      const averageLevel = owned.length
        ? owned.reduce((sum, skill) => sum + (skill.level ?? 0), 0) / owned.length
        : 0;
      return {
        area,
        skills: owned,
        seeds: inArea.filter((skill) => skill.state === 'seed'),
        validated: owned.filter((skill) => skill.state === 'validated').length,
        averageLevel,
        inFocus: owned.some((skill) => skill.state === 'current'),
      };
    })
    .filter((summary) => summary.skills.length > 0)
    .sort((a, b) => b.averageLevel * b.skills.length - a.averageLevel * a.skills.length);
}
