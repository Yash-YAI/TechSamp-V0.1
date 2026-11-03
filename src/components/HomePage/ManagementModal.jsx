import React from 'react';
import { X, Users, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ManagementModal({ type, isOpen, onClose }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const isUserMgmt = type === 'user';
  const title = isUserMgmt ? t('nav.userManagement', 'User Management') : t('nav.roleManagement', 'Role Management');
  const Icon = isUserMgmt ? Users : ShieldCheck;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-xs text-slate-400">
              {isUserMgmt ? 'Manage system accounts and access status' : 'Configure role permissions and module assignments'}
            </p>
          </div>
        </div>

        <div className="py-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              <span>Database Source</span>
              <span className="text-emerald-500 font-semibold">Connected: eco_development</span>
            </div>
            <p className="text-xs text-slate-400">
              {isUserMgmt
                ? 'User accounts are synced directly from the eco_development MongoDB users collection.'
                : 'Module role gates evaluate permissions against user roles and job titles.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {title} interface is active and linked to the authentication controller.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
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

