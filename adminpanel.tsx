import React, { useState, useEffect } from 'react';
import { User, TournamentEvent, EventQuestion, RankTierInfo } from '../types';
import { api } from '../services/api';
import { getRankTiersList, setDynamicRanks } from '../utils/rankUtils';
import {
  ShieldAlert,
  Search,
  PlusCircle,
  BookOpen,
  UserCheck,
  UserMinus,
  Coins,
  Ban,
  RotateCcw,
  Sparkles,
  HelpCircle,
  X,
  Award,
  Crown,
  Eye,
  Users,
  CheckCircle2,
  Calendar,
  Mail,
  Disc3,
  UserPlus,
  Gamepad2,
  Trash2,
  Edit3,
  Zap,
  Trophy,
  Play,
  Clock,
  Check,
  Code2,
  Copy
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: User;
  onClose: () => void;
  onToast: (msg: string) => void;
  onUserUpdate: (updated: Partial<User>) => void;
  onQuizAdded?: () => void;
  onTopicAdded?: () => void;
  onGameAdded?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  onClose,
  onToast,
  onUserUpdate,
  onQuizAdded,
  onTopicAdded,
  onGameAdded,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'helpers' | 'banned'>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'addQuestion' | 'addTopic' | 'addGame' | 'event' | 'ranks'>('users');
  const [inspectUser, setInspectUser] = useState<User | null>(null);
  const [helperInputUsername, setHelperInputUsername] = useState('');
  const [adminGames, setAdminGames] = useState<any[]>([]);

  // Rank Management state
  const [ranksList, setRanksList] = useState<RankTierInfo[]>(() => getRankTiersList());
  const [newRankTier, setNewRankTier] = useState('');
  const [newRankUzName, setNewRankUzName] = useState('');
  const [newRankMinRating, setNewRankMinRating] = useState('5000');
  const [newRankBadge, setNewRankBadge] = useState('👑');
  const [newRankDesc, setNewRankDesc] = useState('');
  const [newRankTheme, setNewRankTheme] = useState('gold');

  // Tournament Event state
  const [adminEvent, setAdminEvent] = useState<TournamentEvent | null>(null);
  const [eventTitle, setEventTitle] = useState('Koinot Bilimdonlari Tezkor Turniri');
  const [eventDesc, setEventDesc] = useState("Eng tez va to'g'ri yechgan Top 3 o'quvchining rasmiy unvoni (Rank) 1 pog'onaga ko'tariladi!");
  const [eventDuration, setEventDuration] = useState('5');
  const [eventQuestionsList, setEventQuestionsList] = useState<EventQuestion[]>([
    {
      q: "25 sonining kvadrat ildiziga 15 ni qo'shganda nechchi hosil bo'ladi? (√25 + 15 = ?)",
      a: ['20', '25', '18', '30'],
      c: 0,
    },
    {
      q: 'Axborotning eng kichik o\'lchov birligi nima?',
      a: ['Bit', 'Bayt', 'Kilobayt', 'Megabayt'],
      c: 0,
    },
    {
      q: 'Yorug\'lik tezligi vakuumda sekundiga taxminan qancha masofani bosib o\'tadi?',
      a: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'],
      c: 0,
    },
  ]);
  const [newEqText, setNewEqText] = useState('');
  const [newEqA0, setNewEqA0] = useState('');
  const [newEqA1, setNewEqA1] = useState('');
  const [newEqA2, setNewEqA2] = useState('');
  const [newEqA3, setNewEqA3] = useState('');
  const [newEqCorrect, setNewEqCorrect] = useState(0);

  // Add Question form
  const [qCat, setQCat] = useState('Matematika');
  const [qText, setQText] = useState('');
  const [qA0, setQA0] = useState('');
  const [qA1, setQA1] = useState('');
  const [qA2, setQA2] = useState('');
  const [qA3, setQA3] = useState('');

  // Add Topic form
  const [topicSubject, setTopicSubject] = useState('matematika');
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [topicStep1, setTopicStep1] = useState('');
  const [topicStep2, setTopicStep2] = useState('');

  // Add Game form
  const [gameTitle, setGameTitle] = useState('');
  const [gameDesc, setGameDesc] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [gamePrice, setGamePrice] = useState('0');
  const [gameReward, setGameReward] = useState('15');

  // Code Viewer Modal for Admin & Helper
  const [viewingGameCode, setViewingGameCode] = useState<any | null>(null);
  const [copiedGameCode, setCopiedGameCode] = useState(false);

  const isOwner = currentUser.isAdmin || currentUser.username.toLowerCase() === 'admin' || currentUser.email.toLowerCase() === 'xojayevistam16@gmail.com';
  const isHelper = !!currentUser.helper && !isOwner;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      setUsers(res.users);
      setInspectUser((prev) => {
        if (!prev) return null;
        return res.users.find((u) => u.username.toLowerCase() === prev.username.toLowerCase()) || prev;
      });
    } catch (e: any) {
      onToast(e.message || "Foydalanuvchilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const loadAdminGames = async () => {
    try {
      const res = await api.getCustomGames();
      setAdminGames(res.games || []);
    } catch {
      // ignore
    }
  };

  const loadAdminEvent = async () => {
    try {
      const res = await api.getActiveEvent();
      setAdminEvent(res.event);
    } catch {
      // ignore
    }
  };

  const loadRanks = async () => {
    try {
      const res = await api.getRanks();
      if (res.ranks) {
        setRanksList(res.ranks);
        setDynamicRanks(res.ranks);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadUsers();
    loadAdminGames();
    loadAdminEvent();
    loadRanks();
  }, []);

  // Rank Management Handlers
  const handleCreateRank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      onToast("Faqat Asosiy Admin yangi Rank (Unvon) yarata oladi!");
      return;
    }
    if (!newRankTier.trim()) {
      onToast("Rank nomini kiriting!");
      return;
    }
    const minRatingNum = parseInt(newRankMinRating, 10);
    if (isNaN(minRatingNum) || minRatingNum < 0) {
      onToast("Minimal reyting ballini to'g'ri kiriting!");
      return;
    }

    let color = 'text-amber-400';
    let border = 'border-amber-500/50';
    let bgGradient = 'from-amber-950 to-slate-900';
    let textGradient = 'from-amber-300 to-yellow-400';

    if (newRankTheme === 'purple') {
      color = 'text-purple-400';
      border = 'border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      bgGradient = 'from-purple-950 via-slate-900 to-pink-950';
      textGradient = 'from-purple-300 via-pink-300 to-rose-400';
    } else if (newRankTheme === 'cyan') {
      color = 'text-cyan-400';
      border = 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]';
      bgGradient = 'from-cyan-950 via-slate-900 to-blue-950';
      textGradient = 'from-cyan-300 to-blue-400';
    } else if (newRankTheme === 'emerald') {
      color = 'text-emerald-400';
      border = 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      bgGradient = 'from-emerald-950 via-slate-900 to-teal-950';
      textGradient = 'from-emerald-300 to-teal-300';
    } else if (newRankTheme === 'rose') {
      color = 'text-rose-400';
      border = 'border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
      bgGradient = 'from-rose-950 via-slate-900 to-red-950';
      textGradient = 'from-rose-300 via-orange-300 to-amber-300';
    } else if (newRankTheme === 'gold') {
      color = 'text-yellow-300';
      border = 'border-yellow-400/80 shadow-[0_0_20px_rgba(250,204,21,0.35)]';
      bgGradient = 'from-yellow-950 via-slate-900 to-amber-950';
      textGradient = 'from-yellow-200 via-amber-300 to-orange-400';
    }

    const rankData: Partial<RankTierInfo> = {
      tier: newRankTier.trim(),
      uzName: (newRankUzName || newRankTier).trim(),
      minRating: minRatingNum,
      badge: newRankBadge.trim() || '👑',
      color,
      border,
      bgGradient,
      textGradient,
      description: (newRankDesc || "Cosmo platformasining rasmiy maxsus unvoni.").trim(),
    };

    try {
      const res = await api.addRank(currentUser, rankData);
      setRanksList(res.ranks);
      setDynamicRanks(res.ranks);
      setNewRankTier('');
      setNewRankUzName('');
      setNewRankDesc('');
      onToast(`🎉 Yangi «${rankData.tier}» unvoni muvaffaqiyatli qo'shildi!`);
    } catch (err: any) {
      onToast(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteRank = async (tierName: string) => {
    if (!isOwner) return;
    const confirmed = window.confirm(`Haqiqatan ham «${tierName}» unvonini o'chirmoqchimisiz?`);
    if (!confirmed) return;

    try {
      const res = await api.deleteRank(currentUser, tierName);
      setRanksList(res.ranks);
      setDynamicRanks(res.ranks);
      onToast(`🗑️ «${tierName}» unvoni o'chirildi!`);
    } catch (err: any) {
      onToast(err.message || 'Xatolik');
    }
  };

  const handleResetRanks = async () => {
    if (!isOwner) return;
    const confirmed = window.confirm("Barcha unvonlarni asl standart 9 ta holatiga qaytarmoqchimisiz?");
    if (!confirmed) return;

    try {
      const res = await api.resetRanks(currentUser);
      setRanksList(res.ranks);
      setDynamicRanks(res.ranks);
      onToast("✅ Unvonlar standart holatga qaytarildi!");
    } catch (err: any) {
      onToast(err.message || 'Xatolik');
    }
  };

  // Event handlers
  const handleAddQuestionToEvent = () => {
    if (!newEqText.trim() || !newEqA0.trim() || !newEqA1.trim()) {
      onToast("Savol matni va kamida A va B variantlarini kiriting!");
      return;
    }
    const qItem: EventQuestion = {
      q: newEqText.trim(),
      a: [newEqA0.trim(), newEqA1.trim(), newEqA2.trim() || "Noto'g'ri variant", newEqA3.trim() || "Boshqa variant"],
      c: newEqCorrect,
    };
    setEventQuestionsList((prev) => [...prev, qItem]);
    setNewEqText('');
    setNewEqA0('');
    setNewEqA1('');
    setNewEqA2('');
    setNewEqA3('');
    setNewEqCorrect(0);
    onToast("✅ Savol musobaqa ro'yxatiga qo'shildi!");
  };

  const handleRemoveEventQuestion = (idx: number) => {
    setEventQuestionsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      onToast("Faqat Asosiy Admin turnir yarata oladi!");
      return;
    }
    if (!eventTitle.trim()) {
      onToast("Turnir sarlavhasini kiriting!");
      return;
    }
    if (eventQuestionsList.length === 0) {
      onToast("Turnirda kamida 1 ta savol bo'lishi kerak!");
      return;
    }
    try {
      const res = await api.createEvent(
        currentUser,
        eventTitle.trim(),
        eventDesc.trim(),
        parseInt(eventDuration, 10) || 5,
        eventQuestionsList
      );
      setAdminEvent(res.event);
      onToast("🎉 Yangi Event muvaffaqiyatli saqlandi! Endi uni «Boshlash» tugmasi orqali jonli efirga chiqaring!");
    } catch (err: any) {
      onToast(err.message || 'Xatolik');
    }
  };

  const handleStartEvent = async () => {
    if (!isOwner) return;
    try {
      const res = await api.startEvent(currentUser);
      setAdminEvent(res.event);
      onToast("⚡ Musobaqa JONLI boshlandi! Barcha o'yinchilar ishtirok etishi mumkin!");
    } catch (err: any) {
      onToast(err.message || 'Xatolik');
    }
  };

  const handleFinishEvent = async () => {
    if (!isOwner) return;
    const confirmed = window.confirm("Haqiqatan ham turnirni yakunlab, Top 3 talik g'oliblar unvonini 1 pog'onaga ko'tarmoqchimisiz?");
    if (!confirmed) return;

    try {
      const res = await api.finishEvent(currentUser);
      setAdminEvent(res.event);
      onToast("🏆 Musobaqa yakunlandi! Top 3 g'olibning DARJASI (RANK) 1 pog'onaga oshirildi va mukofotlandi!");
      loadUsers();
    } catch (err: any) {
      onToast(err.message || 'Xatolik');
    }
  };

  const handleDeleteEvent = async () => {
    if (!isOwner) return;
    const confirmed = window.confirm("Haqiqatan ham faol turnirni butunlay bekor qilib o'chirmoqchimisiz?");
    if (!confirmed) return;

    try {
      await api.deleteActiveEvent(currentUser);
      setAdminEvent(null);
      onToast("🗑️ Event bekor qilindi va o'chirildi!");
    } catch (err: any) {
      onToast(err.message || 'Xatolik');
    }
  };

  const handleDeleteAdminGame = async (gameId: string, title: string) => {
    const confirmed = window.confirm(`Haqiqatan ham «${title}» o'yinini butunlay o'chirmoqchimisiz?`);
    if (!confirmed) return;

    try {
      await api.deleteCustomGame(currentUser, gameId);
      setAdminGames((prev) => prev.filter((g) => g.id !== gameId));
      onToast(`🗑️ «${title}» o'yini muvaffaqiyatli o'chirildi!`);
      if (onGameAdded) onGameAdded();
    } catch (e: any) {
      onToast(e.message || "O'yinni o'chirishda xatolik yuz berdi");
    }
  };

  const handleUpdateAdminGamePrice = async (game: any) => {
    if (!isOwner) {
      onToast("Faqat Asosiy Admin o'yin narxini o'zgartira oladi!");
      return;
    }
    const newPriceStr = window.prompt(`«${game.title}» o'yini uchun yangi narxni kiriting (Tanga):`, `${game.price || 0}`);
    if (newPriceStr === null) return;
    const newPrice = Math.max(0, parseInt(newPriceStr, 10) || 0);

    const newRewardStr = window.prompt(`«${game.title}» o'yini g'alaba mukofotini kiriting (Tanga):`, `${game.reward || 15}`);
    if (newRewardStr === null) return;
    const newReward = Math.max(0, parseInt(newRewardStr, 10) || 0);

    try {
      const res = await api.updateGamePrice(currentUser, game.id, newPrice, newReward);
      setAdminGames((prev) => prev.map((g) => (g.id === game.id ? res.game : g)));
      onToast(`💰 «${game.title}» o'yini narxi yangilandi: ${newPrice} Tanga (Mukofot: +${newReward} 🪙)`);
      if (onGameAdded) onGameAdded();
    } catch (e: any) {
      onToast(e.message || "Narxni o'zgartirishda xatolik");
    }
  };

  const handleAdjustCoins = async (targetUsername: string, amount: number) => {
    try {
      const res = await api.updateCoins(currentUser, targetUsername, amount);
      onToast(`${targetUsername} uchun tangalar o'zgartirildi (${amount > 0 ? '+' + amount : amount})`);
      if (targetUsername.toLowerCase() === currentUser.username.toLowerCase()) {
        onUserUpdate({ coins: res.coins });
      }
      loadUsers();
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleBan = async (targetUsername: string, unban: boolean = false) => {
    try {
      await api.banUser(currentUser, targetUsername, 3, unban);
      onToast(unban ? `✅ ${targetUsername} bandan chiqarildi` : `🚫 ${targetUsername} 3 kunga bloklandi!`);
      loadUsers();
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleSetHelper = async (targetUsername: string, makeHelper: boolean) => {
    if (!isOwner) {
      onToast("Faqat asosiy admin yordamchi tayinlay oladi!");
      return;
    }
    if (!targetUsername.trim()) {
      onToast("Foydalanuvchi nomini kiriting yoki tanlang!");
      return;
    }
    try {
      await api.setHelper(currentUser, targetUsername.trim(), makeHelper);
      onToast(makeHelper ? `⭐ ${targetUsername} muvaffaqiyatli Admin Yordamchisi etib tayinlandi!` : `❌ ${targetUsername} yordamchilik lavozimidan olindi`);
      setHelperInputUsername('');
      loadUsers();
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleResetWheel = async (targetUsername: string) => {
    if (!isOwner) {
      onToast("Faqat asosiy admin imkoniyatni tiklay oladi!");
      return;
    }
    try {
      await api.resetWheel(currentUser, targetUsername);
      onToast(`🎰 ${targetUsername} uchun baraban imkoniyati (3/3) tiklandi!`);
      if (targetUsername.toLowerCase() === currentUser.username.toLowerCase()) {
        onUserUpdate({ wheelSpins: 3 });
      }
      loadUsers();
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleAddQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qA0.trim() || !qA1.trim() || !qA2.trim() || !qA3.trim()) {
      onToast("Savol va barcha 4 ta javob variantini to'ldiring!");
      return;
    }

    try {
      await api.addCustomQuiz(currentUser, qText.trim(), [qA0.trim(), qA1.trim(), qA2.trim(), qA3.trim()], 0, qCat);
      onToast("✅ Yangi savol muvaffaqiyatli qo'shildi!");
      setQText('');
      setQA0('');
      setQA1('');
      setQA2('');
      setQA3('');
      if (onQuizAdded) onQuizAdded();
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleAddTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) {
      onToast("Mavzu nomini kiriting!");
      return;
    }

    const steps = [
      {
        h: '1-qadam. Mavzu kirish qismi',
        t: topicDesc.trim() || `«${topicTitle.trim()}» mavzusi bo'yicha muhim dars va tavsiyalar.`,
      },
      {
        h: '2-qadam. Asosiy tushunchalar va qoidalar',
        t: topicStep1.trim() || `Ushbu qismda mavzuning asosiy qoidalari va mohiyati tushuntiriladi.`,
      },
      {
        h: '3-qadam. Amaliy qo\'llash va tahlil',
        t: topicStep2.trim() || `O'rganilgan qoidalarni amaliyotda sinab ko'rish orqali bilimlar mustahkamlanadi.`,
      },
      {
        h: '4-qadam. Xulosa va test',
        t: `Mavzuni to'liq tushunganingizni tekshirish uchun quyidagi 10 ta savolli testni topshiring.`,
      },
    ];

    try {
      await api.addCustomTopic(currentUser, topicSubject, topicTitle.trim(), topicDesc, steps, []);
      onToast("✅ Yangi dars mavzusi muvaffaqiyatli qo'shildi!");
      setTopicTitle('');
      setTopicDesc('');
      setTopicStep1('');
      setTopicStep2('');
      if (onTopicAdded) onTopicAdded();
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleAddGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle.trim() || !gameCode.trim()) {
      onToast("O'yin nomi va dastur kodini kiriting!");
      return;
    }
    try {
      await api.addCustomGame(
        currentUser,
        gameTitle.trim(),
        gameDesc.trim(),
        gameCode,
        Number(gamePrice) || 0,
        Number(gameReward) || 15
      );
      onToast("🎮 O'yin muvaffaqiyatli qo'shildi va Arcade bo'limiga joylandi!");
      setGameTitle('');
      setGameDesc('');
      setGameCode('');
      setGamePrice('0');
      setGameReward('15');
      loadAdminGames();
      if (onGameAdded) onGameAdded();
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleHelperTake100 = async () => {
    try {
      const res = await api.updateCoins(currentUser, currentUser.username, 100);
      onUserUpdate({ coins: res.coins });
      onToast("🪙 Yordamchi bonusi: +100 Tanga hisobingizga qo'shildi!");
      loadUsers();
    } catch (e: any) {
      onToast(e.message || 'Xatolik');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const isBanned = u.bannedUntil && u.bannedUntil > Date.now();
    if (filterRole === 'helpers') return matchesSearch && u.helper;
    if (filterRole === 'banned') return matchesSearch && isBanned;
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-4xl rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col max-h-[92vh] relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${isOwner ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'}`}>
              {isOwner ? <Crown className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300">
                {isOwner ? "👑 Asosiy Admin Boshqaruv Paneli" : "🤝 Admin Yordamchisi Paneli"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isOwner
                  ? "Barcha foydalanuvchilarni ko'rish, yordamchi tayinlash, tanga berish, ban qilish va savol/mavzu qo'shish"
                  : "Yordamchi imkoniyatlari: +100/-100 tanga, 3 kunlik ban, yangi savol va mavzu qo'shish"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mb-4 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Foydalanuvchilar ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addQuestion')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'addQuestion'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Savol Qo'shish (+500 Quiz)</span>
          </button>

          <button
            onClick={() => setActiveTab('addTopic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'addTopic'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mavzu Qo'shish (Ta'lim)</span>
          </button>

          <button
            onClick={() => setActiveTab('addGame')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'addGame'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>O'yin Qo'shish</span>
          </button>

          <button
            onClick={() => setActiveTab('event')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'event'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black shadow'
                : 'text-amber-400/90 hover:text-amber-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>⚡ Event / Turnir</span>
          </button>

          <button
            onClick={() => setActiveTab('ranks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'ranks'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black shadow-lg shadow-purple-500/20'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>🏆 Ranklar Boshqaruvi</span>
          </button>

          {/* Quick helper take 100 */}
          <button
            onClick={handleHelperTake100}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 active:scale-95 transition shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+100 Tanga Olish</span>
          </button>
        </div>

        {/* Tab 1: All Users */}
        {activeTab === 'users' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Quick Helper Assigner (for Owner) */}
            {isOwner && (
              <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/40 shadow-lg flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-indigo-200 flex items-center gap-1.5">
                        <span>⭐ Admin Yordamchisi Qo'shish & Tayinlash</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Foydalanuvchini tanlang va bitta bosishda "Admin Yordamchisi" huquqini bering
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-48">
                      <input
                        type="text"
                        value={helperInputUsername}
                        onChange={(e) => setHelperInputUsername(e.target.value)}
                        list="admin-panel-users-datalist"
                        placeholder="Username tanlang yoki yozing..."
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400"
                      />
                      <datalist id="admin-panel-users-datalist">
                        {users
                          .filter((u) => !u.isAdmin && u.username.toLowerCase() !== 'admin' && !u.helper)
                          .map((u) => (
                            <option key={u.username} value={u.username}>
                              {u.username} ({u.email})
                            </option>
                          ))}
                      </datalist>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!helperInputUsername.trim()) {
                          onToast("Foydalanuvchi nomini kiriting yoki ro'yxatdan tanlang!");
                          return;
                        }
                        handleSetHelper(helperInputUsername.trim(), true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow shrink-0"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Yordamchi qilish</span>
                    </button>
                  </div>
                </div>

                {/* Current helpers list badge row */}
                {users.filter((u) => u.helper).length > 0 && (
                  <div className="pt-2 border-t border-indigo-500/20 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                      Hozirgi Admin Yordamchilari ({users.filter((u) => u.helper).length} ta):
                    </span>
                    {users
                      .filter((u) => u.helper)
                      .map((h) => (
                        <span
                          key={h.username}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/25 border border-indigo-500/50 text-indigo-200 text-xs font-semibold"
                        >
                          <button
                            onClick={() => setInspectUser(h)}
                            title="Profilini ko'rish"
                            className="hover:underline"
                          >
                            {h.username}
                          </button>
                          <button
                            onClick={() => handleSetHelper(h.username, false)}
                            title="Yordamchilikdan olish"
                            className="text-rose-400 hover:text-rose-200 font-bold ml-0.5 transition"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Search and filters */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex-1 min-w-[180px] relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Username yoki email bo'yicha qidirish..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setFilterRole('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${filterRole === 'all' ? 'bg-slate-800 text-amber-300' : 'text-slate-400'}`}
                >
                  Barchasi ({users.length})
                </button>
                <button
                  onClick={() => setFilterRole('helpers')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${filterRole === 'helpers' ? 'bg-indigo-600/40 text-indigo-300' : 'text-slate-400'}`}
                >
                  Yordamchilar ({users.filter((u) => u.helper).length})
                </button>
                <button
                  onClick={() => setFilterRole('banned')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${filterRole === 'banned' ? 'bg-rose-600/40 text-rose-300' : 'text-slate-400'}`}
                >
                  Ban qilinganlar
                </button>
              </div>

              <button
                onClick={loadUsers}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Yangilash</span>
              </button>
            </div>

            {/* Table of all users */}
            <div className="flex-1 overflow-x-auto overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60 pr-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900/90 text-slate-400 sticky top-0 z-10 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Foydalanuvchi / Pochta</th>
                    <th className="p-3">Tanga</th>
                    <th className="p-3">Baraban</th>
                    <th className="p-3">Holati</th>
                    <th className="p-3 text-right">Amallar (Ko'rish / +100 / -100 / Ban / Yordamchi)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500">
                        Foydalanuvchilar topilmadi
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isTargetOwner = u.isAdmin || u.username.toLowerCase() === 'admin' || u.email.toLowerCase() === 'xojayevistam16@gmail.com';
                      const isBanned = !!u.bannedUntil && u.bannedUntil > Date.now();

                      return (
                        <tr key={u.username} className="hover:bg-slate-800/40 transition">
                          <td className="p-3">
                            <button
                              onClick={() => setInspectUser(u)}
                              title="Foydalanuvchi ma'lumotlarini to'liq ko'rish"
                              className="text-left group cursor-pointer"
                            >
                              <div className="font-bold text-white flex items-center gap-1.5 group-hover:text-amber-300 transition">
                                {isTargetOwner && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                                {u.helper && !isTargetOwner && <Award className="w-3.5 h-3.5 text-indigo-400" />}
                                <span>{u.username}</span>
                                <Eye className="w-3 h-3 text-slate-500 group-hover:text-amber-300 ml-0.5 opacity-0 group-hover:opacity-100 transition" />
                              </div>
                              <div className="text-[10px] text-slate-400 group-hover:text-slate-300">{u.email}</div>
                            </button>
                          </td>

                          <td className="p-3 text-amber-400 font-extrabold whitespace-nowrap">
                            🪙 {u.coins.toLocaleString()}
                          </td>

                          <td className="p-3 text-teal-300 font-bold whitespace-nowrap">
                            🎰 {u.wheelSpins}/3
                          </td>

                          <td className="p-3 whitespace-nowrap">
                            {isTargetOwner ? (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                                ADMIN
                              </span>
                            ) : u.helper ? (
                              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                                YORDAMCHI
                              </span>
                            ) : isBanned ? (
                              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                                3 KUN BAN
                              </span>
                            ) : (
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                                FAOL
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Inspect / View Profile */}
                              <button
                                onClick={() => setInspectUser(u)}
                                title="Foydalanuvchi ma'lumotlarini to'liq ko'rish"
                                className="bg-sky-600/80 hover:bg-sky-500 text-white font-bold px-2 py-1 rounded-lg text-[11px] transition active:scale-95 flex items-center gap-1 shadow"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Ko'rish</span>
                              </button>

                              {/* +100 Coin */}
                              <button
                                onClick={() => handleAdjustCoins(u.username, 100)}
                                title="+100 Tanga berish"
                                className="bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded-lg text-[11px] transition active:scale-95 shadow"
                              >
                                +100
                              </button>

                              {/* -100 Coin */}
                              <button
                                onClick={() => handleAdjustCoins(u.username, -100)}
                                title="-100 Tanga ayirish"
                                className="bg-amber-600/80 hover:bg-amber-500 text-white font-bold px-2 py-1 rounded-lg text-[11px] transition active:scale-95 shadow"
                              >
                                -100
                              </button>

                              {/* Ban / Unban */}
                              {!isTargetOwner && (
                                <>
                                  {isBanned ? (
                                    <button
                                      onClick={() => handleBan(u.username, true)}
                                      className="bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded-lg text-[11px] transition active:scale-95"
                                    >
                                      Banni ochish
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleBan(u.username, false)}
                                      className="bg-rose-600/80 hover:bg-rose-500 text-white font-bold px-2 py-1 rounded-lg text-[11px] transition active:scale-95 flex items-center gap-0.5"
                                    >
                                      <Ban className="w-3 h-3" />
                                      <span>3 kun Ban</span>
                                    </button>
                                  )}
                                </>
                              )}

                              {/* Make/Remove Helper (Admin only) */}
                              {isOwner && !isTargetOwner && (
                                <>
                                  {u.helper ? (
                                    <button
                                      onClick={() => handleSetHelper(u.username, false)}
                                      title="Yordamchilikdan olish"
                                      className="bg-slate-700 hover:bg-slate-600 text-rose-300 font-bold px-2 py-1 rounded-lg text-[11px] transition active:scale-95 flex items-center gap-0.5"
                                    >
                                      <UserMinus className="w-3 h-3" />
                                      <span>Olish</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleSetHelper(u.username, true)}
                                      title="Admin yordamchisi qilish"
                                      className="bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold px-2 py-1 rounded-lg text-[11px] transition active:scale-95 flex items-center gap-0.5 shadow"
                                    >
                                      <UserCheck className="w-3 h-3" />
                                      <span>Yordamchi qilish</span>
                                    </button>
                                  )}
                                </>
                              )}

                              {/* Reset Wheel Spins (Admin only) */}
                              {isOwner && (
                                <button
                                  onClick={() => handleResetWheel(u.username)}
                                  title="Baraban imkoniyatini 3 taga tiklash"
                                  className="bg-teal-700/80 hover:bg-teal-600 text-white font-bold px-2 py-1 rounded-lg text-[11px] transition active:scale-95"
                                >
                                  Tiklash
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Savol Qo'shish (Add Quiz Question) */}
        {activeTab === 'addQuestion' && (
          <form onSubmit={handleAddQuestionSubmit} className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                500+ Savollar Quiz bazasiga yangi savol qo'shish
              </h3>
              <p className="text-xs text-slate-400">
                Ushbu savol barcha foydalanuvchilar o'ynaydigan Quiz bo'limiga qo'shiladi. To'g'ri javobni birinchi maydonga (A) yozing, tizim uni avtomatik aralashtiradi!
              </p>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Fan / Kategoriya</label>
                <select
                  value={qCat}
                  onChange={(e) => setQCat(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                >
                  <option value="Matematika">Matematika</option>
                  <option value="Informatika">Informatika</option>
                  <option value="Fizika">Fizika</option>
                  <option value="Ingliz tili">Ingliz tili</option>
                  <option value="Mantiq">Mantiq</option>
                  <option value="Geografiya">Geografiya</option>
                  <option value="Tarix">Tarix</option>
                  <option value="Umumiy">Umumiy bilim</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Savol matni</label>
                <input
                  type="text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Misol: O'zbekiston hududidan o'tuvchi eng uzun daryo qaysi?..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs text-emerald-400 font-semibold block mb-1">
                    A) To'g'ri javob (Doim to'g'risini yozing)
                  </label>
                  <input
                    type="text"
                    value={qA0}
                    onChange={(e) => setQA0(e.target.value)}
                    placeholder="To'g'ri variant..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-600/70 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">B) Noto'g'ri variant</label>
                  <input
                    type="text"
                    value={qA1}
                    onChange={(e) => setQA1(e.target.value)}
                    placeholder="Noto'g'ri variant 1..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">C) Noto'g'ri variant</label>
                  <input
                    type="text"
                    value={qA2}
                    onChange={(e) => setQA2(e.target.value)}
                    placeholder="Noto'g'ri variant 2..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">D) Noto'g'ri variant</label>
                  <input
                    type="text"
                    value={qA3}
                    onChange={(e) => setQA3(e.target.value)}
                    placeholder="Noto'g'ri variant 3..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition"
              >
                Savolni Bazaga Saqlash (+100 Tanga mukofot)
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Mavzu Qo'shish (Add Educational Topic) */}
        {activeTab === 'addTopic' && (
          <form onSubmit={handleAddTopicSubmit} className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Bilim Olish bo'limiga yangi dars mavzusi qo'shish
              </h3>
              <p className="text-xs text-slate-400">
                O'quvchilar va foydalanuvchilar o'rganishi uchun yangi mavzu, dars bosqichlari va 10 savollik test tizimi bilan to'ldiring.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Fan</label>
                  <select
                    value={topicSubject}
                    onChange={(e) => setTopicSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  >
                    <option value="matematika">📐 Matematika</option>
                    <option value="informatika">💻 Informatika</option>
                    <option value="fizika">⚡ Fizika</option>
                    <option value="kimyo">🧪 Kimyo</option>
                    <option value="biologiya">🧬 Biologiya</option>
                    <option value="tarix">📜 Tarix</option>
                    <option value="ingliz-tili">🇬🇧 Ingliz tili</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Mavzu nomi</label>
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    placeholder="Misol: Kvadrat tenglamalar va diskriminant..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  1-qadam. Dars maqsadi va qisqacha mazmuni
                </label>
                <textarea
                  rows={2}
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                  placeholder="Mavzuning kirish qismi va darsdan ko'zlangan maqsad..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  2-qadam. Asosiy qoidalar va formulalar
                </label>
                <textarea
                  rows={2}
                  value={topicStep1}
                  onChange={(e) => setTopicStep1(e.target.value)}
                  placeholder="Mavzuga doir qoidalar, formulalar, ta'riflar..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  3-qadam. Amaliy misollar va tahlil
                </label>
                <textarea
                  rows={2}
                  value={topicStep2}
                  onChange={(e) => setTopicStep2(e.target.value)}
                  placeholder="Misollar yechimi va hayotiy qo'llanishi..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition"
              >
                Mavzuni Saytga Joylash (+100 Tanga mukofot)
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: O'yin Qo'shish (Add Custom Game) */}
        {activeTab === 'addGame' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left">
            <form onSubmit={handleAddGameSubmit} className="space-y-3">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Arcade bo'limiga yangi o'yin qo'shish
                </h3>
                <p className="text-xs text-slate-400">
                  Platformaga yangi o'yin dasturini kiriting. Dastur uchun joyga HTML/JS kodini yozing va nech tanga kerakligini belgilang.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">O'yin Nomi</label>
                    <input
                      type="text"
                      value={gameTitle}
                      onChange={(e) => setGameTitle(e.target.value)}
                      placeholder="Masalan: Koinot Kosmos Otishmasi..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Nech tangacha (Narxi)</label>
                      <input
                        type="number"
                        min="0"
                        value={gamePrice}
                        onChange={(e) => setGamePrice(e.target.value)}
                        placeholder="0 (Bepul)"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Mukofot Tanga</label>
                      <input
                        type="number"
                        min="0"
                        value={gameReward}
                        onChange={(e) => setGameReward(e.target.value)}
                        placeholder="15"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">O'yin Tavsifi</label>
                  <input
                    type="text"
                    value={gameDesc}
                    onChange={(e) => setGameDesc(e.target.value)}
                    placeholder="O'yin haqida qisqacha ma'lumot..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Dastur uchun joy (HTML/JS/Canvas kodini kiriting)
                  </label>
                  <textarea
                    rows={8}
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    placeholder="<!DOCTYPE html><html>...</html>"
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-teal-300 outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition"
                >
                  O'yinni Qo'shish (Arcade'ga chiqarish)
                </button>
              </div>
            </form>

            {/* Existing Games List & Delete Section */}
            {adminGames.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4 text-amber-400" />
                    <span>Mavjud O'yinlar ({adminGames.length} ta) — Boshqarish va O'chirish</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                    Admin & Yordamchi huquqi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {adminGames.map((g) => (
                    <div
                      key={g.id}
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                          {g.icon || '🎮'}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-black text-white truncate">{g.title}</h5>
                          <p className="text-[10.5px] text-slate-400 truncate">{g.description || 'Maxsus o\'yin'}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-amber-300/90 font-mono">
                            <span>Narx: {g.price || 0}🪙</span>
                            <span>•</span>
                            <span>Mukofot: +{g.reward || 15}🪙</span>
                            <span>•</span>
                            <span className="text-slate-500 truncate">@{g.author || 'admin'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setViewingGameCode(g);
                            setCopiedGameCode(false);
                          }}
                          title="O'yin dasturiy kodini ko'rish va nusxalash"
                          className="p-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500 border border-indigo-500/40 text-indigo-300 hover:text-white transition active:scale-95 flex items-center gap-1 text-[11px] font-bold"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Kod</span>
                        </button>

                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => handleUpdateAdminGamePrice(g)}
                            title="O'yin narxi va mukofotini o'zgartirish"
                            className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-slate-950 transition active:scale-95 flex items-center gap-1 text-[11px] font-bold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Narx</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteAdminGame(g.id, g.title)}
                          title="O'yinni butunlay o'chirish"
                          className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500 border border-rose-500/40 text-rose-300 hover:text-white transition active:scale-95 flex items-center gap-1 text-[11px] font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">O'chirish</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Event / Turnir Yaratish & Boshqarish */}
        {activeTab === 'event' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left">
            {/* Live event control banner */}
            {adminEvent && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 to-slate-900 border-2 border-amber-500/60 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {adminEvent.status === 'active' ? '⚡ Jonli Efirda (Faol)' : adminEvent.status === 'finished' ? '✓ Yakunlangan' : 'Qoralama'}
                      </span>
                      <h4 className="text-base font-extrabold text-white mt-1">{adminEvent.title}</h4>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span>Ishtirokchilar: <strong className="text-teal-300">{adminEvent.participants?.length || 0} nafar</strong></span>
                    <span>•</span>
                    <span>Vaqt: {adminEvent.durationMinutes} daqiqa</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                  {adminEvent.status === 'draft' && (
                    <button
                      type="button"
                      onClick={handleStartEvent}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>TURNIRNI JONLI BOSHLASH</span>
                    </button>
                  )}

                  {adminEvent.status === 'active' && (
                    <button
                      type="button"
                      onClick={handleFinishEvent}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>TURNIRNI YAKUNLASH & TOP 3 RANKINI 1 POG'ONAGA OSHIRISH</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1 ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eventni Bekor Qilish</span>
                  </button>
                </div>
              </div>
            )}

            {/* Create New Event Form */}
            <form onSubmit={handleCreateEvent} className="bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Yangi Jonli Musobaqa (Event) Yaratish</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Musobaqa sarlavhasi, davomiyligi va savollarini belgilang. Top 3 g'olibning unvoni 1 pog'onaga ko'tariladi!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-300 font-bold block mb-1">Turnir Sarlavhasi</label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Masalan: Koinot Bilimdonlari Tezkor Musobaqasi..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Davomiyligi (Daqiqa)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={eventDuration}
                    onChange={(e) => setEventDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono font-bold outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Turnir Tavsifi</label>
                <input
                  type="text"
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Turnir qoidalari va mukofotlari haqida ma'lumot..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Add Questions Section */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-teal-300 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>Turnir Savollari ({eventQuestionsList.length} ta kiritilgan)</span>
                  </span>
                </div>

                {/* List of current questions */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {eventQuestionsList.map((eq, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-amber-300">Savol {idx + 1}: </span>
                        <span className="text-slate-200">{eq.q}</span>
                        <div className="text-[11px] text-emerald-400 mt-1">
                          To'g'ri javob: {eq.a[eq.c]}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEventQuestion(idx)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* New Question Box */}
                <div className="bg-slate-900/90 border border-teal-500/30 p-3.5 rounded-2xl space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-300">Yangi savol qo'shish:</span>
                  <input
                    type="text"
                    value={newEqText}
                    onChange={(e) => setNewEqText(e.target.value)}
                    placeholder="Savol matnini kiriting..."
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-teal-400"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newEqCorrect === 0}
                        onChange={() => setNewEqCorrect(0)}
                      />
                      <input
                        type="text"
                        value={newEqA0}
                        onChange={(e) => setNewEqA0(e.target.value)}
                        placeholder="A variant..."
                        className="flex-1 p-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newEqCorrect === 1}
                        onChange={() => setNewEqCorrect(1)}
                      />
                      <input
                        type="text"
                        value={newEqA1}
                        onChange={(e) => setNewEqA1(e.target.value)}
                        placeholder="B variant..."
                        className="flex-1 p-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newEqCorrect === 2}
                        onChange={() => setNewEqCorrect(2)}
                      />
                      <input
                        type="text"
                        value={newEqA2}
                        onChange={(e) => setNewEqA2(e.target.value)}
                        placeholder="C variant..."
                        className="flex-1 p-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newEqCorrect === 3}
                        onChange={() => setNewEqCorrect(3)}
                      />
                      <input
                        type="text"
                        value={newEqA3}
                        onChange={(e) => setNewEqA3(e.target.value)}
                        placeholder="D variant..."
                        className="flex-1 p-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-400">Dumaloq tugma orqali to'g'ri variantni tanlang.</p>

                  <button
                    type="button"
                    onClick={handleAddQuestionToEvent}
                    className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Savolni Ro'yxatga Qo'shish</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-90 active:scale-95 transition"
                >
                  Turnirni Saqlash & E'lon Qilish
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 6: Ranklar Boshqaruvi (Yangi Rank Qo'shish & O'chirish) */}
        {activeTab === 'ranks' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left">
            {/* Top info and Reset bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>Cosmo Ranking Darajalari Tizimi</span>
                    <span className="text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.2 rounded-full font-bold">
                      {ranksList.length} ta Unvon Faol
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Yangi unvonlarni qo'shing yoki mavjudlarini tahrirlang. Barcha o'yinchilar profili va reyting jadvali avtomatik yangilanadi.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetRanks}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Standartga Qaytarish (Reset)</span>
              </button>
            </div>

            {/* Create New Rank Tier Form */}
            <form onSubmit={handleCreateRank} className="bg-slate-950/80 border border-purple-500/40 p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="text-xs sm:text-sm font-black text-purple-300 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-purple-400" />
                  <span>Yangi Rank (Unvon) Qo'shish</span>
                </h4>
                <span className="text-[10px] text-slate-400">Asosiy Admin Huquqi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Rank Nomi (Inglizcha)</label>
                  <input
                    type="text"
                    value={newRankTier}
                    onChange={(e) => setNewRankTier(e.target.value)}
                    placeholder="Masalan: Titan, Mythic, Cosmo King..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">O'zbekcha Nomi (Unvon)</label>
                  <input
                    type="text"
                    value={newRankUzName}
                    onChange={(e) => setNewRankUzName(e.target.value)}
                    placeholder="Masalan: Afsonaviy Qahramon..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Minimal Reyting Balli</label>
                  <input
                    type="number"
                    min="0"
                    value={newRankMinRating}
                    onChange={(e) => setNewRankMinRating(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono font-bold outline-none focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Nishon (Emoji Badge)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newRankBadge}
                      onChange={(e) => setNewRankBadge(e.target.value)}
                      className="w-16 p-2 text-center text-lg rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                    <div className="flex flex-wrap gap-1">
                      {['👑', '🌟', '🪐', '⚡', '🔥', '💎', '🏆', '🌌', '🚀', '🔮', '💠', '🥉'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewRankBadge(emoji)}
                          className={`w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition ${
                            newRankBadge === emoji ? 'bg-purple-600 border-purple-400' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Rang & Dizayn Uslubi</label>
                  <select
                    value={newRankTheme}
                    onChange={(e) => setNewRankTheme(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-400"
                  >
                    <option value="gold">👑 Oltin (G.O.A.T. & Afsonaviy)</option>
                    <option value="purple">🔮 Binafsha / Pink (Master)</option>
                    <option value="cyan">💠 Havorang / Moviy (Ekspert)</option>
                    <option value="rose">🔴 Olovrang / Qizil (Grossmeyster)</option>
                    <option value="emerald">🟢 Zumrad Yashil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Qisqacha Ta'rif</label>
                <input
                  type="text"
                  value={newRankDesc}
                  onChange={(e) => setNewRankDesc(e.target.value)}
                  placeholder="Bu darajaga erishish shartlari va unvon egasining tavsifi..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-purple-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Yangi Rankni Tizimga Qo'shish</span>
              </button>
            </form>

            {/* Current Active Ranks List */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                <span>Barcha Faol Ranklar Ro'yxati ({ranksList.length} ta)</span>
              </h4>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {ranksList.map((r, idx) => (
                  <div
                    key={r.tier}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-xl shrink-0 shadow">
                        {r.badge}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                            #{idx + 1}
                          </span>
                          <span className={`font-black text-sm ${r.color || 'text-white'}`}>
                            {r.tier}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold truncate">
                            ({r.uzName})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {r.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right font-mono text-xs font-black text-amber-300">
                        {r.minRating}+ ball
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteRank(r.tier)}
                        title="Unvonni o'chirish"
                        className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full User Details Inspection Modal (Admin View) */}
        {inspectUser && (
          <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
            <div className="bg-slate-900 border-2 border-indigo-500/50 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(99,102,241,0.25)] relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setInspectUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Avatar */}
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 p-0.5 shadow-lg shrink-0">
                  <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-3xl overflow-hidden">
                    {inspectUser.avatar && inspectUser.avatar.startsWith('data:') ? (
                      <img src={inspectUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      inspectUser.avatar || '👤'
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-white truncate">{inspectUser.username}</h3>
                    {inspectUser.isAdmin || inspectUser.username.toLowerCase() === 'admin' || inspectUser.email.toLowerCase() === 'xojayevistam16@gmail.com' ? (
                      <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                        <Crown className="w-3 h-3 text-amber-400" /> ADMIN
                      </span>
                    ) : inspectUser.helper ? (
                      <span className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                        <Award className="w-3 h-3 text-indigo-400" /> ADMIN YORDAMCHISI
                      </span>
                    ) : (
                      <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        FOYDALANUVCHI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{inspectUser.email}</span>
                  </p>
                </div>
              </div>

              {/* Status / Ban alert */}
              {inspectUser.bannedUntil && inspectUser.bannedUntil > Date.now() ? (
                <div className="mb-4 p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <Ban className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold">Holati: 3 kunlik bloklangan (BAN)</span>
                    <p className="text-[11px] text-rose-400/80">
                      Tugash vaqti: {new Date(inspectUser.bannedUntil).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold">Holati: Faol (cheklovlarsiz)</span>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Tanga Balansi</span>
                  <span className="text-sm font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                    <Coins className="w-3.5 h-3.5" />
                    {inspectUser.coins.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Baraban</span>
                  <span className="text-sm font-black text-teal-400 flex items-center justify-center gap-1 mt-0.5">
                    <Disc3 className="w-3.5 h-3.5" />
                    {inspectUser.wheelSpins} / 3
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Obunachilar</span>
                  <span className="text-sm font-black text-indigo-300 flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                    {(inspectUser.followers || []).length} ta
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Obuna bo'lgan</span>
                  <span className="text-sm font-black text-purple-300 flex items-center justify-center gap-1 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    {(inspectUser.following || []).length} ta
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Foydalanuvchi Bio / Haqida:</span>
                <p className="text-xs text-slate-200 italic">
                  {inspectUser.bio || "Foydalanuvchi hali o'zi haqida ma'lumot kiritmagan."}
                </p>
              </div>

              {/* Followers List Details */}
              {(inspectUser.followers || []).length > 0 && (
                <div className="mb-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    Unga obuna bo'lganlar ({(inspectUser.followers || []).length} ta):
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {(inspectUser.followers || []).map((f) => (
                      <span key={f} className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded-lg border border-slate-700">
                        @{f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Actions for this user */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-amber-300 block">⚡ Ushbu foydalanuvchini boshqarish:</span>

                {/* Make / Revoke Helper */}
                {isOwner && !(inspectUser.isAdmin || inspectUser.username.toLowerCase() === 'admin' || inspectUser.email.toLowerCase() === 'xojayevistam16@gmail.com') && (
                  <button
                    onClick={() => handleSetHelper(inspectUser.username, !inspectUser.helper)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5 shadow ${
                      inspectUser.helper
                        ? 'bg-rose-600/80 hover:bg-rose-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white font-black'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>{inspectUser.helper ? "❌ Admin Yordamchiligidan Olish" : "⭐ Admin Yordamchisi Qilish (Tayinlash)"}</span>
                  </button>
                )}

                {/* Coins +100 / -100 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdjustCoins(inspectUser.username, 100)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1 shadow"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>+100 Tanga Berish</span>
                  </button>

                  <button
                    onClick={() => handleAdjustCoins(inspectUser.username, -100)}
                    className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1 shadow"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>-100 Tanga Ayirish</span>
                  </button>
                </div>

                {/* Ban / Unban & Reset Wheel */}
                <div className="flex items-center gap-2">
                  {!(inspectUser.isAdmin || inspectUser.username.toLowerCase() === 'admin' || inspectUser.email.toLowerCase() === 'xojayevistam16@gmail.com') && (
                    <>
                      {inspectUser.bannedUntil && inspectUser.bannedUntil > Date.now() ? (
                        <button
                          onClick={() => handleBan(inspectUser.username, true)}
                          className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition active:scale-95"
                        >
                          Banni Ochish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBan(inspectUser.username, false)}
                          className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>3 Kunlik Ban Qo'yish</span>
                        </button>
                      )}
                    </>
                  )}

                  {isOwner && (
                    <button
                      onClick={() => handleResetWheel(inspectUser.username)}
                      className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1"
                    >
                      <Disc3 className="w-3.5 h-3.5" />
                      <span>Barabanni Tiklash (3/3)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Code Viewer Modal */}
        {viewingGameCode && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="bg-slate-900 border-2 border-indigo-500/70 w-full max-w-4xl rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh] text-left">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-2xl">
                    {viewingGameCode.icon || '🎮'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white">{viewingGameCode.title}</h3>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                        Dastur Kodu (Admin / Yordamchi)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Muallif: <strong className="text-indigo-300">@{viewingGameCode.author || 'admin'}</strong> • Narx: {viewingGameCode.price || 0} 🪙 • Mukofot: +{viewingGameCode.reward || 15} 🪙
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(viewingGameCode.code || '');
                      setCopiedGameCode(true);
                      setTimeout(() => setCopiedGameCode(false), 2000);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 border border-slate-700"
                  >
                    {copiedGameCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-300" />}
                    <span>{copiedGameCode ? 'Kopiya olindi!' : 'Kodni nusxalash'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingGameCode(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>HTML5 / JavaScript / Canvas Game Engine</span>
                </span>
                <span>Hajmi: {(viewingGameCode.code || '').length} belgi</span>
              </div>

              <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-emerald-300 overflow-y-auto max-h-[58vh] scrollbar-thin">
                <pre className="whitespace-pre-wrap break-all leading-relaxed select-all">
                  {viewingGameCode.code || '// O\'yin kodi topilmadi'}
                </pre>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Admin va Admin Yordamchisi o'yin kodini to'liq ko'rib chiqishi va nusxalab olishi mumkin.</span>
                <button
                  type="button"
                  onClick={() => setViewingGameCode(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
