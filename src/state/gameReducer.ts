import { FIRST_MISSION_ACHIEVEMENT_ID, STARTER_TITLE_ID } from '@/data/mock';
import type { GameState, Settings } from '@/data/types';
import { MAX_SKILL_LEVEL } from '@/game/constants';
import { completeMission } from '@/game/missions';
import { validatorForLevel } from '@/game/validation';
import type { SkillArtName } from '@/theme/art';

export type GameAction =
  | { type: 'completeMission'; missionId: string }
  | { type: 'unlockAchievement'; achievementId: string }
  | { type: 'dismissAchievement' }
  | { type: 'equipTitle'; titleId: string }
  | { type: 'submitAssessment'; skillId: string; evidence: string; summary: string; now: string }
  | { type: 'addSkill'; name: string; areaId: string; art: SkillArtName }
  | { type: 'setOpenArea'; areaId: string | null }
  | { type: 'setSetting'; key: keyof Settings; value: boolean }
  | { type: 'signIn'; email: string }
  | { type: 'signUp'; name: string; email: string }
  | { type: 'signOut' }
  | { type: 'completeOnboarding'; skills: { name: string; areaId: string; art: SkillArtName }[] }
  | { type: 'editSkill'; skillId: string; name: string; areaId: string };

function slugify(name: string) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function freshProfile(state: GameState, name: string, email: string): GameState {
  return {
    ...state,
    session: { signedIn: true, email, onboarded: false },
    hero: {
      name,
      totalXp: 0,
      weeklyXp: 0,
      streakDays: 0,
      equippedTitleId: STARTER_TITLE_ID,
      ownedTitleIds: [STARTER_TITLE_ID],
    },
    skills: [],
    missions: state.missions.map((mission) => ({ ...mission, done: false })),
    achievements: state.achievements.map((achievement) => ({ ...achievement, unlocked: false })),
    assessments: [],
    levelHistory: [],
    pendingAchievementId: null,
    openArea: null,
  };
}

function unlockAchievement(state: GameState, achievementId: string): GameState {
  const achievement = state.achievements.find((item) => item.id === achievementId);
  if (!achievement || achievement.unlocked) return state;
  const titleId = achievement.titleId;
  return {
    ...state,
    achievements: state.achievements.map((item) => (item.id === achievementId ? { ...item, unlocked: true } : item)),
    hero: {
      ...state.hero,
      totalXp: state.hero.totalXp + achievement.xp,
      ownedTitleIds:
        titleId && !state.hero.ownedTitleIds.includes(titleId)
          ? [...state.hero.ownedTitleIds, titleId]
          : state.hero.ownedTitleIds,
    },
    pendingAchievementId: achievementId,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'completeMission': {
      const mission = state.missions.find((item) => item.id === action.missionId);
      if (!mission || mission.done) return state;
      const firstCompletion = state.missions.every((item) => !item.done);
      const result = completeMission(state.hero, mission);
      const next: GameState = {
        ...state,
        hero: { ...state.hero, totalXp: result.totalXp, weeklyXp: result.weeklyXp },
        missions: state.missions.map((item) => (item.id === mission.id ? { ...item, done: true } : item)),
      };
      return firstCompletion ? unlockAchievement(next, FIRST_MISSION_ACHIEVEMENT_ID) : next;
    }
    case 'unlockAchievement':
      return unlockAchievement(state, action.achievementId);
    case 'dismissAchievement':
      return state.pendingAchievementId === null ? state : { ...state, pendingAchievementId: null };
    case 'equipTitle':
      if (!state.hero.ownedTitleIds.includes(action.titleId) || state.hero.equippedTitleId === action.titleId) {
        return state;
      }
      return { ...state, hero: { ...state.hero, equippedTitleId: action.titleId } };
    case 'submitAssessment': {
      const skill = state.skills.find((item) => item.id === action.skillId);
      const evidence = action.evidence.trim();
      const alreadyPending = state.assessments.some(
        (item) => item.skillId === action.skillId && item.status === 'pending',
      );
      if (!skill || evidence === '' || alreadyPending || skill.level >= MAX_SKILL_LEVEL) return state;
      const targetLevel = skill.level + 1;
      const validator = validatorForLevel(targetLevel);
      if (!validator) return state;
      return {
        ...state,
        assessments: [
          ...state.assessments,
          {
            id: skill.id + '-' + targetLevel + '-' + state.assessments.length,
            skillId: skill.id,
            targetLevel,
            validator,
            evidence,
            summary: action.summary.trim(),
            status: 'pending',
            sentAt: action.now,
          },
        ],
        skills: state.skills.map((item) => (item.id === skill.id ? { ...item, validation: 'pending' } : item)),
      };
    }
    case 'addSkill': {
      const name = action.name.trim();
      const id = slugify(name);
      const duplicate = state.skills.some((item) => item.id === id || item.name.toLowerCase() === name.toLowerCase());
      if (name === '' || id === '' || duplicate) return state;
      return {
        ...state,
        skills: [
          ...state.skills,
          { id, name, areaId: action.areaId, art: action.art, level: 0, practiceXp: 0, status: 'available', validation: null },
        ],
      };
    }
    case 'signIn':
      return { ...state, session: { signedIn: true, email: action.email.trim(), onboarded: true } };
    case 'signUp':
      return freshProfile(state, action.name.trim(), action.email.trim());
    case 'signOut':
      return { ...state, session: { ...state.session, signedIn: false } };
    case 'completeOnboarding': {
      const withSkills = action.skills.reduce<GameState>(
        (current, skill) => gameReducer(current, { type: 'addSkill', ...skill }),
        state,
      );
      return { ...withSkills, session: { ...withSkills.session, onboarded: true } };
    }
    case 'editSkill': {
      const name = action.name.trim();
      const skill = state.skills.find((item) => item.id === action.skillId);
      const taken = state.skills.some(
        (item) => item.id !== action.skillId && item.name.toLowerCase() === name.toLowerCase(),
      );
      if (!skill || name === '' || taken) return state;
      return {
        ...state,
        skills: state.skills.map((item) => (item.id === skill.id ? { ...item, name, areaId: action.areaId } : item)),
      };
    }
    case 'setOpenArea':
      return state.openArea === action.areaId ? state : { ...state, openArea: action.areaId };
    case 'setSetting':
      return state.settings[action.key] === action.value
        ? state
        : { ...state, settings: { ...state.settings, [action.key]: action.value } };
  }
}
