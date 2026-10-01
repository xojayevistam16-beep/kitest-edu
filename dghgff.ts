export interface RankTierInfo {
  tier: string;
  uzName: string;
  minRating: number;
  maxRating?: number;
  badge: string;
  color?: string;
  border?: string;
  bgGradient?: string;
  textGradient?: string;
  description: string;
}

export interface User {
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
  claimedMilestones?: number[];
  dailyChallengeDate?: string;
  dailyChallengeCompleted?: boolean;
  dailyChallengeWon?: boolean;
  dailyChallengeStreak?: number;
  coins: number;
  wheelSpins: number;
  lastSpinDate: string;
  bannedUntil: number | null;
  helper: boolean;
  isAdmin: boolean;
  createdAt: number;
  premiumUntil?: number | null;
  unlockedAvatars?: string[];
  packOpensToday?: number;
  packOpenDate?: string;
  superWheelSpins?: number;
  lastSuperSpinDate?: string;
  completedLessons?: string[];
  solvedProblemsCount?: number;
  bonusRating?: number;
  isJudge?: boolean;
}

export interface EventQuestion {
  q: string;
  a: string[];
  c: number;
}

export interface EventParticipant {
  username: string;
  score: number;
  total: number;
  timeSpentSec: number;
  completedAt: number;
  isJudge?: boolean;
}

export interface TournamentEvent {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  startTime: number;
  endTime: number;
  status: 'draft' | 'active' | 'finished';
  questions: EventQuestion[];
  participants: EventParticipant[];
  winners?: {
    username: string;
    rank: number;
    score: number;
    promotedTo: string;
    coinsReward: number;
  }[];
  createdBy: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  ts: number;
  role?: string;
  avatar?: string;
}

export interface ReelItem {
  id: string;
  user: string;
  caption: string;
  mediaType: 'image' | 'video' | 'none';
  mediaUrl: string;
  ts: number;
  likes: number;
}

export interface QuizQuestion {
  id?: string;
  q: string;
  a: string[];
  c: number;
  cat: string;
  author?: string;
}

export interface LessonStep {
  h: string;
  t: string;
}

export interface EducationLesson {
  id?: string;
  title: string;
  steps: LessonStep[];
  questions: QuizQuestion[];
  subject?: string;
  author?: string;
}

export interface CustomGame {
  id: string;
  title: string;
  description: string;
  icon?: string;
  code: string;
  price: number;
  reward?: number;
  author: string;
  ts: number;
}
