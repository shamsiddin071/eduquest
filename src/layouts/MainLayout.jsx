import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('eduquest_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('eduquest_lang') || 'en';
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('eduquest_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('eduquest_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'uz' : 'en';
    setCurrentLang(nextLang);
    localStorage.setItem('eduquest_lang', nextLang);
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 z-40">
        <Sidebar currentLang={currentLang} />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Slider */}
      <div
        className={`fixed inset-y-0 left-0 w-64 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar 
          currentLang={currentLang} 
          onCloseMobile={() => setIsMobileSidebarOpen(false)} 
        />
      </div>

      {/* Primary Content Region */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header
          currentLang={currentLang}
          onToggleLang={toggleLanguage}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ currentLang, isDarkMode }} />
        </main>
      </div>
    </div>
  );
}
