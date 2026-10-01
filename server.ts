import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email Transporter for sending real Gmail emails
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || process.env.GMAIL_USER || '',
    pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '',
  },
});

async function sendPasswordResetEmail(toEmail: string, username: string, code: string, resetUrl: string) {
  const mailOptions = {
    from: `"CosmoEdu Xavfsizlik" <${process.env.SMTP_USER || process.env.GMAIL_USER || 'security@cosmo-edu.uz'}>`,
    to: toEmail,
    subject: `🔐 CosmoEdu: Parolni tiklash tasdiqlash kodingiz — ${code}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; padding: 30px; color: #f8fafc; border-radius: 20px; max-width: 520px; margin: 0 auto; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #2dd4bf; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">🚀 CosmoEdu</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Parolni qayta tiklash xizmati</p>
        </div>

        <div style="background-color: #111827; border-radius: 16px; padding: 24px; border: 1px solid #1f2937;">
          <p style="font-size: 15px; color: #e2e8f0; margin-top: 0;">
            Assalomu alaykum, <strong style="color: #38bdf8;">${username}</strong>!
          </p>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
            Sizning <strong>${toEmail}</strong> hisobingiz uchun parolni tiklash so'rovi yuborildi. Hisobingizni tiklash uchun quyidagi 6 xonali tasdiqlash kodidan foydalaning:
          </p>

          <div style="background: linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(56, 189, 248, 0.1)); border: 2px dashed #2dd4bf; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0;">
            <div style="font-size: 12px; color: #2dd4bf; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
              Tasdiqlash Kodi
            </div>
            <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">
              ${code}
            </div>
          </div>

          <p style="font-size: 12px; color: #64748b; margin-bottom: 0; line-height: 1.5;">
            ⏳ Ushbu kod <strong>15 daqiqa</strong> davomida amal qiladi. Agar ushbu so'rovni siz amalga oshirmagan bo'lsangiz, xatni e'tiborsiz qoldirishingiz mumkin.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #475569; font-size: 11px;">
          &copy; ${new Date().getFullYear()} CosmoEdu Ta'lim Portali. Barcha huquqlar himoyalangan.
        </div>
      </div>
    `,
    text: `Assalomu alaykum, ${username}!\n\nHisobingiz (${toEmail}) uchun parolni tiklash kodi: ${code}\n\nUshbu kod 15 daqiqa amal qiladi.\n\nAgar siz so'rov yubormagan bo'lsangiz, bu xatni e'tiborsiz qoldiring.`,
  };

  try {
    if (process.env.SMTP_USER || process.env.GMAIL_USER) {
      await emailTransporter.sendMail(mailOptions);
      console.log(`[REAL GMAIL SENT] Email successfully dispatched via SMTP to ${toEmail}`);
    } else {
      console.log(`\n======================================================`);
      console.log(`📧 [GMAIL XABARI DISPATCH] Kimga: ${toEmail} (${username})`);
      console.log(`🔑 TASDIQLASH KODI: >>> ${code} <<<`);
      console.log(`======================================================\n`);
    }
  } catch (err) {
    console.error(`[GMAIL ERROR] Could not dispatch email to ${toEmail}:`, err);
  }
}

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const CUSTOM_GAMES_FILE = path.join(DATA_DIR, 'custom_games.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface User {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
  claimedMilestones?: number[];
  dailyChallengeDate?: string;
  dailyChallengeCompleted?: boolean;
  dailyChallengeWon?: boolean;
  dailyChallengeStreak?: number;
  coins: number;
  wheelSpins: number;
  lastSpinDate: string;
  bannedUntil: number | null;
  helper: boolean;
  isAdmin: boolean;
  createdAt: number;
  premiumUntil?: number | null;
  unlockedAvatars?: string[];
  packOpensToday?: number;
  packOpenDate?: string;
  superWheelSpins?: number;
  lastSuperSpinDate?: string;
  completedLessons?: string[];
  solvedProblemsCount?: number;
  bonusRating?: number;
}

interface EventQuestion {
  q: string;
  a: string[];
  c: number;
}

interface EventParticipant {
  username: string;
  score: number;
  total: number;
  timeSpentSec: number;
  completedAt: number;
}

interface TournamentEvent {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  startTime: number;
  endTime: number;
  status: 'draft' | 'active' | 'finished';
  questions: EventQuestion[];
  participants: EventParticipant[];
  winners?: {
    username: string;
    rank: number;
    score: number;
    promotedTo: string;
    coinsReward: number;
    ratingBoost: number;
  }[];
  createdBy: string;
}

interface RankTierInfo {
  tier: string;
  uzName: string;
  minRating: number;
  maxRating?: number;
  badge: string;
  color?: string;
  border?: string;
  bgGradient?: string;
  textGradient?: string;
  description: string;
}

const DEFAULT_RANKS: RankTierInfo[] = [
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

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  ts: number;
  role?: string;
  avatar?: string;
}

interface ReelItem {
  id: string;
  user: string;
  caption: string;
  mediaType: 'image' | 'video' | 'none';
  mediaUrl: string;
  ts: number;
  likes: number;
}

interface CustomQuestion {
  id: string;
  q: string;
  a: string[];
  c: number;
  cat: string;
  author: string;
  ts: number;
}

interface CustomTopic {
  id: string;
  subject: string;
  title: string;
  content: string;
  steps: { h: string; t: string }[];
  questions: { q: string; a: string[]; c: number }[];
  author: string;
  ts: number;
}

export interface CustomGame {
  id: string;
  title: string;
  description: string;
  icon?: string;
  code: string;
  price: number;
  reward?: number;
  author: string;
  ts: number;
}

const defaultSeedGames: CustomGame[] = [
  {
    id: 'game-snake',
    title: 'Koinot Iloni (Space Snake)',
    description: 'Neon koinotida ilonni boshqaring, yulduzlarni yeng va tanga to\'plang!',
    icon: '🐍',
    price: 5,
    reward: 15,
    author: 'admin',
    ts: Date.now(),
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
    body { background: #070314; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; padding: 10px; }
    #hud { display: flex; justify-content: space-between; width: 320px; margin-bottom: 8px; font-weight: bold; font-size: 14px; color: #38bdf8; }
    canvas { background: #0f172a; border: 2px solid #38bdf8; border-radius: 12px; box-shadow: 0 0 20px rgba(56,189,248,0.3); }
    .controls { display: grid; grid-template-columns: repeat(3, 50px); gap: 6px; margin-top: 10px; }
    .btn { background: #1e293b; border: 1px solid #475569; color: #fff; font-size: 18px; border-radius: 8px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .btn:active { background: #38bdf8; color: #000; }
    #msg { margin-top: 6px; font-size: 12px; color: #a7f3d0; text-align: center; }
  </style>
</head>
<body>
  <div id="hud"><span>Ball: <span id="score">0</span></span><span>Rekord: <span id="high">0</span></span></div>
  <canvas id="c" width="320" height="320"></canvas>
  <div class="controls">
    <div></div><button class="btn" onclick="setDir(0,-1)">⬆️</button><div></div>
    <button class="btn" onclick="setDir(-1,0)">⬅️</button><button class="btn" onclick="setDir(0,1)">⬇️</button><button class="btn" onclick="setDir(1,0)">➡️</button>
  </div>
  <div id="msg">Klaviatura strelkalari yoki tugmalar orqali boshqaring!</div>
  <script>
    const cvs = document.getElementById('c'), ctx = cvs.getContext('2d');
    const grid = 16, cols = 20, rows = 20;
    let snake = [{x:10, y:10}], dir = {x:1, y:0}, food = {x:15, y:10}, score = 0, high = 0, running = true;
    function randFood() { food = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)}; }
    function setDir(x,y) { if ((x && x === -dir.x) || (y && y === -dir.y)) return; dir = {x, y}; }
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') setDir(0,-1);
      if (e.key === 'ArrowDown') setDir(0,1);
      if (e.key === 'ArrowLeft') setDir(-1,0);
      if (e.key === 'ArrowRight') setDir(1,0);
    });
    function loop() {
      if (!running) return;
      const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x===head.x && s.y===head.y)) {
        if (score >= 5) {
          window.parent.postMessage({ type: 'GAME_WIN', score: score }, '*');
        }
        document.getElementById('msg').innerHTML = '<span style="color:#f87171">O\\'yin tugadi! Qaytadan: Boshlash uchun strelka bosing</span>';
        snake = [{x:10,y:10}]; dir={x:1,y:0}; score=0;
        document.getElementById('score').innerText = score;
      } else {
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 1;
          if (score > high) { high = score; document.getElementById('high').innerText = high; }
          document.getElementById('score').innerText = score;
          randFood();
          if (score === 5) {
            window.parent.postMessage({ type: 'GAME_WIN', score: score }, '*');
          }
        } else {
          snake.pop();
        }
      }
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,cvs.width,cvs.height);
      ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(food.x*grid+grid/2, food.y*grid+grid/2, grid/2.2, 0, Math.PI*2); ctx.fill();
      snake.forEach((s, idx) => {
        ctx.fillStyle = idx === 0 ? '#38bdf8' : '#818cf8';
        ctx.fillRect(s.x*grid+1, s.y*grid+1, grid-2, grid-2);
      });
      setTimeout(loop, Math.max(70, 140 - score*4));
    }
    randFood(); loop();
  </script>
