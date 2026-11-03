import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import BrandLogo from '../Common/BrandLogo';

export default function LoginHeader() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      {/* Official T & S Brand Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <BrandLogo
          size={56}
          showText={true}
          layout="vertical"
          subtitle="Tech & Samp • Apparel Intelligence"
        />
      </div>

      <h1
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: isDark ? '#f8fafc' : '#0f172a',
          margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}
      >
        Account Login
      </h1>

      <p
        style={{
          fontSize: 12.5,
          color: isDark ? '#94a3b8' : '#64748b',
          margin: 0,
        }}
      >
        Sign in with your credentials to access merchandising systems
      </p>
    </div>
  );
}
