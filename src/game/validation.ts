import { MAX_SKILL_LEVEL, VALIDATION_BANDS } from '@/game/constants';
import { practiceXpForLevel } from '@/game/levels';

export type Validator = keyof typeof VALIDATION_BANDS;

export function validatorForLevel(level: number): Validator | null {
  if (!Number.isInteger(level)) return null;
  const match = (Object.keys(VALIDATION_BANDS) as Validator[]).find(
    (validator) => level >= VALIDATION_BANDS[validator].from && level <= VALIDATION_BANDS[validator].to,
  );
  return match ?? null;
}

export function canRequestAssessment(skill: { level: number; practiceXp: number }): boolean {
  if (skill.level >= MAX_SKILL_LEVEL) return false;
  return skill.practiceXp >= practiceXpForLevel(skill.level + 1);
}
