import React, { useState, useRef, useEffect } from 'react';
import { queryAiMentor } from '../data/aiKnowledgeBase';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Trash2, 
  ChevronDown, 
  HelpCircle, 
  BookOpen, 
  Zap, 
  Maximize2 
} from 'lucide-react';

export default function AiChatWidget({ currentLang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const initialGreeting = currentLang === 'uz'
    ? 'Assalomu alaykum! Men EduQuest AI Mentoriman. Platformadan foydalanish yoki xohlagan faningiz (Fizika, IELTS, Matematika, CS) bo‘yicha savolingiz bormi? Yordam berishga tayyorman!'
    : 'Hello! I am your EduQuest AI Mentor. Ask me anything about how EduQuest works (Sprint, Mistake-to-Mission) or study questions across Physics, IELTS, Math, CS, and more!';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: initialGreeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const suggestedPrompts = [
    {
      label: currentLang === 'uz' ? '🛡️ Mistake-to-Mission nima?' : '🛡️ How does Mistake-to-Mission work?',
      query: currentLang === 'uz' ? 'Mistake-to-Mission qanday ishlaydi?' : 'How does Mistake-to-Mission work?'
    },
    {
      label: currentLang === 'uz' ? '⚛️ Fizika formulalari' : '⚛️ Explain Newton\'s 2nd Law',
      query: currentLang === 'uz' ? 'Nyutonning ikkinchi qonunini tushuntirib ber' : 'Explain Newton\'s Second Law with an example'
    },
    {
      label: currentLang === 'uz' ? '📖 IELTS Paraphrasing' : '📖 IELTS Paraphrase Tips',
      query: currentLang === 'uz' ? 'IELTSda paraphrasing qilish usullari qanday?' : 'Give me tips for IELTS reading paraphrasing'
    },
    {
      label: currentLang === 'uz' ? '🪙 AMM formulasi nima?' : '🪙 How do AMM pools work?',
      query: currentLang === 'uz' ? 'Uniswap AMM x * y = k formulasi qanday ishlaydi?' : 'How does the AMM x * y = k formula calculate token swaps?'
    }
  ];

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const textToSend = inputMessage.trim();
    if (!textToSend || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiReply = await queryAiMentor(textToSend, currentLang);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: currentLang === 'uz'
            ? 'Kechirasiz, javob tayyorlashda xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.'
            : 'Sorry, an error occurred while processing your request. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePromptClick = (query) => {
    setInputMessage(query);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: initialGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Summon Pill / Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-sm shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-indigo-400/40"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-900 animate-ping" />
          </div>
          <span>{currentLang === 'uz' ? 'AI Mentor' : 'AI Study Mentor'}</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-black tracking-wider">
            ASK ANYTHING
          </span>
        </button>
      )}

      {/* Expanded Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-md sm:max-w-lg h-[620px] max-h-[90vh] bg-slate-900/95 border-2 border-indigo-500/50 rounded-3xl shadow-2xl shadow-indigo-950/60 backdrop-blur-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white leading-tight">
                    EduQuest AI Mentor
                  </h3>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-indigo-300 font-medium">
                  {currentLang === 'uz' ? 'Har qanday savol berishingiz mumkin' : 'Ask anything: Platform & Subjects'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-none shadow-sm whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                  <span
                    className={`block text-[10px] mt-1.5 font-medium ${
                      msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400 text-left'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>{currentLang === 'uz' ? 'AI Mentor javob tayyorlamoqda...' : 'AI Mentor is thinking...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompts Pills */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(p.query)}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-[11px] font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                currentLang === 'uz'
                  ? 'Savolingizni yozing (platforma, fizika, IELTS, matematika)...'
                  : 'Ask about platform, physics, IELTS, math, coding...'
              }
              className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
