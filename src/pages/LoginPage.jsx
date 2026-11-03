import AnimatedMerchBackground from '../components/Login/AnimatedMerchBackground';
import LoginHeader from '../components/Login/LoginHeader';
import LoginForm from '../components/Login/LoginForm';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage({ onLoginSuccess }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(ellipse at 50% 10%, #0f172a 0%, #030712 100%)'
          : 'radial-gradient(ellipse at 50% 10%, #f8fafc 0%, #e2e8f0 100%)',
        transition: 'background 0.3s ease',
      }}
    >
      {/* Animated Merchandising Background with Flowing Stitches & Floating Data Nodes */}
      <AnimatedMerchBackground />

      <main
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 480,
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.7)',
            borderRadius: 20,
            padding: '34px 30px',
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.06) inset'
              : '0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.6) inset, 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            boxSizing: 'border-box',
            textAlign: 'left',
          }}
        >
          {/* Top Decorative Stitch Bar */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 35%, #ec4899 70%, #34d399 100%)',
              opacity: 0.9,
            }}
          />

          {/* Tailor's Pattern Notch / Stitch Accents */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              width: 10,
              height: 10,
              borderTop: isDark ? '2px solid #a78bfa' : '2px solid #8b5cf6',
              borderLeft: isDark ? '2px solid #a78bfa' : '2px solid #8b5cf6',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 10,
              height: 10,
              borderTop: isDark ? '2px solid #a78bfa' : '2px solid #8b5cf6',
              borderRight: isDark ? '2px solid #a78bfa' : '2px solid #8b5cf6',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              width: 10,
              height: 10,
              borderBottom: isDark ? '2px solid #a78bfa' : '2px solid #8b5cf6',
              borderLeft: isDark ? '2px solid #a78bfa' : '2px solid #8b5cf6',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              width: 10,
              height: 10,
              borderBottom: isDark ? '2px solid #a78bfa' : '2px solid #8b5cf6',
              borderRight: isDark ? '2px solid #a78bfa' : '2px solid #8b5cf6',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />

          <LoginHeader />
          <LoginForm onLoginSuccess={onLoginSuccess} />

          <div
            style={{
              marginTop: 22,
              textAlign: 'center',
              paddingTop: 14,
              borderTop: isDark ? '1px dashed rgba(51, 65, 85, 0.6)' : '1px dashed rgba(203, 213, 225, 0.6)',
              fontSize: 11,
              color: isDark ? '#64748b' : '#94a3b8',
              letterSpacing: '0.3px',
            }}
          >
            <span>TexLink Apparel & Merchandising Intelligence</span>
          </div>
        </div>
      </main>
    </div>
  );
}
