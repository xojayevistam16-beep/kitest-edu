import { User, RankTierInfo } from '../types';

export type { RankTierInfo };

export const DEFAULT_RANKS_CONFIG: RankTierInfo[] = [
  {
    tier: 'Pupil',
    uzName: "Boshlang'ich O'quvchi",
    minRating: 0,
    badge: '🥉',
    color: 'text-slate-300',
    border: 'border-slate-600',
    bgGradient: 'from-slate-700 to-slate-800',
    textGradient: 'from-slate-200 to-slate-400',
    description: "Ilm yo'lidagi ilk qadamlar, boshlang'ich darslarni o'rganish bosqichi."
  },
  {
    tier: 'Specialist',
    uzName: 'Mutaxassis',
    minRating: 151,
    badge: '🥈',
    color: 'text-cyan-400',
    border: 'border-cyan-500/40',
    bgGradient: 'from-cyan-950 to-slate-900',
    textGradient: 'from-cyan-300 to-blue-400',
    description: "Bir nechta fanlardan asosiy qoidalar va darslarni muvaffaqiyatli o'zlashtirgan."
  },
  {
    tier: 'Pro',
    uzName: 'Professional',
    minRating: 351,
    badge: '🔹',
    color: 'text-blue-400',
    border: 'border-blue-500/40',
    bgGradient: 'from-blue-950 to-slate-900',
    textGradient: 'from-blue-300 to-indigo-400',
    description: "Darsliklarni chuqur o'rganib, test va misollarni barqaror yechuvchi bilimdon."
  },
  {
    tier: 'Expert',
    uzName: 'Ekspert',
    minRating: 651,
    badge: '💠',
    color: 'text-teal-400',
    border: 'border-teal-500/40',
    bgGradient: 'from-teal-950 to-slate-900',
    textGradient: 'from-teal-300 to-emerald-400',
    description: "Matematika, Informatika va Fizikadan ko'plab mavzularni 100% bajargan ekspert."
  },
  {
    tier: 'Master',
    uzName: 'Usta (Master)',
    minRating: 1101,
    badge: '🔮',
    color: 'text-purple-400',
    border: 'border-purple-500/50',
    bgGradient: 'from-purple-950 to-slate-900',
    textGradient: 'from-purple-300 to-pink-400',
    description: "Muntazam amaliyot bilan yuzlab masalalarni hal qilgan bilim ustasi."
  },
  {
    tier: 'Candidate Master',
    uzName: 'Masterlikka Nomzod (CM)',
    minRating: 1701,
    badge: '💎',
    color: 'text-pink-400',
    border: 'border-pink-500/50',
    bgGradient: 'from-pink-950 to-slate-900',
    textGradient: 'from-pink-300 to-rose-400',
    description: "Barcha sinflar dasturini yuqori darajada o'zlashtirgan yuqori toifali nomzod."
  },
  {
    tier: 'Grandmaster',
    uzName: 'Grossmeyster (GM)',
    minRating: 2401,
    badge: '🔴',
    color: 'text-rose-400',
    border: 'border-rose-500/60',
    bgGradient: 'from-rose-950 to-slate-900',
    textGradient: 'from-rose-400 via-orange-300 to-amber-300',
    description: "Mintaqaviy va platformadagi barcha qiyin olimpiada darajasidagi testlarni yenggan."
  },
  {
    tier: 'International Master',
    uzName: 'Xalqaro Usta (IM)',
    minRating: 3201,
    badge: '⚡',
    color: 'text-amber-400',
    border: 'border-amber-500/70',
    bgGradient: 'from-amber-950 to-slate-900',
    textGradient: 'from-amber-300 via-yellow-300 to-orange-400',
    description: "Xalqaro standartdagi eng yuqori ilmiy natijalarga erishgan intellektual etakchi."
  },
  {
    tier: 'G.O.A.T.',
    uzName: 'G.O.A.T. (Buyuklar Buyugi)',
    minRating: 4201,
    badge: '👑',
    color: 'text-yellow-300',
    border: 'border-yellow-400/80 shadow-[0_0_20px_rgba(250,204,21,0.3)]',
    bgGradient: 'from-yellow-950 via-slate-900 to-amber-950',
    textGradient: 'from-yellow-200 via-amber-300 to-orange-400',
    description: "Barcha zamonlarning eng buyuk bilimdoni! 100% darslar va rekord darajadagi yechilgan masalalar egasi."
  }
];

