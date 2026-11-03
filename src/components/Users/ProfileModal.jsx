import React from 'react';
import { X, User, Briefcase, Building, Shield, Mail, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProfileModal({ user, isOpen, onClose }) {
  const { t } = useTranslation();
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            {user.face_photo ? (
              <img
                src={user.face_photo}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl border-2 border-purple-500">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {user.eng_name || user.name}
            </h3>
            {user.kh_name && (
              <p className="text-xs text-slate-400 font-medium">{user.kh_name}</p>
            )}
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              {user.job_title || 'Software Developer'}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 py-5 text-left">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <Hash size={16} className="text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Employee ID</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user.emp_code || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <Building size={16} className="text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Department</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user.dept_name || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <Briefcase size={16} className="text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Section</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user.sect_name || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <Mail size={16} className="text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Email</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{user.email || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Roles list */}
        {user.roles && user.roles.length > 0 && (
          <div className="text-left pt-2 pb-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield size={14} /> Assigned Roles
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.roles.map((r, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                >
                  {typeof r === 'string' ? r : r.name || JSON.stringify(r)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

