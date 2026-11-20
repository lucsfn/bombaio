import { HERO_XP_PER_LEVEL, MAX_SKILL_LEVEL, PRACTICE_XP_PER_TARGET_LEVEL } from '@/game/constants';

export type LevelProgress = {
  level: number;
  current: number;
  needed: number;
};

export function heroLevelProgress(totalXp: number): LevelProgress {
  const xp = Math.max(0, Math.floor(totalXp));
  return {
    level: Math.floor(xp / HERO_XP_PER_LEVEL) + 1,
    current: xp % HERO_XP_PER_LEVEL,
    needed: HERO_XP_PER_LEVEL,
  };
}

export function practiceXpForLevel(targetLevel: number): number {
  if (!Number.isInteger(targetLevel) || targetLevel < 1 || targetLevel > MAX_SKILL_LEVEL) return 0;
  return targetLevel * PRACTICE_XP_PER_TARGET_LEVEL;
}
