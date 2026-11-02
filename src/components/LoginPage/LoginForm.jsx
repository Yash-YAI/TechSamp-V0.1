import { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { loginUser } from '../../api/auth';

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    <form onSubmit={handleSubmit} className="login-form">
      {errorMessage && (
        <div className="login-error">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="username">
          Username or Employee Code
        </label>
        <div className="input-wrapper">
          <User className="input-icon" size={18} />
          <input
            id="username"
            type="text"
            className="form-input"
            placeholder="e.g. 00009520 or Yasomi"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <div className="input-wrapper">
          <Lock className="input-icon" size={18} />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? (
          'Authenticating...'
        ) : (
          <>
            <LogIn size={18} /> Sign In
          </>
        )}
      </button>
    </form>
  );
}

