import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import {
  getUserRankInfo,
  calculateUserRating,
  getUserCompletedLessonsCount,
  getUserSolvedProblemsCount,
  RANK_TIERS_CONFIG
} from '../utils/rankUtils';
import {
  Users,
  Search,
  Crown,
  Award,
  Coins,
  Sparkles,
  UserCheck,
  UserPlus,
  Ban,
  RotateCcw,
  Flame,
  CheckCircle2,
  ShieldAlert,
  Eye,
  X,
  Mail,
  Disc3,
  Trophy,
  Zap,
  TrendingUp,
  Medal,
  GraduationCap
} from 'lucide-react';

interface UsersSectionProps {
  currentUser: User;
  onUserUpdate: (updated: Partial<User>) => void;
  onToast: (msg: string) => void;
}

export const UsersSection: React.FC<UsersSectionProps> = ({
  currentUser,
  onUserUpdate,
  onToast,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ranking' | 'all' | 'staff' | 'topCoins' | 'topFollowers'>('ranking');
  const [inspectUser, setInspectUser] = useState<User | null>(null);
  const [quickHelperUsername, setQuickHelperUsername] = useState('');

  const isOwner =
    currentUser.isAdmin ||
    currentUser.username.toLowerCase() === 'admin' ||
    currentUser.email.toLowerCase() === 'xojayevistam16@gmail.com';
  const isHelper = !!currentUser.helper && !isOwner;
  const isStaff = isOwner || isHelper;

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
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleSubscribe = async (targetUsername: string) => {
    try {
      const res = await api.subscribeUser(targetUsername, currentUser.username);
      if (res.bonusGiven > 0) {
        onToast(`🎉 Tabriklaymiz! ${targetUsername} 500 ta obunachiga yetdi va +100 Tanga qo'shildi!`);
      } else {
        onToast(res.subscribed ? `✅ ${targetUsername} ga obuna bo'ldingiz!` : `❌ ${targetUsername} dan obunani bekor qildingiz.`);
      }

      const currentFollowing = currentUser.following || [];
      const updatedFollowing = res.subscribed
        ? [...currentFollowing, targetUsername]
        : currentFollowing.filter((u) => u.toLowerCase() !== targetUsername.toLowerCase());

      onUserUpdate({ following: updatedFollowing });
      loadUsers();
    } catch (err: any) {
      onToast(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleAdjustCoins = async (targetUsername: string, amount: number) => {
    if (!isStaff) return;
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
    if (!isStaff) return;
    try {
      await api.banUser(currentUser, targetUsername, 3, unban);
      onToast(unban ? `✅ ${targetUsername} bandan chiqarildi` : `🚫 ${targetUsername} 3 kunga bloklandi!`);
      loadUsers();
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    }
  };

  const handleToggleHelper = async (targetUsername: string, currentHelper: boolean) => {
    if (!isOwner) return;
    try {
      await api.setHelper(currentUser, targetUsername, !currentHelper);
      onToast(!currentHelper ? `⭐ ${targetUsername} Admin Yordamchisi etib tayinlandi!` : `❌ ${targetUsername} yordamchi lavozimidan olindi.`);
      setQuickHelperUsername('');
      loadUsers();
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    }
  };

  // Filter & Sort logic
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchesSearch =
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          (u.bio && u.bio.toLowerCase().includes(search.toLowerCase()));

        if (filter === 'staff') {
          const isUserOwner =
            u.isAdmin ||
            u.username.toLowerCase() === 'admin' ||
            u.email.toLowerCase() === 'xojayevistam16@gmail.com';
          return matchesSearch && (isUserOwner || u.helper);
        }
        return matchesSearch;
      })
      .sort((a, b) => {
        if (filter === 'ranking') {
          return calculateUserRating(b) - calculateUserRating(a);
        }
        if (filter === 'topCoins') {
          return (b.coins || 0) - (a.coins || 0);
        }
        if (filter === 'topFollowers') {
          return (b.followers?.length || 0) - (a.followers?.length || 0);
        }
        return b.createdAt - a.createdAt;
      });
  }, [users, search, filter]);

  // Top 3 for Ranking Podium
  const topRankers = useMemo(() => {
    return [...users].sort((a, b) => calculateUserRating(b) - calculateUserRating(a)).slice(0, 3);
  }, [users]);

  return (
    <div className="w-full space-y-5 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-teal-500/20 border border-amber-500/30 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-300 to-purple-300">
                Foydalanuvchilar & Ranking Jadvali
              </h2>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {users.length} O'quvchi
              </span>
            </div>
            <p className="text-xs text-slate-400">
              O'rgangan darslar va yechilgan misollar bo'yicha rasmiy unvonlar reytingi (Pupil ➡️ G.O.A.T.)
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('ranking')}
            className={`px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1 ${
              filter === 'ranking'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>🏆 Ranking Reyting</span>
          </button>
          <button
            onClick={() => setFilter('topCoins')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
              filter === 'topCoins'
                ? 'bg-teal-400 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Tangalar</span>
          </button>
          <button
            onClick={() => setFilter('topFollowers')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
              filter === 'topFollowers'
                ? 'bg-purple-500 text-white font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Obunachilar</span>
          </button>
          <button
            onClick={() => setFilter('staff')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
              filter === 'staff'
                ? 'bg-indigo-600 text-white font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>👨‍⚖️ Hakamlar (Judges)</span>
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'all'
                ? 'bg-slate-700 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Barchasi
          </button>
        </div>
      </div>

      {/* PODIUM TOP 3 (Shows when in ranking filter or default) */}
      {filter === 'ranking' && topRankers.length >= 1 && (
        <div className="bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-slate-950/90 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h3 className="text-sm sm:text-base font-black text-white">
                O'quvchilar Shon-Sharaf Supasi (Top 3 Liderlar)
              </h3>
            </div>
            <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full">
              Haftalik Reyting
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            {topRankers.map((u, idx) => {
              const rInfo = getUserRankInfo(u);
              const medalColor =
                idx === 0
                  ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300'
                  : idx === 1
                  ? 'border-slate-300 bg-slate-400/10 text-slate-200'
                  : 'border-amber-700 bg-amber-800/10 text-amber-400';
              const medalEmoji = idx === 0 ? '🥇 1-O\'RIN' : idx === 1 ? '🥈 2-O\'RIN' : '🥉 3-O\'RIN';

              return (
                <div
                  key={u.username}
                  onClick={() => setInspectUser(u)}
                  className={`border rounded-2xl p-4 flex flex-col justify-between items-center text-center cursor-pointer transition transform hover:-translate-y-1 ${medalColor} shadow-lg relative`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider mb-2 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700">
                    {medalEmoji}
                  </span>

                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-amber-400/60 flex items-center justify-center text-2xl mb-2 shadow overflow-hidden">
                    {u.avatar && u.avatar.startsWith('data:') ? (
                      <img src={u.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      u.avatar || '👤'
                    )}
                  </div>

                  <h4 className="text-sm font-extrabold text-white truncate max-w-[150px]">
                    {u.username}
                  </h4>

                  <div className="my-1.5">
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 border ${rInfo.border} ${rInfo.color}`}>
                      {rInfo.badge} {rInfo.tier}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-black text-amber-300 mt-1">
                    {rInfo.rating.toLocaleString()} Ball
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{rInfo.lessonsCount} dars</span>
                    <span>•</span>
                    <span>{rInfo.solvedCount} misol</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin quick helper assignment bar */}
      {isOwner && (
        <div className="bg-indigo-950/40 border border-indigo-500/40 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-xs font-black text-white">Yordamchi tayinlash (Admin):</span>
              <p className="text-[11px] text-slate-400">
                Foydalanuvchini tanlang va bitta bosishda "Admin Yordamchisi" qiling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={quickHelperUsername}
              onChange={(e) => setQuickHelperUsername(e.target.value)}
              placeholder="Username kiriting..."
              className="flex-1 sm:w-44 px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (!quickHelperUsername.trim()) {
                  onToast("Foydalanuvchi nomini kiriting!");
                  return;
                }
                handleToggleHelper(quickHelperUsername.trim(), false);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Yordamchi qilish</span>
            </button>
          </div>
        </div>
      )}

      {/* Search and refresh row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Username, email yoki unvon bo'yicha izlash..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
          />
        </div>

        <button
          onClick={loadUsers}
          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition active:scale-95"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Yangilash</span>
        </button>
      </div>

      {/* Users Cards Grid with Official Rank Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">
            Foydalanuvchilar topilmadi
          </div>
        ) : (
          filteredUsers.map((u, index) => {
            const isMe = u.username.toLowerCase() === currentUser.username.toLowerCase();
            const isTargetOwner =
              u.isAdmin ||
              u.username.toLowerCase() === 'admin' ||
              u.email.toLowerCase() === 'xojayevistam16@gmail.com';
            const isBanned = !!u.bannedUntil && u.bannedUntil > Date.now();
            const isSubscribed = (currentUser.following || []).some(
              (name) => name.toLowerCase() === u.username.toLowerCase()
            );
            const userFollowersCount = (u.followers || []).length;
            const rInfo = getUserRankInfo(u);

            return (
              <div
                key={u.username}
                className={`bg-slate-950/80 border rounded-3xl p-4.5 flex flex-col justify-between transition transform hover:-translate-y-0.5 shadow-lg relative ${
                  isTargetOwner
                    ? 'border-amber-500/40 hover:border-amber-400'
                    : u.helper
                    ? 'border-indigo-500/40 hover:border-indigo-400'
                    : isBanned
                    ? 'border-rose-500/40 opacity-75'
                    : 'border-slate-800 hover:border-teal-500/40'
                }`}
              >
                <div>
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <button
                      type="button"
                      onClick={() => setInspectUser(u)}
                      title="Profilni to'liq ko'rish"
                      className="flex items-center gap-2.5 text-left group min-w-0"
                    >
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600/40 to-teal-400/40 border border-slate-700 flex items-center justify-center text-xl overflow-hidden shrink-0 shadow group-hover:border-teal-400 transition">
                        {u.avatar && u.avatar.startsWith('data:') ? (
                          <img src={u.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          u.avatar || '👤'
                        )}
                      </div>

                      {/* Name & Rank */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-black text-sm text-white group-hover:text-teal-300 transition truncate">
                          <span className="truncate">{u.username}</span>
                          {isMe && <span className="text-[10px] text-teal-400 font-normal">(Siz)</span>}
                        </div>
                        <div className="text-[10.5px] text-slate-400 truncate">
                          {u.email}
                        </div>
                      </div>
                    </button>

                    {/* Rank Tier Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-900 border ${rInfo.border} ${rInfo.color} shadow-sm`}>
                        {rInfo.badge} {rInfo.tier}
                      </span>

                      {isTargetOwner ? (
                        <span className="text-[9px] text-amber-300 font-extrabold uppercase bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          👑 Bosh Hakam (Admin)
                        </span>
                      ) : u.helper ? (
                        <span className="text-[9px] text-indigo-300 font-bold uppercase bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ⚖️ Hakam (Judge)
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-bold uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                          🎓 O'quvchi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating & Lessons bar */}
                  <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">Reyting Balli</div>
                      <div className="text-sm font-black text-amber-300 font-mono">
                        {rInfo.rating.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">ball</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-semibold">O'rganilgan</div>
                      <div className="text-xs font-bold text-teal-300">
                        {rInfo.lessonsCount} dars • {rInfo.solvedCount} misol
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {u.bio && (
                    <p className="text-[11px] text-slate-300 italic line-clamp-2 mb-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      "{u.bio}"
                    </p>
                  )}

                  {/* Stats chips */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 flex items-center gap-1.5 text-amber-300 font-extrabold">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>{u.coins.toLocaleString()}</span>
                    </div>

                    <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-2 flex items-center gap-1.5 text-teal-300 font-bold">
                      <Users className="w-3.5 h-3.5 text-teal-400" />
                      <span>{userFollowersCount} obunachi</span>
                    </div>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectUser(u)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profilni ko'rish</span>
                    </button>

                    {!isMe && (
                      <button
                        type="button"
                        onClick={() => handleToggleSubscribe(u.username)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1 ${
                          isSubscribed
                            ? 'bg-slate-800 text-teal-300 border border-teal-500/30'
                            : 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-black'
                        }`}
                      >
                        {isSubscribed ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                        <span>{isSubscribed ? 'Obunadasiz' : 'Obuna'}</span>
                      </button>
                    )}
                  </div>

                  {/* Staff actions */}
                  {isStaff && !isTargetOwner && (
                    <div className="flex items-center gap-1 justify-between pt-1">
                      <button
                        onClick={() => handleAdjustCoins(u.username, 100)}
                        title="+100 Tanga"
                        className="flex-1 py-1 rounded-lg bg-emerald-600/70 hover:bg-emerald-500 text-white font-bold text-[10px] transition"
                      >
                        +100🪙
                      </button>
                      <button
                        onClick={() => handleAdjustCoins(u.username, -100)}
                        title="-100 Tanga"
                        className="flex-1 py-1 rounded-lg bg-amber-600/70 hover:bg-amber-500 text-white font-bold text-[10px] transition"
                      >
                        -100🪙
                      </button>
                      {isBanned ? (
                        <button
                          onClick={() => handleBan(u.username, true)}
                          className="flex-1 py-1 rounded-lg bg-emerald-700/80 text-white font-bold text-[10px]"
                        >
                          Bandan olish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBan(u.username, false)}
                          className="flex-1 py-1 rounded-lg bg-rose-600/80 text-white font-bold text-[10px]"
                        >
                          3 kun Ban
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INSPECT USER MODAL WITH RANK TIER */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-teal-500/50 w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl relative text-left">
            <button
              onClick={() => setInspectUser(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* User Profile Overview */}
            {(() => {
              const rInfo = getUserRankInfo(inspectUser);
              const isInspectOwner =
                inspectUser.isAdmin ||
                inspectUser.username.toLowerCase() === 'admin' ||
                inspectUser.email.toLowerCase() === 'xojayevistam16@gmail.com';

              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-teal-400 p-0.5 flex items-center justify-center text-3xl shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                        {inspectUser.avatar && inspectUser.avatar.startsWith('data:') ? (
                          <img src={inspectUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          inspectUser.avatar || '👤'
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-white">
                          {inspectUser.username}
                        </h3>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-950 border ${rInfo.border} ${rInfo.color}`}>
                          {rInfo.badge} {rInfo.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{inspectUser.email}</p>
                    </div>
                  </div>

                  {/* Rank card */}
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${rInfo.bgGradient} border ${rInfo.border} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">
                        Rasmiy Daraja: <span className={rInfo.color}>{rInfo.tier} ({rInfo.uzName})</span>
                      </span>
                      <span className="text-xs font-mono font-black text-amber-300">
                        {rInfo.rating.toLocaleString()} Ball
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {rInfo.description}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10.5px]">O'zlashtirgan Darslari</div>
                      <div className="text-sm font-black text-teal-300 mt-0.5">
                        {rInfo.lessonsCount} ta mavzu
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10.5px]">Yechgan Misollari</div>
                      <div className="text-sm font-black text-emerald-300 mt-0.5">
                        {rInfo.solvedCount} ta misol
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10.5px]">Tangalari</div>
                      <div className="text-sm font-black text-amber-300 mt-0.5">
                        {inspectUser.coins.toLocaleString()} 🪙
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10.5px]">Obunachilari</div>
                      <div className="text-sm font-black text-purple-300 mt-0.5">
                        {(inspectUser.followers || []).length} kishi
                      </div>
                    </div>
                  </div>

                  {inspectUser.bio && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <span className="text-slate-500 text-[10px] block mb-1">Status / Bio:</span>
                      "{inspectUser.bio}"
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
