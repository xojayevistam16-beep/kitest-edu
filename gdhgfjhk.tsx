import React, { useState } from 'react';
import { User } from '../types';
import { getUserRankInfo } from '../utils/rankUtils';
import { Sparkles, Coins, Disc3, ShieldAlert, LogOut, Users, Award, Crown, Globe, Copy, Check, Share2, Trophy } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onlineCount: number;
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onlineCount,
  onOpenAdmin,
  onOpenProfile,
  onLogout,
}) => {
  const [copiedDomain, setCopiedDomain] = useState(false);
  const isOwner = user?.isAdmin || user?.username.toLowerCase() === 'admin' || user?.email.toLowerCase() === 'xojayevistam16@gmail.com';
  const isHelper = !!user?.helper && !isOwner;
  const isStaff = isOwner || isHelper;
  const followersCount = (user?.followers || []).length;

  const handleCopyDomain = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('https://kitest-edu.ai.studio');
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  return (
    <header className="w-full max-w-5xl mx-auto p-3 sm:p-4 bg-slate-900/90 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      {/* Brand logo & Domain badge */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-300 to-amber-300">
              kitest-edu
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
              O'quv & Dasturlash Platformasi
            </p>
          </div>
        </div>

        {/* Official Domain Link & Quick Copy / Share Badge */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyDomain}
            title="Ilova havolasidan nusxa olish (https://kitest-edu.ai.studio)"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-xs text-teal-300 font-mono transition active:scale-95 group shadow-sm shadow-teal-500/10"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-12 transition-transform" />
            <span className="font-bold tracking-tight">https://kitest-edu.ai.studio</span>
            {copiedDomain ? (
              <span className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-0.5 ml-0.5">
                <Check className="w-3 h-3 text-emerald-400" /> Nusxa olindi!
              </span>
            ) : (
              <span className="text-[10px] text-teal-400/80 font-sans flex items-center gap-1 ml-0.5 group-hover:text-teal-200">
                <Copy className="w-3 h-3 text-teal-400" /> Nusxalash
              </span>
            )}
          </button>

          <a
            href="https://t.me/share/url?url=https://kitest-edu.ai.studio&text=kitest-edu+ta%27lim+va+o%27yinlar+platformasiga+qo%27shiling!"
            target="_blank"
            rel="noopener noreferrer"
            title="Ilova havolasini Telegramda ulashish"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-[11px] text-sky-300 font-medium transition active:scale-95 shadow-sm"
          >
            <Share2 className="w-3 h-3 text-sky-400" />
            <span>Ulashish</span>
          </a>
        </div>
      </div>

      {/* Online indicator & user stats */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-3">
        {/* Real-time online counter & link to Foydalanuvchilar */}
        <a
          href="#foydalanuvchilar"
          title="Foydalanuvchilar bo'limiga o'tish"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 font-medium transition active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <Users className="w-3.5 h-3.5 text-teal-400" />
          <span>{onlineCount} online</span>
        </a>

        {user && (
          <>
            {/* Coins */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{user.coins.toLocaleString()}</span>
            </div>

            {/* Daily spins */}
            <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Disc3 className="w-3.5 h-3.5 text-teal-400" />
              <span>{user.wheelSpins}/3</span>
            </div>

            {/* User Profile Button */}
            {(() => {
              const rankInfo = getUserRankInfo(user);
              return (
                <button
                  onClick={onOpenProfile}
                  title={`Profil • Darajangiz: ${rankInfo.tier} (${rankInfo.rating} ball)`}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400 text-xs font-semibold text-purple-200 transition active:scale-95 shadow-sm"
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs overflow-hidden">
                    {user.avatar && user.avatar.startsWith('data:') ? (
                      <img src={user.avatar} alt="face" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.avatar || '👤'}</span>
                    )}
                  </div>
                  <span className="max-w-[75px] truncate font-bold">{user.username}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full bg-slate-900 border ${rankInfo.border} ${rankInfo.color}`}>
                    {rankInfo.badge} {rankInfo.tier}
                  </span>
                </button>
              );
            })()}

            {/* Staff / Admin button */}
            {isStaff && (
              <button
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition active:scale-95 ${
                  isOwner
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:brightness-110'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isOwner ? '👑 Bosh Hakam' : '⚖️ Hakam'}</span>
              </button>
            )}

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Chiqish"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition active:scale-95"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
