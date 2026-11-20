import { describe, expect, it } from '@jest/globals';
import { heroLevelProgress, heroXpToNext, practiceXpForLevel } from '@/game/levels';

describe('heroXpToNext', () => {
  it('pede 450 XP para sair do nível 1', () => {
    expect(heroXpToNext(1)).toBe(450);
  });

  it('cresce 50 XP por nível: 1000 no nível 12, como no protótipo', () => {
    expect(heroXpToNext(12)).toBe(1000);
  });
});

describe('heroLevelProgress', () => {
  it('começa no nível 1 com 0 XP', () => {
    expect(heroLevelProgress(0)).toEqual({ level: 1, current: 0, needed: 450 });
  });

  it('sobe para o nível 2 com 450 XP', () => {
    expect(heroLevelProgress(450)).toEqual({ level: 2, current: 0, needed: 500 });
  });

  it('reproduz o herói do protótipo: nível 12 com 740 de 1000', () => {
    expect(heroLevelProgress(8440)).toEqual({ level: 12, current: 740, needed: 1000 });
  });

  it('trata XP negativo como zero', () => {
    expect(heroLevelProgress(-50)).toEqual({ level: 1, current: 0, needed: 450 });
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
