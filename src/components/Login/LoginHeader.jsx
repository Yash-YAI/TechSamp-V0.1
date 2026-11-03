import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import BrandLogo from '../Common/BrandLogo';

export default function LoginHeader() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      {/* Official T & S Brand Logo */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BrandLogo
          size={56}
          showText={true}
          layout="vertical"
        />
      </div>
    </div>
  );
}
