import React, { useState, useMemo, useEffect } from 'react';
import { EducationLesson, QuizQuestion, User } from '../types';
import { api } from '../services/api';
import {
  getUserRankInfo,
  getRankTiersList,
  calculateUserRating,
  getUserSolvedProblemsCount,
  getUserCompletedLessonsCount,
  RankTierInfo
} from '../utils/rankUtils';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Trophy,
  CheckCheck,
  TrendingUp,
  RotateCcw,
  Target,
  Flame,
  Crown,
  Zap,
  Info,
  X
} from 'lucide-react';

interface EducationSectionProps {
  user: User;
  lessonsBySubject: Record<string, EducationLesson[]>;
  onUserUpdate: (updated: Partial<User>) => void;
  onToast: (msg: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  user,
  lessonsBySubject,
  onUserUpdate,
  onToast,
}) => {
  const subjects = Object.keys(lessonsBySubject);
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0] || 'matematika');
  const [selectedLesson, setSelectedLesson] = useState<EducationLesson | null>(null);
  const [search, setSearch] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [showRanksRoadmap, setShowRanksRoadmap] = useState(false);

  // Completed Lessons list for user (synced with user state & localStorage)
  const completedLessonKeys: string[] = useMemo(() => {
    if (Array.isArray(user.completedLessons)) {
      return user.completedLessons;
    }
    try {
      const saved = localStorage.getItem(`cosmo_completed_lessons_${user.username.toLowerCase()}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, [user.completedLessons, user.username]);

  // Dynamic Rank & Rating Info
  const rankInfo = useMemo(() => {
    return getUserRankInfo(user);
  }, [user, completedLessonKeys]);

  // Lesson Test state
  const [testing, setTesting] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const getSubjectMeta = (subj: string) => {
    switch (subj.toLowerCase()) {
      case 'matematika':
        return { name: 'Matematika', emoji: '📐', border: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-300', color: 'from-blue-500 to-cyan-500' };
      case 'informatika':
        return { name: 'Informatika', emoji: '💻', border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300', color: 'from-purple-500 to-indigo-500' };
      case 'fizika':
        return { name: 'Fizika', emoji: '⚡', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300', color: 'from-emerald-500 to-teal-500' };
      case 'ingliz':
      case 'ingliz-tili':
      case 'ingliz_tili':
        return { name: 'Ingliz tili', emoji: '🇬🇧', border: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-300', color: 'from-rose-500 to-red-600' };
      default:
        return { name: subj.toUpperCase(), emoji: '📚', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300', color: 'from-amber-500 to-orange-500' };
    }
  };

  const getLessonKey = (lesson: EducationLesson) => {
    return `${lesson.subject || selectedSubject}_${lesson.title}`.toLowerCase();
  };

  const isLessonCompleted = (lesson: EducationLesson) => {
    const key = getLessonKey(lesson);
    return completedLessonKeys.includes(key);
  };

  // Progress Calculations
  const stats = useMemo(() => {
    let totalAll = 0;
    let completedAll = 0;
    const subjectStats: Record<string, { total: number; completed: number; percent: number }> = {};

    subjects.forEach((subj) => {
      const list = lessonsBySubject[subj] || [];
      const total = list.length;
      const completed = list.filter((l) => {
        const key = `${l.subject || subj}_${l.title}`.toLowerCase();
        return completedLessonKeys.includes(key);
      }).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      subjectStats[subj] = { total, completed, percent };
      totalAll += total;
      completedAll += completed;
    });

    const totalPercent = totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0;

    return {
      totalAll,
      completedAll,
      totalPercent,
      subjectStats,
    };
  }, [lessonsBySubject, subjects, completedLessonKeys]);

  const rawLessons = lessonsBySubject[selectedSubject] || [];
  const currentLessons = rawLessons.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedGradeFilter !== 'all' && !l.title.toLowerCase().includes(selectedGradeFilter.toLowerCase())) {
      return false;
    }

    const completed = isLessonCompleted(l);
    if (statusFilter === 'completed' && !completed) return false;
    if (statusFilter === 'pending' && completed) return false;

    return true;
  });

  const markLessonComplete = (lesson: EducationLesson, correctInTest: number) => {
    const key = getLessonKey(lesson);
    const updatedKeys = completedLessonKeys.includes(key)
      ? completedLessonKeys
      : [...completedLessonKeys, key];

    localStorage.setItem(`cosmo_completed_lessons_${user.username.toLowerCase()}`, JSON.stringify(updatedKeys));

    const currentSolved = getUserSolvedProblemsCount(user);
    const updatedSolved = currentSolved + correctInTest;
    localStorage.setItem(`cosmo_solved_problems_${user.username.toLowerCase()}`, String(updatedSolved));

    onUserUpdate({
      completedLessons: updatedKeys,
      solvedProblemsCount: updatedSolved
    });

    // Sync to backend so other users see real rank on leaderboard
    api.updateUserStats(user.username, {
      completedLessons: updatedKeys,
      solvedProblemsCount: updatedSolved
    }).catch(() => {});
  };

  const handleStartTest = () => {
    if (!selectedLesson) return;
    const prepared = selectedLesson.questions.map((item) => {
      const indexed = item.a.map((opt, i) => ({ opt, isCorrect: i === item.c }));
      for (let i = indexed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
      }
      return {
        q: item.q,
        a: indexed.map((x) => x.opt),
        c: indexed.findIndex((x) => x.isCorrect),
        cat: item.cat,
      };
    });

    setShuffledQuestions(prepared);
    setQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTesting(true);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = shuffledQuestions[qIndex];
    if (index === currentQ.c) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (qIndex + 1 < shuffledQuestions.length) {
      setQIndex((idx) => idx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Test ended
      const finalScore = score;
      const isPassed = finalScore >= Math.ceil(shuffledQuestions.length / 2);
      const bonusCoins = finalScore * 5;

      if (selectedLesson && isPassed) {
        markLessonComplete(selectedLesson, finalScore);
      }

      if (bonusCoins > 0) {
        try {
          const res = await api.changePlayerCoins(user.username, bonusCoins);
          onUserUpdate({ coins: res.coins });
        } catch {
          // ignore
        }
      }

      if (isPassed) {
        onToast(`🎉 Tabriklaymiz! Mavzu o'zlashtirildi (${finalScore}/${shuffledQuestions.length}). Reyting va +${bonusCoins} Tanga qo'shildi!`);
      } else {
        onToast(`⚠️ Natija: ${finalScore}/${shuffledQuestions.length}. Mavzuni qayta o'qib, testni qayta topshiring.`);
      }

      setTesting(false);
      setSelectedLesson(null);
    }
  };

  const currentSubjectStat = stats.subjectStats[selectedSubject] || { total: 0, completed: 0, percent: 0 };

  return (
    <div className="w-full space-y-5">
      {/* 1. DYNAMIC RANKING & PROGRESS BAR BANNER */}
      <div className="bg-slate-950/90 border border-teal-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden text-left">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          {/* Rank Badge & Tier Name */}
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${rankInfo.bgGradient} border ${rankInfo.border} p-0.5 shadow-xl flex items-center justify-center shrink-0`}>
              <div className="w-full h-full bg-slate-900/90 rounded-[14px] flex items-center justify-center text-3xl">
                {rankInfo.badge}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Daraja (Ranking):
                </span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r ${rankInfo.bgGradient} border ${rankInfo.border} ${rankInfo.color} shadow`}>
                  {rankInfo.tier} ({rankInfo.uzName})
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-extrabold text-white">
                  Reyting: <strong className="text-amber-300 font-mono">{rankInfo.rating}</strong> Ball
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  <strong className="text-teal-300 font-mono">{rankInfo.lessonsCount}</strong> ta dars
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  <strong className="text-emerald-300 font-mono">{rankInfo.solvedCount}</strong> ta misol
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons: Ranks Roadmap */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={() => setShowRanksRoadmap(true)}
              className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition active:scale-95 shadow"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Barcha Darajalar Yo'li</span>
            </button>

            <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-2xl text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase">O'zlashtirish</div>
              <div className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
                {stats.totalPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression to Next Rank Tier */}
        {rankInfo.nextTier ? (
          <div className="mb-3 space-y-1.5 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <span>Keyingi unvon:</span>
                <strong className={rankInfo.nextTier.color}>
                  {rankInfo.nextTier.badge} {rankInfo.nextTier.tier} ({rankInfo.nextTier.uzName})
                </strong>
              </span>
              <span className="text-amber-300 font-mono font-black text-xs">
                {rankInfo.pointsToNext} ball qoldi ({rankInfo.progressToNext}%)
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 via-amber-400 to-emerald-400 transition-all duration-700"
                style={{ width: `${Math.max(rankInfo.progressToNext, 3)}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="mb-3 p-2.5 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/10 border border-yellow-500/40 text-xs text-yellow-300 font-black flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>Siz eng oliy «G.O.A.T.» (Greatest Of All Time) darajasidasiz! Afsonaviy natija! 👑</span>
          </div>
        )}

        {/* Subject Mini-Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          {subjects.map((subj) => {
            const meta = getSubjectMeta(subj);
            const subStat = stats.subjectStats[subj] || { total: 0, completed: 0, percent: 0 };
            const isSelected = selectedSubject === subj;

            return (
              <div
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-teal-400 shadow-md shadow-teal-500/10'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span>{meta.emoji}</span>
                    <span>{meta.name}</span>
                  </span>
                  <span className="font-mono font-black text-teal-300">
                    {subStat.completed}/{subStat.total} ({subStat.percent}%)
                  </span>
                </div>

                {/* Mini bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${meta.color} transition-all duration-500`}
                    style={{ width: `${subStat.percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SUBJECT TABS & FILTERS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-teal-500/20 border border-purple-500/30 text-purple-300">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-300 to-emerald-300">
                {getSubjectMeta(selectedSubject).name} Darslari
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-black">
                {currentSubjectStat.completed} / {currentSubjectStat.total} tugatildi
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Mavzuni o'qing, testni yeching va reyting ballaringizni oshirib unvonlarga erishing!
            </p>
          </div>
        </div>

        {/* Subject selector pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {subjects.map((subj) => {
            const meta = getSubjectMeta(subj);
            const active = selectedSubject === subj;
            const subStat = stats.subjectStats[subj] || { total: 0, completed: 0, percent: 0 };
            return (
              <button
                key={subj}
                onClick={() => {
                  setSelectedSubject(subj);
                  setSelectedLesson(null);
                  setTesting(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                  active
                    ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{meta.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-900/60">
                  {subStat.percent}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN LESSONS GRID OR DETAIL VIEW */}
      {!selectedLesson ? (
        <div className="space-y-4">
          {/* Search, Grade & Completion Status Filters */}
          <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mavzu nomi bo'yicha qidirish..."
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-teal-400 transition"
              />
            </div>

            {/* Status Filter Tabs (Barchasi, O'zlashtirilgan, O'rganish kerak) */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'all'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hammasi ({rawLessons.length})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>O'zlashtirilgan ({currentSubjectStat.completed})</span>
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                O'rganish kerak ({currentSubjectStat.total - currentSubjectStat.completed})
              </button>
            </div>

            {/* Grade filter tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
              {['all', '5-sinf', '6-sinf', '7-sinf', '8-sinf'].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGradeFilter(grade)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 whitespace-nowrap ${
                    selectedGradeFilter === grade
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {grade === 'all' ? 'Barcha sinflar' : grade}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Grid with visual completion indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[560px] overflow-y-auto pr-1">
            {currentLessons.map((lesson) => {
              const completed = isLessonCompleted(lesson);

              return (
                <div
                  key={lesson.id || lesson.title}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-4 sm:p-5 rounded-3xl flex flex-col justify-between cursor-pointer transition transform active:scale-98 group shadow-lg relative border ${
                    completed
                      ? 'bg-slate-900/95 border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/5'
                      : 'bg-slate-900/80 border-slate-800 hover:border-teal-400/60'
                  }`}
                >
                  <div>
                    {/* Status Ribbon / Top meta */}
                    <div className="flex items-center justify-between text-[11px] mb-2.5">
                      <span className="font-semibold text-slate-400 flex items-center gap-1">
                        {getSubjectMeta(selectedSubject).emoji} {lesson.title.split(' ')[0]}
                      </span>

                      {completed ? (
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-black">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>O'zlashtirildi ✓</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-950 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-slate-800">
                          {lesson.questions?.length || 4} ta test
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-extrabold text-white group-hover:text-teal-300 transition line-clamp-2 leading-snug">
                      {lesson.title}
                    </h3>
                  </div>

                  {/* Card footer with progress bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          completed ? 'bg-emerald-400 w-full' : 'bg-slate-800 w-0'
                        }`}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className={completed ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                        {completed ? '100% Tugatilgan' : 'O\'rganilmagan'}
                      </span>
                      <div className="flex items-center gap-1 text-teal-400 font-bold group-hover:translate-x-1 transition">
                        <span>{completed ? 'Takrorlash' : 'Boshlash'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {currentLessons.length === 0 && (
            <div className="text-center py-12 bg-slate-950/60 rounded-3xl border border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-bold">Mavzu topilmadi</p>
              <p className="text-xs text-slate-500 mt-1">Filtr parametrlarini o'zgartirib ko'ring.</p>
            </div>
          )}
        </div>
      ) : (
        /* Comprehensive Single-Topic Lesson Viewer */
        <div className="bg-slate-900/95 border border-teal-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative text-left">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Mavzular ro'yxatiga qaytish</span>
            </button>

            {isLessonCompleted(selectedLesson) && (
              <span className="flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Bu mavzu to'liq o'zlashtirilgan (100%)</span>
              </span>
            )}
          </div>

          <div className="border-b border-slate-800 pb-3.5 mb-5">
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2.5 py-1 rounded-full">
              {getSubjectMeta(selectedSubject).name} darsligi
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2 leading-snug">
              {selectedLesson.title}
            </h3>
          </div>

          {/* Full Lesson Content Cards */}
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 mb-6 scrollbar-thin">
            {selectedLesson.steps.map((st, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 transition hover:border-slate-700"
              >
                <h4 className="font-extrabold text-amber-300 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black shrink-0">
                    {idx + 1}
                  </span>
                  <span>{st.h}</span>
                </h4>
                <div className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line pl-1 sm:pl-8">
                  {st.t}
                </div>
              </div>
            ))}
          </div>

          {/* Test CTA */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              Mavzuni to'liq o'rganib bo'ldingizmi? Testni topshiring va unvoningizni oshiring!
            </div>
            <button
              onClick={handleStartTest}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-2 shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>
                {isLessonCompleted(selectedLesson)
                  ? `TESTNI QAYTA TOPSHIRISH (${selectedLesson.questions?.length || 4} TA SAVOL)`
                  : `MAVZU TESTINI TOPSHIRISH VA TUGATISH (${selectedLesson.questions?.length || 4} TA)`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 4. RANKINGS ROADMAP MODAL (PUPIL => G.O.A.T.) */}
      {showRanksRoadmap && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-500/60 w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl relative text-left max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Cosmo Ranking Darajalari (Yo'l Xaritasi)
                  </h3>
                  <p className="text-xs text-slate-400">
                    O'rgangan darslaringiz va yechgan misollaringizga qarab beriladigan unvonlar zanjiri
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRanksRoadmap(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ranking formula description */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 mb-4 shrink-0 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-teal-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Reyting ballari qanday hisoblanadi?</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                • Har bir to'liq o'zlashtirilgan dars uchun: <strong className="text-teal-300">+60 Ball</strong><br />
                • Testdagi har bir to'g'ri yechilgan misol/savol uchun: <strong className="text-emerald-300">+10 Ball</strong><br />
                • Kunlik sinov ketma-ketligi (Streak) uchun: <strong className="text-amber-300">+15 Ball</strong>
              </p>
            </div>

            {/* Dynamic Ranks List */}
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 scrollbar-thin">
              {getRankTiersList().map((tier, idx) => {
                const isCurrent = rankInfo.tier === tier.tier;
                const isUnlocked = rankInfo.rating >= tier.minRating;

                return (
                  <div
                    key={tier.tier}
                    className={`p-3.5 rounded-2xl border transition relative flex items-center justify-between gap-3 ${
                      isCurrent
                        ? `bg-slate-950 border-amber-400/90 shadow-lg shadow-amber-500/10`
                        : isUnlocked
                        ? 'bg-slate-900/90 border-slate-700/80'
                        : 'bg-slate-950/40 border-slate-800/40 opacity-55'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow">
                        {tier.badge}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                            #{idx + 1}
                          </span>
                          <h4 className={`text-xs sm:text-sm font-black ${tier.color}`}>
                            {tier.tier}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-semibold truncate">
                            ({tier.uzName})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-black text-amber-300">
                        {tier.minRating}+ ball
                      </div>
                      {isCurrent ? (
                        <span className="inline-block mt-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                          Joriy Daraja ★
                        </span>
                      ) : isUnlocked ? (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-400">
                          ✓ Erishilgan
                        </span>
                      ) : (
                        <span className="inline-block mt-0.5 text-[9px] text-slate-500">
                          Qulflangan 🔒
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. LESSON TEST MODAL */}
      {testing && selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Mavzulashtirilgan Test
                </span>
                <h3 className="text-sm font-extrabold text-white line-clamp-1 mt-1">{selectedLesson.title}</h3>
              </div>
              <div className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-extrabold border border-slate-700">
                Savol: <span className="text-amber-400">{qIndex + 1}</span> / {shuffledQuestions.length}
              </div>
            </div>

            {/* Question */}
            <div className="my-4 min-h-[45px]">
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {shuffledQuestions[qIndex]?.q}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 my-4">
              {shuffledQuestions[qIndex]?.a.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === shuffledQuestions[qIndex]?.c;

                let btnStyle = "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200";

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-500/20";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-950 border-rose-500 text-rose-200";
                  } else {
                    btnStyle = "bg-slate-900 border-slate-800 text-slate-500 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-2 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && (
                      <span>
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isSelected ? (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                To'g'ri javoblar: <span className="text-emerald-400 font-bold">{score}</span> / {shuffledQuestions.length}
              </div>

              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition flex items-center gap-1.5 shadow"
                >
                  <span>{qIndex + 1 < shuffledQuestions.length ? 'Keyingi savol' : 'Natijani yakunlash'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
