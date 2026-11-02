import { ShieldCheck } from 'lucide-react';

export default function LoginHeader() {
  return (
    <div className="login-header">
      <span className="login-badge">
        <ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
        eco_development Portal
      </span>
      <h1 className="login-title">Account Login</h1>
      <p className="login-subtitle">
        Sign in with your <strong>Name</strong> or <strong>Employee Code</strong>
      </p>
    </div>
  );
}

