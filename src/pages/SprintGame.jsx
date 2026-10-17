import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useOutletContext, useSearchParams } from 'react-router-dom';
import questionsData from '../data/questions.json';
import MistakeModal from '../components/MistakeModal';
import { supabase } from '../supabaseClient';
import { 
  Timer, 
  Zap, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Play, 
  Pause, 
  Home,
  BookOpen
} from 'lucide-react';

export default function SprintGame() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const context = useOutletContext();
  const currentLang = context?.currentLang || 'en';

  const initialSubject = searchParams.get('subject') || 'all';
  const initialTopic = searchParams.get('topic') || 'all';
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);

  const [gameState, setGameState] = useState('ready');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streakCombo, setStreakCombo] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackStatus, setFeedbackStatus] = useState(null);

  const [isMistakeModalActive, setIsMistakeModalActive] = useState(false);
  const [activeMistakeQuestion, setActiveMistakeQuestion] = useState(null);

  const timerRef = useRef(null);

  // Derive available topics dynamically based on the active subject
  const availableTopics = React.useMemo(() => {
    if (!selectedSubject || selectedSubject === 'all') return [];
    const matched = questionsData.filter((q) =>
      q.subject.toLowerCase().includes(selectedSubject.toLowerCase())
    );
    return Array.from(new Set(matched.map((q) => q.topic).filter(Boolean)));
  }, [selectedSubject]);

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId);
    setSelectedTopic('all');
  };

  const startSprint = () => {
    let pool = questionsData;
    if (selectedSubject && selectedSubject !== 'all') {
      pool = pool.filter((q) =>
        q.subject.toLowerCase().includes(selectedSubject.toLowerCase())
      );
    }
    if (selectedTopic && selectedTopic !== 'all') {
      const topicFiltered = pool.filter((q) =>
        q.topic && q.topic.toLowerCase().includes(selectedTopic.toLowerCase())
      );
      if (topicFiltered.length > 0) {
        pool = topicFiltered;
      }
    }

    const randomized = [...pool].sort(() => 0.5 - Math.random());
    setShuffledQuestions(randomized);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setStreakCombo(0);
    setMaxStreak(0);
    setTimeLeft(60);
    setIsPaused(false);
    setSelectedOption(null);
    setFeedbackStatus(null);
    setIsMistakeModalActive(false);
    setActiveMistakeQuestion(null);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing' && !isPaused && !isMistakeModalActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [gameState, isPaused, isMistakeModalActive]);

  const finishGame = async () => {
    setGameState('gameover');
    clearInterval(timerRef.current);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('total_xp, current_level')
          .eq('id', session.user.id)
          .single();

        if (userProfile) {
          const updatedXp = (userProfile.total_xp || 0) + score;
          const updatedLevel = Math.floor(updatedXp / 200) + 1;
          await supabase.from('users').update({
            total_xp: updatedXp,
            current_level: updatedLevel
          }).eq('id', session.user.id);
        }
      } else {
        const demo = localStorage.getItem('eduquest_demo_user');
        if (demo) {
          const parsed = JSON.parse(demo);
          parsed.total_xp = (parsed.total_xp || 0) + score;
          parsed.current_level = Math.floor(parsed.total_xp / 200) + 1;
          localStorage.setItem('eduquest_demo_user', JSON.stringify(parsed));
        }
      }
    } catch (err) {
      console.warn('Game sync warning:', err);
    }
  };

  const handleAnswerClick = (option) => {
    if (feedbackStatus !== null || gameState !== 'playing' || isPaused || isMistakeModalActive) {
      return;
    }

    setSelectedOption(option);
    const currentQuestion = shuffledQuestions[currentIndex];
    const isCorrect = option === currentQuestion.correct_answer;

    if (isCorrect) {
      setFeedbackStatus('correct');
      const comboBonus = streakCombo >= 3 ? 5 : 0;
      setScore((prev) => prev + 10 + comboBonus);
      setCorrectCount((prev) => prev + 1);
      setStreakCombo((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });

      setTimeout(() => {
        advanceQuestion();
      }, 400);
    } else {
      setFeedbackStatus('wrong');
      setWrongCount((prev) => prev + 1);
      setStreakCombo(0);

      setTimeout(() => {
        setIsPaused(true);
        setActiveMistakeQuestion(currentQuestion);
        setIsMistakeModalActive(true);
      }, 500);
    }
  };

  const advanceQuestion = () => {
    setSelectedOption(null);
    setFeedbackStatus(null);
    if (currentIndex + 1 < shuffledQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishGame();
    }
  };

  const handleMistakeMissionResolved = () => {
    setScore((prev) => prev + 5);
    setIsMistakeModalActive(false);
    setActiveMistakeQuestion(null);
    setIsPaused(false);
    advanceQuestion();
  };

  const currentQ = shuffledQuestions[currentIndex] || questionsData[0];
  const timerPercentage = (timeLeft / 60) * 100;

  return (
    <div className="max-w-3xl mx-auto py-4">
      {gameState === 'ready' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Timer className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {currentLang === 'uz' ? '60 Soniyalik Sprint' : '60 Seconds Sprint'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            {currentLang === 'uz'
              ? 'Vaqt tugashidan oldin imkon qadar ko‘proq savolga to‘g‘ri javob bering. Har bir to‘g‘ri javob +10 XP beradi. Xato qilsangiz, Mistake-to-Mission sizni qutqaradi!'
              : 'Race against the clock to answer real-world SAT Math, AI, and CS problems. Earn +10 XP per hit. If you slip up, the Mistake-to-Mission engine activates!'}
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Time Limit</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">60 Sec</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Base Reward</span>
              <span className="text-lg font-bold text-emerald-500">+10 XP</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Adaptive</span>
              <span className="text-lg font-bold text-indigo-400">Recovery</span>
            </div>
          </div>

          {/* TWO-TIER THEMATIC QUIZ SELECTOR */}
          <div className="mb-8 space-y-6 text-left">
            {/* Step 1: Subject Selection */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  {currentLang === 'uz' ? '1. Fanni Tanlang' : '1. Select Subject'}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {questionsData.length} {currentLang === 'uz' ? 'jami savol' : 'total questions'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: currentLang === 'uz' ? '⚡ Barcha Fanlar (Aralash)' : '⚡ All Subjects (Mixed Arena)' },
                  { id: 'Mathematics', label: '📐 Math' },
                  { id: 'IELTS Academic', label: '📖 IELTS Academic' },
                  { id: 'Physics', label: '⚛️ Physics' },
                  { id: 'SAT Math', label: '🚀 SAT Math' },
                  { id: 'Computer Science', label: '💻 CompSci & AI' },
                  { id: 'Cryptocurrency', label: '🪙 Crypto & DeFi' }
                ].map((subj) => {
                  const isActive =
                    (subj.id === 'all' && selectedSubject === 'all') ||
                    (subj.id !== 'all' && selectedSubject.toLowerCase().includes(subj.id.toLowerCase()));
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => handleSubjectChange(subj.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400 scale-[1.02]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {subj.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Thematic Topic Selection */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  {currentLang === 'uz' ? '2. Mavzuni Tanlang' : '2. Select Topic'}
                </span>
                {selectedSubject !== 'all' && (
                  <span className="text-[11px] font-bold text-indigo-400">
                    {availableTopics.length} {currentLang === 'uz' ? 'mavzu mavjud' : 'topics available'}
                  </span>
                )}
              </div>

              {selectedSubject === 'all' ? (
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium flex items-center justify-between">
                  <span>
                    {currentLang === 'uz'
                      ? '⚡ Aralash Rejim: Barcha 6 ta fan va ularning barcha kichik mavzulari qamrab olinadi.'
                      : '⚡ Mixed Arena: Questions will be dynamically pulled across all domains and sub-topics.'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-black text-[10px] uppercase">
                    Full Spectrum
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTopic('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTopic === 'all'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {currentLang === 'uz' ? '⚡ Barcha Mavzulari' : '⚡ All Topics in this Subject'}
                  </button>

                  {availableTopics.map((top) => {
                    const count = questionsData.filter(
                      (q) =>
                        q.subject.toLowerCase().includes(selectedSubject.toLowerCase()) &&
                        q.topic === top
                    ).length;
                    const isTopicActive = selectedTopic === top;

                    return (
                      <button
                        key={top}
                        type="button"
                        onClick={() => setSelectedTopic(top)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isTopicActive
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>{top}</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={startSprint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-extrabold text-lg shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{currentLang === 'uz' ? 'Sprintni Boshlash' : 'Start Sprint'}</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${timeLeft <= 10 ? 'bg-rose-500/10 text-rose-500 animate-pulse' : 'bg-indigo-500/10 text-indigo-500'}`}>
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block leading-none">Time Remaining</span>
                  <span className={`text-xl font-black ${timeLeft <= 10 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              {streakCombo > 1 && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-black animate-bounce">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>{streakCombo}X STREAK (+5 BONUS)</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block leading-none">Sprint Score</span>
                  <span className="text-xl font-black text-emerald-500">+{score} XP</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaused((prev) => !prev)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title={isPaused ? 'Resume Sprint' : 'Pause Sprint'}
                >
                  {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg relative">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {currentQ.subject}
                </span>
                {currentQ.topic && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {currentQ.topic}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Question {currentIndex + 1} of {shuffledQuestions.length}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
              {currentQ.text}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQ.correct_answer;

                let buttonStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-800';

                if (feedbackStatus !== null) {
                  if (isSelected && isCorrect) {
                    buttonStyle = 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30';
                  } else if (isCorrect) {
                    buttonStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={feedbackStatus !== null || isPaused || isMistakeModalActive}
                    onClick={() => handleAnswerClick(option)}
                    className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all flex items-center justify-between cursor-pointer disabled:cursor-not-allowed ${buttonStyle}`}
                  >
                    <span>{option}</span>
                    {feedbackStatus !== null && isSelected && (
                      isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {currentLang === 'uz' ? 'Sprint Yakunlandi!' : 'Sprint Complete!'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            {currentLang === 'uz' ? 'Ajoyib natija! Tajriba ballari hisobingizga qo‘shildi.' : 'Outstanding performance! XP rewards have been credited to your profile.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">XP Earned</span>
              <span className="text-2xl font-black text-emerald-500">+{score}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Correct</span>
              <span className="text-2xl font-black text-indigo-500">{correctCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Misses</span>
              <span className="text-2xl font-black text-rose-500">{wrongCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Max Combo</span>
              <span className="text-2xl font-black text-amber-500">{maxStreak}x</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={startSprint}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{currentLang === 'uz' ? 'Qayta O‘ynash' : 'Sprint Again'}</span>
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{currentLang === 'uz' ? 'Dashboardga Qaytish' : 'Return to Dashboard'}</span>
            </Link>
          </div>
        </div>
      )}

      <MistakeModal
        isOpen={isMistakeModalActive}
        question={activeMistakeQuestion}
        onSuccess={handleMistakeMissionResolved}
        currentLang={currentLang}
      />
    </div>
  );
}
