import { describe, expect, it } from '@jest/globals';
import { masteryScore, nextTreeThreshold, treeVariant } from '@/game/mastery';

type Sample = { level: number; area: string };

const repeat = (count: number, level: number, areas: string[] = ['tec']): Sample[] =>
  Array.from({ length: count }, (_, index) => ({ level, area: areas[index % areas.length] }));

describe('masteryScore', () => {
  it('soma os quadrados dos níveis: 3, 4 e 6 dão 61', () => {
    expect(masteryScore([{ level: 3 }, { level: 4 }, { level: 6 }])).toBe(61);
  });

  it('skills de nível 0 não somam', () => {
    expect(masteryScore([{ level: 0 }, { level: 2 }])).toBe(4);
  });

  it('perfil vazio vale 0', () => {
    expect(masteryScore([])).toBe(0);
  });
});

describe('treeVariant', () => {
  it.each([
    ['perfil vazio', [], 1],
    ['1 skill nível 2 (4 pontos)', repeat(1, 2), 2],
    ['4 skills nível 3 (36 pontos)', repeat(4, 3), 5],
    ['3, 4 e 6 (61 pontos)', [{ level: 3, area: 'a' }, { level: 4, area: 'a' }, { level: 6, area: 'a' }], 7],
    ['1 skill nível 10 (100 pontos)', repeat(1, 10), 8],
    ['10 skills nível 5 (250 pontos)', repeat(10, 5), 11],
    ['10 skills nível 7 (490 pontos)', repeat(10, 7), 12],
    ['10 skills nível 10 (1000 pontos)', repeat(10, 10), 15],
    ['20 skills nível 10 (2000 pontos)', repeat(20, 10), 17],
    ['35 skills nível 10 numa área só (3500 pontos)', repeat(35, 10), 20],
  ])('%s → variante %i', (_, skills, expected) => {
    expect(treeVariant(skills)).toBe(expected);
  });

  it('desperta o Poder I com 4725 pontos, 35 skills nível 10 em 3 áreas', () => {
    const skills = [...repeat(35, 10, ['tec', 'idi', 'mus']), ...repeat(25, 7)];
    expect(treeVariant(skills)).toBe(21);
  });

  it('mantém a árvore 20 sem áreas suficientes para o Poder I', () => {
    const skills = [...repeat(35, 10, ['tec', 'idi']), ...repeat(25, 7)];
    expect(treeVariant(skills)).toBe(20);
  });
});

describe('nextTreeThreshold', () => {
  it('aponta o mínimo da próxima árvore natural', () => {
    expect(nextTreeThreshold(7)).toBe(90);
  });

  it('não há próxima depois do Poder V', () => {
    expect(nextTreeThreshold(25)).toBeNull();
  });
});
