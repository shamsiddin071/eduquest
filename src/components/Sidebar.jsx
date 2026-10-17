import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  Award,
  Bot
} from 'lucide-react';

export default function Sidebar({ currentLang, onCloseMobile }) {
  const translations = {
    en: {
      dashboard: 'Dashboard',
      sprint: '60s Sprint',
      subjects: 'Subjects',
      leaderboard: 'Leaderboard',
      aiMentor: 'AI Mentor',
      missionTitle: 'Mistake-to-Mission',
      missionSubtitle: 'Active Learning Engine',
      footerBadge: 'Season 1 Quest Active'
    },
    uz: {
      dashboard: 'Boshqaruv Paneli',
      sprint: '60s Sprint',
      subjects: 'Fanlar',
      leaderboard: 'Yetakchilar',
      aiMentor: 'AI Mentor',
      missionTitle: 'Xatodan-Missiyaga',
      missionSubtitle: 'Adaptiv Ta’lim Tizimi',
      footerBadge: '1-Mavsum Faol'
    }
  };

  const t = translations[currentLang] || translations.en;

  const navItems = [
    {
      to: '/dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/sprint',
      label: t.sprint,
      icon: Zap,
      badge: 'LIVE'
    },
    {
      to: '/mentor',
      label: t.aiMentor,
      icon: Bot,
      badge: 'AI'
    },
    {
      to: '/subjects',
      label: t.subjects,
      icon: BookOpen,
      badge: null
    },
    {
      to: '/leaderboard',
      label: t.leaderboard,
      icon: Trophy,
      badge: 'TOP'
    }
  ];

  return (
    <aside className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white leading-none">
              EduQuest
            </h1>
            <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">
              Gamified EdTech
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-1.5">
          <p className="px-3 text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-2">
            {currentLang === 'uz' ? 'Asosiy Menyu' : 'Main Menu'}
          </p>

          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Feature Promo Card & Version Status */}
      <div className="p-4 space-y-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/70 to-purple-950/70 border border-indigo-800/40">
          <div className="flex items-center gap-2 mb-1.5 text-indigo-300">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold">{t.missionTitle}</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t.missionSubtitle}
          </p>
        </div>

        <div className="px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.footerBadge}</span>
          </div>
          <span className="font-mono text-[10px]">v1.0</span>
        </div>
      </div>
    </aside>
  );
}
