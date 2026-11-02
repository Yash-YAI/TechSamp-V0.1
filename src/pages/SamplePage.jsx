import React from 'react';
import ModulePageLayout from '../components/ModulePageLayout/ModulePageLayout';

export default function SamplePage({ user, onLogout }) {
  return (
    <ModulePageLayout
      title="Sample"
      description="Sample development and approvals."
      icon="/assets/modules/sample.jpg"
      user={user}
      onLogout={onLogout}
    />
  );
}

