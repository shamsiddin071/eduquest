import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  Sun, 
  Moon, 
  Globe, 
  LogOut, 
  User, 
  Flame, 
  Zap, 
  Menu, 
  X 
} from 'lucide-react';

export default function Header({ 
  currentLang, 
  onToggleLang, 
  isDarkMode, 
  onToggleTheme, 
  onToggleMobileSidebar,
  isMobileSidebarOpen 
}) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Player',
          email: session.user.email,
          level: 3,
          xp: 450,
          streak: 3
        });
      } else {
        const demo = localStorage.getItem('eduquest_demo_user');
        if (demo) {
          try {
            setCurrentUser(JSON.parse(demo));
          } catch (e) {
            console.error('Failed to parse demo user', e);
          }
        } else {
          setCurrentUser({
            name: 'Guest Challenger',
            level: 1,
            xp: 120,
            streak: 1
          });
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          email: session.user.email,
          level: 3,
          xp: 450,
          streak: 3
        });
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem('eduquest_demo_user');
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar Trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            EduQuest
          </span>
        </div>

        {/* Center / Stat Pills */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-amber-500" />
            <span>{currentUser?.streak || 3} {currentLang === 'uz' ? 'Kunlik Seriya' : 'Day Streak'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            <span>{currentUser?.xp || 450} XP</span>
          </div>
        </div>

        {/* Right Action Controls: Language, Theme & Profile */}
        <div className="flex items-center gap-2">
          {/* Uz / Eng Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span className="uppercase">{currentLang === 'uz' ? 'UZ' : 'EN'}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {currentUser?.name || 'Challenger'}
                </p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold leading-none">
                  {currentLang === 'uz' ? 'Daraja' : 'Lvl'} {currentUser?.level || 1}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title={currentLang === 'uz' ? 'Chiqish' : 'Sign Out'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