</body>
</html>`
  },
  {
    id: 'game-flappy',
    title: 'Koinot Flappy (Flappy Rocket)',
    description: 'Raketani teginish orqali to\'siqlardan o\'tkazing va yulduzlarni zabt eting!',
    icon: '🚀',
    price: 10,
    reward: 20,
    author: 'admin',
    ts: Date.now(),
    code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
    body { background: #070314; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; padding: 10px; }
    #hud { display: flex; justify-content: space-between; width: 300px; margin-bottom: 8px; font-weight: bold; font-size: 14px; color: #a855f7; }
    canvas { background: #0b0720; border: 2px solid #a855f7; border-radius: 12px; box-shadow: 0 0 20px rgba(168,85,247,0.3); touch-action: none; }
    #hint { margin-top: 8px; font-size: 12px; color: #cbd5e1; }
  </style>
</head>
<body onclick="flap()" ontouchstart="flap()">
  <div id="hud"><span>Ball: <span id="score">0</span></span><span>Rekord: <span id="high">0</span></span></div>
  <canvas id="c" width="300" height="380"></canvas>
  <div id="hint">Ekranga bosing yoki bo'shliq (Space) tugmasini bosing! 🚀</div>
  <script>
    const cvs = document.getElementById('c'), ctx = cvs.getContext('2d');
    let ry = 180, rvy = 0, pipes = [], score = 0, high = 0, frame = 0, dead = false;
    function flap() {
      if (dead) { ry = 180; rvy = 0; pipes = []; score = 0; dead = false; document.getElementById('score').innerText = 0; return; }
      rvy = -5.2;
    }
    window.addEventListener('keydown', e => { if (e.code === 'Space') flap(); });
    function loop() {
      frame++;
      ctx.fillStyle = '#0b0720'; ctx.fillRect(0,0,cvs.width,cvs.height);
      if (!dead) {
        rvy += 0.28; ry += rvy;
        if (frame % 85 === 0) {
          const gap = 115, top = 40 + Math.random()*(cvs.height - gap - 80);
          pipes.push({ x: cvs.width, top: top, bottom: top + gap, scored: false });
        }
      }
      pipes.forEach(p => {
        if (!dead) p.x -= 2.2;
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(p.x, 0, 36, p.top);
        ctx.fillRect(p.x, p.bottom, 36, cvs.height - p.bottom);
        if (!p.scored && p.x + 36 < 45) {
          p.scored = true; score++; document.getElementById('score').innerText = score;
          if (score > high) { high = score; document.getElementById('high').innerText = high; }
          if (score === 5) window.parent.postMessage({ type: 'GAME_WIN', score: score }, '*');
        }
        if (!dead && p.x < 65 && p.x + 36 > 45) {
          if (ry < p.top || ry + 20 > p.bottom) {
            dead = true;
            if (score >= 3) window.parent.postMessage({ type: 'GAME_WIN', score: score }, '*');
          }
        }
      });
      pipes = pipes.filter(p => p.x > -50);
      if (ry > cvs.height - 20 || ry < 0) { dead = true; }
      ctx.font = '24px sans-serif'; ctx.fillText('🚀', 45, ry + 16);
      if (dead) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,cvs.width,cvs.height);
        ctx.fillStyle = '#f43f5e'; ctx.font = 'bold 20px sans-serif'; ctx.fillText('O\\'yin tugadi!', 85, 170);
        ctx.fillStyle = '#fff'; ctx.font = '13px sans-serif'; ctx.fillText('Boshlash uchun bosing', 80, 205);
      }
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`
  }
];

interface ResetRequest {
  username: string;
  email: string;
  code: string;
  token: string;
  expiresAt: number;
  createdAt: number;
}

interface DatabaseSchema {
  users: Record<string, User>;
  chat: ChatMessage[];
  reels: ReelItem[];
  customQuestions: CustomQuestion[];
  customTopics: CustomTopic[];
  customGames: CustomGame[];
  resetRequests?: Record<string, ResetRequest>;
  activeEvent?: TournamentEvent | null;
  eventsHistory?: TournamentEvent[];
  customRanks?: RankTierInfo[];
}

const defaultDb: DatabaseSchema = {
  resetRequests: {},
  activeEvent: null,
  eventsHistory: [],
  customRanks: DEFAULT_RANKS,
  users: {
    admin: {
      username: 'admin',
      email: 'xojayevistam16@gmail.com',
      password: 'admin',
      avatar: '👑',
      bio: 'kitest-edu Asosiy Boshqaruvchisi va Bosh Hakam (Chief Judge)',
      followers: [],
      following: [],
      claimedMilestones: [500, 1000],
      coins: 5000,
      wheelSpins: 5,
      lastSpinDate: new Date().toDateString(),
      superWheelSpins: 10,
      lastSuperSpinDate: new Date().toDateString(),
      bannedUntil: null,
      helper: false,
      isAdmin: true,
      createdAt: Date.now() - 30 * 86400000,
      completedLessons: ['mat-1', 'mat-2', 'mat-3', 'mat-4', 'inf-1', 'inf-2', 'inf-3', 'fiz-1', 'fiz-2', 'eng-1', 'eng-2'],
      solvedProblemsCount: 280,
      dailyChallengeStreak: 18,
      bonusRating: 1500,
    },
  },
  chat: [
    {
      id: 'welcome-msg',
      user: 'admin',
      text: "Assalomu alaykum! kitest-edu rasmiy ta'lim va bilimlar portaliga xush kelibsiz! Barcha musobaqalar adolatli va xolis o'tkaziladi. 🚀",
      ts: Date.now(),
      role: 'BOSH HAKAM',
      avatar: '👑',
    },
  ],
  reels: [],
  customQuestions: [],
  customTopics: [],
  customGames: [...defaultSeedGames],
};

function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Clean out any legacy mock bots
      const fakeBots = ['jasur_coder', 'nodira_math', 'alisher_ilm', 'malika_iq'];
      fakeBots.forEach((bot) => {
        if (parsed.users && parsed.users[bot]) {
          delete parsed.users[bot];
        }
      });

      // Ensure admin exists
      if (!parsed.users['admin']) {
        parsed.users['admin'] = defaultDb.users['admin'];
      }
      // Ensure all users have profile, follow, and learning stats
      Object.keys(parsed.users).forEach((key) => {
        const u = parsed.users[key];
        if (!u.avatar) u.avatar = key === 'admin' ? '👑' : '🚀';
        if (typeof u.bio !== 'string') u.bio = '';
        if (!Array.isArray(u.followers)) u.followers = [];
        if (!Array.isArray(u.following)) u.following = [];
        if (!Array.isArray(u.claimedMilestones)) u.claimedMilestones = [];
        if (typeof u.dailyChallengeDate !== 'string') u.dailyChallengeDate = '';
        if (typeof u.dailyChallengeCompleted !== 'boolean') u.dailyChallengeCompleted = false;
        if (typeof u.dailyChallengeWon !== 'boolean') u.dailyChallengeWon = false;
        if (typeof u.dailyChallengeStreak !== 'number') u.dailyChallengeStreak = 0;
        if (!Array.isArray(u.completedLessons)) u.completedLessons = [];
        if (typeof u.solvedProblemsCount !== 'number') u.solvedProblemsCount = 0;
        if (typeof u.bonusRating !== 'number') u.bonusRating = 0;
      });

      // Restore custom games from backup file if available
      if (fs.existsSync(CUSTOM_GAMES_FILE)) {
        try {
          const bgData = fs.readFileSync(CUSTOM_GAMES_FILE, 'utf-8');
          const bgGames = JSON.parse(bgData);
          if (Array.isArray(bgGames) && bgGames.length > 0) {
            parsed.customGames = bgGames;
          }
        } catch {
          // ignore
        }
      }

      if (!Array.isArray(parsed.customGames) || parsed.customGames.length === 0) {
        parsed.customGames = [...defaultSeedGames];
      }
      return { ...defaultDb, ...parsed };
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }
  saveDb(defaultDb);
  return defaultDb;
}

