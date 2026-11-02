import React from 'react';
import { useLocation } from 'react-router-dom';
import ModulePageLayout from '../components/ModulePageLayout/ModulePageLayout';
import { modulesConfig } from '../config/modulesConfig';

export default function GenericModulePage({ user, onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Find module config by path
  const allItems = modulesConfig.flatMap((section) => section.items);
  const moduleItem = allItems.find(
    (item) => item.path === currentPath || item.path.split('?')[0] === currentPath
  );

  const title = moduleItem?.titleKey?.replace(/^[^.]+\./, '') || 'Module';
  const description = moduleItem?.description || 'Feature module management.';
  const icon = moduleItem?.image || '/assets/Home/Upload_Order_details.png';

  return (
    <ModulePageLayout
      title={title}
      description={description}
      icon={icon}
      user={user}
      onLogout={onLogout}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xs text-center flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          <img src={icon} alt={title} className="w-10 h-10 object-contain" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {title} Workspace
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          {description}
        </p>
      </div>
    </ModulePageLayout>
  );
}

