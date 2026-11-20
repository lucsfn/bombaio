import { MAX_SKILL_LEVEL } from '@/game/constants';
import { treeSpecs } from '@/theme/trees';

const NATURAL_TREE_COUNT = 20;

export function masteryScore(skills: readonly { level: number }[]): number {
  return skills.reduce((sum, skill) => sum + skill.level * skill.level, 0);
}

export function treeVariant(skills: readonly { level: number; area: string }[]): number {
  const score = masteryScore(skills);
  const maxed = skills.filter((skill) => skill.level >= MAX_SKILL_LEVEL);
  const maxedAreas = new Set(maxed.map((skill) => skill.area)).size;

  const natural = treeSpecs
    .slice(0, NATURAL_TREE_COUNT)
    .filter((tree) => score >= tree.min)
    .reduce((best, tree) => Math.max(best, tree.n), 1);

  if (natural < NATURAL_TREE_COUNT) return natural;

  return treeSpecs
    .slice(NATURAL_TREE_COUNT)
    .filter((tree) => score >= tree.min && maxed.length >= tree.level10 && maxedAreas >= tree.areas)
    .reduce((best, tree) => Math.max(best, tree.n), natural);
}

export function nextTreeThreshold(variant: number): number | null {
  const next = treeSpecs[variant];
  return next ? next.min : null;
}
