import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { getUserRankInfo } from '../utils/rankUtils';
import {
  User as UserIcon,
  KeyRound,
  Image as ImageIcon,
  Sparkles,
  Users,
  Coins,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
  Lock,
  UserCheck,
  UserPlus,
  Crown,
  Award,
  Upload,
  Globe,
  Copy
} from 'lucide-react';

interface ProfileModalProps {
  currentUser: User;
  onClose: () => void;
  onUserUpdate: (updated: Partial<User>) => void;
  onToast: (msg: string) => void;
}

const PRESET_AVATARS = [
  '🚀', '👑', '⚡', '💎', '🧠', '🐱', '🦁', '🦊', '🐉', '🤖', '🦸', '🧙', '🌟', '🎨', '🎯', '🪐'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentUser,
  onClose,
  onUserUpdate,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'community'>('profile');

  // Avatar & Bio state
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentUser.avatar || '🚀');
  const [bio, setBio] = useState<string>(currentUser.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  // Community users list for follow/subscribe
  const [communityUsers, setCommunityUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const followersCount = (currentUser.followers || []).length;
  const followingCount = (currentUser.following || []).length;

  // Next milestone calculation (each 500 followers = +100 coins)
  const milestoneProgress = followersCount % 500;
  const currentLevelMilestones = Math.floor(followersCount / 500);
  const totalSubBonusCoins = currentLevelMilestones * 100;

  useEffect(() => {
    loadCommunityUsers();
  }, []);

  const loadCommunityUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.getUsers();
      setCommunityUsers(res.users);
    } catch {
      // ignore
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.updateProfile(currentUser.username, selectedAvatar, bio);
      onUserUpdate({ avatar: res.user.avatar, bio: res.user.bio });
      onToast("✅ Profil muvaffaqiyatli saqlandi!");
    } catch (err: any) {
      onToast(err.message || 'Xatolik yuz berdi');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast("Faqat rasm fayli tanlang!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onToast("Rasm hajmi 2MB dan oshmasligi kerak!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(200, Math.max(img.width, img.height));
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setSelectedAvatar(dataUrl);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError("Barcha parollarni to'ldiring!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError("Yangi parollar bir-biriga mos kelmadi!");
      return;
    }

    if (newPassword.length < 4) {
      setPassError("Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    setChangingPass(true);
    try {
      await api.changePassword(currentUser.username, oldPassword, newPassword);
      onToast("🔐 Parol muvaffaqiyatli almashtirildi!");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setActiveTab('profile');
    } catch (err: any) {
      setPassError(err.message || "Parolni o'zgartirishda xatolik");
    } finally {
      setChangingPass(false);
    }
  };

  const handleToggleSubscribe = async (targetUsername: string) => {
    try {
      const res = await api.subscribeUser(targetUsername, currentUser.username);
      if (res.bonusGiven > 0) {
        onToast(`🎉 Tabriklaymiz! ${targetUsername} 500 ta obunachiga yetdi va +100 Tanga qo'shildi!`);
      } else {
        onToast(res.subscribed ? `✅ ${targetUsername} ga obuna bo'ldingiz!` : `❌ ${targetUsername} dan obunani bekor qildingiz.`);
      }

      // Update following array
      const currentFollowing = currentUser.following || [];
      const updatedFollowing = res.subscribed
        ? [...currentFollowing, targetUsername]
        : currentFollowing.filter((u) => u.toLowerCase() !== targetUsername.toLowerCase());

      onUserUpdate({ following: updatedFollowing });
      loadCommunityUsers();
    } catch (err: any) {
      onToast(err.message || 'Xatolik');
    }
  };



  const isOwner = currentUser.isAdmin || currentUser.username.toLowerCase() === 'admin' || currentUser.email.toLowerCase() === 'xojayevistam16@gmail.com';
  const rankInfo = getUserRankInfo(currentUser);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-purple-500/50 w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col max-h-[92vh] relative text-left">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-teal-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl">
                {selectedAvatar.startsWith('data:') ? (
                  <img src={selectedAvatar} alt="avatar" className="w-full h-full object-cover rounded-[14px]" />
                ) : (
                  selectedAvatar
                )}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {currentUser.username}
                </h2>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-950 border ${rankInfo.border} ${rankInfo.color}`}>
                  {rankInfo.badge} {rankInfo.tier}
                </span>
                {isOwner ? (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> ADMIN
                  </span>
                ) : currentUser.helper ? (
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                    <Award className="w-3 h-3 text-indigo-400" /> YORDAMCHI
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-slate-400">
                {currentUser.email} • <strong className="text-amber-300 font-mono">{rankInfo.rating}</strong> reyting balli ({rankInfo.lessonsCount} dars, {rankInfo.solvedCount} misol)
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

        {/* Tab buttons */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-4 gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profil & Avatar</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'password'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Parol Almashtirish</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Obunachilar & Do'stlar</span>
          </button>
        </div>

        {/* TAB 1: Profile & Avatar */}
        {activeTab === 'profile' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              {/* Preset Face / Avatar Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Profil Yuzi (Avatar)ni tanlang:
                </label>
                <div className="grid grid-cols-8 gap-2 mb-3">
                  {PRESET_AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`h-11 rounded-xl flex items-center justify-center text-xl transition transform active:scale-95 border ${
                        selectedAvatar === emoji
                          ? 'bg-purple-600/50 border-teal-400 scale-105 shadow-md shadow-teal-400/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Upload own photo / custom avatar */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 text-teal-400" />
                    <span>O'z rasmingizni yuklash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {selectedAvatar.startsWith('data:') && (
                    <span className="text-[11px] text-teal-400 font-bold">
                      Maxsus rasm yuklandi ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Bio / Status */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  O'zingiz haqingizda (Status / Bio):
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Misol: Matematika va koinot ishqibozi, tezkor hisoblovchi..."
                  maxLength={200}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:opacity-90 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-lg transition"
              >
                {savingProfile ? 'Saqlanmoqda...' : 'PROFIL MA\'LUMOTLARINI SAQLASH'}
              </button>

              {/* App Link & Invite Section */}
              <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/30 flex flex-col gap-2.5 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs">
                    <Globe className="w-3.5 h-3.5 text-teal-400" />
                    <span>Ilova Rasmiy Havolasi</span>
                  </div>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold">
                    Doimiy Manzil
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-teal-300 font-mono text-xs select-all overflow-hidden text-ellipsis whitespace-nowrap">
                    https://kitest-edu.ai.studio
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://kitest-edu.ai.studio');
                      onToast("✅ Ilova havolasi nusxalandi: https://kitest-edu.ai.studio");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0 shadow"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nusxalash</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <a
                    href="https://t.me/share/url?url=https://kitest-edu.ai.studio&text=kitest-edu+bilan+bilim+olish+va+tanga+yutish+platformasi!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Telegramda do'stlarga yuborish</span>
                  </a>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Change Password */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Lock className="w-4 h-4" />
              <h3 className="text-sm font-bold">Xavfsizlik: Parolni Almashtirish</h3>
            </div>
            <p className="text-xs text-slate-400">
              Profilingizni himoyalash uchun eski parolni kiriting va yangi kuchli parol o'rnating.
            </p>

            {passError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{passError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Eski parol
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Joriy parolingiz..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Yangi parol
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Kamida 4 ta belgi..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Yangi parolni takrorlang
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Yangi parolni qayta kiriting..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition"
            >
              {changingPass ? 'Tekshirilmoqda...' : 'PAROLNI YANGILASH'}
            </button>
          </form>
        )}

        {/* TAB 3: Community Users & Follow / Subscribe */}
        {activeTab === 'community' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Sizning obunachilaringiz: <strong className="text-teal-300 font-bold">{followersCount}</strong>
              </span>
              <span className="text-slate-400">
                Siz obuna bo'lgansiz: <strong className="text-purple-300 font-bold">{followingCount}</strong>
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Barcha foydalanuvchilar bilan tanishing va bir-biringizga obuna bo'ling! Har bir foydalanuvchining obunachisi 500 taga yetganda <strong className="text-amber-400">+100 Tanga</strong> taqdim etiladi!
            </p>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {loadingUsers ? (
                <div className="text-center py-8 text-slate-500 text-xs">Yuklanmoqda...</div>
              ) : (
                communityUsers.map((u) => {
                  const isMe = u.username.toLowerCase() === currentUser.username.toLowerCase();
                  const isSubscribed = (currentUser.following || []).some(
                    (name) => name.toLowerCase() === u.username.toLowerCase()
                  );
                  const uFollowersCount = (u.followers || []).length;

                  return (
                    <div
                      key={u.username}
                      className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg overflow-hidden">
                          {u.avatar && u.avatar.startsWith('data:') ? (
                            <img src={u.avatar} alt="face" className="w-full h-full object-cover" />
                          ) : (
                            u.avatar || '👤'
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span>{u.username}</span>
                            {isMe && <span className="text-[10px] text-teal-400 font-normal">(Siz)</span>}
                            {u.isAdmin && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                                ADMIN
                              </span>
                            )}
                            {u.helper && !u.isAdmin && (
                              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">
                                YORDAMCHI
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                            <span>🪙 {u.coins.toLocaleString()}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">{uFollowersCount} obunachi</span>
                          </div>
                          {u.bio && <p className="text-[10px] text-slate-400 italic line-clamp-1">{u.bio}</p>}
                        </div>
                      </div>

                      {!isMe && (
                        <button
                          type="button"
                          onClick={() => handleToggleSubscribe(u.username)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-1 ${
                            isSubscribed
                              ? 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30'
                              : 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-black shadow'
                          }`}
                        >
                          {isSubscribed ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Obunadasiz</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Obuna bo'lish</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
