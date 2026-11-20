import { describe, expect, it } from '@jest/globals';
import { FIRST_MISSION_ACHIEVEMENT_ID, initialState } from '@/data/mock';
import { gameReducer } from '@/state/gameReducer';

const now = '2026-11-20T12:00:00.000Z';

describe('completeMission', () => {
  it('soma o XP e marca a missão como concluída', () => {
    const state = gameReducer(initialState, { type: 'completeMission', missionId: 'logica' });
    const mission = state.missions.find((item) => item.id === 'logica');
    expect(mission?.done).toBe(true);
    expect(state.hero.weeklyXp).toBe(initialState.hero.weeklyXp + 25);
  });

  it('a primeira conclusão desbloqueia a Chama Acesa com XP e título', () => {
    const state = gameReducer(initialState, { type: 'completeMission', missionId: 'violao' });
    const achievement = state.achievements.find((item) => item.id === FIRST_MISSION_ACHIEVEMENT_ID);
    expect(achievement?.unlocked).toBe(true);
    expect(state.pendingAchievementId).toBe(FIRST_MISSION_ACHIEVEMENT_ID);
    expect(state.hero.totalXp).toBe(initialState.hero.totalXp + 40 + 150);
    expect(state.hero.ownedTitleIds).toContain('constante');
  });

  it('a segunda conclusão só dá XP, sem abrir conquista de novo', () => {
    const first = gameReducer(initialState, { type: 'completeMission', missionId: 'violao' });
    const dismissed = gameReducer(first, { type: 'dismissAchievement' });
    const second = gameReducer(dismissed, { type: 'completeMission', missionId: 'ingles' });
    expect(second.pendingAchievementId).toBeNull();
    expect(second.hero.totalXp).toBe(dismissed.hero.totalXp + 30);
  });

  it('missão já concluída não muda nada', () => {
    const first = gameReducer(initialState, { type: 'completeMission', missionId: 'logica' });
    expect(gameReducer(first, { type: 'completeMission', missionId: 'logica' })).toBe(first);
  });
});

describe('submitAssessment', () => {
  it('cria uma avaliação por pares para o nível 4 do Python e deixa o selo pendente', () => {
    const state = gameReducer(initialState, {
      type: 'submitAssessment',
      skillId: 'python',
      evidence: 'github.com/eu/projeto',
      summary: 'Automatiza relatórios',
      now,
    });
    expect(state.assessments).toHaveLength(1);
    expect(state.assessments[0]).toMatchObject({ skillId: 'python', targetLevel: 4, validator: 'peer', status: 'pending' });
    expect(state.skills.find((skill) => skill.id === 'python')?.validation).toBe('pending');
  });

  it('não aceita avaliação sem evidência', () => {
    const state = gameReducer(initialState, { type: 'submitAssessment', skillId: 'python', evidence: '  ', summary: '', now });
    expect(state).toBe(initialState);
  });

  it('não aceita uma segunda avaliação pendente da mesma skill', () => {
    const action = { type: 'submitAssessment', skillId: 'python', evidence: 'link', summary: '', now } as const;
    const once = gameReducer(initialState, action);
    expect(gameReducer(once, action)).toBe(once);
  });
});

describe('equipTitle', () => {
  it('equipa um título que o herói tem', () => {
    const state = gameReducer(initialState, { type: 'equipTitle', titleId: 'aprendiz' });
    expect(state.hero.equippedTitleId).toBe('aprendiz');
  });

  it('ignora um título que o herói não tem', () => {
    expect(gameReducer(initialState, { type: 'equipTitle', titleId: 'constante' })).toBe(initialState);
  });
});

describe('addSkill', () => {
  it('cadastra a skill no nível 0, disponível para praticar', () => {
    const state = gameReducer(initialState, { type: 'addSkill', name: 'Fotografia', areaId: 'cri', art: 'fotografia' });
    const added = state.skills[state.skills.length - 1];
    expect(added).toMatchObject({ name: 'Fotografia', areaId: 'cri', level: 0, status: 'available', validation: null });
  });

  it('não cadastra nome vazio nem repetido', () => {
    expect(gameReducer(initialState, { type: 'addSkill', name: ' ', areaId: 'cri', art: 'desenho' })).toBe(initialState);
    expect(gameReducer(initialState, { type: 'addSkill', name: 'python', areaId: 'tec', art: 'python' })).toBe(initialState);
  });
});

describe('preferências e navegação', () => {
  it('lembra a área aberta na árvore', () => {
    expect(gameReducer(initialState, { type: 'setOpenArea', areaId: 'idi' }).openArea).toBe('idi');
  });

  it('liga e desliga preferências', () => {
    const state = gameReducer(initialState, { type: 'setSetting', key: 'publicProfile', value: true });
    expect(state.settings.publicProfile).toBe(true);
  });
});
