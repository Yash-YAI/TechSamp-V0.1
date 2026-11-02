import React from 'react';
import ModulePageLayout from '../components/ModulePageLayout/ModulePageLayout';

export default function FabricConsumptionPage({ user, onLogout }) {
  return (
    <ModulePageLayout
      title="Fabric Consumption"
      description="Fabric usage estimates."
      icon="/assets/modules/fabric-consumption.jpg"
      user={user}
      onLogout={onLogout}
    />
  );
}

