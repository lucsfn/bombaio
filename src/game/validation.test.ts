import { describe, expect, it } from '@jest/globals';
import { canRequestAssessment, validatorForLevel } from '@/game/validation';

describe('validatorForLevel', () => {
  it.each([1, 2, 3])('nível %i é validado por IA', (level) => {
    expect(validatorForLevel(level)).toBe('ai');
  });

  it.each([4, 5, 6])('nível %i é validado por pares', (level) => {
    expect(validatorForLevel(level)).toBe('peer');
  });

  it.each([7, 8, 9, 10])('nível %i é validado por especialista', (level) => {
    expect(validatorForLevel(level)).toBe('expert');
  });

  it.each([0, 11, 2.5])('nível %p não tem validador', (level) => {
    expect(validatorForLevel(level)).toBeNull();
  });
});

describe('canRequestAssessment', () => {
  it('libera a avaliação quando a prática do próximo nível está completa', () => {
    expect(canRequestAssessment({ level: 3, practiceXp: 400 })).toBe(true);
  });

  it('bloqueia enquanto falta prática', () => {
    expect(canRequestAssessment({ level: 3, practiceXp: 180 })).toBe(false);
  });

  it('bloqueia no nível máximo', () => {
    expect(canRequestAssessment({ level: 10, practiceXp: 5000 })).toBe(false);
  });
});
