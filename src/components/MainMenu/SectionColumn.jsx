import React from 'react';
import ModuleCard from './ModuleCard';

export default function SectionColumn({ section, onItemClick }) {
  return (
    <div className="w-full flex flex-col items-start">
      {/* Full-width cards container without category header */}
      <div className="w-full flex flex-wrap gap-6 justify-start">
        {section.items.map((item, index) => (
          <ModuleCard key={item.path || index} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}
