import LoginHeader from '../components/LoginPage/LoginHeader';
import LoginForm from '../components/LoginPage/LoginForm';
import '../components/LoginPage/Login.css';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <LoginHeader />
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}

