import { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { loginUser } from '../../api/auth';
import { useTheme } from '../../context/ThemeContext';

export default function LoginForm({ onLoginSuccess }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username (Name/Emp Code) and password.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser(username.trim(), password);
      if (data.success) {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Unable to connect to the authentication server. Please verify backend is running.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: isDark ? 'rgba(185, 28, 28, 0.15)' : '#fef2f2',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
            color: isDark ? '#f87171' : '#b91c1c',
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 12.5,
            marginBottom: 18,
            lineHeight: 1.4,
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Username / Emp Code Field */}
      <div style={{ marginBottom: 18 }}>
        <label
          htmlFor="username"
          style={{
            display: 'block',
            fontSize: 12.5,
            fontWeight: 600,
            color: isDark ? '#e2e8f0' : '#334155',
            marginBottom: 6,
          }}
        >
          Username
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <User
            size={18}
            style={{
              position: 'absolute',
              left: 14,
              color: usernameFocused ? (isDark ? '#a78bfa' : '#7c3aed') : '#94a3b8',
              pointerEvents: 'none',
              transition: 'color 0.2s ease',
            }}
          />
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setUsernameFocused(true)}
            onBlur={() => setUsernameFocused(false)}
            autoComplete="username"
            disabled={isLoading}
            required
            style={{
              width: '100%',
              padding: '11px 14px 11px 42px',
              border: usernameFocused
                ? isDark ? '1px solid #a78bfa' : '1px solid #7c3aed'
                : isDark ? '1px solid #334155' : '1px solid #cbd5e1',
              borderRadius: 10,
              fontSize: 14,
              color: isDark ? '#f1f5f9' : '#0f172a',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              boxShadow: usernameFocused
                ? isDark ? '0 0 0 3px rgba(167, 139, 250, 0.2)' : '0 0 0 3px rgba(124, 58, 237, 0.15)'
                : 'none',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Password Field */}
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            fontSize: 12.5,
            fontWeight: 600,
            color: isDark ? '#e2e8f0' : '#334155',
            marginBottom: 6,
          }}
        >
          Password
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Lock
            size={18}
            style={{
              position: 'absolute',
              left: 14,
              color: passwordFocused ? (isDark ? '#a78bfa' : '#7c3aed') : '#94a3b8',
              pointerEvents: 'none',
              transition: 'color 0.2s ease',
            }}
          />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            autoComplete="current-password"
            disabled={isLoading}
            required
            style={{
              width: '100%',
              padding: '11px 40px 11px 42px',
              border: passwordFocused
                ? isDark ? '1px solid #a78bfa' : '1px solid #7c3aed'
                : isDark ? '1px solid #334155' : '1px solid #cbd5e1',
              borderRadius: 10,
              fontSize: 14,
              color: isDark ? '#f1f5f9' : '#0f172a',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              boxShadow: passwordFocused
                ? isDark ? '0 0 0 3px rgba(167, 139, 250, 0.2)' : '0 0 0 3px rgba(124, 58, 237, 0.15)'
                : 'none',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: 12,
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: '100%',
          marginTop: 6,
          padding: 12,
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: 10,
          fontSize: 14.5,
          fontWeight: 600,
          letterSpacing: '0.2px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          boxShadow: btnHovered && !isLoading
            ? '0 6px 20px rgba(124, 58, 237, 0.45)'
            : '0 4px 14px rgba(124, 58, 237, 0.35)',
          transform: btnHovered && !isLoading ? 'translateY(-1px)' : 'translateY(0)',
          filter: btnHovered && !isLoading ? 'brightness(1.05)' : 'none',
          opacity: isLoading ? 0.65 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        {isLoading ? (
          'Authenticating...'
        ) : (
          <>
            <LogIn size={18} />
            <span>Sign In to Dashboard</span>
          </>
        )}
      </button>
    </form>
  );
}
