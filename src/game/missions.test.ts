import { describe, expect, it } from '@jest/globals';
import { completeMission, weeklyChestProgress } from '@/game/missions';

const hero = { totalXp: 11740, weeklyXp: 320 };

describe('completeMission', () => {
  it('soma o XP da missão ao total e à semana', () => {
    expect(completeMission(hero, { xp: 40, done: false })).toEqual({ totalXp: 11780, weeklyXp: 360, gained: 40 });
  });

  it('missão já concluída não dá XP de novo', () => {
    expect(completeMission(hero, { xp: 40, done: true })).toEqual({ totalXp: 11740, weeklyXp: 320, gained: 0 });
  });

  it('missão nunca mexe no nível da skill, só no XP', () => {
    const result = completeMission(hero, { xp: 25, done: false });
    expect(Object.keys(result).sort()).toEqual(['gained', 'totalXp', 'weeklyXp']);
  });
});

describe('weeklyChestProgress', () => {
  it('mostra quanto falta para o baú de 500 XP', () => {
    expect(weeklyChestProgress(320)).toEqual({ current: 320, goal: 500, remaining: 180, open: false });
  });

  it('libera o baú ao chegar em 500', () => {
    expect(weeklyChestProgress(530)).toEqual({ current: 500, goal: 500, remaining: 0, open: true });
  });
});
