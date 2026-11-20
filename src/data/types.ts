import type { Validator } from '@/game/validation';
import type { IconName, SkillArtName } from '@/theme/art';

export type AreaIcon = { kind: 'icon'; name: IconName } | { kind: 'skill'; name: SkillArtName };

export type Area = {
  id: string;
  name: string;
  icon: AreaIcon;
};

export type SkillStatus = 'validated' | 'current' | 'available' | 'seed';

export type ValidationStatus = Validator | 'pending' | 'failed';

export type Skill = {
  id: string;
  name: string;
  areaId: string;
  art: SkillArtName;
  parentId?: string;
  level: number;
  practiceXp: number;
  status: SkillStatus;
  validation: ValidationStatus | null;
};

export type LevelRecord = {
  id: string;
  skillId: string;
  level: number;
  validator: Validator;
  date: string;
};

export type AssessmentStatus = 'pending' | 'approved' | 'failed';

export type Assessment = {
  id: string;
  skillId: string;
  targetLevel: number;
  validator: Validator;
  evidence: string;
  summary: string;
  status: AssessmentStatus;
  sentAt: string;
};

export type MissionKind = 'daily' | 'weekly' | 'main';

export type Mission = {
  id: string;
  kind: MissionKind;
  title: string;
  description: string;
  skillId?: string;
  xp: number;
  done: boolean;
};

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'obsidian';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  hint: string;
  tier: AchievementTier;
  icon: IconName;
  xp: number;
  titleId?: string;
  unlocked: boolean;
};

export type Title = {
  id: string;
  name: string;
};

export type Hero = {
  name: string;
  totalXp: number;
  weeklyXp: number;
  streakDays: number;
  equippedTitleId: string;
  ownedTitleIds: string[];
};

export type Settings = {
  dailyReminder: boolean;
  publicProfile: boolean;
};

export type Session = {
  signedIn: boolean;
  email: string;
  onboarded: boolean;
};

export type GameState = {
  session: Session;
  hero: Hero;
  areas: Area[];
  skills: Skill[];
  missions: Mission[];
  achievements: Achievement[];
  titles: Title[];
  assessments: Assessment[];
  levelHistory: LevelRecord[];
  settings: Settings;
  pendingAchievementId: string | null;
  openArea: string | null;
};