let db = loadDb();

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    if (Array.isArray(data.customGames)) {
      fs.writeFileSync(CUSTOM_GAMES_FILE, JSON.stringify(data.customGames, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

// Track connected clients
const clients = new Set<WebSocket>();

function broadcast(type: string, payload: any) {
  const message = JSON.stringify({ type, payload });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastOnlineCount() {
  broadcast('online:count', { count: clients.size });
}

wss.on('connection', (ws) => {
  clients.add(ws);
  broadcastOnlineCount();

  // Send initial online count
  ws.send(JSON.stringify({ type: 'online:count', payload: { count: clients.size } }));

  ws.on('close', () => {
    clients.delete(ws);
    broadcastOnlineCount();
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch {
      // ignore
    }
  });
});

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Helper function to check admin / helper rights
function checkUserRole(reqUser: { username?: string; email?: string } | undefined) {
  if (!reqUser || !reqUser.username) return { isOwner: false, isHelper: false, isStaff: false };
  const key = reqUser.username.toLowerCase();
  const u = db.users[key];
  if (!u) return { isOwner: false, isHelper: false, isStaff: false };
  const isOwner = key === 'admin' || u.email.toLowerCase() === 'xojayevistam16@gmail.com' || !!u.isAdmin;
  const isHelper = !!u.helper;
  return { isOwner, isHelper, isStaff: isOwner || isHelper };
}

// REST API ROUTES

// 1. Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Barcha maydonlarni to'ldiring!" });
  }

  const cleanUser = username.trim();
  const userKey = cleanUser.toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  if (db.users[userKey]) {
    return res.status(400).json({ error: 'Bu taxallus (username) allaqachon band!' });
  }

  for (const k in db.users) {
    if (db.users[k].email.toLowerCase() === cleanEmail) {
      return res.status(400).json({ error: "Bu Gmail pochta orqali ro'yxatdan o'tilgan!" });
    }
  }

  const isOwner = userKey === 'admin' || cleanEmail === 'xojayevistam16@gmail.com';

  const newUser: User = {
    username: cleanUser,
    email: cleanEmail,
    password: password.trim(),
    avatar: '🚀',
    bio: '',
    followers: [],
    following: [],
    claimedMilestones: [],
    coins: 50,
    wheelSpins: 3,
    lastSpinDate: new Date().toDateString(),
    superWheelSpins: 5,
    lastSuperSpinDate: new Date().toDateString(),
    bannedUntil: null,
    helper: false,
    isAdmin: isOwner,
    createdAt: Date.now(),
  };

  db.users[userKey] = newUser;
  saveDb(db);
  broadcast('user:registered', { username: newUser.username });

  const { password: _, ...userSafe } = newUser;
  return res.json({ success: true, user: userSafe });
});

// 1.2 Auth: Forgot Password (Send reset code & link to registered Gmail)
app.post('/api/auth/forgot-password', async (req, res) => {
  const { identifier } = req.body;
  if (!identifier || !identifier.trim()) {
    return res.status(400).json({ error: "Gmail pochtangiz yoki Username-ni kiriting!" });
  }

  const idClean = identifier.trim().toLowerCase();
  let targetUser: User | null = null;
  let targetKey: string | null = null;

  for (const k in db.users) {
    const u = db.users[k];
    if (k === idClean || (u.email && u.email.toLowerCase() === idClean)) {
      targetUser = u;
      targetKey = k;
      break;
    }
  }

  if (!targetUser || !targetKey) {
    return res.status(404).json({ error: "Bunday Username yoki Gmail pochtali hisob topilmadi!" });
  }

  // Generate 6-digit OTP code and secure reset token
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const token = 'rst_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

  if (!db.resetRequests) {
    db.resetRequests = {};
  }

  // Clean old requests for this user
  for (const t in db.resetRequests) {
    if (db.resetRequests[t].email.toLowerCase() === targetUser.email.toLowerCase()) {
      delete db.resetRequests[t];
    }
  }

  db.resetRequests[token] = {
    username: targetUser.username,
    email: targetUser.email,
    code,
    token,
    expiresAt,
    createdAt: Date.now(),
  };

  saveDb(db);

  const resetUrl = `https://cosmo-edu.ai.studio?reset_token=${token}&email=${encodeURIComponent(targetUser.email)}`;

  // Send real email to user's Gmail
  await sendPasswordResetEmail(targetUser.email, targetUser.username, code, resetUrl);

  return res.json({
    success: true,
    message: `6 xonali tasdiqlash kodi ${targetUser.email} shaxsiy Gmail pochtangizga yuborildi!`,
    email: targetUser.email,
    username: targetUser.username,
    expiresAt,
  });
});

// 1.3 Auth: Reset Password (using 6-digit code or resetToken)
app.post('/api/auth/reset-password', (req, res) => {
  const { identifier, code, resetToken, newPassword } = req.body;

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ error: "Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak!" });
  }

  if (!db.resetRequests) {
    return res.status(400).json({ error: "Parolni tiklash so'rovi topilmadi yoki muddati tugagan!" });
  }

  let matchedRequest: ResetRequest | null = null;
  let matchedTokenKey: string | null = null;
  const now = Date.now();

  if (resetToken) {
    const reqItem = db.resetRequests[resetToken];
    if (reqItem && reqItem.expiresAt > now) {
      matchedRequest = reqItem;
      matchedTokenKey = resetToken;
    }
  } else if (identifier && code) {
    const cleanId = identifier.trim().toLowerCase();
    const cleanCode = code.trim();
    for (const t in db.resetRequests) {
      const item = db.resetRequests[t];
      if (
        (item.email.toLowerCase() === cleanId || item.username.toLowerCase() === cleanId) &&
        item.code === cleanCode &&
        item.expiresAt > now
      ) {
        matchedRequest = item;
        matchedTokenKey = t;
        break;
      }
    }
  }

  if (!matchedRequest || !matchedTokenKey) {
    return res.status(400).json({ error: "Tasdiqlash kodi yoki havola noto'g'ri, yoxud muddati (15 daqiqa) tugagan!" });
  }

  const userKey = matchedRequest.username.toLowerCase();
  const targetUser = db.users[userKey];
  if (!targetUser) {
    return res.status(404).json({ error: "Foydalanuvchi topilmadi!" });
  }

  targetUser.password = newPassword.trim();
  delete db.resetRequests[matchedTokenKey];
  saveDb(db);

  return res.json({
    success: true,
    message: "Parolingiz muvaffaqiyatli yangilandi! Endi yangi parol bilan tizimga kirishingiz mumkin.",
    username: targetUser.username,
  });
});

// 1.4 Auth: Verify Reset Token
app.get('/api/auth/verify-reset-token', (req, res) => {
  const token = req.query.token as string;
  if (!token || !db.resetRequests || !db.resetRequests[token]) {
    return res.status(400).json({ valid: false, error: "Havola eskirgan yoki topilmadi!" });
  }
  const item = db.resetRequests[token];
  if (item.expiresAt <= Date.now()) {
    return res.status(400).json({ valid: false, error: "Havolaning amal qilish muddati (15 daqiqa) tugagan!" });
  }
  return res.json({ valid: true, email: item.email, username: item.username });
});

// 2.1 Profile: Change Password
app.post('/api/profile/change-password', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "Eski va yangi parolni kiriting!" });
  }

  const userKey = username.toLowerCase();
  const u = db.users[userKey];
  if (!u) {
    return res.status(404).json({ error: "Foydalanuvchi topilmadi!" });
  }

  if (u.password !== oldPassword.trim()) {
    return res.status(400).json({ error: "Eski parol noto'g'ri kiritildi!" });
  }

  if (newPassword.trim().length < 4) {
    return res.status(400).json({ error: "Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak!" });
  }

  u.password = newPassword.trim();
  saveDb(db);
  return res.json({ success: true, message: "Parol muvaffaqiyatli o'zgartirildi!" });
});

// 2.2 Profile: Update Avatar & Bio
app.post('/api/profile/update', (req, res) => {
  const { username, avatar, bio } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username talab etiladi!" });
  }

  const userKey = username.toLowerCase();
  const u = db.users[userKey];
  if (!u) {
    return res.status(404).json({ error: "Foydalanuvchi topilmadi!" });
  }

  if (avatar) u.avatar = avatar;
  if (typeof bio === 'string') u.bio = bio.trim().slice(0, 200);

  saveDb(db);
  broadcast('user:updated', { username: u.username, avatar: u.avatar, bio: u.bio });

  const { password: _, ...userSafe } = u;
  return res.json({ success: true, user: userSafe });
});

// 2.3 Follow / Subscribe to User (Har 500 obunachida +100 tanga beriladi!)
app.post('/api/users/:username/subscribe', (req, res) => {
  const { followerUsername } = req.body;
  const targetKey = req.params.username.toLowerCase();
  const followerKey = (followerUsername || '').toLowerCase();

  if (!followerKey) {
    return res.status(400).json({ error: "Obunachi nomi talab etiladi!" });
  }

  if (targetKey === followerKey) {
    return res.status(400).json({ error: "O'zingizga obuna bo'la olmaysiz!" });
  }

  const target = db.users[targetKey];
  const follower = db.users[followerKey];

  if (!target || !follower) {
    return res.status(404).json({ error: "Foydalanuvchi topilmadi!" });
  }

  if (!Array.isArray(target.followers)) target.followers = [];
  if (!Array.isArray(follower.following)) follower.following = [];
  if (!Array.isArray(target.claimedMilestones)) target.claimedMilestones = [];

  const isSubscribed = target.followers.includes(follower.username);

  if (isSubscribed) {
    // Unsubscribe
    target.followers = target.followers.filter((name) => name.toLowerCase() !== followerKey);
    follower.following = follower.following.filter((name) => name.toLowerCase() !== targetKey);
  } else {
    // Subscribe
    target.followers.push(follower.username);
    follower.following.push(target.username);
  }

  // Check 500 subscribers milestone for target user
  const followerCount = target.followers.length;
  let bonusGiven = 0;
  // Calculate milestone milestones: 500, 1000, 1500, etc.
  const milestoneUnit = 500;
  const currentMilestoneLevel = Math.floor(followerCount / milestoneUnit) * milestoneUnit;

  if (currentMilestoneLevel >= milestoneUnit && !target.claimedMilestones.includes(currentMilestoneLevel)) {
    bonusGiven = 100;
    target.coins += 100;
    target.claimedMilestones.push(currentMilestoneLevel);
  }

  saveDb(db);

  broadcast('user:updated', {
    username: target.username,
    followers: target.followers,
    coins: target.coins,
  });
  broadcast('user:updated', {
    username: follower.username,
    following: follower.following,
  });

  return res.json({
    success: true,
    subscribed: !isSubscribed,
    followersCount: target.followers.length,
    followingCount: follower.following.length,
    bonusGiven,
    targetCoins: target.coins,
  });
});

// 2.4 Profile: Gain subscribers (Promote / invite friends to test and reach 500 subscribers milestone)
app.post('/api/profile/gain-subscribers', (req, res) => {
  const { username, count } = req.body;
  if (!username) return res.status(400).json({ error: "Username talab etiladi!" });

  const targetKey = username.toLowerCase();
  const target = db.users[targetKey];
  if (!target) return res.status(404).json({ error: "Foydalanuvchi topilmadi!" });

  const addAmount = Math.max(1, Math.min(1000, parseInt(count, 10) || 50));
  if (!Array.isArray(target.followers)) target.followers = [];
  if (!Array.isArray(target.claimedMilestones)) target.claimedMilestones = [];

  const currentCount = target.followers.length;
  for (let i = 1; i <= addAmount; i++) {
    target.followers.push(`obunachi_${currentCount + i}`);
  }

  const newTotal = target.followers.length;
  // Check for any 500-multiple milestones
  let totalBonus = 0;
  for (let m = 500; m <= newTotal; m += 500) {
    if (!target.claimedMilestones.includes(m)) {
      target.claimedMilestones.push(m);
      target.coins += 100;
      totalBonus += 100;
    }
  }

  saveDb(db);

  broadcast('user:updated', {
    username: target.username,
    followers: target.followers,
    coins: target.coins,
  });

  return res.json({
    success: true,
    followersCount: target.followers.length,
    totalBonus,
    coins: target.coins,
  });
});

