import { describe, expect, it } from '@jest/globals';
import { initialState } from '@/data/mock';
import { gameReducer } from '@/state/gameReducer';

describe('sessão', () => {
  it('começa fora da conta', () => {
    expect(initialState.session.signedIn).toBe(false);
  });

  it('entrar abre o perfil de exemplo, já com onboarding feito', () => {
    const state = gameReducer(initialState, { type: 'signIn', email: 'heroi@bombaio.app' });
    expect(state.session).toEqual({ signedIn: true, email: 'heroi@bombaio.app', onboarded: true });
    expect(state.hero.name).toBe(initialState.hero.name);
  });

  it('criar conta começa um perfil do zero, ainda sem onboarding', () => {
    const state = gameReducer(initialState, { type: 'signUp', name: 'Ana', email: 'ana@bombaio.app' });
    expect(state.session).toEqual({ signedIn: true, email: 'ana@bombaio.app', onboarded: false });
    expect(state.hero).toMatchObject({ name: 'Ana', totalXp: 0, weeklyXp: 0, streakDays: 0 });
    expect(state.skills).toHaveLength(0);
    expect(state.levelHistory).toHaveLength(0);
    expect(state.achievements.every((item) => !item.unlocked)).toBe(true);
    expect(state.missions.every((item) => !item.done)).toBe(true);
    expect(state.hero.ownedTitleIds).toEqual(['aprendiz']);
    expect(state.hero.equippedTitleId).toBe('aprendiz');
  });

  it('sair volta para fora da conta', () => {
    const signedIn = gameReducer(initialState, { type: 'signIn', email: 'heroi@bombaio.app' });
    expect(gameReducer(signedIn, { type: 'signOut' }).session.signedIn).toBe(false);
  });
});

describe('completeOnboarding', () => {
  it('cadastra as skills escolhidas e marca o onboarding como feito', () => {
    const fresh = gameReducer(initialState, { type: 'signUp', name: 'Ana', email: 'ana@bombaio.app' });
    const state = gameReducer(fresh, {
      type: 'completeOnboarding',
      skills: [
        { name: 'Violão', areaId: 'mus', art: 'violao' },
        { name: 'Inglês', areaId: 'idi', art: 'idiomas' },
      ],
    });
    expect(state.session.onboarded).toBe(true);
    expect(state.skills.map((skill) => skill.name)).toEqual(['Violão', 'Inglês']);
  });
});

describe('editSkill', () => {
  it('muda nome e área da skill', () => {
    const state = gameReducer(initialState, { type: 'editSkill', skillId: 'violao', name: 'Violão clássico', areaId: 'cri' });
    expect(state.skills.find((skill) => skill.id === 'violao')).toMatchObject({ name: 'Violão clássico', areaId: 'cri' });
  });

  it('não aceita nome vazio nem nome de outra skill', () => {
    expect(gameReducer(initialState, { type: 'editSkill', skillId: 'violao', name: ' ', areaId: 'mus' })).toBe(
      initialState,
    );
    expect(gameReducer(initialState, { type: 'editSkill', skillId: 'violao', name: 'Python', areaId: 'mus' })).toBe(
      initialState,
    );
  });
});
