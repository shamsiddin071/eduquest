import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  Flame, 
  Zap, 
  Award, 
  Play, 
  ArrowUpRight, 
  TrendingUp, 
  BrainCircuit, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export default function Dashboard() {
  const context = useOutletContext();
  const currentLang = context?.currentLang || 'en';

  const [userData, setUserData] = useState({
    name: 'Player One',
    level: 3,
    xp: 450,
    nextLevelXp: 600,
    streak: 3,
    mistakesRedeemed: 8
  });

  const [loading, setLoading] = useState(true);

  const radarData = [
    { subject: 'SAT Math', score: 85, fullMark: 100 },
    { subject: 'CS & AI', score: 92, fullMark: 100 },
    { subject: 'Crypto', score: 78, fullMark: 100 },
    { subject: 'Math', score: 88, fullMark: 100 },
    { subject: 'IELTS', score: 82, fullMark: 100 },
    { subject: 'Physics', score: 86, fullMark: 100 },
  ];

  const weeklyActivityData = [
    { day: currentLang === 'uz' ? 'Dush' : 'Mon', xp: 60 },
    { day: currentLang === 'uz' ? 'Sesh' : 'Tue', xp: 110 },
    { day: currentLang === 'uz' ? 'Chor' : 'Wed', xp: 90 },
    { day: currentLang === 'uz' ? 'Pay' : 'Thu', xp: 140 },
    { day: currentLang === 'uz' ? 'Jum' : 'Fri', xp: 80 },
    { day: currentLang === 'uz' ? 'Shan' : 'Sat', xp: 160 },
    { day: currentLang === 'uz' ? 'Yak' : 'Sun', xp: 120 },
  ];

  const subjectsList = [
    {
      id: 'sat-math',
      filterKey: 'SAT Math',
      title: 'SAT Math & Dynamics',
      progress: 85,
      questionsCount: 40,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Advanced'
    },
    {
      id: 'cs-ai',
      filterKey: 'Computer Science',
      title: 'Computer Science & AI',
      progress: 92,
      questionsCount: 55,
      color: 'from-purple-500 to-pink-600',
      badge: 'Popular'
    },
    {
      id: 'crypto-math',
      filterKey: 'Cryptocurrency',
      title: 'Cryptocurrency & DeFi',
      progress: 78,
      questionsCount: 30,
      color: 'from-amber-500 to-orange-600',
      badge: 'Hot'
    },
    {
      id: 'math',
      filterKey: 'Mathematics',
      title: 'Mathematics (Calculus & Functions)',
      progress: 88,
      questionsCount: 45,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Core'
    },
    {
      id: 'ielts',
      filterKey: 'IELTS Academic',
      title: 'IELTS Academic & Reading',
      progress: 82,
      questionsCount: 35,
      color: 'from-rose-500 to-pink-600',
      badge: 'Verbal'
    },
    {
      id: 'physics',
      filterKey: 'Physics',
      title: 'Physics & Modern Mechanics',
      progress: 86,
      questionsCount: 40,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Science'
    }
  ];

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUserData({
              name: profile.full_name || 'Player',
              level: profile.current_level || 3,
              xp: profile.total_xp || 450,
              nextLevelXp: ((profile.current_level || 3) + 1) * 200,
              streak: profile.streak_days || 3,
              mistakesRedeemed: 8
            });
          }
        } else {
          const demo = localStorage.getItem('eduquest_demo_user');
          if (demo) {
            const parsed = JSON.parse(demo);
            setUserData({
              name: parsed.full_name,
              level: parsed.current_level,
              xp: parsed.total_xp,
              nextLevelXp: 600,
              streak: parsed.streak_days,
              mistakesRedeemed: 8
            });
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const xpPercent = Math.min(
    100,
    Math.round((userData.xp / userData.nextLevelXp) * 100)
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/50">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'uz' ? 'Xush kelibsiz' : 'Sprint Ready'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            {currentLang === 'uz'
              ? `Salom, ${userData.name}! Bugun nimani zabt etamiz?`
              : `Welcome back, ${userData.name}! Ready to Sprint?`}
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base mb-6 leading-relaxed">
            {currentLang === 'uz'
              ? 'Xatolaringiz yangi missiyalarni faollashtiradi. Har bir noaniqlik bilim sari qo‘shimcha imkoniyat!'
              : 'Mistake-to-Mission is standing by. Turn your missteps into bonus learning checkpoints and boost your streak.'}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/sprint"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold text-sm shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-indigo-600" />
              <span>{currentLang === 'uz' ? '60s Sprintni Boshlash' : 'Start 60s Sprint'}</span>
            </Link>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
            >
              <span>{currentLang === 'uz' ? 'Reytingni Ko‘rish' : 'View Standings'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-indigo-500/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {currentLang === 'uz' ? 'Joriy Daraja' : 'Current Rank'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentLang === 'uz' ? 'Daraja' : 'Level'} {userData.level}
            </h3>
            <span className="text-xs font-semibold text-indigo-500">
              Cyber Pioneer
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>{userData.xp} XP</span>
              <span>{userData.nextLevelXp} XP ({xpPercent}%)</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-amber-500/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {currentLang === 'uz' ? 'Jami Ballar' : 'Total XP'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {userData.xp.toLocaleString()}
            </h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +40 today
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentLang === 'uz'
              ? 'Har bir to‘g‘ri javob +10 XP mukofot beradi'
              : '+10 XP earned per correct sprint reaction'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-rose-500/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {currentLang === 'uz' ? 'Ketma-Ketlik' : 'Active Streak'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-current animate-bounce" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {userData.streak} {currentLang === 'uz' ? 'Kun' : 'Days'}
            </h3>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
              {currentLang === 'uz' ? 'Olovda!' : 'On Fire!'}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => (
              <div
                key={dayNum}
                className={`flex-1 h-2 rounded-full ${
                  dayNum <= userData.streak
                    ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
                title={`Day ${dayNum}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-500" />
                <span>{currentLang === 'uz' ? 'Fanlar Bo‘yicha Mahorat' : 'Subject Mastery Matrix'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentLang === 'uz' ? 'Sprint va missiyalar natijalari tahlili' : 'Adaptive cognitive coverage breakdown'}
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#475569" strokeDasharray="3 3" opacity={0.3} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                />
                <Radar
                  name="Mastery Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.45}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>{currentLang === 'uz' ? 'Haftalik XP Oqimi' : 'Weekly XP Velocity'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentLang === 'uz' ? 'Oxirgi 7 kundagi mashg‘ulotlar' : 'Consistency and XP volume generated'}
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="xp" 
                  fill="#8b5cf6" 
                  radius={[8, 8, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentLang === 'uz' ? 'Mavjud Fanlar & Tezkor Kirish' : 'Active Subject Tracks'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentLang === 'uz' ? 'Sprint mashqini boshlash uchun fanni tanlang' : 'Select a track to launch a customized session'}
            </p>
          </div>
          <Link
            to="/sprint"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>{currentLang === 'uz' ? 'Barchasi' : 'Quick Play'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjectsList.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    {sub.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {sub.progress}%
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-3">
                  {sub.title}
                </h3>
              </div>

              <div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${sub.color}`}
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
                <Link
                  to={`/sprint?subject=${encodeURIComponent(sub.filterKey)}`}
                  className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{currentLang === 'uz' ? 'Sprintni Boshlash' : 'Enter Sprint'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