// 2. Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username yoki Gmail va parolni kiriting!' });
  }

  const idClean = identifier.trim().toLowerCase();
  const passClean = password.trim();

  let targetUser: User | null = null;
  let targetKey: string | null = null;
  let userFoundWithId = false;

  for (const k in db.users) {
    const u = db.users[k];
    if (k === idClean || u.email.toLowerCase() === idClean) {
      userFoundWithId = true;
      if (u.password === passClean) {
        targetUser = u;
        targetKey = k;
      }
      break;
    }
  }

  if (!userFoundWithId) {
    if (idClean.includes('@')) {
      return res.status(404).json({ error: "bu gmail ro'yxatdan o'tmagan" });
    } else {
      return res.status(404).json({ error: "bu username ro'yxatdan o'tmagan" });
    }
  }

  if (!targetUser || !targetKey) {
    return res.status(401).json({ error: "Parol noto'g'ri kiritildi!" });
  }

  const now = Date.now();
  if (targetUser.bannedUntil && targetUser.bannedUntil > now) {
    const remainingHours = Math.ceil((targetUser.bannedUntil - now) / (1000 * 60 * 60));
    return res.status(403).json({
      error: `Sizning hisobingiz bloklangan! Qolgan muddat: ${remainingHours} soat.`,
      bannedUntil: targetUser.bannedUntil,
    });
  }

  // Refresh daily spins
  const today = new Date().toDateString();
  if (targetUser.lastSpinDate !== today) {
    targetUser.wheelSpins = 3;
    targetUser.lastSpinDate = today;
    saveDb(db);
  }
  if (targetUser.lastSuperSpinDate !== today) {
    targetUser.superWheelSpins = 5;
    targetUser.lastSuperSpinDate = today;
    saveDb(db);
  }

  const { password: _, ...userSafe } = targetUser;
  return res.json({ success: true, user: userSafe });
});

// 3. Get All Users (for Admin & Helper & Leaderboard)
app.get('/api/users', (req, res) => {
  const usersList = Object.values(db.users).map(({ password: _, ...safe }) => safe);
  return res.json({ users: usersList });
});

// 3.1 Update User Learning Stats (completedLessons, solvedProblemsCount, bonusRating)
app.post('/api/users/:username/stats', (req, res) => {
  const targetKey = req.params.username.toLowerCase();
  const target = db.users[targetKey];
  if (!target) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });
  }

  const { completedLessons, solvedProblemsCount, bonusRating } = req.body;
  if (Array.isArray(completedLessons)) {
    target.completedLessons = Array.from(new Set([...(target.completedLessons || []), ...completedLessons]));
  }
  if (typeof solvedProblemsCount === 'number' && !isNaN(solvedProblemsCount)) {
    target.solvedProblemsCount = Math.max(target.solvedProblemsCount || 0, solvedProblemsCount);
  }
  if (typeof bonusRating === 'number' && !isNaN(bonusRating)) {
    target.bonusRating = Math.max(target.bonusRating || 0, bonusRating);
  }

  saveDb(db);
  broadcast('user:updated', {
    username: target.username,
    completedLessons: target.completedLessons,
    solvedProblemsCount: target.solvedProblemsCount,
    bonusRating: target.bonusRating,
  });

  const { password: _, ...userSafe } = target;
  return res.json({ success: true, user: userSafe });
});

// 4. Update coins (+100 / -100 or any amount) by Admin or Helper
app.post('/api/users/:username/coins', (req, res) => {
  const { requester, amount } = req.body;
  const { isStaff } = checkUserRole(requester);

  if (!isStaff) {
    return res.status(403).json({ error: 'Faqat Admin yoki Admin Yordamchisi tanga o\'zgartira oladi!' });
  }

  const targetKey = req.params.username.toLowerCase();
  const target = db.users[targetKey];
  if (!target) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });
  }

  const delta = parseInt(amount, 10);
  if (isNaN(delta)) {
    return res.status(400).json({ error: "Noto'g'ri miqdor!" });
  }

  target.coins = Math.max(0, target.coins + delta);
  saveDb(db);

  broadcast('user:updated', { username: target.username, coins: target.coins });
  return res.json({ success: true, username: target.username, coins: target.coins });
});

// 5. Ban User (3-day ban or unban) by Admin or Helper
app.post('/api/users/:username/ban', (req, res) => {
  const { requester, days, unban } = req.body;
  const { isStaff } = checkUserRole(requester);

  if (!isStaff) {
    return res.status(403).json({ error: 'Faqat Admin yoki Admin Yordamchisi ban qila oladi!' });
  }

  const targetKey = req.params.username.toLowerCase();
  const target = db.users[targetKey];
  if (!target) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });
  }

  if (targetKey === 'admin' || target.email.toLowerCase() === 'xojayevistam16@gmail.com') {
    return res.status(400).json({ error: 'Asosiy adminni ban qilib bo\'lmaydi!' });
  }

  if (unban) {
    target.bannedUntil = null;
  } else {
    const banDays = days || 3;
    target.bannedUntil = Date.now() + banDays * 24 * 60 * 60 * 1000;
  }

  saveDb(db);
  broadcast('user:updated', { username: target.username, bannedUntil: target.bannedUntil });
  return res.json({ success: true, username: target.username, bannedUntil: target.bannedUntil });
});

// 6. Set Helper (Admin only can make someone an Admin Assistant)
app.post('/api/users/:username/helper', (req, res) => {
  const { requester, helper } = req.body;
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: 'Faqat asosiy admin yordamchi tayinlay oladi!' });
  }

  const targetKey = req.params.username.toLowerCase();
  const target = db.users[targetKey];
  if (!target) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });
  }

  target.helper = Boolean(helper);
  saveDb(db);

  broadcast('user:updated', { username: target.username, helper: target.helper });
  return res.json({ success: true, username: target.username, helper: target.helper });
});

// 7. Reset Wheel Spins (Admin only)
app.post('/api/users/:username/reset-wheel', (req, res) => {
  const { requester } = req.body;
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: 'Faqat asosiy admin imkoniyatni tiklay oladi!' });
  }

  const targetKey = req.params.username.toLowerCase();
  const target = db.users[targetKey];
  if (!target) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });
  }

  target.wheelSpins = 3;
  saveDb(db);

  broadcast('user:updated', { username: target.username, wheelSpins: target.wheelSpins });
  return res.json({ success: true, username: target.username, wheelSpins: 3 });
});

// 8. Spin Wheel
app.post('/api/wheel/spin', (req, res) => {
  const { username, winCoins } = req.body;
  if (!username) return res.status(400).json({ error: 'Username talab etiladi!' });

  const target = db.users[username.toLowerCase()];
  if (!target) return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });

  if (target.wheelSpins <= 0) {
    return res.status(400).json({ error: 'Bugungi baraban imkoniyatingiz tugagan!' });
  }

  target.wheelSpins = Math.max(0, target.wheelSpins - 1);
  const reward = Math.max(0, parseInt(winCoins, 10) || 0);
  target.coins += reward;
  saveDb(db);

  broadcast('user:updated', { username: target.username, coins: target.coins, wheelSpins: target.wheelSpins });
  return res.json({ success: true, coins: target.coins, wheelSpins: target.wheelSpins, reward });
});

// 8b. Buy Premium (10,000 coins for 2 days)
app.post('/api/premium/buy', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username talab etiladi!' });

  const target = db.users[username.toLowerCase()];
  if (!target) return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });

  const COST = 10000;
  if (target.coins < COST) {
    return res.status(400).json({ error: `Premium sotib olish uchun tanga yetarli emas! Kerak: ${COST} Tanga.` });
  }

  target.coins -= COST;
  const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
  const currentExpiry = target.premiumUntil && target.premiumUntil > Date.now() ? target.premiumUntil : Date.now();
  target.premiumUntil = currentExpiry + TWO_DAYS;
  saveDb(db);

  broadcast('user:updated', { username: target.username, coins: target.coins, premiumUntil: target.premiumUntil });
  return res.json({ success: true, coins: target.coins, premiumUntil: target.premiumUntil });
});

// 8c. Super Baraban Spin (Premium only: 5 spins/day, +200, +100, +50, +0, -10)
app.post('/api/super-wheel/spin', (req, res) => {
  const { username, winCoins } = req.body;
  if (!username) return res.status(400).json({ error: 'Username talab etiladi!' });

  const target = db.users[username.toLowerCase()];
  if (!target) return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });

  if (!target.premiumUntil || target.premiumUntil <= Date.now()) {
    return res.status(403).json({ error: 'Super Baraban faqat Premium foydalanuvchilar uchun!' });
  }

  const today = new Date().toDateString();
  if (target.lastSuperSpinDate !== today) {
    target.superWheelSpins = 5;
    target.lastSuperSpinDate = today;
  }

  if (target.superWheelSpins === undefined) target.superWheelSpins = 5;

  if (target.superWheelSpins <= 0) {
    return res.status(400).json({ error: 'Bugungi Super Baraban imkoniyatingiz tugadi!' });
  }

  target.superWheelSpins = Math.max(0, target.superWheelSpins - 1);

  const reward = parseInt(winCoins, 10);
  if (isNaN(reward)) return res.status(400).json({ error: "Noto'g'ri mukofot!" });

  target.coins = Math.max(0, target.coins + reward);
  saveDb(db);

  broadcast('user:updated', { username: target.username, coins: target.coins, superWheelSpins: target.superWheelSpins });
  return res.json({ success: true, coins: target.coins, reward, superWheelSpins: target.superWheelSpins });
});

