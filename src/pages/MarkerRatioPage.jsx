import React from 'react';
import ModulePageLayout from '../components/ModulePageLayout/ModulePageLayout';

export default function MarkerRatioPage({ user, onLogout }) {
  return (
    <ModulePageLayout
      title="Marker Ratio"
      description="Marker ratio planning."
      icon="/assets/modules/marker-ratio.jpg"
      user={user}
      onLogout={onLogout}
    />
  );
}

