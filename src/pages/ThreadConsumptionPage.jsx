import React from 'react';
import ModulePageLayout from '../components/ModulePageLayout/ModulePageLayout';

export default function ThreadConsumptionPage({ user, onLogout }) {
  return (
    <ModulePageLayout
      title="Thread Consumption"
      description="Thread usage estimates."
      icon="/assets/modules/thread-consumption.jpg"
      user={user}
      onLogout={onLogout}
    />
  );
}

