import { HERO_XP_BASE, HERO_XP_STEP, MAX_SKILL_LEVEL, PRACTICE_XP_PER_TARGET_LEVEL } from '@/game/constants';

export type LevelProgress = {
  level: number;
  current: number;
  needed: number;
};

export function heroXpToNext(level: number): number {
  return HERO_XP_BASE + HERO_XP_STEP * Math.max(1, Math.floor(level));
}

export function heroLevelProgress(totalXp: number): LevelProgress {
  let remaining = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (remaining >= heroXpToNext(level)) {
    remaining -= heroXpToNext(level);
    level += 1;
  }
  return { level, current: remaining, needed: heroXpToNext(level) };
}

export function practiceXpForLevel(targetLevel: number): number {
  if (!Number.isInteger(targetLevel) || targetLevel < 1 || targetLevel > MAX_SKILL_LEVEL) return 0;
  return targetLevel * PRACTICE_XP_PER_TARGET_LEVEL;
}