// 8d. Pack Opener (Cost 20 coins, 3 opens per day, unlocks profile pictures / avatars, requires Premium)
app.post('/api/pack-opener/open', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username talab etiladi!' });

  const target = db.users[username.toLowerCase()];
  if (!target) return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });

  if (!target.premiumUntil || target.premiumUntil <= Date.now()) {
    return res.status(403).json({ error: 'Maxsus Pack Opener faqat Premium foydalanuvchilar uchun!' });
  }

  const COST = 20;
  if (target.coins < COST) {
    return res.status(400).json({ error: `Pack ochish uchun tanga yetarli emas! Narxi: ${COST} Tanga.` });
  }

  const todayStr = new Date().toDateString();
  if (target.packOpenDate !== todayStr) {
    target.packOpenDate = todayStr;
    target.packOpensToday = 0;
  }

  if ((target.packOpensToday || 0) >= 3) {
    return res.status(400).json({ error: 'Bugungi 3 ta pack ochish imkoniyatingiz tugadi!' });
  }

  target.coins -= COST;
  target.packOpensToday = (target.packOpensToday || 0) + 1;

  const avatars = ['🌌', '🐉', '🛸', '🦸', '👑', '🐯', '🦅', '🔮', '⚡', '💎', '🚀', '🌟', '🎨', '🎯', '✨', '🪐', '🦁', '🦊'];
  const dropped = avatars[Math.floor(Math.random() * avatars.length)];

  if (!target.unlockedAvatars) target.unlockedAvatars = [];
  if (!target.unlockedAvatars.includes(dropped)) {
    target.unlockedAvatars.push(dropped);
  }

  saveDb(db);

  broadcast('user:updated', { username: target.username, coins: target.coins, unlockedAvatars: target.unlockedAvatars });
  return res.json({
    success: true,
    coins: target.coins,
    droppedAvatar: dropped,
    packOpensToday: target.packOpensToday,
    unlockedAvatars: target.unlockedAvatars,
  });
});

// 9. Update Player Coins (for quiz/games rewards or entrance fees)
app.post('/api/player/coins', (req, res) => {
  const { username, delta } = req.body;
  if (!username) return res.status(400).json({ error: 'Username talab etiladi!' });

  const target = db.users[username.toLowerCase()];
  if (!target) return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });

  const amount = parseInt(delta, 10);
  if (isNaN(amount)) return res.status(400).json({ error: "Noto'g'ri miqdor!" });

  if (amount < 0 && target.coins + amount < 0) {
    return res.status(400).json({ error: "Tangalar yetarli emas!" });
  }

  target.coins = Math.max(0, target.coins + amount);
  saveDb(db);

  broadcast('user:updated', { username: target.username, coins: target.coins });
  return res.json({ success: true, coins: target.coins });
});

// 10. Chat: Get messages
app.get('/api/chat', (_req, res) => {
  return res.json({ messages: db.chat });
});

// 11. Chat: Send message (All users can send and everyone sees!)
const BAD_WORDS = ['soqqi', 'ahmoq', 'tentak', 'axmoq', 'blin', 'damn', 'stupid', 'idiot', 'hayvon', 'mol'];
function cleanText(t: string): string {
  let s = (t || '').trim();
  BAD_WORDS.forEach((w) => {
    const re = new RegExp(w, 'gi');
    s = s.replace(re, '***');
  });
  return s;
}

app.post('/api/chat', (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) {
    return res.status(400).json({ error: 'Xabar matni kerak!' });
  }

  const userKey = username.toLowerCase();
  const u = db.users[userKey];
  if (!u) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });
  }

  const now = Date.now();
  if (u.bannedUntil && u.bannedUntil > now) {
    return res.status(403).json({ error: "Siz bloklangansiz, chatda yoza olmaysiz!" });
  }

  const cleaned = cleanText(text);
  if (!cleaned) {
    return res.status(400).json({ error: "Xabar bo'sh bo'lishi mumkin emas!" });
  }

  let role = '';
  if (userKey === 'admin' || u.isAdmin || u.email.toLowerCase() === 'xojayevistam16@gmail.com') {
    role = 'BOSH HAKAM';
  } else if (u.helper) {
    role = 'HAKAM';
  }

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user: u.username,
    text: cleaned,
    ts: Date.now(),
    role: role || undefined,
    avatar: u.avatar || '👤',
  };

  db.chat.push(newMsg);
  // Keep last 300 messages
  if (db.chat.length > 300) {
    db.chat = db.chat.slice(-300);
  }
  saveDb(db);

  broadcast('chat:new', newMsg);
  return res.json({ success: true, message: newMsg });
});

// 12. Chat: Clear (Admin only)
app.delete('/api/chat', (req, res) => {
  const { requester } = req.body;
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: 'Faqat asosiy admin chatni tozalay oladi!' });
  }

  db.chat = [
    {
      id: `cleared-${Date.now()}`,
      user: 'admin',
      text: "🧹 Chat admin tomonidan tozalandi.",
      ts: Date.now(),
      role: 'ADMIN',
    },
  ];
  saveDb(db);

  broadcast('chat:cleared', { messages: db.chat });
  return res.json({ success: true, messages: db.chat });
});

// 12.1 Chat: Delete single message (author or staff)
app.delete('/api/chat/:id', (req, res) => {
  const requester = req.body?.requester || { username: req.query.username as string };
  const messageId = req.params.id;

  const msgIndex = db.chat.findIndex((m) => m.id === messageId);
  if (msgIndex === -1) {
    return res.status(404).json({ error: 'Xabar topilmadi!' });
  }

  const msg = db.chat[msgIndex];
  const { isStaff } = checkUserRole(requester);
  const isAuthor = requester && requester.username && msg.user.toLowerCase() === requester.username.toLowerCase();

  if (!isAuthor && !isStaff) {
    return res.status(403).json({ error: "Siz faqat o'z yozuvingizni o'chira olasiz!" });
  }

  db.chat.splice(msgIndex, 1);
  saveDb(db);

  broadcast('chat:deleted', { id: messageId });
  return res.json({ success: true, id: messageId });
});

// 13. Reels: Get feed
app.get('/api/reels', (_req, res) => {
  return res.json({ reels: db.reels });
});

