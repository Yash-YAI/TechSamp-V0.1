import React from 'react';
import ModulePageLayout from '../components/ModulePageLayout/ModulePageLayout';

export default function GsdSamPage({ user, onLogout }) {
  return (
    <ModulePageLayout
      title="GSD / SAM"
      description="General sewing data / standard allowed minutes."
      icon="/assets/modules/gsd-sam.jpg"
      user={user}
      onLogout={onLogout}
    />
  );
}

