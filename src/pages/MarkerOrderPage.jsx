import React from 'react';
import ModulePageLayout from '../components/ModulePageLayout/ModulePageLayout';

export default function MarkerOrderPage({ user, onLogout }) {
  return (
    <ModulePageLayout
      title="Marker Order"
      description="Create and manage marker orders."
      icon="/assets/modules/marker-order.jpg"
      user={user}
      onLogout={onLogout}
    />
  );
}

