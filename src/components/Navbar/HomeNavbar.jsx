import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Settings,
  User,
  LogOut,
  Users,
  ShieldCheck,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import BrandLogo from '../Common/BrandLogo';

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
  const isDark = theme === 'dark';

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
    <nav
      style={{
        width: '100%',
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.74)' : 'rgba(255, 255, 255, 0.76)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: isDark
          ? '0 4px 20px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 20px -2px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        userSelect: 'none',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* LEFT BRAND SECTION - Clickable to return Home */}
      <div
        onClick={() => navigate('/home')}
        title="Tech & Samp (T & S) - Return to Home"
        style={{
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <BrandLogo
          size={38}
          showText={true}
          subtitle="Garment Intelligence"
        />
      </div>

      {/* RIGHT ACTIONS SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Notification Bell with Badge */}
        <div style={{ position: 'relative' }}>
          <button
            title="Notifications"
            style={{
              padding: 8,
              color: isDark ? '#94a3b8' : '#475569',
              background: 'none',
              border: 'none',
              borderRadius: 9999,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease, color 0.2s ease',
            }}
          >
            <Bell size={18} />
          </button>
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              boxShadow: isDark ? '0 0 0 2px #0f172a' : '0 0 0 2px #ffffff',
            }}
          />
        </div>

        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative' }} ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 8,
              border: isDark ? '1px solid rgba(51, 65, 85, 0.85)' : '1px solid rgba(203, 213, 225, 0.85)',
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.8)',
              color: isDark ? '#e2e8f0' : '#334155',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 14 }}>{currentLang.flag}</span>
            <span>{currentLang.label}</span>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </button>

          {isLangOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                marginTop: 8,
                width: 160,
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 12,
                boxShadow: isDark ? '0 12px 30px -4px rgba(0, 0, 0, 0.6)' : '0 12px 30px -4px rgba(15, 23, 42, 0.12)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(226, 232, 240, 0.9)',
                padding: '6px 0',
                zIndex: 50,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  padding: '4px 12px',
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: isDark ? '#64748b' : '#94a3b8',
                }}
              >
                Select Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: i18n.language === lang.code ? 700 : 500,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: i18n.language === lang.code
                      ? isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
                      : 'transparent',
                    color: i18n.language === lang.code
                      ? isDark ? '#c4b5fd' : '#7c3aed'
                      : isDark ? '#cbd5e1' : '#334155',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15 }}>{lang.flag}</span>
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
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            padding: 8,
            color: isDark ? '#fbbf24' : '#475569',
            background: 'none',
            border: 'none',
            borderRadius: 9999,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
          }}
        >
          {isDark ? (
            <Sun size={18} style={{ color: '#fbbf24' }} />
          ) : (
            <Moon size={18} style={{ color: '#475569' }} />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '4px 10px 4px 6px',
              borderRadius: 9999,
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.55)' : 'rgba(241, 245, 249, 0.65)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226, 232, 240, 0.8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Avatar with Online Dot */}
            <div style={{ position: 'relative' }}>
              {user?.face_photo && (
                <img
                  src={user.face_photo}
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: isDark ? '1px solid #475569' : '1px solid #cbd5e1',
                  }}
                />
              )}
              <div
                style={{
                  display: user?.face_photo ? 'none' : 'flex',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)',
                  color: isDark ? '#c4b5fd' : '#7c3aed',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                  border: isDark ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 9,
                  height: 9,
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  border: isDark ? '2px solid #0f172a' : '2px solid #ffffff',
                }}
              />
            </div>

            {/* Name & Job Title */}
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: isDark ? '#f8fafc' : '#0f172a',
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.eng_name || user?.name || 'Yasomi'}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: isDark ? '#94a3b8' : '#64748b',
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.job_title || 'Software Developer'}
              </div>
            </div>

            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </button>

          {isProfileOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                marginTop: 8,
                width: 200,
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 12,
                boxShadow: isDark ? '0 12px 30px -4px rgba(0, 0, 0, 0.6)' : '0 12px 30px -4px rgba(15, 23, 42, 0.12)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(226, 232, 240, 0.9)',
                padding: '6px 0',
                zIndex: 50,
                textAlign: 'left',
              }}
            >
              {/* Profile Card Header */}
              <div
                style={{
                  padding: '10px 14px',
                  borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f1f5f9',
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isDark ? '#f8fafc' : '#0f172a',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.eng_name || user?.name}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: isDark ? '#94a3b8' : '#64748b',
                    margin: '2px 0 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.emp_code ? `ID: ${user.emp_code}` : user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onOpenProfile();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 500,
                  border: 'none',
                  background: 'none',
                  color: isDark ? '#cbd5e1' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <User size={15} style={{ color: '#94a3b8' }} />
                <span>{t('nav.profile', 'Profile')}</span>
              </button>

              <div
                style={{
                  margin: '4px 0',
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f1f5f9',
                }}
              />

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 500,
                  border: 'none',
                  background: 'none',
                  color: isDark ? '#f87171' : '#dc2626',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <LogOut size={15} />
                <span>{t('nav.logout', 'Logout')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Settings Gear Dropdown */}
        <div style={{ position: 'relative' }} ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="Settings"
            style={{
              padding: 8,
              color: isDark ? '#94a3b8' : '#475569',
              background: 'none',
              border: 'none',
              borderRadius: 9999,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease, color 0.2s ease',
            }}
          >
            <Settings size={18} />
          </button>

          {isSettingsOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                marginTop: 8,
                width: 190,
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 12,
                boxShadow: isDark ? '0 12px 30px -4px rgba(0, 0, 0, 0.6)' : '0 12px 30px -4px rgba(15, 23, 42, 0.12)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(226, 232, 240, 0.9)',
                padding: '6px 0',
                zIndex: 50,
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  padding: '4px 14px',
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: isDark ? '#64748b' : '#94a3b8',
                }}
              >
                Administration
              </div>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  onOpenManagement('user');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 500,
                  border: 'none',
                  background: 'none',
                  color: isDark ? '#cbd5e1' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <Users size={15} style={{ color: '#94a3b8' }} />
                <span>{t('nav.userManagement', 'User Management')}</span>
              </button>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  onOpenManagement('role');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 500,
                  border: 'none',
                  background: 'none',
                  color: isDark ? '#cbd5e1' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <ShieldCheck size={15} style={{ color: '#94a3b8' }} />
                <span>{t('nav.roleManagement', 'Role Management')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
