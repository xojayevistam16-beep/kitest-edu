import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { api } from '../services/api';
import { Send, MessageSquare, Trash2, Smile, ShieldCheck, Crown, X, RefreshCw } from 'lucide-react';

interface LiveChatProps {
  user: User;
  chatMessages: ChatMessage[];
  onNewMessage?: (msg: ChatMessage) => void;
  onSyncMessages?: (messages: ChatMessage[]) => void;
  onDeleteMessage?: (id: string) => void;
  onToast: (msg: string) => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({
  user,
  chatMessages,
  onNewMessage,
  onSyncMessages,
  onDeleteMessage,
  onToast,
}) => {
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const isOwner =
    user.isAdmin ||
    user.username.toLowerCase() === 'admin' ||
    user.email.toLowerCase() === 'xojayevistam16@gmail.com';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  // Periodic fallback sync every 3.5 seconds to guarantee messages never get lost
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.getChat();
        if (res.messages && onSyncMessages) {
          onSyncMessages(res.messages);
        }
      } catch {
        // ignore background poll errors
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [onSyncMessages]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.getChat();
      if (res.messages && onSyncMessages) {
        onSyncMessages(res.messages);
      }
      onToast("💬 Chat yangilandi");
    } catch {
      onToast("Chatni yangilashda xatolik");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    if (user.bannedUntil && user.bannedUntil > Date.now()) {
      onToast("Siz bloklangansiz, chatda yozish cheklangan!");
      return;
    }

    // ⚡ INSTANT (0ms) OPTIMISTIC DISPLAY
    const tempId = `opt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const optimisticMessage: ChatMessage = {
      id: tempId,
      user: user.username,
      text: text,
      ts: Date.now(),
      role: isOwner ? 'ADMIN' : (user.helper ? 'YORDAMCHI' : undefined),
      avatar: user.avatar || '🚀',
    };

    setInputText('');
    if (onNewMessage) {
      onNewMessage(optimisticMessage);
    }

    setSending(true);
    try {
      const res = await api.sendChat(user.username, text);
      if (res.message && onNewMessage) {
        onNewMessage(res.message);
      }
    } catch (err: any) {
      onToast(err.message || 'Xabar yuborilmadi');
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    if (!isOwner) return;
    if (!confirm("Haqiqatan ham butun chat tarixini tozalashni xohlaysizmi?")) return;
    try {
      const res = await api.clearChat(user);
      if (res.messages && onSyncMessages) {
        onSyncMessages(res.messages);
      }
      onToast("🧹 Butun chat tozalandi");
    } catch (err: any) {
      onToast(err.message || 'Xatolik');
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    try {
      onDeleteMessage?.(msgId);
      await api.deleteChatMessage(msgId, user);
      onToast("🗑️ Xabar o'chirildi");
    } catch (err: any) {
      onToast(err.message || "Xabarni o'chirishda xatolik");
    }
  };

  const addEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const clearInputText = () => {
    setInputText('');
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full bg-slate-900/90 border border-purple-500/30 rounded-3xl p-4 sm:p-6 flex flex-col shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-teal-500/30 border border-teal-500/40 text-teal-300">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-300 to-amber-300">
                Umumiy Jonli Chat
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Jonli
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Barcha o'quvchilar va adminlar bilan real vaqtda jonli suhbatlashing!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRefresh}
            title="Chatni yangilash"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
          </button>

          {isOwner && (
            <button
              onClick={handleClear}
              title="Barcha xabarlarni tozalash"
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-xl transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tozalash</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages list */}
      <div className="h-80 sm:h-96 overflow-y-auto space-y-3 pr-2 mb-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <MessageSquare className="w-8 h-8 opacity-40 text-teal-400" />
            </div>
            <span className="font-bold text-slate-400">Hali hech qanday xabar yo'q.</span>
            <span>Birinchi bo'lib salom deb yozing! 🚀</span>
          </div>
        ) : (
          chatMessages.map((m) => {
            const isMe = m.user.toLowerCase() === user.username.toLowerCase();
            const isAdminRole = m.role === 'ADMIN' || m.user.toLowerCase() === 'admin';
            const isHelperRole = m.role === 'YORDAMCHI';
            const canDelete = isMe || isOwner || !!user.helper;

            return (
              <div
                key={m.id}
                className={`group p-3 rounded-2xl text-xs transition border ${
                  isMe
                    ? 'bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border-purple-500/40 ml-4 sm:ml-12 shadow-sm'
                    : isAdminRole
                    ? 'bg-gradient-to-r from-amber-950/40 to-slate-900/90 border-amber-500/40 mr-4 sm:mr-12'
                    : isHelperRole
                    ? 'bg-gradient-to-r from-indigo-950/40 to-slate-900/90 border-indigo-500/40 mr-4 sm:mr-12'
                    : 'bg-slate-900/90 border-slate-800 mr-4 sm:mr-12'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/5">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-xs overflow-hidden shrink-0 shadow">
                      {m.avatar && m.avatar.startsWith('data:') ? (
                        <img src={m.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        m.avatar || '👤'
                      )}
                    </span>

                    {isAdminRole ? (
                      <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                        <Crown className="w-3 h-3 text-amber-400" /> ADMIN
                      </span>
                    ) : isHelperRole ? (
                      <span className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                        <ShieldCheck className="w-3 h-3 text-indigo-400" /> YORDAMCHI
                      </span>
                    ) : null}

                    <span className={`font-black ${isMe ? 'text-teal-300' : 'text-slate-200'}`}>
                      {m.user} {isMe && <span className="text-[10px] text-teal-400 font-normal">(Siz)</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">{formatTime(m.ts)}</span>
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        title="Xabarni o'chirish"
                        className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-lg transition active:scale-90"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden sm:inline font-bold">O'chirish</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-slate-100 text-xs sm:text-sm break-words whitespace-pre-wrap leading-relaxed pl-1">
                  {m.text}
                </p>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick emoji bar */}
      <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 text-base scrollbar-none">
        <Smile className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
        {['🔥', '🚀', '👍', '👏', '💡', '🪙', '❤️', '🎉', '🧠', '🌟', '🎮', '👑'].map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => addEmoji(emoji)}
            className="hover:scale-125 transition active:scale-95 px-1.5 py-0.5 rounded-lg hover:bg-slate-800"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input row */}
      <form onSubmit={handleSend} className="flex gap-2 relative">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Xabar yozing (barcha foydalanuvchilarga ko'rinadi)..."
            maxLength={250}
            className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-700 focus:border-teal-400 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition shadow-inner"
          />
          {inputText.length > 0 && (
            <button
              type="button"
              onClick={clearInputText}
              title="Tozalash"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={sending || !inputText.trim()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition disabled:opacity-40 flex items-center justify-center gap-2 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>{sending ? 'Yuborilmoqda...' : 'Yuborish'}</span>
        </button>
      </form>
    </div>
  );
};
