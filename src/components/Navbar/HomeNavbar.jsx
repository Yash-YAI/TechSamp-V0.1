import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  User,
  LogOut,
  Users,
  ShieldCheck,
  Check,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

export default function HomeNavbar({
  user,
  onLogout,
  onOpenProfile,
  onOpenManagement,
  onFocusSearch,
}) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  // Dropdown states
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const langRef = useRef(null);
  const profileRef = useRef(null);
  const settingsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'kh', label: 'ភាសាខ្មែរ', flag: '🇰🇭' },
    { code: 'ch', label: '中文', flag: '🇨🇳' },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
  };

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 select-none shadow-xs">
      {/* LEFT BRAND SECTION - Clickable to return Home */}
      <div
        onClick={() => navigate('/home')}
        title="Return to Home"
        className="flex items-center gap-3 cursor-pointer group select-none transition-opacity hover:opacity-85"
      >
        {/* Show Apps / Logo Badge */}
        <div className="relative">
          <div
            className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-amber-400/80 transition-transform group-hover:scale-105"
          >
            TL
          </div>
        </div>

        {/* Brand Text */}
        <span className="text-[#8b5cf6] font-black text-2xl tracking-tight transition-transform group-hover:scale-102">
          T & S
        </span>
      </div>

      {/* RIGHT ACTIONS SECTION */}
      <div className="flex items-center gap-3">
        {/* Search Icon */}
        {/* <button
          onClick={onFocusSearch}
          title="Search"
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <Search size={18} />
        </button> */}

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            title="Notifications"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <Bell size={18} />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <span className="text-sm">{currentLang.flag}</span>
            <span>{currentLang.label}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-left animate-in fade-in duration-100">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {i18n.language === lang.code && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

         {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-amber-400 animate-in spin-in-180 duration-200" />
          ) : (
            <Moon size={18} className="text-slate-600 transition-transform hover:-rotate-12 duration-200" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {/* Avatar with Online Dot */}
            <div className="relative">
              {user?.face_photo ? (
                <img
                  src={user.face_photo}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-300 dark:border-purple-800">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>

            {/* Name & Job Title */}
            <div className="text-left hidden sm:block leading-tight">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {user?.eng_name || user?.name || 'Yasomi'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                {user?.job_title || 'Software Developer'}
              </div>
            </div>

            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-left animate-in fade-in duration-100">
              {/* Profile Card Header */}
              <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {user?.eng_name || user?.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.emp_code ? `ID: ${user.emp_code}` : user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <User size={15} className="text-slate-400" />
                <span>{t('nav.profile', 'Profile')}</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
              >
                <LogOut size={15} />
                <span>{t('nav.logout', 'Logout')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Settings Gear Dropdown */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="Settings"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <Settings size={18} />
          </button>

          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-left animate-in fade-in duration-100">
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Administration
              </div>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  onOpenManagement('user');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <Users size={15} className="text-slate-400" />
                <span>{t('nav.userManagement', 'User Management')}</span>
              </button>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  onOpenManagement('role');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <ShieldCheck size={15} className="text-slate-400" />
                <span>{t('nav.roleManagement', 'Role Management')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
