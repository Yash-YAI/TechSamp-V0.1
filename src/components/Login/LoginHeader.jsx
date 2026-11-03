import { Shirt, Scissors, Layers, Timer, Tag } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function LoginHeader() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const modules = [
    { label: 'Marker Order', icon: Scissors },
    { label: 'Marker Ratio', icon: Layers },
    { label: 'Fabric & Thread', icon: Tag },
    { label: 'GSD / SAM', icon: Timer },
    { label: 'Sample Room', icon: Shirt },
  ];

  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      {/* Merchandising Suite Brand Badge */}
      {/* <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 14px',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            backgroundColor: isDark ? 'rgba(167, 139, 250, 0.15)' : 'rgba(139, 92, 246, 0.12)',
            color: isDark ? '#c4b5fd' : '#7c3aed',
            border: isDark ? '1px solid rgba(167, 139, 250, 0.35)' : '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 9999,
          }}
        >
          <Shirt size={13} style={{ color: 'inherit' }} />
          Tech & Samp Merchandising Portal
        </span>
      </div> */}

      <h1
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: isDark ? '#f8fafc' : '#0f172a',
          margin: '0 0 6px',
          letterSpacing: '-0.3px',
        }}
      >
        Account Login
      </h1>

      {/* <p
        style={{
          fontSize: 13.5,
          color: isDark ? '#94a3b8' : '#64748b',
          margin: '0 0 16px',
        }}
      >
        Sign in with your <strong>Name</strong> or <strong>Employee Code</strong>
      </p> */}

      {/* Apparel Modules Micro Ribbon */}
      {/* <div
        title="Integrated Merchandising Systems"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 6,
          paddingTop: 4,
        }}
      >
        {modules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 8px',
                borderRadius: 6,
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.85)',
                color: isDark ? '#cbd5e1' : '#475569',
                border: isDark ? '1px solid rgba(51, 65, 85, 0.8)' : '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <Icon size={11} style={{ opacity: 0.8 }} />
              {m.label}
            </span>
          );
        })}
      </div> */}
    </div>
  );
}
