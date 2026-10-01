import React, { useState } from 'react';
import { User } from '../types';
import { READING_ARTICLES, ReadingArticle } from '../data/readingData';
import { api } from '../services/api';
import {
  BookOpen,
  Search,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  FileText,
  ChevronRight,
  BookMarked
} from 'lucide-react';

interface ReadingSectionProps {
  user: User;
  onUserUpdate: (updated: Partial<User>) => void;
  onToast: (msg: string) => void;
}

export const ReadingSection: React.FC<ReadingSectionProps> = ({
  user,
  onUserUpdate,
  onToast,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'matematika' | 'informatika' | 'fizika' | 'ingliz'>('all');
  const [search, setSearch] = useState('');
  const [activeArticle, setActiveArticle] = useState<ReadingArticle | null>(null);

  // Quiz states inside active article
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [claimedBonus, setClaimedBonus] = useState<Record<string, boolean>>({});

  const filteredArticles = READING_ARTICLES.filter((item) => {
    const matchesSubj = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    return matchesSubj && matchesSearch;
  });

  const handleOpenArticle = (article: ReadingArticle) => {
    setActiveArticle(article);
    setAnswers({});
    setSubmittedQuiz(false);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (submittedQuiz) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeArticle) return;
    setSubmittedQuiz(true);

    let correctCount = 0;
    activeArticle.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correctCount++;
    });

    if (!claimedBonus[activeArticle.id]) {
      const bonus = correctCount * 5 + 10; // +10 reading bonus + 5 per correct answer
      try {
        const res = await api.changePlayerCoins(user.username, bonus);
        onUserUpdate({ coins: res.coins });
        setClaimedBonus((prev) => ({ ...prev, [activeArticle.id]: true }));
        onToast(`🎉 Mutolaa muvaffaqiyatli yakunlandi! Natija: ${correctCount}/${activeArticle.questions.length}. Mukofot: +${bonus} Tanga!`);
      } catch {
        onToast("Dars o'qildi!");
      }
    } else {
      onToast(`Natija: ${correctCount}/${activeArticle.questions.length} ta to'g'ri.`);
    }
  };

  return (
    <div className="w-full space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300">
              O'qish & Mutolaa Zali
            </h2>
            <p className="text-xs text-slate-400">
              Matematika, Informatika va Fizika bo'yicha chuqurlashtirilgan mavzular, formulalar va mustahkamlovchi savollar
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedSubject === 'all'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setSelectedSubject('matematika')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedSubject === 'matematika'
                ? 'bg-blue-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📐 Matematika
          </button>
          <button
            onClick={() => setSelectedSubject('informatika')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedSubject === 'informatika'
                ? 'bg-purple-600 text-white font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💻 Informatika
          </button>
          <button
            onClick={() => setSelectedSubject('fizika')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedSubject === 'fizika'
                ? 'bg-emerald-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Fizika
          </button>
          <button
            onClick={() => setSelectedSubject('ingliz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedSubject === 'ingliz'
                ? 'bg-rose-500 text-white font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 Ingliz tili
          </button>
        </div>
      </div>

      {!activeArticle ? (
        /* Articles List */
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mavzular yoki qoidalar ichidan qidirish..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((art) => {
              const subjColor =
                art.subject === 'matematika'
                  ? 'border-blue-500/30 hover:border-blue-400 bg-blue-950/10'
                  : art.subject === 'informatika'
                  ? 'border-purple-500/30 hover:border-purple-400 bg-purple-950/10'
                  : art.subject === 'ingliz'
                  ? 'border-rose-500/30 hover:border-rose-400 bg-rose-950/10'
                  : 'border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/10';

              const badgeColor =
                art.subject === 'matematika'
                  ? 'bg-blue-500/20 text-blue-300'
                  : art.subject === 'informatika'
                  ? 'bg-purple-500/20 text-purple-300'
                  : art.subject === 'ingliz'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-emerald-500/20 text-emerald-300';

              return (
                <div
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className={`border rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition transform hover:-translate-y-1 shadow-lg group ${subjColor}`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeColor}`}>
                        {art.subjectTitle}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {art.readTime}
                        </span>
                        <span>•</span>
                        <span>{art.level}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-white group-hover:text-amber-300 transition mb-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      +{art.questions.length * 5 + 10} Tanga yutish
                    </span>
                    <div className="flex items-center gap-1 text-teal-300 font-bold group-hover:translate-x-1 transition text-xs">
                      <span>O'qish</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full Article Reader Mode */
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
          <button
            onClick={() => setActiveArticle(null)}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mavzular ro'yxatiga qaytish</span>
          </button>

          {/* Article Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="bg-amber-500/20 text-amber-300 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {activeArticle.subjectTitle}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {activeArticle.readTime} mutolaa
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">{activeArticle.level}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {activeArticle.title}
            </h1>
            <p className="text-sm text-slate-300 mt-2 font-medium italic">
              {activeArticle.summary}
            </p>
          </div>

          {/* Article Content Paragraphs */}
          <div className="space-y-3.5 text-slate-200 text-sm sm:text-base leading-relaxed">
            {activeArticle.content.map((p, idx) => (
              <p key={idx} className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/80">
                {p}
              </p>
            ))}
          </div>

          {/* Key Formulas / Rules Card */}
          {activeArticle.keyFormulas.length > 0 && (
            <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-lg">
              <h3 className="text-sm font-black text-blue-300 flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4" />
                <span>Asosiy Formulalar va Qoidalar:</span>
              </h3>
              <ul className="space-y-2">
                {activeArticle.keyFormulas.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-100 font-mono bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-teal-400 font-bold shrink-0">✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interesting Facts */}
          {activeArticle.interestingFacts.length > 0 && (
            <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-orange-950/30 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-black text-amber-300 flex items-center gap-2 mb-2.5">
                <Lightbulb className="w-4 h-4" />
                <span>Qiziqarli Ilmiy Faktlar:</span>
              </h3>
              <ul className="space-y-2">
                {activeArticle.interestingFacts.map((fact, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-400 shrink-0">💡</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Review Quiz (Mustahkamlovchi Savollar) */}
          <div className="bg-slate-950/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black text-white">
                  Mavzuni Mustahkamlash Savollari ({activeArticle.questions.length} ta)
                </h3>
              </div>
              <span className="text-xs text-amber-400 font-bold">
                Har bir to'g'ri javob: +5 Tanga 🪙
              </span>
            </div>

            <div className="space-y-5">
              {activeArticle.questions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2.5">
                  <p className="text-sm font-bold text-slate-100 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <span>{q.q}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = answers[qIdx] === optIdx;
                      const isCorrect = optIdx === q.correct;

                      let style = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";

                      if (submittedQuiz) {
                        if (isCorrect) {
                          style = "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold";
                        } else if (isSelected) {
                          style = "bg-rose-950 border-rose-500 text-rose-200";
                        } else {
                          style = "bg-slate-950 border-slate-800 text-slate-500 opacity-60";
                        }
                      } else if (isSelected) {
                        style = "bg-purple-900/60 border-purple-400 text-white font-bold";
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={submittedQuiz}
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between gap-2 ${style}`}
                        >
                          <span>{opt}</span>
                          {submittedQuiz && (
                            <span>
                              {isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : isSelected ? (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              ) : null}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submittedQuiz && (
                    <p className="text-[11px] text-teal-400/90 pl-7 italic">
                      Izoh: {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Quiz button */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              {!submittedQuiz ? (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length === 0}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition disabled:opacity-40 shadow-lg"
                >
                  SAVOLLARNI TEKSHIRISH VA TANGALARNI OLISH
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Dars o'qildi va mustahkamlandi!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