// 14. Reels: Post new reel
app.post('/api/reels', (req, res) => {
  const { username, caption, mediaType, mediaUrl } = req.body;
  if (!username) return res.status(400).json({ error: 'Username talab etiladi!' });

  const u = db.users[username.toLowerCase()];
  if (!u) return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });

  const now = Date.now();
  if (u.bannedUntil && u.bannedUntil > now) {
    return res.status(403).json({ error: 'Hisobingiz bloklangan!' });
  }

  const cleanCaption = cleanText(caption || '');
  const newReel: ReelItem = {
    id: `reel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user: u.username,
    caption: cleanCaption,
    mediaType: mediaType || 'none',
    mediaUrl: mediaUrl || '',
    ts: Date.now(),
    likes: 0,
  };

  db.reels.unshift(newReel);
  if (db.reels.length > 100) {
    db.reels = db.reels.slice(0, 100);
  }
  saveDb(db);

  broadcast('reel:new', newReel);
  return res.json({ success: true, reel: newReel });
});

// 14.1 Reels: Delete reel
app.delete('/api/reels/:id', (req, res) => {
  const requester = req.body?.requester || { username: req.query.username as string };
  const reelId = req.params.id;

  const reelIndex = db.reels.findIndex((r) => r.id === reelId);
  if (reelIndex === -1) {
    return res.status(404).json({ error: 'Reels topilmadi!' });
  }

  const reel = db.reels[reelIndex];
  const { isStaff } = checkUserRole(requester);
  const isAuthor = requester && requester.username && reel.user.toLowerCase() === requester.username.toLowerCase();

  if (!isAuthor && !isStaff) {
    return res.status(403).json({ error: "Siz faqat o'z reelsingizni o'chira olasiz!" });
  }

  db.reels.splice(reelIndex, 1);
  saveDb(db);

  broadcast('reel:deleted', { id: reelId });
  return res.json({ success: true, id: reelId });
});

// 15. Custom Quiz Questions (Savol qo'shish by Admin or Admin Yordamchisi)
app.get('/api/quiz/custom', (_req, res) => {
  return res.json({ questions: db.customQuestions || [] });
});

app.post('/api/quiz/custom', (req, res) => {
  const { requester, q, a, c, cat } = req.body;
  const { isStaff } = checkUserRole(requester);

  if (!isStaff) {
    return res.status(403).json({ error: "Faqat Admin yoki Admin Yordamchisi savol qo'sha oladi!" });
  }

  if (!q || !Array.isArray(a) || a.length < 4) {
    return res.status(400).json({ error: "Savol matni va 4 ta variant to'liq kiritilishi shart!" });
  }

  const newQ: CustomQuestion = {
    id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    q: q.trim(),
    a: a.map((opt: string) => opt.trim()),
    c: typeof c === 'number' ? c : 0,
    cat: cat || 'Umumiy',
    author: requester.username,
    ts: Date.now(),
  };

  if (!db.customQuestions) db.customQuestions = [];
  db.customQuestions.push(newQ);
  saveDb(db);

  broadcast('quiz:new', newQ);
  return res.json({ success: true, question: newQ });
});

// 16. Custom Education Topics (Mavzu qo'shish by Admin or Admin Yordamchisi)
app.get('/api/topics/custom', (_req, res) => {
  return res.json({ topics: db.customTopics || [] });
});

app.post('/api/topics/custom', (req, res) => {
  const { requester, subject, title, content, steps, questions } = req.body;
  const { isStaff } = checkUserRole(requester);

  if (!isStaff) {
    return res.status(403).json({ error: "Faqat Admin yoki Admin Yordamchisi mavzu qo'sha oladi!" });
  }

  if (!subject || !title) {
    return res.status(400).json({ error: "Fan va mavzu nomi kiritilishi shart!" });
  }

  const parsedSteps = Array.isArray(steps) && steps.length > 0
    ? steps
    : [
        { h: 'Kirish', t: content || `«${title}» mavzusi bo'yicha batafsil dars.` },
        { h: '1-qadam. Asosiy tushunchalar', t: `Ushbu qismda ${title} ning muhim qoidalari va mohiyati bayon qilinadi.` },
        { h: '2-qadam. Amaliy qo\'llash', t: `Misollar va hayotiy misollar orqali ko'rib chiqamiz.` },
        { h: 'Mustahkamlash', t: `Darsni takrorlang va pastdagi 10 savollik testni yeching.` },
      ];

  const parsedQuestions = Array.isArray(questions) && questions.length > 0
    ? questions
    : [
        { q: `«${title}» qaysi fanga tegishli?`, a: [subject, "Boshqa fan", "Musiqa", "Jismoniy tarbiya"], c: 0 },
        { q: `«${title}» darsining asosiy maqsadi nima?`, a: ["Bilim olish va amaliyot", "Faqat yodlash", "Baho olish", "Vaqt o'tkazish"], c: 0 },
        { q: `Ushbu mavzuni o'rganishda nima muhim?`, a: ["Qoidalar va tushunchalar", "Hech narsa", "Tez tugatish", "Faqat test yechish"], c: 0 },
        { q: `Darsni qanday mustahkamlash lozim?`, a: ["Misollar yechish va test topshirish", "Daftarga chizish", "Unutish", "Hech narsa qilmaslik"], c: 0 },
      ];

  const newTopic: CustomTopic = {
    id: `topic-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    subject: subject.toLowerCase(),
    title: title.trim(),
    content: content || '',
    steps: parsedSteps,
    questions: parsedQuestions,
    author: requester.username,
    ts: Date.now(),
  };

  if (!db.customTopics) db.customTopics = [];
  db.customTopics.push(newTopic);
  saveDb(db);

  broadcast('topic:new', newTopic);
  return res.json({ success: true, topic: newTopic });
});

// 16.1 Custom Games (O'yin qo'shish by Admin or Admin Yordamchisi)
app.get('/api/games/custom', (_req, res) => {
  return res.json({ games: db.customGames || [] });
});

app.post('/api/games/custom', (req, res) => {
  const { requester, title, description, icon, code, price, reward } = req.body;
  const { isStaff } = checkUserRole(requester);

  if (!isStaff) {
    return res.status(403).json({ error: "Faqat Admin yoki Admin Yordamchisi o'yin qo'sha oladi!" });
  }

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "O'yin nomi kiritilishi shart!" });
  }

  if (!code || !code.trim()) {
    return res.status(400).json({ error: "O'yin kodi (HTML/JS) kiritilishi shart!" });
  }

  const coinPrice = Math.max(0, parseInt(price, 10) || 0);
  const coinReward = Math.max(0, parseInt(reward, 10) || 0);

  const newGame: CustomGame = {
    id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    description: (description || '').trim(),
    icon: (icon || '🎮').trim(),
    code: code.trim(),
    price: coinPrice,
    reward: coinReward,
    author: requester.username,
    ts: Date.now(),
  };

  if (!db.customGames) db.customGames = [];
  db.customGames.push(newGame);
  saveDb(db);

  broadcast('game:new', newGame);
  return res.json({ success: true, game: newGame });
});

app.delete('/api/games/custom/:id', (req, res) => {
  const requester = req.body?.requester || { username: req.query.username as string };
  const gameId = req.params.id;
  const { isStaff } = checkUserRole(requester);

  if (!isStaff) {
    return res.status(403).json({ error: "Faqat Admin yoki Admin Yordamchisi o'yinni o'chira oladi!" });
  }

  const idx = (db.customGames || []).findIndex((g) => g.id === gameId);
  if (idx === -1) {
    return res.status(404).json({ error: "O'yin topilmadi!" });
  }

  db.customGames.splice(idx, 1);
  saveDb(db);

  broadcast('game:deleted', { id: gameId });
  return res.json({ success: true, id: gameId });
});

// Update custom game price & reward (Admin only!)
app.put('/api/games/custom/:id/price', (req, res) => {
  const { requester, price, reward } = req.body;
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: "Faqat Asosiy Admin o'yinlar narxini o'zgartira oladi!" });
  }

  const gameId = req.params.id;
  const game = (db.customGames || []).find((g) => g.id === gameId);
  if (!game) {
    return res.status(404).json({ error: "O'yin topilmadi!" });
  }

  if (price !== undefined) {
    game.price = Math.max(0, parseInt(price, 10) || 0);
  }
  if (reward !== undefined) {
    game.reward = Math.max(0, parseInt(reward, 10) || 0);
  }

  saveDb(db);
  broadcast('game:updated', game);
  return res.json({ success: true, game });
});

// Play custom game (deduct price coins if > 0)
app.post('/api/games/custom/:id/play', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username kiritilmadi" });

  const u = db.users[username.toLowerCase()];
  if (!u) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

  const game = (db.customGames || []).find((g) => g.id === req.params.id);
  if (!game) return res.status(404).json({ error: "O'yin topilmadi" });

  if (game.price > 0) {
    if (u.coins < game.price) {
      return res.status(400).json({ error: `O'yinni o'ynash uchun tanga yetarli emas! Narxi: ${game.price} Tanga.` });
    }
    u.coins -= game.price;
    saveDb(db);
    broadcast('user:updated', { username: u.username, coins: u.coins });
  }

  return res.json({ success: true, coins: u.coins });
});

// Win custom game (award reward coins if > 0)
app.post('/api/games/custom/:id/win', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username kiritilmadi" });

  const u = db.users[username.toLowerCase()];
  if (!u) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

  const game = (db.customGames || []).find((g) => g.id === req.params.id);
  if (!game) return res.status(404).json({ error: "O'yin topilmadi" });

  const reward = typeof game.reward === 'number' ? game.reward : 15;
  if (reward > 0) {
    u.coins += reward;
    saveDb(db);
    broadcast('user:updated', { username: u.username, coins: u.coins });
  }

  return res.json({ success: true, coins: u.coins, reward });
});

// 17. Daily Challenge System (Kunlik Sinov)
interface DailyChallengeQuestion {
  id: string;
  q: string;
  a: string[];
  c: number;
  cat: string;
  explanation: string;
  difficulty: string;
}

const DAILY_CHALLENGE_POOL: DailyChallengeQuestion[] = [
  {
    id: 'dc-1',
    q: 'Agar poezd 120 km masofani 1.5 soatda bosib o\'tsa, uning o\'rtacha tezligi soatiga necha km bo\'ladi?',
    a: ['80 km/soat', '90 km/soat', '75 km/soat', '100 km/soat'],
    c: 0,
    cat: 'Matematika & Fizika',
    explanation: 'v = s / t = 120 / 1.5 = 80 km/soat.',
    difficulty: 'O\'rta',
  },
  {
    id: 'dc-2',
    q: 'Qaysi sonning kvadrati bilan o\'zining yig\'indisi 30 ga teng? (x² + x = 30)',
    a: ['5 (chunki 25 + 5 = 30)', '6', '4', '7'],
    c: 0,
    cat: 'Matematika',
    explanation: '5² + 5 = 25 + 5 = 30. (Shuningdek manfiy ildizi -6).',
    difficulty: 'Oson',
  },
  {
    id: 'dc-3',
    q: 'Kompyuter xotirasida bitta rangli pikselli tasvir RGB tizimida har bir rang kanali (Qizil, Yashil, Ko\'k) uchun 8 bitdan joy olsa, bitta piksel jami necha bayt joy egallaydi?',
    a: ['3 bayt (24 bit)', '1 bayt', '8 bayt', '32 bayt'],
    c: 0,
    cat: 'Informatika',
    explanation: 'Har bir kanal 8 bit = 1 bayt. 3 ta kanal (R, G, B) = 3 bayt (24-bit TrueColor).',
    difficulty: 'Qiziqarli',
  },
  {
    id: 'dc-4',
    q: 'Nyutonning ikkinchi qonuniga ko\'ra 5 kg massali jismga 20 Nyuton kuch ta\'sir etsa, uning tezlanishi qanday bo\'ladi?',
    a: ['4 m/s²', '100 m/s²', '15 m/s²', '2 m/s²'],
    c: 0,
    cat: 'Fizika',
    explanation: 'a = F / m = 20 / 5 = 4 m/s².',
    difficulty: 'Oson',
  },
  {
    id: 'dc-5',
    q: 'Birinchi 10 ta toq natural sonlar yig\'indisi nechaga teng? (1 + 3 + 5 + ... + 19)',
    a: ['100 (n² qoidasiga ko\'ra 10² = 100)', '90', '110', '95'],
    c: 0,
    cat: 'Matematika',
    explanation: 'Dastlabki n ta toq sonlar yig\'indisi doimo n² ga teng: 10² = 100.',
    difficulty: 'Kombinatorika',
  },
  {
    id: 'dc-6',
    q: 'Qaysi algoritmik tuzilma belgilangan shart bajarilguncha bir xil buyruqlarni takroran bajaradi?',
    a: ['Sikl (Takrorlanuvchi algoritm)', 'Chiziqli algoritm', 'Tarmoqlanuvchi algoritm', 'Funksiya chaqiruvi'],
    c: 0,
    cat: 'Informatika',
    explanation: 'Sikllar (loop: for, while) takrorlanuvchi amallarni boshqaradi.',
    difficulty: 'Asosiy',
  },
  {
    id: 'dc-7',
    q: 'Elektr zanjirida 220 V kuchlanish ostida 11 Om qarshilikka ega isitgich ulangan. Tok kuchi qancha?',
    a: ['20 Amper', '10 Amper', '2420 Amper', '2 Amper'],
    c: 0,
    cat: 'Fizika',
    explanation: 'Om qonuniga ko\'ra: I = U / R = 220 / 11 = 20 A.',
    difficulty: 'Amaliy',
  },
  {
    id: 'dc-8',
    q: 'Xonada 4 ta burchak bor. Har bir burchakda bittadan mushuk o\'tiribdi. Har bir mushukning qarshisida 3 tadan mushuk bor. Xonada jami nechta mushuk bor?',
    a: ['4 ta mushuk', '12 ta mushuk', '16 ta mushuk', '8 ta mushuk'],
    c: 0,
    cat: 'Mantiq',
    explanation: 'Har bir burchakdagi mushuk qolgan 3 ta burchakdagi mushuklarga qarab turadi, demak xonada jami 4 ta mushuk bor.',
    difficulty: 'Mantiqiy',
  },
  {
    id: 'dc-9',
    q: 'Dunyodagi birinchi sun\'iy yo\'ldosh (Sputnik-1) qaysi yili fazoga uchirilgan?',
    a: ['1957-yilda', '1961-yilda', '1969-yilda', '1945-yilda'],
    c: 0,
    cat: 'Koinot & Tarix',
    explanation: '1957-yil 4-oktyabrda insoniyat tarixidagi ilk sun\'iy yo\'ldosh Yer orbitasiga chiqarilgan.',
    difficulty: 'Umumiy',
  },
  {
    id: 'dc-10',
    q: '2 ning 10-darajasi (2¹⁰) nechaga teng?',
    a: ['1024', '1000', '2048', '512'],
    c: 0,
    cat: 'Informatika & Matematika',
    explanation: '2¹⁰ = 1024. Shu sababli 1 Kilobayt = 1024 Bayt.',
    difficulty: 'Asosiy',
  },
];

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyChallengeForDate(dateStr: string) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const pool = [...DAILY_CHALLENGE_POOL, ...(db.customQuestions || [])];
  const idx = Math.abs(hash) % pool.length;
  return pool[idx];
}

app.get('/api/daily-challenge', (req, res) => {
  const username = (req.query.username as string || '').toLowerCase();
  const today = getTodayString();
  const q = getDailyChallengeForDate(today);

  let userStatus = {
    attempted: false,
    won: false,
    streak: 0,
    coinsWon: 0,
  };

  if (username && db.users[username]) {
    const u = db.users[username];
    if (u.dailyChallengeDate === today && u.dailyChallengeCompleted) {
      userStatus.attempted = true;
      userStatus.won = !!u.dailyChallengeWon;
      userStatus.streak = u.dailyChallengeStreak || 0;
    } else {
      userStatus.streak = u.dailyChallengeStreak || 0;
    }
  }

  // Calculate ms until midnight for countdown
  const now = new Date();
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const msUntilNext = Math.max(0, tomorrow.getTime() - now.getTime());

  // Return question without revealing correct answer index if not attempted
  return res.json({
    date: today,
    msUntilNext,
    baseReward: 50,
    question: {
      id: q.id || 'daily-q',
      q: q.q,
      a: q.a,
      cat: q.cat,
      difficulty: (q as any).difficulty || 'Maxsus',
    },
    userStatus,
  });
});

app.post('/api/daily-challenge/submit', (req, res) => {
  const { username, answerIndex } = req.body;
  if (!username) return res.status(400).json({ error: 'Username talab etiladi!' });

  const targetKey = username.toLowerCase();
  const u = db.users[targetKey];
  if (!u) return res.status(404).json({ error: 'Foydalanuvchi topilmadi!' });

  const today = getTodayString();
  if (u.dailyChallengeDate === today && u.dailyChallengeCompleted) {
    return res.status(400).json({ error: 'Bugungi Kunlik Sinovni allaqachon topshirgansiz!' });
  }

  const q = getDailyChallengeForDate(today);
  const isCorrect = Number(answerIndex) === q.c;

  let reward = 0;
  let newStreak = u.dailyChallengeStreak || 0;

  if (isCorrect) {
    // Check if yesterday was completed and won to continue streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (u.dailyChallengeDate === yesterday && u.dailyChallengeWon) {
      newStreak = (u.dailyChallengeStreak || 0) + 1;
    } else {
      newStreak = 1;
    }

    const streakBonus = Math.min(50, (newStreak - 1) * 10); // +10 per streak day up to +50
    reward = 50 + streakBonus; // 50 base coins + streak bonus

    u.coins += reward;
    u.dailyChallengeDate = today;
    u.dailyChallengeCompleted = true;
    u.dailyChallengeWon = true;
    u.dailyChallengeStreak = newStreak;
  } else {
    u.dailyChallengeDate = today;
    u.dailyChallengeCompleted = true;
    u.dailyChallengeWon = false;
    u.dailyChallengeStreak = 0;
  }

  saveDb(db);

  broadcast('user:updated', {
    username: u.username,
    coins: u.coins,
    dailyChallengeDate: u.dailyChallengeDate,
    dailyChallengeCompleted: u.dailyChallengeCompleted,
    dailyChallengeWon: u.dailyChallengeWon,
    dailyChallengeStreak: u.dailyChallengeStreak,
  });

  return res.json({
    success: true,
    isCorrect,
    reward,
    streak: newStreak,
    newCoins: u.coins,
    correctAnswerIndex: q.c,
    explanation: (q as any).explanation || `To'g'ri javob: ${q.a[q.c]}`,
  });
});

// ==========================================
// 18. LIVE TOURNAMENT EVENT SYSTEM (Musobaqa Eventlari)
// ==========================================

// Get active event
app.get('/api/event/active', (_req, res) => {
  return res.json({
    event: db.activeEvent || null,
    history: (db.eventsHistory || []).slice(-5),
  });
});

// Create event (Admin only)
app.post('/api/event/create', (req, res) => {
  const { requester, title, description, durationMinutes, questions } = req.body;
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: "Faqat Asosiy Admin yangi Event/Turnir yarata oladi!" });
  }

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Event sarlavhasi kiritilishi shart!" });
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Eventda kamida bitta savol bo'lishi shart!" });
  }

  const duration = Math.max(1, parseInt(durationMinutes, 10) || 5);

  const newEvent: TournamentEvent = {
    id: `event-${Date.now()}`,
    title: title.trim(),
    description: (description || '').trim(),
    durationMinutes: duration,
    startTime: 0,
    endTime: 0,
    status: 'draft',
    questions: questions.map((q: any) => ({
      q: q.q.trim(),
      a: Array.isArray(q.a) ? q.a : ['Variant A', 'Variant B', 'Variant C', 'Variant D'],
      c: typeof q.c === 'number' ? q.c : 0,
    })),
    participants: [],
    createdBy: requester.username,
  };

  db.activeEvent = newEvent;
  saveDb(db);

  broadcast('event:updated', newEvent);
  return res.json({ success: true, event: newEvent });
});

// Start active event (Admin only)
app.post('/api/event/start', (req, res) => {
  const { requester } = req.body;
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: "Faqat Asosiy Admin Eventni boshlay oladi!" });
  }

  if (!db.activeEvent) {
    return res.status(404).json({ error: "Hozirda yaratilgan Event topilmadi!" });
  }

  const now = Date.now();
  const durationMs = (db.activeEvent.durationMinutes || 5) * 60 * 1000;

  db.activeEvent.status = 'active';
  db.activeEvent.startTime = now;
  db.activeEvent.endTime = now + durationMs;
  db.activeEvent.participants = []; // Reset participants for fresh live tournament

  saveDb(db);

  // Post live announcement in chat
  const eventMsg: ChatMessage = {
    id: `event-announce-${now}`,
    user: 'COSMO_BOT',
    text: `⚡ DIQQAT: Admin «${db.activeEvent.title}» Jonli Musobaqasini boshladi! Davomiyligi: ${db.activeEvent.durationMinutes} daqiqa (${db.activeEvent.questions.length} ta savol). Top 3 g'olibning DARJASI (RANK) 1 pog'onaga oshiriladi va katta tangalar beriladi! Barcha qatnashing! 🏆`,
    ts: now,
    role: 'ADMIN',
    avatar: '🏆',
  };
  db.chat.push(eventMsg);
  saveDb(db);

  broadcast('chat:new', eventMsg);
  broadcast('event:started', db.activeEvent);

  return res.json({ success: true, event: db.activeEvent });
});

// Submit participant answers
app.post('/api/event/submit', (req, res) => {
  const { username, score, total, timeSpentSec } = req.body;

  if (!username) return res.status(400).json({ error: "Username kiritilmadi" });
  if (!db.activeEvent || db.activeEvent.status !== 'active') {
    return res.status(400).json({ error: "Hozirda faol musobaqa mavjud emas yoki vaqti tugagan!" });
  }

  const cleanUser = username.toLowerCase();
  const existingIdx = db.activeEvent.participants.findIndex(
    (p) => p.username.toLowerCase() === cleanUser
  );

  const userObj = db.users[cleanUser];
  const isJudge = Boolean(
    userObj?.isAdmin ||
    cleanUser === 'admin' ||
    userObj?.email?.toLowerCase() === 'xojayevistam16@gmail.com' ||
    userObj?.helper
  );

  const participantData: EventParticipant = {
    username,
    score: Math.max(0, parseInt(score, 10) || 0),
    total: Math.max(1, parseInt(total, 10) || db.activeEvent.questions.length),
    timeSpentSec: Math.max(1, parseInt(timeSpentSec, 10) || 1),
    completedAt: Date.now(),
    isJudge,
  };

  if (existingIdx !== -1) {
    // keep best score
    if (participantData.score >= db.activeEvent.participants[existingIdx].score) {
      db.activeEvent.participants[existingIdx] = participantData;
    }
  } else {
    db.activeEvent.participants.push(participantData);
  }

  saveDb(db);
  broadcast('event:participant_submitted', { event: db.activeEvent, participant: participantData });

  return res.json({ success: true, participant: participantData });
});

// Finish event & boost Top 3 rank by 1 tier + coins (Judges: Admin & Helper only)
app.post('/api/event/finish', (req, res) => {
  const { requester } = req.body;
  const { isOwner, isStaff } = checkUserRole(requester);

  if (!isStaff) {
    return res.status(403).json({ error: "Faqat Hakamlar (Admin yoki Yordamchi) Eventni yakunlay oladi!" });
  }

  if (!db.activeEvent) {
    return res.status(404).json({ error: "Faol Event topilmadi!" });
  }

  // Sort participants by score (desc), then timeSpentSec (asc)
  const sorted = [...db.activeEvent.participants].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSpentSec - b.timeSpentSec;
  });

  const isJudgeUser = (uname: string) => {
    const u = db.users[uname.toLowerCase()];
    if (!u) return false;
    return Boolean(
      u.isAdmin ||
      u.username.toLowerCase() === 'admin' ||
      u.email?.toLowerCase() === 'xojayevistam16@gmail.com' ||
      u.helper
    );
  };

  // Hakamlar (Admin va Yordamchilar) o'quvchilar o'rtasidagi sovg'ali o'rinlarni olmaydi, ular hakamlik qiladi!
  const studentParticipants = sorted.filter((p) => !isJudgeUser(p.username));
  const winnersList = studentParticipants.slice(0, 3);
  const rewardsMeta = [
    { rank: 1, coins: 500, ratingBoost: 450, title: "1-o'rin (Chempion)" },
    { rank: 2, coins: 300, ratingBoost: 350, title: "2-o'rin (Vitse-chempion)" },
    { rank: 3, coins: 150, ratingBoost: 250, title: "3-o'rin (Bronza)" },
  ];

  const processedWinners = winnersList.map((w, idx) => {
    const meta = rewardsMeta[idx];
    const targetUser = db.users[w.username.toLowerCase()];

    if (targetUser) {
      targetUser.coins = (targetUser.coins || 0) + meta.coins;
      targetUser.bonusRating = (targetUser.bonusRating || 0) + meta.ratingBoost;

      broadcast('user:updated', {
        username: targetUser.username,
        coins: targetUser.coins,
        bonusRating: targetUser.bonusRating,
      });
    }

    return {
      username: w.username,
      rank: meta.rank,
      score: w.score,
      promotedTo: "Daraja (Rank) +1 Pog'ona Oshirildi! 🌟",
      coinsReward: meta.coins,
      ratingBoost: meta.ratingBoost,
    };
  });

  db.activeEvent.status = 'finished';
  db.activeEvent.winners = processedWinners;

  if (!db.eventsHistory) db.eventsHistory = [];
  db.eventsHistory.push({ ...db.activeEvent });

  const now = Date.now();
  let winnerAnnouncementText = `🎉 «${db.activeEvent.title}» EVENTI G'OLIBLARI:\n`;
  if (processedWinners.length > 0) {
    processedWinners.forEach((pw) => {
      winnerAnnouncementText += `🏆 ${pw.rank}-o'rin: @${pw.username} (${pw.score} ball) ➡️ Unvoni 1 pog'ona oshirildi (+${pw.ratingBoost} Reyting) & +${pw.coinsReward} Tanga!\n`;
    });
  } else {
    winnerAnnouncementText += "Turnirda ishtirokchilar bo'lmadi.";
  }

  const finishChatMsg: ChatMessage = {
    id: `event-finish-${now}`,
    user: 'COSMO_BOT',
    text: winnerAnnouncementText,
    ts: now,
    role: 'ADMIN',
    avatar: '👑',
  };
  db.chat.push(finishChatMsg);

  saveDb(db);

  broadcast('chat:new', finishChatMsg);
  broadcast('event:finished', { event: db.activeEvent, winners: processedWinners });

  return res.json({ success: true, event: db.activeEvent, winners: processedWinners });
});

