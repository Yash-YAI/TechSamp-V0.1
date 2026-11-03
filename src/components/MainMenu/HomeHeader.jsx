import React from 'react';
import { Search, LogOut, ShieldCheck, User } from 'lucide-react';

export default function HomeHeader({ searchTerm, onSearchChange, user, onLogout }) {
  return (
    <div className="w-full max-w-8xl mx-auto mb-12">
      {/* Top Navbar */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100 uppercase">
              eco_development
            </h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Portal System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              {user.face_photo ? (
                <img src={user.face_photo} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-xs">
                  <User size={16} />
                </div>
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user.eng_name || user.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  ID: {user.emp_code || 'N/A'}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Search Header */}
      <div className="relative mt-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search for modules..."
          className="w-full pl-12 pr-6 py-3.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}

