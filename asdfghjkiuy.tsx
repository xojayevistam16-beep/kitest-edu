import React, { useState, useEffect } from 'react';
import { User, QuizQuestion } from '../types';
import { api, initWebSocket } from '../services/api';
import {
  Gamepad2,
  Sparkles,
  Zap,
  Timer,
  CheckCircle,
  XCircle,
  ArrowRight,
  Shuffle,
  Trophy,
  Trash2,
  Play,
  Search,
  Edit3,
  Coins,
  Gift,
  Code2,
  Copy,
  Check,
  X
} from 'lucide-react';

interface GamesSectionProps {
  user: User;
  allQuizQuestions: QuizQuestion[];
  onUserUpdate: (updated: Partial<User>) => void;
  onToast: (msg: string) => void;
}

export const GamesSection: React.FC<GamesSectionProps> = ({
  user,
  allQuizQuestions,
  onUserUpdate,
  onToast,
}) => {
  // Category / Tab filter for all users
  const [filterTab, setFilterTab] = useState<'all' | 'custom' | 'classic' | 'free'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [activeGame, setActiveGame] = useState<'none' | 'quiz' | 'math'>('none');

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Math Speed state
  const [mathScore, setMathScore] = useState(0);
  const [mathTimeLeft, setMathTimeLeft] = useState(15);
  const [mathA, setMathA] = useState(12);
  const [mathB, setMathB] = useState(15);
  const [mathOptions, setMathOptions] = useState<number[]>([]);
  const [mathRunning, setMathRunning] = useState(false);

  // Custom Games state (Loaded for all users with local fallback)
  const [customGames, setCustomGames] = useState<any[]>(() => {
    try {
      const s = localStorage.getItem('kitest_custom_games_backup');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [playingCustomGame, setPlayingCustomGame] = useState<any | null>(null);

  // Admin Price Edit Modal state
  const [editingGame, setEditingGame] = useState<any | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<number>(0);
  const [editRewardInput, setEditRewardInput] = useState<number>(15);
  const [savingPrice, setSavingPrice] = useState(false);

  // Admin & Helper Code Viewer Modal state
  const [viewingCodeGame, setViewingCodeGame] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const isOwner =
    user.isAdmin ||
    user.username.toLowerCase() === 'admin' ||
    user.email?.toLowerCase() === 'xojayevistam16@gmail.com';
  const isHelper = !!user.helper;
  const canDeleteGame = isOwner || isHelper;
  const canViewCode = isOwner || isHelper;

  useEffect(() => {
    loadCustomGames();

    const cleanup = initWebSocket({
      onGameNew: (newGame) => {
        setCustomGames((prev) => {
          if (prev.some((g) => g.id === newGame.id)) return prev;
          const updated = [newGame, ...prev];
          try {
            localStorage.setItem('kitest_custom_games_backup', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      },
      onGameUpdated: (updatedGame) => {
        setCustomGames((prev) => {
          const updated = prev.map((g) => (g.id === updatedGame.id ? updatedGame : g));
          try {
            localStorage.setItem('kitest_custom_games_backup', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      },
      onGameDeleted: ({ id }) => {
        setCustomGames((prev) => {
          const updated = prev.filter((g) => g.id !== id);
          try {
            localStorage.setItem('kitest_custom_games_backup', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      },
    });

    return () => cleanup();
  }, []);

  // Listen to game win messages from inside custom games iframe
  useEffect(() => {
    const onGameMessage = async (e: MessageEvent) => {
      if (e.data && e.data.type === 'GAME_WIN' && playingCustomGame) {
        const reward = Number(playingCustomGame.reward) || 15;
        try {
          const res = await api.changePlayerCoins(user.username, reward);
          onUserUpdate({ coins: res.coins });
          onToast(`🏆 Tabriklaymiz! O'yindagi g'alaba uchun +${reward} Tanga mukofot oldingiz!`);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('message', onGameMessage);
    return () => window.removeEventListener('message', onGameMessage);
  }, [playingCustomGame, user.username]);

  const loadCustomGames = async () => {
    try {
      const res = await api.getCustomGames();
      if (Array.isArray(res.games) && res.games.length > 0) {
        setCustomGames(res.games);
        try {
          localStorage.setItem('kitest_custom_games_backup', JSON.stringify(res.games));
        } catch {}
      } else {
        const saved = localStorage.getItem('kitest_custom_games_backup');
        if (saved) {
          setCustomGames(JSON.parse(saved));
        }
      }
    } catch {
      const saved = localStorage.getItem('kitest_custom_games_backup');
      if (saved) {
        setCustomGames(JSON.parse(saved));
      }
    }
  };

  const handleDeleteCustomGame = async (gameId: string, gameTitle: string) => {
    if (!canDeleteGame) {
      onToast("Faqat Admin yoki Admin Yordamchisi o'yinni o'chira oladi!");
      return;
    }
    const confirmed = window.confirm(`Haqiqatan ham «${gameTitle}» o'yinini butunlay o'chirmoqchimisiz?`);
    if (!confirmed) return;

    try {
      await api.deleteCustomGame(user, gameId);
      setCustomGames((prev) => prev.filter((g) => g.id !== gameId));
      onToast(`🗑️ «${gameTitle}» o'yini muvaffaqiyatli o'chirildi!`);
    } catch (e: any) {
      onToast(e.message || "O'yinni o'chirishda xatolik yuz berdi");
    }
  };

  const openPriceEditModal = (game: any) => {
    if (!isOwner) {
      onToast("Faqat Asosiy Admin o'yinlar narxini o'zgartira oladi!");
      return;
    }
    setEditingGame(game);
    setEditPriceInput(Number(game.price) || 0);
    setEditRewardInput(Number(game.reward) || 15);
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner || !editingGame) return;

    setSavingPrice(true);
    try {
      const res = await api.updateGamePrice(user, editingGame.id, editPriceInput, editRewardInput);
      setCustomGames((prev) =>
        prev.map((g) => (g.id === editingGame.id ? res.game : g))
      );
      onToast(`💰 «${editingGame.title}» o'yini narxi yangilandi: ${editPriceInput} Tanga (Mukofot: +${editRewardInput} 🪙)`);
      setEditingGame(null);
    } catch (err: any) {
      onToast(err.message || "Narxni o'zgartirishda xatolik");
    } finally {
      setSavingPrice(false);
    }
  };

  const handlePlayCustomGame = async (game: any) => {
    const cost = Number(game.price) || 0;
    if (cost > 0 && user.coins < cost) {
      onToast(`Ushbu o'yinni o'ynash uchun kamida ${cost} Tanga kerak! Sizda: ${user.coins} Tanga bor.`);
      return;
    }

    try {
      if (cost > 0) {
        const res = await api.playCustomGame(game.id, user.username);
        onUserUpdate({ coins: res.coins });
      }
      setPlayingCustomGame(game);
    } catch (e: any) {
      onToast(e.message || "O'yinni ishga tushirishda xatolik");
    }
  };

  // QUIZ LOGIC
  const currentQuizQ = allQuizQuestions[quizIdx % (allQuizQuestions.length || 1)];

  const handleQuizAnswer = async (choiceIdx: number) => {
    if (quizAnswered) return;
    setQuizSelected(choiceIdx);
    setQuizAnswered(true);

    if (choiceIdx === currentQuizQ.c) {
      try {
        const res = await api.changePlayerCoins(user.username, 5);
        onUserUpdate({ coins: res.coins });
        onToast("🎉 To'g'ri javob! +5 Tanga hisobingizga qo'shildi!");
      } catch {
        // ignore
      }
    } else {
      onToast(`❌ Noto'g'ri javob! To'g'risi: ${currentQuizQ.a[currentQuizQ.c]}`);
    }
  };

  const handleQuizNext = () => {
    setQuizIdx((prev) => (prev + 1) % allQuizQuestions.length);
    setQuizSelected(null);
    setQuizAnswered(false);
  };

  const handleQuizRandom = () => {
    const randomIdx = Math.floor(Math.random() * allQuizQuestions.length);
    setQuizIdx(randomIdx);
    setQuizSelected(null);
    setQuizAnswered(false);
  };

  // MATH SPEED LOGIC
  const startMathGame = async () => {
    if (user.coins < 10) {
      onToast("Math Speed o'ynash uchun kamida 10 Tanga kerak!");
      return;
    }

    try {
      const res = await api.changePlayerCoins(user.username, -10);
      onUserUpdate({ coins: res.coins });
    } catch (e: any) {
      onToast(e.message || 'Xatolik');
      return;
    }

    setMathScore(0);
    setMathTimeLeft(15);
    setMathRunning(true);
    generateMathProblem();
    setActiveGame('math');
  };

  const generateMathProblem = () => {
    const a = Math.floor(Math.random() * 35) + 5;
    const b = Math.floor(Math.random() * 35) + 5;
    const correct = a + b;
    const wrongs = [correct + 2, correct - 3, correct + 5, correct - 1].filter((x) => x !== correct);
    const opts = [correct, wrongs[0], wrongs[1], wrongs[2]].sort(() => Math.random() - 0.5);

    setMathA(a);
    setMathB(b);
    setMathOptions(opts);
  };

  const handleMathChoice = (chosen: number) => {
    if (!mathRunning) return;
    if (chosen === mathA + mathB) {
      setMathScore((s) => s + 1);
    }
    generateMathProblem();
  };

  useEffect(() => {
    let timer: any = null;
    if (activeGame === 'math' && mathRunning) {
      timer = setInterval(async () => {
        setMathTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timer);
            setMathRunning(false);
            finishMath();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeGame, mathRunning, mathScore]);

  const finishMath = async () => {
    const reward = mathScore * 3;
    if (reward > 0) {
      try {
        const res = await api.changePlayerCoins(user.username, reward);
        onUserUpdate({ coins: res.coins });
      } catch {
        // ignore
      }
    }
    onToast(`⏱️ Vaqt tugadi! To'g'ri hisoblar: ${mathScore} ta. Mukofot: +${reward} Tanga!`);
  };

  // Built-in Classic Games (Memory Cards completely removed as requested)
  const classicGames = [
    {
      id: 'quiz-classic',
      title: '500+ Savol (Quiz)',
      desc: "Mutlaqo bepul! Matematika, Informatika, Fizika, Mantiq, Tarix va Geografiya.",
      icon: '💡',
      price: 0,
      reward: 5,
      type: 'classic',
      onPlay: () => {
        setActiveGame('quiz');
        setQuizSelected(null);
        setQuizAnswered(false);
      },
    },
    {
      id: 'math-speed',
      title: 'Math Speed (Tezkor Hisob)',
      desc: '15 soniyada qancha ko\'p to\'g\'ri hisoblay olasiz? Har bir to\'g\'ri hisob: +3 Tanga!',
      icon: '🔢',
      price: 10,
      reward: 3,
      type: 'classic',
      onPlay: startMathGame,
    },
  ];

  // Filter logic
  const filteredCustomGames = customGames.filter((g) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || g.title?.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filterTab === 'classic') return false;
    if (filterTab === 'free') return (Number(g.price) || 0) === 0;
    return true;
  });

  const filteredClassicGames = classicGames.filter((g) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filterTab === 'custom') return false;
    if (filterTab === 'free') return g.price === 0;
    return true;
  });

  const totalGamesCount = classicGames.length + customGames.length;

  return (
    <div className="w-full space-y-5">
      {/* Header with Title and Global Visibility Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-teal-500/20 border border-purple-500/40 text-purple-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-teal-300 to-amber-300">
                Cosmo Arcade O'yinlar
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-black">
                {totalGamesCount} ta O'yin
              </span>
              {isOwner && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black">
                  👑 Admin Narxlarni boshqarishi mumkin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Barcha foydalanuvchilar o'ynashi va tanga yutib olishi mumkin bo'lgan o'yinlar zali! 🎮
            </p>
          </div>
        </div>

        {/* Filter Tabs for all users */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
              filterTab === 'all'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hammasi ({totalGamesCount})
          </button>
          <button
            onClick={() => setFilterTab('custom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
              filterTab === 'custom'
                ? 'bg-amber-500 text-slate-950 shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Maxsus ({customGames.length})
          </button>
          <button
            onClick={() => setFilterTab('classic')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
              filterTab === 'classic'
                ? 'bg-teal-500 text-slate-950 shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Klassik ({classicGames.length})
          </button>
          <button
            onClick={() => setFilterTab('free')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
              filterTab === 'free'
                ? 'bg-emerald-500 text-slate-950 shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bepul 🎁
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="O'yinlarni nomi yoki tavsifi bo'yicha qidirish..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-purple-400 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition"
        />
      </div>

      {/* Unified Games Grid for ALL Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* 1. Classic Games Cards */}
        {filteredClassicGames.map((game) => (
          <div
            key={game.id}
            className="bg-slate-900/85 border border-purple-500/30 hover:border-teal-400 p-5 rounded-3xl flex flex-col justify-between items-center text-center shadow-lg transition transform hover:-translate-y-1 relative group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl shadow-lg mb-3">
              {game.icon}
            </div>

            <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-[10px] font-bold text-teal-300">
              Klassik
            </span>

            <h3 className="text-base font-extrabold text-white mb-1">{game.title}</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">
              {game.desc}
            </p>

            <div className="text-[11px] text-amber-300 font-bold mb-3 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full w-full flex justify-between items-center">
              <span>Narxi: {game.price === 0 ? 'Bepul' : `${game.price} Tanga`}</span>
              <span>Mukofot: +{game.reward} 🪙</span>
            </div>

            <button
              onClick={game.onPlay}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow transition flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{game.price === 0 ? 'BEPUL O\'YNASH' : `O'YNASH (${game.price} TANGA)`}</span>
            </button>
          </div>
        ))}

        {/* 2. Custom Games Cards (Admin created games) */}
        {filteredCustomGames.map((game) => {
          const cost = Number(game.price) || 0;
          const reward = Number(game.reward) || 15;
          return (
            <div
              key={game.id}
              className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 p-5 rounded-3xl flex flex-col justify-between items-center text-center shadow-lg transition transform hover:-translate-y-1 relative group"
            >
              <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-300">
                Arcade
              </span>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg mb-3">
                {game.icon || '🎮'}
              </div>

              <h4 className="text-base font-extrabold text-white mb-1 truncate max-w-[200px]">
                {game.title}
              </h4>

              <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                {game.description || "Maxsus dasturiy arcade o'yin"}
              </p>

              <div className="text-[11px] text-amber-300 font-bold mb-3 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full w-full flex justify-between items-center">
                <span>Narxi: {cost === 0 ? 'Bepul' : `${cost} Tanga`}</span>
                <span>Mukofot: +{reward} 🪙</span>
              </div>

              <div className="w-full flex items-center gap-2">
                <button
                  onClick={() => handlePlayCustomGame(game)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow transition flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{cost === 0 ? 'O\'YINNI BOSHLASH' : `O'YNASH (${cost} 🪙)`}</span>
                </button>

                {/* Admin & Helper Code Viewer Button */}
                {canViewCode && (
                  <button
                    onClick={() => {
                      setViewingCodeGame(game);
                      setCopiedCode(false);
                    }}
                    title="O'yin dasturiy kodini ko'rish (Admin & Yordamchi)"
                    className="p-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500 border border-indigo-500/40 text-indigo-300 hover:text-white transition active:scale-95 shrink-0 flex items-center gap-1"
                  >
                    <Code2 className="w-4 h-4" />
                    <span className="hidden md:inline text-[11px] font-bold">Kod</span>
                  </button>
                )}

                {/* Admin Price Edit Button */}
                {isOwner && (
                  <button
                    onClick={() => openPriceEditModal(game)}
                    title="O'yin narxini o'zgartirish (Faqat Admin)"
                    className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-slate-950 transition active:scale-95 shrink-0"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}

                {canDeleteGame && (
                  <button
                    onClick={() => handleDeleteCustomGame(game.id, game.title)}
                    title="O'yinni butunlay o'chirish"
                    className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500 border border-rose-500/40 text-rose-300 hover:text-white transition active:scale-95 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* If No Games Found */}
      {filteredClassicGames.length === 0 && filteredCustomGames.length === 0 && (
        <div className="text-center py-12 bg-slate-950/60 rounded-3xl border border-slate-800">
          <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400 font-bold">Hech qanday o'yin topilmadi</p>
          <p className="text-xs text-slate-500 mt-1">Qidiruv so'zini o'zgartirib ko'ring yoki boshqa toifani tanlang.</p>
        </div>
      )}

      {/* ADMIN EDIT GAME PRICE MODAL */}
      {editingGame && isOwner && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/80 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    O'yin Narxi va Mukofotini O'zgartirish
                  </h3>
                  <p className="text-[11px] text-amber-300/80 font-semibold">
                    {editingGame.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingGame(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  O'yin narxi (Kirish uchun ketadigan Tanga):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={editPriceInput}
                    onChange={(e) => setEditPriceInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-amber-400 outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-amber-400 font-bold">
                    {editPriceInput === 0 ? 'BEPUL' : 'Tanga'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">0 qo'ysangiz o'yin barcha foydalanuvchilar uchun bepul bo'ladi.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  G'alaba mukofoti (Yutganda beriladigan Tanga):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={editRewardInput}
                    onChange={(e) => setEditRewardInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-amber-400 outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-emerald-400 font-bold">
                    +{editRewardInput} 🪙
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={savingPrice}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow hover:opacity-90 active:scale-95 transition"
                >
                  {savingPrice ? 'Saqlanmoqda...' : 'Narxni Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN & HELPER GAME CODE VIEWER MODAL */}
      {viewingCodeGame && canViewCode && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-slate-900 border-2 border-indigo-500/70 w-full max-w-4xl rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-2xl">
                  {viewingCodeGame.icon || '🎮'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">{viewingCodeGame.title}</h3>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                      Admin & Yordamchi Ko'rinishi 🔐
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Muallif: <strong className="text-indigo-300">@{viewingCodeGame.author || 'admin'}</strong> • Narx: {viewingCodeGame.price || 0} 🪙 • Mukofot: +{viewingCodeGame.reward || 15} 🪙
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(viewingCodeGame.code || '');
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 border border-slate-700"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-300" />}
                  <span>{copiedCode ? 'Kopiya olindi!' : 'Kodni nusxalash'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingCodeGame(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Code2 className="w-3.5 h-3.5" />
                <span>Format: HTML5 / JavaScript / Canvas Game Engine</span>
              </span>
              <span>Hajmi: {(viewingCodeGame.code || '').length} belgi</span>
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-emerald-300 overflow-y-auto max-h-[58vh] scrollbar-thin">
              <pre className="whitespace-pre-wrap break-all leading-relaxed select-all">
                {viewingCodeGame.code || '// O\'yin kodi topilmadi'}
              </pre>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>Faqat Admin va Admin Yordamchisi ushbu dasturiy kodni ko'rish huquqiga ega.</span>
              <button
                type="button"
                onClick={() => {
                  const g = viewingCodeGame;
                  setViewingCodeGame(null);
                  handlePlayCustomGame(g);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>O'yinda Sinab Ko'rish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM GAME PLAYER MODAL */}
      {playingCustomGame && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900 border-2 border-amber-500 w-full max-w-3xl rounded-3xl p-4 sm:p-6 shadow-2xl relative flex flex-col h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{playingCustomGame.icon || '🎮'}</span>
                <div>
                  <h3 className="text-base font-extrabold text-amber-300">{playingCustomGame.title}</h3>
                  <p className="text-[11px] text-slate-400">{playingCustomGame.description || 'Arcade o\'yin rejimi'}</p>
                </div>
              </div>
              <button
                onClick={() => setPlayingCustomGame(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative">
              <iframe
                srcDoc={playingCustomGame.code}
                title={playingCustomGame.title}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {activeGame === 'quiz' && currentQuizQ && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-teal-500/50 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-teal-300 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full">
                  Savol: {(quizIdx % allQuizQuestions.length) + 1} / {allQuizQuestions.length}
                </span>
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-full">
                  {currentQuizQ.cat}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuizRandom}
                  title="Tasodifiy savol"
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveGame('none')}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="my-5 min-h-[50px] flex items-center">
              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQuizQ.q}
              </h3>
            </div>

            <div className="space-y-2.5 my-4">
              {currentQuizQ.a.map((opt, idx) => {
                const isSelected = quizSelected === idx;
                const isCorrect = idx === currentQuizQ.c;

                let style = "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200";

                if (quizAnswered) {
                  if (isCorrect) {
                    style = "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-500/20";
                  } else if (isSelected) {
                    style = "bg-rose-950 border-rose-500 text-rose-200";
                  } else {
                    style = "bg-slate-900 border-slate-800 text-slate-500 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={quizAnswered}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-2 ${style}`}
                  >
                    <span>{opt}</span>
                    {quizAnswered && (
                      <span>
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isSelected ? (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-amber-400 font-bold">
                Har bir to'g'ri javob: +5 Tanga 🪙
              </span>

              {quizAnswered && (
                <button
                  onClick={handleQuizNext}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition flex items-center gap-1.5 shadow"
                >
                  <span>Keyingi Savol</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MATH SPEED MODAL */}
      {activeGame === 'math' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setActiveGame('none')}
              className="absolute top-4 right-4 p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex justify-between items-center mb-4 text-xs font-black">
              <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4" />
                <span>Hisob: {mathScore}</span>
              </div>
              <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full">
                <Timer className="w-4 h-4 animate-spin" />
                <span>Vaqt: {mathTimeLeft}s</span>
              </div>
            </div>

            <div className="my-8">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-wider">
                {mathA} + {mathB} = ?
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full my-4">
              {mathOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMathChoice(opt)}
                  className="py-4 rounded-2xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-400 text-xl font-black text-white transition active:scale-95 shadow"
                >
                  {opt}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Har bir to'g'ri javob uchun: <strong className="text-amber-300">+3 Tanga</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