// Delete or cancel active event (Admin only)
app.delete('/api/event/active', (req, res) => {
  const requester = req.body?.requester || { username: req.query.username as string };
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: "Faqat Asosiy Admin Eventni o'chira oladi!" });
  }

  db.activeEvent = null;
  saveDb(db);

  broadcast('event:deleted', {});
  return res.json({ success: true });
});

// ==========================================
// 19. CUSTOM RANK TIERS MANAGEMENT (Admin Rank Qo'shish)
// ==========================================

// Get all ranks (sorted by minRating ascending)
app.get('/api/ranks', (_req, res) => {
  if (!db.customRanks || db.customRanks.length === 0) {
    db.customRanks = [...DEFAULT_RANKS];
    saveDb(db);
  }
  const sorted = [...db.customRanks].sort((a, b) => a.minRating - b.minRating);
  return res.json({ ranks: sorted });
});

// Add new rank (Admin only)
app.post('/api/ranks/add', (req, res) => {
  const { requester, rank } = req.body;
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: "Faqat Asosiy Admin yangi Rank (Unvon) yarata oladi!" });
  }

  if (!rank || !rank.tier || !rank.tier.trim()) {
    return res.status(400).json({ error: "Rank nomi kiritilishi shart!" });
  }

  if (typeof rank.minRating !== 'number' || isNaN(rank.minRating) || rank.minRating < 0) {
    return res.status(400).json({ error: "Minimal reyting balli to'g'ri kiritilishi shart!" });
  }

  if (!db.customRanks) {
    db.customRanks = [...DEFAULT_RANKS];
  }

  const cleanTier = rank.tier.trim();
  const existingIdx = db.customRanks.findIndex((r) => r.tier.toLowerCase() === cleanTier.toLowerCase());

  const newRankData: RankTierInfo = {
    tier: cleanTier,
    uzName: (rank.uzName || cleanTier).trim(),
    minRating: rank.minRating,
    badge: (rank.badge || '🌟').trim(),
    color: rank.color || 'text-amber-400',
    border: rank.border || 'border-amber-500/50',
    bgGradient: rank.bgGradient || 'from-amber-950 to-slate-900',
    textGradient: rank.textGradient || 'from-amber-300 to-yellow-400',
    description: (rank.description || "Cosmo Arcade maxsus unvoni.").trim(),
  };

  if (existingIdx !== -1) {
    db.customRanks[existingIdx] = newRankData;
  } else {
    db.customRanks.push(newRankData);
  }

  db.customRanks.sort((a, b) => a.minRating - b.minRating);
  saveDb(db);

  broadcast('ranks:updated', { ranks: db.customRanks });
  return res.json({ success: true, ranks: db.customRanks, added: newRankData });
});

