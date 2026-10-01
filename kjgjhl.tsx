import React, { useState } from 'react';
import { User, ReelItem } from '../types';
import { api } from '../services/api';
import { Film, Image as ImageIcon, Video, Send, Heart, Trash2 } from 'lucide-react';

interface ReelsSectionProps {
  user: User;
  reels: ReelItem[];
  onDeleteReel?: (id: string) => void;
  onToast: (msg: string) => void;
}

export const ReelsSection: React.FC<ReelsSectionProps> = ({ user, reels, onDeleteReel, onToast }) => {
  const [caption, setCaption] = useState('');
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'none'>('none');
  const [posting, setPosting] = useState(false);

  const isOwner = user.isAdmin || user.username.toLowerCase() === 'admin' || user.email.toLowerCase() === 'xojayevistam16@gmail.com';
  const isStaff = isOwner || !!user.helper;

  const handleDeleteReel = async (id: string) => {
    try {
      onDeleteReel?.(id);
      await api.deleteReel(id, user);
      onToast("🗑️ Reels yozuvi o'chirildi");
    } catch (e: any) {
      onToast(e.message || "O'chirishda xatolik");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      if (file.size > 2 * 1024 * 1024) {
        onToast("Video hajmi 2MB dan kichik bo'lishi kerak!");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFileData(reader.result as string);
        setFileType('video');
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileData(reader.result as string);
        setFileType('image');
      };
      reader.readAsDataURL(file);
    } else {
      onToast("Faqat rasm yoki video fayl tanlang!");
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() && !fileData) {
      onToast("Izoh yoki rasm/video kiriting!");
      return;
    }

    if (user.bannedUntil && user.bannedUntil > Date.now()) {
      onToast("Siz bloklangansiz, reels qo'sha olmaysiz!");
      return;
    }

    setPosting(true);
    try {
      await api.postReel(user.username, caption.trim(), fileType, fileData || '');
      setCaption('');
      setFileData(null);
      setFileType('none');
      onToast("🎬 Reels muvaffaqiyatli qo'yildi!");
    } catch (err: any) {
      onToast(err.message || 'Xatolik yuz berdi');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
        <div className="p-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
          <Film className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-white">
            Qisqa Reels & Dars Tajribalari
          </h3>
          <p className="text-[11px] text-slate-400">
            O'rgangan darslaringiz haqida taassurotlar va qisqa video/rasmlar ulashing
          </p>
        </div>
      </div>

      {/* Post creator form */}
      <form onSubmit={handlePost} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 mb-5 space-y-3">
        <textarea
          rows={2}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Bugun nima o'rgandingiz? Izoh qoldiring..."
          maxLength={150}
          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-fuchsia-400"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 cursor-pointer transition">
            <ImageIcon className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>{fileData ? 'Media tanlandi' : 'Rasm / Video tanlash'}</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            disabled={posting || (!caption.trim() && !fileData)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 active:scale-95 text-white font-bold text-xs shadow transition disabled:opacity-40 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{posting ? 'Joylanmoqda...' : "Joylash"}</span>
          </button>
        </div>
      </form>

      {/* Feed list */}
      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
        {reels.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Hali hech kim reels qo'ymagan. Birinchi bo'lib qiziqarli dars yoki fikringizni ulashing!
          </div>
        ) : (
          reels.map((r) => {
            const canDeleteReel = r.user.toLowerCase() === user.username.toLowerCase() || isStaff;

            return (
              <div
                key={r.id}
                className="bg-slate-950/60 border border-fuchsia-500/20 rounded-2xl p-3.5 transition hover:border-fuchsia-500/40 relative group"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-fuchsia-300 flex items-center gap-1">
                    🎬 {r.user} {r.user.toLowerCase() === user.username.toLowerCase() && '(Siz)'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      {new Date(r.ts).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {canDeleteReel && (
                      <button
                        onClick={() => handleDeleteReel(r.id)}
                        title="Reels yozuvini o'chirish"
                        className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.5 rounded-lg transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>O'chirish</span>
                      </button>
                    )}
                  </div>
                </div>

                {r.mediaType === 'image' && r.mediaUrl && (
                  <img
                    src={r.mediaUrl}
                    alt="reel"
                    className="w-full max-h-72 object-cover rounded-xl mb-2"
                  />
                )}

                {r.mediaType === 'video' && r.mediaUrl && (
                  <video
                    src={r.mediaUrl}
                    controls
                    playsInline
                    className="w-full max-h-72 rounded-xl mb-2"
                  />
                )}

                {r.caption && (
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {r.caption}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
