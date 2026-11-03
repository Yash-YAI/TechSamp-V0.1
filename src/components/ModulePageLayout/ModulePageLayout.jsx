import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../Navbar/HomeNavbar';

export default function ModulePageLayout({
  title,
  description,
  icon,
  user,
  onLogout,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col">
      <HomeNavbar user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        {/* Breadcrumb and Back */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={14} />
            Back to Home
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
        </div>

        {/* Module Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-t-4 border-t-teal-500 p-6 mb-8 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center p-3 shadow-inner">
              <img src={icon} alt={title} className="w-10 h-10 object-contain dark:invert" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {description}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={14} />
            <span>Active Module</span>
          </div>
        </div>

        {/* Module Workspace Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xs text-center min-h-[360px] flex flex-col items-center justify-center">
          {children || (
            <div className="max-w-md mx-auto space-y-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {title} Workspace
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This module has been registered and connected to the navigation flow. Custom operations, forms, and database actions can now be built directly here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

