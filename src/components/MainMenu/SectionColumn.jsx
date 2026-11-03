import React from 'react';
import ModuleCard from './ModuleCard';

export default function SectionColumn({ section, onItemClick }) {
  return (
    <div className="w-full flex flex-col items-start">
      {/* Section Header */}
      {section.title && (
        <div className="w-full border-b border-slate-200 dark:border-slate-800 mb-6 pb-2 text-left">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {section.title}
          </h2>
        </div>
      )}

      {/* Full-width cards container */}
      <div className="w-full flex flex-wrap gap-6 justify-start">
        {section.items.map((item, index) => (
          <ModuleCard key={item.path || index} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}
