import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ModuleCard({ item, onClick }) {
  const { t } = useTranslation();

  // Status mapping: 'F' = Completed (Green), 'D' = Developing (Orange), 'C' = Coming Soon (Gray)
  let status = 'F';
  if (item.status && ['F', 'D', 'C'].includes(item.status.toUpperCase())) {
    status = item.status.toUpperCase();
  } else if (item.version === '0') {
    status = 'C';
  } else if (item.version === '0.1' || item.version === '0.5') {
    status = 'D';
  }
  const isComingSoon = status === 'C';

  // Light-color card background and styling by status
  const statusTheme = {
    F: {
      card: 'bg-emerald-100/70 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 shadow-xs hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer',
      title: 'text-slate-850 dark:text-slate-100',
      desc: 'text-slate-600 dark:text-slate-400',
    },
    D: {
      card: 'bg-orange-100/70 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-950/60 border border-orange-300 dark:border-orange-800 shadow-xs hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1 cursor-pointer',
      title: 'text-slate-850 dark:text-slate-100',
      desc: 'text-slate-600 dark:text-slate-400',
    },
    C: {
      card: 'bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 grayscale opacity-60 cursor-not-allowed shadow-2xs',
      title: 'text-slate-600 dark:text-slate-300',
      desc: 'text-slate-500 dark:text-slate-400',
    },
  }[status];

  return (
    <div
      onClick={() => onClick(item)}
      className={`relative overflow-hidden group rounded-2xl transition-all duration-200 select-none
        flex flex-col items-center justify-between p-6 text-center
        w-56 sm:w-60 min-h-[225px] ${statusTheme.card}`}
    >
      {/* Sold Out Style Pattern for Coming Soon */}
      {isComingSoon && (
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none flex items-center justify-center">
          <div className="w-[145%] py-2 bg-slate-800/90 dark:bg-slate-900/95 text-white font-black text-xs uppercase tracking-[0.25em] text-center shadow-lg -rotate-25 border-y border-slate-400/50 backdrop-blur-xs select-none">
            {t('nav.comingSoon', 'Coming Soon')}
          </div>
        </div>
      )}

      {/* Bubble Notification Badge (e.g. New orders count) */}
      {item.badge && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce shadow-md">
            {item.badge}
          </span>
        </div>
      )}

      {/* 3D Module Image without thick border */}
      <div className="w-20 h-20 my-2 transition-transform duration-200 group-hover:scale-105 flex items-center justify-center">
        <img
          src={item.image}
          alt={item.title || ''}
          className="w-full h-full object-contain rounded-2xl drop-shadow-sm pointer-events-none"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Title & Description */}
      <div className="w-full mt-2">
        <h3 className={`text-[15px] font-bold leading-tight ${statusTheme.title}`}>
          {item.title}
        </h3>
        {item.description && (
          <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${statusTheme.desc}`}>
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}
