import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import {
  Lock,
  Mail,
  User as UserIcon,
  KeyRound,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states - Login
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Form states - Register
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPass) {
      setError("Username/Gmail va parolni kiriting!");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await api.login(loginId.trim(), loginPass);
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Kirishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regUsername.trim() || !regPass || !regConfirmPass) {
      setError("Barcha maydonlarni to'ldiring!");
      return;
    }
    if (regPass !== regConfirmPass) {
      setError("Kiritilgan parollar bir-biriga mos kelmadi!");
      return;
    }
    if (regPass.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await api.register(regUsername.trim(), regEmail.trim(), regPass);
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-purple-500/40 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] relative text-center">
        {/* Top Glow Icon */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 p-0.5 shadow-lg shadow-purple-600/40 flex items-center justify-center">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-teal-300" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-300 to-amber-300 mb-1">
          {tab === 'login' ? 'Tizimga Kirish' : "Ro'yxatdan O'tish"}
        </h2>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          {tab === 'login'
            ? "agar akkaunt ochgan bo'lsangiz kirish degan joyiga username va parolingizni kiriting agar akkaunt ochmagan bo'lsangiz ro'yxatdan o'tish tugmasini bosing"
            : "gmailni va ismingizni kiriting va parol qo'ying"}
        </p>

        {/* Tab switch */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'login'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'register'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 text-left animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block">
                Username yoki Gmail
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="admin yoki emailingiz..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-teal-400 text-sm text-white placeholder-slate-500 outline-none transition"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block">
                Parol
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Parolni kiriting..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-teal-400 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 hover:opacity-90 active:scale-95 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
            >
              {loading ? 'Tekshirilmoqda...' : 'KIRISH'}
            </button>
          </form>
        )}

        {/* 2. REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-300 ml-1 block">
                Gmail pochta
              </label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-teal-400 text-sm text-white placeholder-slate-500 outline-none transition"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 ml-1 block">
                Taxallus (Username)
              </label>
              <div className="relative mt-1">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="O'yinchi nomi..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-teal-400 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 ml-1 block">
                Parol
              </label>
              <div className="relative mt-1">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="Kamida 4 ta belgi..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-teal-400 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 ml-1 block">
                Parolni tasdiqlang
              </label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                <input
                  type="password"
                  value={regConfirmPass}
                  onChange={(e) => setRegConfirmPass(e.target.value)}
                  placeholder="Parolni qayta tering..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-teal-400 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 active:scale-95 text-slate-950 font-extrabold text-sm tracking-wide shadow-lg shadow-teal-500/30 transition disabled:opacity-50"
            >
              {loading ? "Ro'yxatdan o'tkazilmoqda..." : "RO'YXATDAN O'TISH"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
