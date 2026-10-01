import React, { useRef, useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { Disc3, Sparkles } from 'lucide-react';

interface FortuneWheelProps {
  user: User;
  onUserUpdate: (updated: Partial<User>) => void;
  onToast: (msg: string) => void;
}

const PRIZES = ['10 Coin', '25 Coin', '5 Coin', '50 Coin', '0 Coin', '100 Coin', '15 Coin', '30 Coin'];
const COLORS = [
  '#7b2cbf', '#3c096c',
  '#5a189a', '#240046',
  '#9d4edd', '#10002b',
  '#6a0dad', '#3b0764'
];

export const FortuneWheel: React.FC<FortuneWheelProps> = ({ user, onUserUpdate, onToast }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [spinning, setSpinning] = useState(false);
  const angleRef = useRef<number>(0);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const center = width / 2;
    const radius = center - 12;
    const count = PRIZES.length;
    const arc = (Math.PI * 2) / count;

    ctx.clearRect(0, 0, width, height);

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#2dd4bf';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw sectors
    for (let i = 0; i < count; i++) {
      const startAngle = angle + i * arc;
      const endAngle = startAngle + arc;

      ctx.beginPath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      const textAngle = startAngle + arc / 2;
      const textX = center + Math.cos(textAngle) * (radius * 0.65);
      const textY = center + Math.sin(textAngle) * (radius * 0.65);

      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      const text = PRIZES[i];
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
    drawWheel(angleRef.current);
  }, []);

  const handleSpin = async () => {
    if (spinning) return;
    if (user.wheelSpins <= 0) {
      onToast("Bugungi baraban imkoniyatingiz tugagan! Ertaga yana urinib ko'ring yoki admin bilan bog'laning.");
      return;
    }

    setSpinning(true);
    let speed = Math.random() * 0.25 + 0.35;
    let currAngle = angleRef.current;

    const timer = setInterval(async () => {
      currAngle += speed;
      speed *= 0.983;
      angleRef.current = currAngle;
      drawWheel(currAngle);

      if (speed < 0.002) {
        clearInterval(timer);
        setSpinning(false);

        const count = PRIZES.length;
        const arc = (Math.PI * 2) / count;
        // Pointer is at top (-PI/2 or 1.5*PI)
        let normalized = (1.5 * Math.PI - currAngle) % (Math.PI * 2);
        if (normalized < 0) normalized += Math.PI * 2;

        const prizeIndex = Math.floor(normalized / arc) % count;
        const prizeStr = PRIZES[prizeIndex];
        const winCoins = parseInt(prizeStr, 10) || 0;

        try {
          const res = await api.spinWheel(user.username, winCoins);
          onUserUpdate({ coins: res.coins, wheelSpins: res.wheelSpins });
          onToast(`🎉 Tabriklaymiz! Siz ${winCoins} Tanga yutib oldingiz!`);
        } catch (e: any) {
          onToast(e.message || 'Xatolik yuz berdi');
        }
      }
    }, 20);
  };

  return (
    <div className="w-full bg-slate-900/80 border border-teal-500/30 rounded-3xl p-5 sm:p-6 flex flex-col items-center gap-4 text-center shadow-xl shadow-teal-500/5 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-2">
        <Disc3 className="w-6 h-6 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300">
          Omad Barabani
        </h2>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 max-w-md">
        Kunlik imkoniyat: <span className="text-amber-400 font-extrabold text-base">{user.wheelSpins}</span> / 3 ta
      </p>

      {/* Canvas container with top indicator */}
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] my-1 flex items-center justify-center">
        {/* Top pointer arrow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 text-3xl text-amber-400 filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]">
          ▼
        </div>
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="w-full h-full rounded-full cursor-pointer select-none"
        />
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || user.wheelSpins <= 0}
        className="w-full max-w-xs py-3 px-6 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 hover:opacity-90 active:scale-95 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-teal-400/25 transition disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>{spinning ? 'AYLANMOQDA...' : user.wheelSpins > 0 ? 'BARABANNI AYLANTIRISH' : 'BUGUNLIK TUGADI'}</span>
      </button>
    </div>
  );
};
