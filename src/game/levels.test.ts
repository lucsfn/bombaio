import { describe, expect, it } from '@jest/globals';
import { heroLevelProgress, practiceXpForLevel } from '@/game/levels';

describe('heroLevelProgress', () => {
  it('começa no nível 1 com 0 XP', () => {
    expect(heroLevelProgress(0)).toEqual({ level: 1, current: 0, needed: 1000 });
  });

  it('sobe um nível a cada 1000 XP', () => {
    expect(heroLevelProgress(1000)).toEqual({ level: 2, current: 0, needed: 1000 });
  });

  it('reproduz o herói do protótipo: nível 12 com 740 de 1000', () => {
    expect(heroLevelProgress(11740)).toEqual({ level: 12, current: 740, needed: 1000 });
  });

  it('trata XP negativo como zero', () => {
    expect(heroLevelProgress(-50)).toEqual({ level: 1, current: 0, needed: 1000 });
  });
});

describe('practiceXpForLevel', () => {
  it('pede 400 XP de prática para o nível 4, como no protótipo', () => {
    expect(practiceXpForLevel(4)).toBe(400);
  });

  it('não pede prática para níveis fora de 1 a 10', () => {
    expect(practiceXpForLevel(0)).toBe(0);
    expect(practiceXpForLevel(11)).toBe(0);
  });
});
