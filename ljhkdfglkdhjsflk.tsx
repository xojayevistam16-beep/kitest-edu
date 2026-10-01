import React, { useState, useEffect, useMemo } from 'react';
import { User, TournamentEvent, EventQuestion, EventParticipant } from '../types';
import { api, initWebSocket } from '../services/api';
import { getUserRankInfo } from '../utils/rankUtils';
import {
  Trophy,
  Zap,
  Timer,
  CheckCircle2,
  XCircle,
  Crown,
  Award,
  ArrowRight,
  Flame,
  Users,
  Sparkles,
  RotateCcw,
  CheckCheck,
  Medal,
  Play,
  Clock
} from 'lucide-react';

interface TournamentEventSectionProps {
  user: User;
  onUserUpdate: (updated: Partial<User>) => void;
  onToast: (msg: string) => void;
}

export const TournamentEventSection: React.FC<TournamentEventSectionProps> = ({
  user,
  onUserUpdate,
  onToast,
}) => {
  const [event, setEvent] = useState<TournamentEvent | null>(null);
  const [history, setHistory] = useState<TournamentEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Play test state
  const [isPlaying, setIsPlaying] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [myResult, setMyResult] = useState<EventParticipant | null>(null);

  // Countdown timer for active event
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);

  const isOwner =
    user.isAdmin ||
    user.username.toLowerCase() === 'admin' ||
    user.email?.toLowerCase() === 'xojayevistam16@gmail.com';
  const isJudge = isOwner || !!user.helper;

  const loadEventData = async () => {
    setLoading(true);
    try {
      const res = await api.getActiveEvent();
      setEvent(res.event);
      setHistory(res.history || []);

      if (res.event && res.event.status === 'active') {
        const remaining = Math.max(0, Math.floor((res.event.endTime - Date.now()) / 1000));
        setTimeLeftSec(remaining);

        // Check if user already participated
        const myP = (res.event.participants || []).find(
          (p) => p.username.toLowerCase() === user.username.toLowerCase()
        );
        if (myP) {
          setHasSubmitted(true);
          setMyResult(myP);
        } else {
          setHasSubmitted(false);
          setMyResult(null);
        }
      } else if (res.event && res.event.status === 'finished') {
        const myP = (res.event.participants || []).find(
          (p) => p.username.toLowerCase() === user.username.toLowerCase()
        );
        if (myP) {
          setHasSubmitted(true);
          setMyResult(myP);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventData();

    const cleanup = initWebSocket({
      onEventUpdated: (updatedEvent) => {
        setEvent(updatedEvent);
        if (updatedEvent.status === 'active') {
          const remaining = Math.max(0, Math.floor((updatedEvent.endTime - Date.now()) / 1000));
          setTimeLeftSec(remaining);
        }
      },
      onEventStarted: (startedEvent) => {
        setEvent(startedEvent);
        const remaining = Math.max(0, Math.floor((startedEvent.endTime - Date.now()) / 1000));
        setTimeLeftSec(remaining);
        setHasSubmitted(false);
        setMyResult(null);
        setIsPlaying(false);
        onToast(`⚡ Yangi Jonli Turnir boshlandi: «${startedEvent.title}»!`);
      },
      onEventParticipantSubmitted: ({ event: updatedEvent, participant }) => {
        setEvent(updatedEvent);
        if (participant.username.toLowerCase() === user.username.toLowerCase()) {
          setMyResult(participant);
          setHasSubmitted(true);
        }
      },
      onEventFinished: ({ event: finishedEvent }) => {
        setEvent(finishedEvent);
        setIsPlaying(false);
        onToast(`🏆 «${finishedEvent.title}» turniri yakunlandi! Top 3 g'olib unvoni 1 pog'ona oshirildi!`);
      },
      onEventDeleted: () => {
        setEvent(null);
        setIsPlaying(false);
        setHasSubmitted(false);
      },
    });

    return () => cleanup();
  }, [user.username]);

  // Event countdown interval
  useEffect(() => {
    if (!event || event.status !== 'active') return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((event.endTime - Date.now()) / 1000));
      setTimeLeftSec(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  // Start taking event test
  const handleStartPlay = () => {
    if (!event || event.status !== 'active') {
      onToast("Hozirda faol musobaqa mavjud emas!");
      return;
    }
    if (event.questions.length === 0) {
      onToast("Ushbu eventda savollar mavjud emas!");
      return;
    }
    setQIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setTestStartTime(Date.now());
    setIsPlaying(true);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
  };

  const handleNextQuestion = async () => {
    if (!event) return;
    const currentQ = event.questions[qIndex];
    const isCorrect = selectedOption === currentQ.c;
    const newAnswers = [...answers, isCorrect ? 1 : 0];
    setAnswers(newAnswers);

    if (qIndex + 1 < event.questions.length) {
      setQIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Test finished! Calculate score & time
      const finalScore = newAnswers.reduce((a, b) => a + b, 0);
      const timeSpent = Math.max(1, Math.round((Date.now() - testStartTime) / 1000));

      try {
        const res = await api.submitEventAnswers(user.username, finalScore, event.questions.length, timeSpent);
        setMyResult(res.participant);
        setHasSubmitted(true);
        setIsPlaying(false);
        onToast(`🎉 Natijangiz saqlandi: ${finalScore}/${event.questions.length} ball (${timeSpent}s)!`);
      } catch (e: any) {
        onToast(e.message || 'Natijani yuborishda xatolik');
      }
    }
  };

  // Sort participants for leaderboard
  const sortedParticipants = useMemo(() => {
    if (!event || !Array.isArray(event.participants)) return [];
    return [...event.participants].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpentSec - b.timeSpentSec;
    });
  }, [event]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-teal-500/20 border border-amber-500/40 text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200">
                Jonli Musobaqa & Turnirlar (Events)
              </h2>
              {event && event.status === 'active' && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  JONLI JARAAYONDA
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Admin e'lon qilgan musobaqalarda qatnashing va <strong>Top 3 talikda unvoningizni (Rank) 1 pog'onaga ko'taring!</strong>
            </p>
          </div>
        </div>

        <button
          onClick={loadEventData}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-bold flex items-center gap-1.5 self-start sm:self-auto transition"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* 0. RASMIY HAKAMLAR HAY'ATI (OFFICIAL TOURNAMENT JUDGES) */}
      <div className="bg-slate-950/90 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-300 to-teal-300 flex items-center gap-2">
                <span>👨‍⚖️ Rasmiy Hakamlar Hay'ati (Judges & Jury)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Turnir va musobaqalarning adolatli, shaffof va xolis o'tishini ta'minlovchi doimiy hakamlar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 flex items-center gap-1.5">
              <span>⚖️ Xolis Baholash</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-lg shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Bosh Hakam (Chief Judge)</span>
                <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-500/40">ADMIN</span>
              </div>
              <div className="text-sm font-extrabold text-white">xojayevistam16@gmail.com (@admin)</div>
              <p className="text-[10px] text-slate-400">Musobaqalarni e'lon qilish, reglamentni tasdiqlash va g'oliblarni yakuniy e'lon qilish.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-lg shrink-0">
              ⚖️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">Hakamlar (Judges)</span>
                <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded-full border border-indigo-500/40">YORDAMCHILAR</span>
              </div>
              <div className="text-sm font-extrabold text-white">Admin Yordamchilari (Helpers)</div>
              <p className="text-[10px] text-slate-400">Savollar sifatini nazorat qilish, ishtirokchilar natijalarini ko'rib chiqish va tartibni ta'minlash.</p>
            </div>
          </div>
        </div>

        {isJudge && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">👨‍⚖️</span>
              <div>
                <strong className="text-amber-300 font-black">
                  {isOwner ? "Siz ushbu platformaning BOSH HAKAMIsiz!" : "Siz ushbu platformaning RASMIY HAKAMIsiz!"}
                </strong>
                <p className="text-[11px] text-slate-300">
                  Hakamlar o'quvchilar reyting sovg'alari uchun da'vogarlik qilmaydi va adolatli hakamlik yuritadi.
                </p>
              </div>
            </div>

            {event && event.status === 'active' && (
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Haqiqatan ham ushbu turnirni yakunlab, o'quvchilar orasidan g'oliblarni e'lon qilmoqchimisiz?")) return;
                  try {
                    await api.finishEvent(user);
                    onToast("🏆 Turnir yakunlandi va o'quvchi g'oliblar taqdirlandi!");
                    loadEventData();
                  } catch (e: any) {
                    onToast(e.message || "Xatolik yuz berdi");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition shadow-lg shrink-0 flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 fill-current" />
                <span>Turnirni Yakunlash (G'oliblarni E'lon Qilish)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 1. ACTIVE EVENT BANNER & PLAY CTA */}
      {event && event.status === 'active' ? (
        <div className="bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Rasmiy Turnir
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">{event.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {event.description || "Admin tomonidan e'lon qilingan maxsus savollar musobaqasi."}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                <span className="bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl text-teal-300 font-bold">
                  {event.questions.length} ta savol
                </span>
                <span className="bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl text-amber-300 font-bold">
                  🎁 Top 3: Rank +1 Pog'ona & +500/300/150 Tanga
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-slate-950/90 border border-amber-500/40 p-4 rounded-2xl flex items-center gap-3.5 shadow-inner self-start lg:self-auto">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Turnir Tugashiga Qoldi
                </div>
                <div className="text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                  {formatTimer(timeLeftSec)}
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4">
            {hasSubmitted && myResult ? (
              <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/40 px-4 py-2.5 rounded-2xl w-full sm:w-auto">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-black text-emerald-300">
                    Siz testni topshirdingiz: {myResult.score}/{myResult.total} ball ({myResult.timeSpentSec}s)
                  </span>
                  <p className="text-[11px] text-slate-400">Turnir yakunlangach g'oliblar aniqlanadi.</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartPlay}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-400/25 hover:opacity-95 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>TURNIR TESTINI BOSHLASH ({event.questions.length} TA SAVOL)</span>
              </button>
            )}

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Ishtirokchilar soni: <strong>{sortedParticipants.length}</strong> nafar</span>
            </div>
          </div>
        </div>
      ) : event && event.status === 'finished' ? (
        /* 2. FINISHED EVENT WINNERS PODIUM */
        <div className="bg-slate-950 border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
                Yakunlangan Musobaqa
              </span>
              <h3 className="text-xl font-black text-white mt-1">{event.title}</h3>
            </div>
            <span className="text-xs text-slate-400">
              Jami ishtirokchilar: {event.participants?.length || 0}
            </span>
          </div>

          <h4 className="text-sm font-black text-amber-300 mb-3 flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span>TOP 3 G'OLIBLAR (Rank 1 pog'ona oshirildi! 🌟)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
            {(event.winners || []).map((w) => {
              const medalEmoji = w.rank === 1 ? '🥇 1-O\'RIN (CHEMPION)' : w.rank === 2 ? '🥈 2-O\'RIN' : '🥉 3-O\'RIN';
              const colorClass =
                w.rank === 1
                  ? 'border-yellow-400 bg-yellow-500/10'
                  : w.rank === 2
                  ? 'border-slate-400 bg-slate-400/10'
                  : 'border-amber-700 bg-amber-700/10';

              return (
                <div
                  key={w.username}
                  className={`p-4 rounded-2xl border ${colorClass} text-center space-y-2`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800">
                    {medalEmoji}
                  </span>
                  <h5 className="text-base font-extrabold text-white">@{w.username}</h5>
                  <div className="text-xs font-bold text-teal-300">Natija: {w.score} to'g'ri</div>
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-amber-300 font-bold space-y-0.5">
                    <div>🌟 {w.promotedTo}</div>
                    <div className="text-emerald-400 font-mono">+{w.coinsReward} Tanga mukofot!</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 3. NO ACTIVE EVENT INFO CARD */
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-2xl mx-auto">
            🏆
          </div>
          <h3 className="text-base font-black text-white">Hozirda faol musobaqa turniri yo'q</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Admin yangi Event e'lon qilganda ushbu sahifada va umumiy chatda jonli xabar chiqadi. Top 3 o'rin egalari avtomatik ravishda <strong>1 ta yuqori unvon (Rank)</strong> bilan taqdirlanadi!
          </p>
        </div>
      )}

      {/* 2. REAL-TIME TOURNAMENT LEADERBOARD TABLE */}
      {event && sortedParticipants.length > 0 && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Turnir Jonli Reyting Jadvali ({sortedParticipants.length} nafar)</span>
            </h3>
            <span className="text-[11px] text-teal-300 font-bold bg-teal-500/10 border border-teal-500/30 px-3 py-0.5 rounded-full">
              Real Vaqt
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-bold">
                  <th className="py-2.5 px-3">O'rin</th>
                  <th className="py-2.5 px-3">O'quvchi</th>
                  <th className="py-2.5 px-3">Ball (To'g'ri)</th>
                  <th className="py-2.5 px-3">Ketgan Vaqt</th>
                  <th className="py-2.5 px-3">Mukofot Imkoniyati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedParticipants.map((p, idx) => {
                  const isMe = p.username.toLowerCase() === user.username.toLowerCase();
                  const isParticipantJudge = Boolean(
                    p.isJudge ||
                    p.username.toLowerCase() === 'admin' ||
                    p.username.toLowerCase() === 'xojayevistam16@gmail.com'
                  );
                  // Student index among genuine participants
                  const studentIndex = sortedParticipants
                    .filter((x) => !x.isJudge && x.username.toLowerCase() !== 'admin')
                    .indexOf(p);
                  const isStudentTop3 = !isParticipantJudge && studentIndex >= 0 && studentIndex < 3;

                  return (
                    <tr
                      key={p.username}
                      className={`hover:bg-slate-900/60 transition ${
                        isMe ? 'bg-teal-500/10 font-bold' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        {isParticipantJudge ? (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/25 border border-indigo-500/50 text-indigo-300 text-[10px] font-black uppercase inline-flex items-center gap-1">
                            ⚖️ HAKAM
                          </span>
                        ) : studentIndex === 0 ? (
                          <span className="text-amber-400 font-black flex items-center gap-1">
                            🥇 1
                          </span>
                        ) : studentIndex === 1 ? (
                          <span className="text-slate-300 font-black flex items-center gap-1">
                            🥈 2
                          </span>
                        ) : studentIndex === 2 ? (
                          <span className="text-amber-600 font-black flex items-center gap-1">
                            🥉 3
                          </span>
                        ) : (
                          <span className="font-mono text-slate-400 font-bold">#{studentIndex + 1}</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-white">{p.username}</span>
                          {isParticipantJudge && (
                            <span className="text-[10px] text-indigo-300 font-bold bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.2 rounded-full">
                              (Judge)
                            </span>
                          )}
                          {isMe && <span className="text-[10px] text-teal-400">(Siz)</span>}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-black text-teal-300">
                        {p.score} / {p.total}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-300">
                        {p.timeSpentSec} soniya
                      </td>

                      <td className="py-3 px-3">
                        {isParticipantJudge ? (
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            👨‍⚖️ Hakam (Reytingdan tashqari)
                          </span>
                        ) : isStudentTop3 ? (
                          <span className="text-[10px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                            ★ Rank +1 Pog'ona & +{studentIndex === 0 ? 500 : studentIndex === 1 ? 300 : 150} 🪙
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">O'quvchi ishtiroki</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. EVENT TEST MODAL (ACTIVE TEST TAKING) */}
      {isPlaying && event && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Turnir Savoli
                </span>
                <h3 className="text-sm font-extrabold text-white line-clamp-1 mt-1">{event.title}</h3>
              </div>
              <div className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-extrabold border border-slate-700">
                Savol: <span className="text-amber-400">{qIndex + 1}</span> / {event.questions.length}
              </div>
            </div>

            {/* Question */}
            <div className="my-4 min-h-[45px]">
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {event.questions[qIndex]?.q}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 my-4">
              {event.questions[qIndex]?.a.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === event.questions[qIndex]?.c;

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
                To'g'ri javoblar: <span className="text-emerald-400 font-bold">{answers.reduce((a, b) => a + b, 0)}</span> / {event.questions.length}
              </div>

              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition flex items-center gap-1.5 shadow"
                >
                  <span>{qIndex + 1 < event.questions.length ? 'Keyingi savol' : 'Turnirni yakunlash'}</span>
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
