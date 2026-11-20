import { WEEKLY_CHEST_XP } from '@/game/constants';

export type MissionResult = {
  totalXp: number;
  weeklyXp: number;
  gained: number;
};

export function completeMission(
  hero: { totalXp: number; weeklyXp: number },
  mission: { xp: number; done: boolean },
): MissionResult {
  const gained = mission.done ? 0 : Math.max(0, mission.xp);
  return { totalXp: hero.totalXp + gained, weeklyXp: hero.weeklyXp + gained, gained };
}

export function weeklyChestProgress(weeklyXp: number) {
  const current = Math.min(WEEKLY_CHEST_XP, Math.max(0, weeklyXp));
  return { current, goal: WEEKLY_CHEST_XP, remaining: WEEKLY_CHEST_XP - current, open: current >= WEEKLY_CHEST_XP };
}
