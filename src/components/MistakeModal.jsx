import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';

export default function MistakeModal({ 
  isOpen, 
  question, 
  onSuccess, 
  currentLang = 'en' 
}) {
  if (!isOpen || !question) return null;

  const fallback = question.fallback_question;
  const [selectedFallbackOption, setSelectedFallbackOption] = useState(null);
  const [fallbackFeedback, setFallbackFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [isResolved, setIsResolved] = useState(false);

  const t = {
    en: {
      badge: 'Adaptive Recovery Engine',
      title: 'Mistake-to-Mission Activated!',
      subtitle: 'The 60s Sprint timer is paused. Master this concept to redeem your streak.',
      debriefTitle: 'Tactical Debrief & Explanation',
      missionTitle: 'Redemption Challenge (Simpler Fallback)',
      wrongFeedback: 'Incorrect attempt. Re-read the debrief and try again.',
      successFeedback: 'Mission Accomplished! Concept redeemed (+5 Recovery XP).',
      resumeBtn: 'Resume Sprint'
    },
    uz: {
      badge: 'Adaptiv Qayta Tiklash Tizimi',
      title: 'Xatodan-Missiyaga Faollashdi!',
      subtitle: '60s Sprint taymeri to‘xtatildi. Ushbu tushunchani o‘zlashtirib seriyangizni saqlang.',
      debriefTitle: 'Xato Tahlili & Tushuntirish',
      missionTitle: 'Qayta Tiklash Missiyasi (Soddalashtirilgan)',
      wrongFeedback: 'Noto‘g‘ri javob. Tushuntirishni qayta o‘qib, yana urinib ko‘ring.',
      successFeedback: 'Missiya Bajarildi! Tushuncha o‘zlashtirildi (+5 Qayta Tiklash XP).',
      resumeBtn: 'Sprintni Davom Ettirish'
    }
  }[currentLang] || {
    badge: 'Adaptive Recovery Engine',
    title: 'Mistake-to-Mission Activated!',
    subtitle: 'The 60s Sprint timer is paused. Master this concept to redeem your streak.',
    debriefTitle: 'Tactical Debrief & Explanation',
    missionTitle: 'Redemption Challenge (Simpler Fallback)',
    wrongFeedback: 'Incorrect attempt. Re-read the debrief and try again.',
    successFeedback: 'Mission Accomplished! Concept redeemed (+5 Recovery XP).',
    resumeBtn: 'Resume Sprint'
  };

  const handleFallbackOptionClick = (option) => {
    if (isResolved) return;
    setSelectedFallbackOption(option);

    if (option === fallback.correct_answer) {
      setFallbackFeedback('correct');
      setIsResolved(true);
    } else {
      setFallbackFeedback('wrong');
    }
  };

  const handleCompleteAndResume = () => {
    setSelectedFallbackOption(null);
    setFallbackFeedback(null);
    setIsResolved(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 max-h-[90vh] overflow-y-auto">
        {/* Header Ribbon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{t.badge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {t.title}
            </h2>
            <p className="text-xs text-slate-400">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Section 1: Detailed Debrief of the Missed Question */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Lightbulb className="w-4 h-4" />
            <span>{t.debriefTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>

        {/* Section 2: Simpler Fallback Challenge */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>{t.missionTitle}</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-white mb-4 leading-snug">
            {fallback.text}
          </p>

          {/* 4 Fallback Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fallback.options.map((option, idx) => {
              const isSelected = selectedFallbackOption === option;
              const isOptionCorrect = option === fallback.correct_answer;

              let style = 'bg-slate-800 border-slate-700 text-slate-200 hover:border-indigo-500 hover:bg-slate-750';

              if (isSelected) {
                if (fallbackFeedback === 'correct') {
                  style = 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30';
                } else if (fallbackFeedback === 'wrong') {
                  style = 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30';
                }
              } else if (isResolved && isOptionCorrect) {
                style = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isResolved}
                  onClick={() => handleFallbackOptionClick(option)}
                  className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer disabled:cursor-not-allowed ${style}`}
                >
                  <span>{option}</span>
                  {isSelected && fallbackFeedback === 'correct' && (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  )}
                  {isSelected && fallbackFeedback === 'wrong' && (
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Messages */}
        {fallbackFeedback === 'wrong' && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{t.wrongFeedback}</span>
          </div>
        )}

        {fallbackFeedback === 'correct' && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{t.successFeedback}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!isResolved}
            onClick={handleCompleteAndResume}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <span>{t.resumeBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
