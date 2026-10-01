import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import {
  Calendar,
  Flame,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface DailyChallengeProps {
  user: User;
  onUserUpdate: (updated: Partial<User>) => void;
  onToast: (msg: string) => void;
}

interface ChallengeData {
  date: string;
  msUntilNext: number;
  baseReward: number;
  question: {
    id: string;
    q: string;
    a: string[];
    cat: string;
    difficulty: string;
  };
  userStatus: {
    attempted: boolean;
    won: boolean;
    streak: number;
    coinsWon: number;
  };
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  user,
  onUserUpdate,
  onToast,
}) => {
  const [data, setData] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    reward: number;
    streak: number;
    correctAnswerIndex: number;
    explanation: string;
  } | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const loadChallenge = async () => {
    try {
      const res = await api.getDailyChallenge(user.username);
      setData(res);
      setTimeLeft(res.msUntilNext || 0);

      // If already attempted today in user status
      if (res.userStatus.attempted) {
        setResult({
          isCorrect: res.userStatus.won,
          reward: res.userStatus.coinsWon || (res.userStatus.won ? res.baseReward : 0),
          streak: res.userStatus.streak || 0,
          correctAnswerIndex: -1,
          explanation: res.userStatus.won
            ? "Bugungi kunlik sinov to'g'ri yechilgan!"
            : "Bugungi urinish yakunlangan. Ertaga yana sinab ko'ring!",
        });
      }
    } catch (err: any) {
      console.error('Error loading daily challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenge();
  }, [user.username]);

  // Live timer countdown until midnight
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatCountdown = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (selectedIdx === null || submitting || !data) return;

    setSubmitting(true);
    try {
      const res = await api.submitDailyChallenge(user.username, selectedIdx);
      setResult(res);
      onUserUpdate({
        coins: res.newCoins,
        dailyChallengeDate: data.date,
        dailyChallengeCompleted: true,
        dailyChallengeWon: res.isCorrect,
        dailyChallengeStreak: res.streak,
      });

      if (res.isCorrect) {
        onToast(`🎉 TABRIKLAYMIZ! Kunlik Sinov to'g'ri yechildi va +${res.reward} Tanga berildi!`);
      } else {
        onToast(`Noto'g'ri javob. Ertaga yana sinab ko'ring!`);
      }
    } catch (err: any) {
      onToast(err.message || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const streak = result ? result.streak : data?.userStatus.streak || user.dailyChallengeStreak || 0;
  const isAlreadyAttempted = !!result || !!data?.userStatus.attempted;

  if (loading) {
    return (
      <div className="w-full bg-slate-900/80 border border-amber-500/30 rounded-3xl p-6 text-center animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-12 bg-slate-800 rounded w-2/3 mx-auto"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_35px_rgba(245,158,11,0.15)] relative overflow-hidden text-left">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300">
                Kunlik Sinov (Daily Challenge)
              </h2>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                1 KUNDA 1 SAVOL
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bugungi maxsus savolga to'g'ri javob bering va qo'shimcha tangalarga ega bo'ling!
            </p>
          </div>
        </div>

        {/* Streak and Timer Badges */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Flame streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black shadow-sm">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>{streak} kunlik seriya</span>
          </div>

          {/* Countdown until next challenge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{formatCountdown(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Main Challenge Content */}
      {!isAlreadyAttempted ? (
        <div className="space-y-5">
          {/* Category & Reward banner */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold px-3 py-1 rounded-xl">
                📚 {data.question.cat}
              </span>
              <span className="bg-purple-500/10 border border-purple-500/30 text-purple-300 font-semibold px-2.5 py-1 rounded-xl">
                Qiyinlik: {data.question.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-amber-400 font-black text-xs sm:text-sm bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
              <Sparkles className="w-4 h-4" />
              <span>Mukofot: +{data.baseReward + Math.min(50, streak * 10)} Tanga</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-base sm:text-lg font-extrabold text-white leading-relaxed">
              {data.question.q}
            </h3>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.question.a.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm text-left transition transform active:scale-98 flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400 text-white font-bold shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400 text-center sm:text-left">
              💡 Diqqat: Kuniga faqat bir marta javob berish mumkin! To'g'ri topshirsangiz seriyangiz o'sadi va ko'proq tanga beriladi.
            </p>

            <button
              type="button"
              disabled={selectedIdx === null || submitting}
              onClick={handleSubmit}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'TEKSHIRILMOQDA...' : 'JAVOBNI TASDIQLASH'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Result Screen when already completed today */
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl p-0.5 flex items-center justify-center">
            {result?.isCorrect ? (
              <div className="w-full h-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30">
                🎉
              </div>
            ) : (
              <div className="w-full h-full bg-rose-500/20 border-2 border-rose-400 text-rose-400 rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-rose-500/30">
                ❌
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {result?.isCorrect
                ? "TABRIKLAYMIZ! KUNLIK SINOV MUVAFFAQIYATLI O'TDI!"
                : "Bugungi Kunlik Sinov Yakunlandi"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
              {result?.explanation}
            </p>
          </div>

          {result?.isCorrect && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-black shadow-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sizga +{result.reward} Tanga taqdim etildi!</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800/80 max-w-sm mx-auto flex items-center justify-between text-xs text-slate-400">
            <span>Keyingi savol ochilishiga:</span>
            <span className="font-mono font-black text-teal-300 bg-slate-900 px-3 py-1 rounded-xl border border-slate-700">
              {formatCountdown(timeLeft)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
