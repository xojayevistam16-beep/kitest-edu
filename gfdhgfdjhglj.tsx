import React, { useRef, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { Crown, Disc3, Sparkles, Gift, Zap, CheckCircle2 } from 'lucide-react';

interface PremiumSectionProps {
  user: User;
  onUserUpdate: (updated: Partial<User>) => void;
  onToast: (msg: string) => void;
}

const SUPER_PRIZES = ['+200 Coin', '+100 Coin', '+50 Coin', '0 Coin', '-10 Coin'];
const SUPER_COLORS = ['#f59e0b', '#d97706', '#b45309', '#475569', '#ef4444'];

export const PremiumSection: React.FC<PremiumSectionProps> = ({ user, onUserUpdate, onToast }) => {
  const isPremium = !!(user.premiumUntil && user.premiumUntil > Date.now());
  const [buying, setBuying] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [openingPack, setOpeningPack] = useState(false);
  const [lastReward, setLastReward] = useState<string | null>(null);
  const [lastDroppedAvatar, setLastDroppedAvatar] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef<number>(0);

  const formatRemainingTime = (expiry: number) => {
    const diff = expiry - Date.now();
    if (diff <= 0) return 'Muddati tugagan';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} soat ${mins} daqiqa qoldi`;
  };

  const handleBuyPremium = async () => {
    if (user.coins < 10000) {
      onToast("Premium sotib olish uchun 10,000 Tanga yetarli emas!");
      return;
    }
    setBuying(true);
    try {
      const res = await api.buyPremium(user.username);
      onUserUpdate({ coins: res.coins, premiumUntil: res.premiumUntil });
      onToast("🎉 Tabriklaymiz! Siz 2 kunlik Premium statusini qo'lga kiritdingiz!");
    } catch (e: any) {
      onToast(e.message || 'Xatolik yuz berdi');
    } finally {
      setBuying(false);
    }
  };

  const drawSuperWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const center = width / 2;
    const radius = center - 12;
    const count = SUPER_PRIZES.length;
    const arc = (Math.PI * 2) / count;

    ctx.clearRect(0, 0, width, height);

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    for (let i = 0; i < count; i++) {
      const startAngle = angle + i * arc;
      const endAngle = startAngle + arc;

      ctx.beginPath();
      ctx.fillStyle = SUPER_COLORS[i % SUPER_COLORS.length];
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.stroke();

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      const textAngle = startAngle + arc / 2;
      const textX = center + Math.cos(textAngle) * (radius * 0.65);
      const textY = center + Math.sin(textAngle) * (radius * 0.65);

      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      const text = SUPER_PRIZES[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 4);
      ctx.restore();
    }

    // Center hub
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
  };

  useEffect(() => {
    if (isPremium) {
      drawSuperWheel(angleRef.current);
    }
  }, [isPremium]);

  const handleSpinSuperWheel = async () => {
    if (spinning || !isPremium) return;
    const currentSpins = user.superWheelSpins ?? 5;
    if (currentSpins <= 0) {
      onToast("Bugungi Super Baraban imkoniyatingiz tugadi!");
      return;
    }

    setSpinning(true);
    setLastReward(null);
    let speed = Math.random() * 0.25 + 0.35;
    let currAngle = angleRef.current;

    const timer = setInterval(async () => {
      currAngle += speed;
      speed *= 0.983;
      angleRef.current = currAngle;
      drawSuperWheel(currAngle);

      if (speed < 0.002) {
        clearInterval(timer);
        setSpinning(false);

        const count = SUPER_PRIZES.length;
        const arc = (Math.PI * 2) / count;
        let normalized = (1.5 * Math.PI - currAngle) % (Math.PI * 2);
        if (normalized < 0) normalized += Math.PI * 2;

        const prizeIndex = Math.floor(normalized / arc) % count;
        const prizeStr = SUPER_PRIZES[prizeIndex];
        const winCoins = prizeStr.includes('-') ? -10 : parseInt(prizeStr, 10) || 0;

        try {
          const res = await api.spinSuperWheel(user.username, winCoins);
          onUserUpdate({ coins: res.coins, superWheelSpins: res.superWheelSpins });
          setLastReward(prizeStr);
          if (winCoins >= 0) {
            onToast(`⭐ Super Baraban: +${winCoins} Tanga yutib oldingiz!`);
          } else {
            onToast(`⚠️ Super Baraban: ${winCoins} Tanga ayrildi!`);
          }
        } catch (e: any) {
          onToast(e.message || 'Xatolik');
        }
      }
    }, 20);
  };

  const handleOpenPack = async () => {
    if (openingPack) return;
    if (user.coins < 20) {
      onToast("Pack ochish uchun 20 Tanga kerak!");
      return;
    }

    setOpeningPack(true);
    setLastDroppedAvatar(null);
    try {
      const res = await api.openPack(user.username);
      onUserUpdate({ coins: res.coins, unlockedAvatars: res.unlockedAvatars });
      setLastDroppedAvatar(res.droppedAvatar);
      onToast(`🎁 Tabriklaymiz! Pack ichidan maxsus rasm (${res.droppedAvatar}) chiqdi!`);
    } catch (e: any) {
      onToast(e.message || 'Xatolik');
    } finally {
      setOpeningPack(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-950/40 via-purple-950/50 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_30px_rgba(245,158,11,0.2)] space-y-6 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-amber-500/30 pb-4">
        <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
          <Crown className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300">
            👑 Premium & Super Baraban & Pack Opener
          </h2>
          <p className="text-xs text-slate-300">
            {isPremium
              ? `⭐ Premium Faol (${formatRemainingTime(user.premiumUntil!)})`
              : "2 kunlik Premium statusini xarid qiling va super imkoniyatlarga ega bo'ling!"}
          </p>
        </div>
      </div>

      {/* Buy Premium Banner if not active */}
      {!isPremium && (
        <div className="bg-slate-950/80 border border-amber-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>2 Kunlik Premium (Narxi: 10,000 Tanga)</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Super Barabanda har kuni omadni sinang (+200 coin gacha) va Maxsus Pack Opener orqali noyob profil rasmlarini qo'lga kiriting!
            </p>
          </div>
          <button
            onClick={handleBuyPremium}
            disabled={buying}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition shrink-0"
          >
            {buying ? 'Sotib olinmoqda...' : '10,000 Coin ga Sotib Olish'}
          </button>
        </div>
      )}

      {/* Premium Exclusive Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SUPER BARABAN */}
        <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg relative">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Disc3 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-amber-300">Super Baraban</h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
              {user.superWheelSpins ?? 5}/5 ta
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Mukofotlar: <strong className="text-amber-400">+200, +100, +50, 0, -10</strong> Tanga!
          </p>

          <div className="relative my-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-amber-400 z-20 filter drop-shadow"></div>
            <canvas ref={canvasRef} width="220" height="220" className="mx-auto rounded-full shadow-lg" />
          </div>

          {lastReward && (
            <div className="my-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-bold animate-bounce">
              Natija: {lastReward}
            </div>
          )}

          <button
            onClick={handleSpinSuperWheel}
            disabled={spinning || !isPremium || (user.superWheelSpins ?? 5) <= 0}
            className={`w-full mt-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow transition active:scale-95 ${
              isPremium && (user.superWheelSpins ?? 5) > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {spinning
              ? 'Aylanmoqda...'
              : !isPremium
              ? 'Faqat Premium Uchun 🔒'
              : (user.superWheelSpins ?? 5) <= 0
              ? 'BUGUNLIK TUGADI'
              : 'SUPER BARABANNI AYLANTIRISH'}
          </button>
        </div>

        {/* PACK OPENER */}
        <div className="bg-slate-950/70 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between text-center shadow-lg">
          <div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-black text-purple-300">Maxsus Pack Opener</h3>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                {3 - (user.packOpensToday || 0)}/3 qoldi
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Narxi: <strong className="text-amber-400">20 Tanga</strong>. Pack ochib profil uchun noyob va ajoyib rasmlar/avatarlarni to'plang!
            </p>

            {/* Dropped Avatar Showcase */}
            <div className="w-28 h-28 mx-auto my-4 rounded-3xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-teal-900 border-2 border-purple-400 flex items-center justify-center text-6xl shadow-[0_0_25px_rgba(168,85,247,0.4)] transform transition-transform hover:scale-105">
              {lastDroppedAvatar || '🎁'}
            </div>

            {lastDroppedAvatar && (
              <div className="text-xs font-bold text-emerald-400 mb-2">
                Tabriklaymiz! Yangi profil rasmi ochildi!
              </div>
            )}
          </div>

          <button
            onClick={handleOpenPack}
            disabled={openingPack || !isPremium || (user.packOpensToday || 0) >= 3}
            className={`w-full mt-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow transition active:scale-95 ${
              isPremium
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {openingPack
              ? 'Ochilmoqda...'
              : !isPremium
              ? 'Faqat Premium Uchun 🔒'
              : (user.packOpensToday || 0) >= 3
              ? 'Bugungi 3 ta limit tugadi'
              : 'PACK OCHISH (20 TANGA)'}
          </button>
        </div>
      </div>
    </div>
  );
};