let dynamicRanksCache: RankTierInfo[] = (() => {
  try {
    const saved = localStorage.getItem('cosmo_dynamic_ranks');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.minRating - b.minRating);
      }
    }
  } catch {
    // ignore
  }
  return [...DEFAULT_RANKS_CONFIG];
})();

export function setDynamicRanks(ranks: RankTierInfo[]) {
  if (Array.isArray(ranks) && ranks.length > 0) {
    dynamicRanksCache = [...ranks].sort((a, b) => a.minRating - b.minRating);
    try {
      localStorage.setItem('cosmo_dynamic_ranks', JSON.stringify(dynamicRanksCache));
    } catch {
      // ignore
    }
  }
}

export function getRankTiersList(): RankTierInfo[] {
  return dynamicRanksCache;
}

export const RANK_TIERS_CONFIG = DEFAULT_RANKS_CONFIG;

export function getUserCompletedLessonsCount(user: User): number {
  if (Array.isArray(user.completedLessons)) {
    return user.completedLessons.length;
  }
  try {
    const saved = localStorage.getItem(`cosmo_completed_lessons_${user.username.toLowerCase()}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.length : 0;
    }
  } catch {
    // ignore
  }
  return 0;
}

export function getUserSolvedProblemsCount(user: User): number {
  if (typeof user.solvedProblemsCount === 'number') {
    return user.solvedProblemsCount;
  }
  try {
    const saved = localStorage.getItem(`cosmo_solved_problems_${user.username.toLowerCase()}`);
    if (saved) {
      return parseInt(saved, 10) || 0;
    }
  } catch {
    // ignore
  }
  return 0;
}

/**
 * Calculates official Rating points:
 * Rating = (Completed Lessons * 60) + (Solved Quiz/Test Problems * 10) + (Daily Streaks * 15) + (Bonus Rating)
 */
export function calculateUserRating(user: User): number {
  const lessonsCount = getUserCompletedLessonsCount(user);
  const solvedCount = getUserSolvedProblemsCount(user);
  const streak = user.dailyChallengeStreak || 0;
  const bonus = user.bonusRating || 0;

  return (lessonsCount * 60) + (solvedCount * 10) + (streak * 15) + bonus;
}

export function getRankBoostPoints(user: User, customRanksList?: RankTierInfo[]): number {
  const currentRank = getUserRankInfo(user, customRanksList);
  if (!currentRank.nextTier) {
    return 200; // already top tier
  }
  return Math.max(150, (currentRank.nextTier.minRating - currentRank.rating) + 5);
}

export function getUserRankInfo(user: User, customRanksList?: RankTierInfo[]): RankTierInfo & {
  rating: number;
  lessonsCount: number;
  solvedCount: number;
  nextTier: RankTierInfo | null;
  progressToNext: number;
  pointsToNext: number;
} {
  const rating = calculateUserRating(user);
  const lessonsCount = getUserCompletedLessonsCount(user);
  const solvedCount = getUserSolvedProblemsCount(user);

  const ranksList = (customRanksList && customRanksList.length > 0)
    ? [...customRanksList].sort((a, b) => a.minRating - b.minRating)
    : dynamicRanksCache;

  let currentTierInfo = ranksList[0] || DEFAULT_RANKS_CONFIG[0];
  let nextTierInfo: RankTierInfo | null = ranksList.length > 1 ? ranksList[1] : null;

  for (let i = 0; i < ranksList.length; i++) {
    const info = ranksList[i];
    if (rating >= info.minRating) {
      currentTierInfo = info;
      nextTierInfo = i < ranksList.length - 1 ? ranksList[i + 1] : null;
    }
  }

  let progressToNext = 100;
  let pointsToNext = 0;

  if (nextTierInfo) {
    const range = nextTierInfo.minRating - currentTierInfo.minRating;
    const currentProgress = rating - currentTierInfo.minRating;
    progressToNext = Math.min(100, Math.max(0, Math.round((currentProgress / (range || 1)) * 100)));
    pointsToNext = Math.max(0, nextTierInfo.minRating - rating);
  }

  return {
    ...currentTierInfo,
    color: currentTierInfo.color || 'text-amber-400',
    border: currentTierInfo.border || 'border-amber-500/50',
    bgGradient: currentTierInfo.bgGradient || 'from-amber-950 to-slate-900',
    textGradient: currentTierInfo.textGradient || 'from-amber-300 to-yellow-400',
    rating,
    lessonsCount,
    solvedCount,
    nextTier: nextTierInfo,
    progressToNext,
    pointsToNext,
  };
}
