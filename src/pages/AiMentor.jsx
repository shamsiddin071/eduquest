import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { queryAiMentor } from '../data/aiKnowledgeBase';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Trash2, 
  BookOpen, 
  Zap, 
  Atom, 
  Code, 
  Coins, 
  Calculator, 
  GraduationCap, 
  MessageSquare, 
  Copy, 
  Check 
} from 'lucide-react';

export default function AiMentor() {
  const context = useOutletContext();
  const currentLang = context?.currentLang || 'en';

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const initialGreeting = currentLang === 'uz'
    ? 'Assalomu alaykum! Men EduQuest-ning shaxsiy AI repetitoriman. Sizga platformadan foydalanish, darslar, tushunarsiz formulalar yoki imtihonga tayyorgarlik bo‘yicha har qanday savolingizga javob bera olaman. Marhamat, quyidagi mavzulardan birini tanlang yoki savolingizni yozing!'
    : 'Welcome to the EduQuest AI Study Arena! I am your 24/7 personal tutor. Ask me anything about platform mechanics, physics dynamics, IELTS vocabulary, calculus, coding, or cryptocurrency math!';

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'ai',
      text: initialGreeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const subjectCoaches = [
    {
      id: 'all',
      name: currentLang === 'uz' ? 'Umumiy Murabbiy' : 'General Coach',
      desc: currentLang === 'uz' ? 'Platforma va barcha fanlar' : 'Platform & All Subjects',
      icon: GraduationCap,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      id: 'physics',
      name: currentLang === 'uz' ? 'Fizika Repetitori' : 'Physics Tutor',
      desc: currentLang === 'uz' ? 'Nyuton, Plank, Termodinamika' : 'Newton, Planck & Energy',
      icon: Atom,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'ielts',
      name: currentLang === 'uz' ? 'IELTS Academic' : 'IELTS Specialist',
      desc: currentLang === 'uz' ? 'Reading, Paraphrasing, Vocab' : 'Reading, Paraphrasing, Vocab',
      icon: BookOpen,
      color: 'from-rose-500 to-pink-600'
    },
    {
      id: 'math',
      name: currentLang === 'uz' ? 'Matematika & SAT' : 'Math & SAT Solver',
      desc: currentLang === 'uz' ? 'Hosila, Ehtimollik, Algebra' : 'Calculus, Probability, Rates',
      icon: Calculator,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'cs',
      name: currentLang === 'uz' ? 'Dasturlash & AI' : 'CS & AI Architect',
      desc: currentLang === 'uz' ? 'Algoritmlar, Transformers' : 'Algorithms, Transformers',
      icon: Code,
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const quickStarters = [
    {
      label: currentLang === 'uz' ? '⚡ Mistake-to-Mission qanday ishlaydi?' : '⚡ How does Mistake-to-Mission work?',
      text: currentLang === 'uz' ? 'Mistake-to-Mission qanday ishlaydi va u qanday XP beradi?' : 'Explain how the Mistake-to-Mission engine works and how it rewards XP'
    },
    {
      label: currentLang === 'uz' ? '⚛️ Foton energiyasi formulasini tushuntir' : '⚛️ How to calculate photon energy?',
      text: currentLang === 'uz' ? 'Foton energiyasi Plank formulasi E = hc/lambda qanday hisoblanadi?' : 'Explain Planck\'s formula E = hc / lambda with an example'
    },
    {
      label: currentLang === 'uz' ? '📖 IELTS Band 8+ Paraphrase usullari' : '📖 IELTS Band 8+ Paraphrase Rules',
      text: currentLang === 'uz' ? 'IELTS Academic imtihonida so‘zlarni buzmasdan qanday to‘g‘ri paraphrase qilish mumkin?' : 'What are the golden rules of paraphrasing for IELTS Academic Band 8+?'
    },
    {
      label: currentLang === 'uz' ? '🪙 AMM x * y = k formulasining mohiyati' : '🪙 What is constant product AMM?',
      text: currentLang === 'uz' ? 'DeFi birjalarida x * y = k formulasi token narxini qanday belgilaydi?' : 'How does the constant product AMM formula x * y = k govern liquidity pool swaps?'
    }
  ];

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await queryAiMentor(query, currentLang);
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: currentLang === 'uz'
            ? 'Xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.'
            : 'Something went wrong. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl border border-indigo-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'uz' ? '24/7 Shaxsiy Repetitor' : '24/7 Cognitive AI Tutor'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
            {currentLang === 'uz' ? 'EduQuest AI Mentor & Study Arena' : 'EduQuest AI Mentor & Study Arena'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            {currentLang === 'uz'
              ? 'Platforma qoidalari, murakkab formulalar yoki IELTS va fizika fanlari bo‘yicha istalgan savolingizni bering!'
              : 'Ask anything about platform mechanics (Mistake-to-Mission, Sprint XP) or academic topics across all subjects.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setChatHistory([
              {
                id: Date.now(),
                sender: 'ai',
                text: initialGreeting,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ])
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{currentLang === 'uz' ? 'Suhbatni Yangilash' : 'Clear Chat'}</span>
        </button>
      </div>

      {/* Coach Track Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {subjectCoaches.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedTrack === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedTrack(c.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center mb-2 shadow-sm`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                {c.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {c.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Chat Window */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col h-[580px] overflow-hidden">
        {/* Chat History View */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {chatHistory.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-none shadow-sm whitespace-pre-wrap'
                }`}
              >
                {m.text}

                <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/10 dark:border-slate-700/50">
                  <span
                    className={`text-[10px] font-medium ${
                      m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                  {m.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(m.id, m.text)}
                      className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2.5 text-slate-400 text-xs py-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center animate-spin">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs font-medium">
                {currentLang === 'uz' ? 'AI Mentor tahlil qilmoqda...' : 'AI Mentor is analyzing...'}
              </span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggested Quick Starters */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {quickStarters.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInput(q.text)}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-colors cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentLang === 'uz'
                ? 'Savolingizni yozing (masalan: "Nyuton qonuni", "IELTS reading", "Mistake-to-Mission qanday ishlaydi")...'
                : 'Ask anything (e.g., "Explain Newton\'s laws", "How does Mistake-to-Mission work", "Derivative of x^3")...'
            }
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{currentLang === 'uz' ? 'Yuborish' : 'Ask'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
