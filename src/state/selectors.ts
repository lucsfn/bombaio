import type { GameState, Skill } from '@/data/types';
import { heroLevelProgress } from '@/game/levels';
import { masteryScore, nextTreeThreshold, treeVariant } from '@/game/mastery';

export function selectHeroLevel(state: GameState) {
  return heroLevelProgress(state.hero.totalXp);
}

export function selectEquippedTitle(state: GameState) {
  return state.titles.find((title) => title.id === state.hero.equippedTitleId)?.name ?? '';
}

export function selectTree(state: GameState) {
  const scored = state.skills.map((skill) => ({ level: skill.level, area: skill.areaId }));
  const variant = treeVariant(scored);
  return { variant, score: masteryScore(scored), nextThreshold: nextTreeThreshold(variant) };
}

export function selectSkill(state: GameState, skillId: string): Skill | undefined {
  return state.skills.find((skill) => skill.id === skillId);
}

export function selectOwnedSkills(state: GameState) {
  return state.skills.filter((skill) => skill.status !== 'seed');
}

export function selectPendingAssessment(state: GameState, skillId: string) {
  return state.assessments.find((item) => item.skillId === skillId && item.status === 'pending');
}

export function selectArea(state: GameState, areaId: string) {
  return state.areas.find((area) => area.id === areaId);
}