// Delete rank (Admin only)
app.delete('/api/ranks/:tier', (req, res) => {
  const requester = req.body?.requester || { username: req.query.username as string };
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: "Faqat Asosiy Admin Rankni o'chira oladi!" });
  }

  const targetTier = decodeURIComponent(req.params.tier || '').trim().toLowerCase();
  if (!targetTier) {
    return res.status(400).json({ error: "O'chiriladigan rank nomi ko'rsatilmadi" });
  }

  if (!db.customRanks) {
    db.customRanks = [...DEFAULT_RANKS];
  }

  if (db.customRanks.length <= 1) {
    return res.status(400).json({ error: "Kamida 1 ta Rank qolishi kerak!" });
  }

  db.customRanks = db.customRanks.filter((r) => r.tier.toLowerCase() !== targetTier);
  db.customRanks.sort((a, b) => a.minRating - b.minRating);
  saveDb(db);

  broadcast('ranks:updated', { ranks: db.customRanks });
  return res.json({ success: true, ranks: db.customRanks });
});

// Reset ranks to default 9 tiers (Admin only)
app.post('/api/ranks/reset', (req, res) => {
  const { requester } = req.body;
  const { isOwner } = checkUserRole(requester);

  if (!isOwner) {
    return res.status(403).json({ error: "Faqat Asosiy Admin Ranklarni asl holatiga qaytara oladi!" });
  }

  db.customRanks = [...DEFAULT_RANKS];
  saveDb(db);

  broadcast('ranks:updated', { ranks: db.customRanks });
  return res.json({ success: true, ranks: db.customRanks });
});

// DIRECT DOWNLOAD ROUTES FOR USER
app.get('/download', (_req, res) => {
  const zipPath = path.join(__dirname, 'kitest-edu-complete.zip');
  if (fs.existsSync(zipPath)) {
    return res.download(zipPath, 'kitest-edu-complete.zip');
  }
  return res.status(404).send('Arxiv topilmadi');
});

app.get('/kitest-edu-complete.zip', (_req, res) => {
  const zipPath = path.join(__dirname, 'kitest-edu-complete.zip');
  if (fs.existsSync(zipPath)) {
    return res.download(zipPath, 'kitest-edu-complete.zip');
  }
  return res.status(404).send('Arxiv topilmadi');
});

app.get('/kitest-edu-all-code.txt', (_req, res) => {
  const txtPath = path.join(__dirname, 'kitest-edu-all-code.txt');
  if (fs.existsSync(txtPath)) {
    return res.download(txtPath, 'kitest-edu-all-code.txt');
  }
  return res.status(404).send('Fayl topilmadi');
});

// VITE MIDDLEWARE IN DEV OR STATIC IN PROD
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Cosmo Arcade server running on http://localhost:${PORT}`);
  });
}

startServer();
