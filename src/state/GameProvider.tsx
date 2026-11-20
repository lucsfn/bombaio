import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { initialState } from '@/data/mock';
import type { GameState, Settings } from '@/data/types';
import { gameReducer } from '@/state/gameReducer';
import type { SkillArtName } from '@/theme/art';

export type GameActions = {
  completeMission: (missionId: string) => void;
  dismissAchievement: () => void;
  unlockAchievement: (achievementId: string) => void;
  equipTitle: (titleId: string) => void;
  submitAssessment: (input: { skillId: string; evidence: string; summary: string }) => void;
  addSkill: (input: { name: string; areaId: string; art: SkillArtName }) => void;
  setOpenArea: (areaId: string | null) => void;
  setSetting: (key: keyof Settings, value: boolean) => void;
  signIn: (email: string) => void;
  signUp: (input: { name: string; email: string }) => void;
  signOut: () => void;
  completeOnboarding: (skills: { name: string; areaId: string; art: SkillArtName }[]) => void;
  editSkill: (input: { skillId: string; name: string; areaId: string }) => void;
};

type GameContextValue = {
  state: GameState;
  actions: GameActions;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const actions = useMemo<GameActions>(
    () => ({
      completeMission: (missionId) => dispatch({ type: 'completeMission', missionId }),
      dismissAchievement: () => dispatch({ type: 'dismissAchievement' }),
      unlockAchievement: (achievementId) => dispatch({ type: 'unlockAchievement', achievementId }),
      equipTitle: (titleId) => dispatch({ type: 'equipTitle', titleId }),
      submitAssessment: (input) =>
        dispatch({ type: 'submitAssessment', ...input, now: new Date().toISOString() }),
      addSkill: (input) => dispatch({ type: 'addSkill', ...input }),
      setOpenArea: (areaId) => dispatch({ type: 'setOpenArea', areaId }),
      setSetting: (key, value) => dispatch({ type: 'setSetting', key, value }),
      signIn: (email) => dispatch({ type: 'signIn', email }),
      signUp: (input) => dispatch({ type: 'signUp', ...input }),
      signOut: () => dispatch({ type: 'signOut' }),
      completeOnboarding: (skills) => dispatch({ type: 'completeOnboarding', skills }),
      editSkill: (input) => dispatch({ type: 'editSkill', ...input }),
    }),
    [],
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame precisa estar dentro de GameProvider');
  return context;
}
