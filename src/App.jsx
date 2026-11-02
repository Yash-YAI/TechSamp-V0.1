import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MarkerOrderPage from './pages/MarkerOrderPage';
import MarkerRatioPage from './pages/MarkerRatioPage';
import FabricConsumptionPage from './pages/FabricConsumptionPage';
import ThreadConsumptionPage from './pages/ThreadConsumptionPage';
import GsdSamPage from './pages/GsdSamPage';
import SamplePage from './pages/SamplePage';
import GenericModulePage from './pages/GenericModulePage';
import { getStoredUser, logoutUser, getCurrentUser } from './api/auth';
import './App.css';

function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Validate active session on initial app load
  useEffect(() => {
    const verifySession = async () => {
      const stored = getStoredUser();
      const token = localStorage.getItem('token');

      if (token && stored) {
        try {
          const res = await getCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        } catch {
          // Token expired or invalid
          logoutUser();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setCheckingAuth(false);
    };

    verifySession();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="app-loader">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
        {/* Authentication */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Home Dashboard */}
        <Route
          path="/home"
          element={
            user ? (
              <HomePage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Main Feature Pages */}
        <Route
          path="/marker-order"
          element={
            user ? (
              <MarkerOrderPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/marker-ratio"
          element={
            user ? (
              <MarkerRatioPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/fabric-consumption"
          element={
            user ? (
              <FabricConsumptionPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/thread-consumption"
          element={
            user ? (
              <ThreadConsumptionPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/gsd-sam"
          element={
            user ? (
              <GsdSamPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/sample"
          element={
            user ? (
              <SamplePage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Dynamic Registered Modules */}
        {[
          '/excel-thread-consumption',
          '/mesurement_spec',
          '/upload-process-sheet',
          '/production-gallery',
          '/data-center',
          '/document-translation',
          '/color-bank',
          '/production-Sheet',
          '/ai-translation-service',
          '/system-translator',
          '/terminology-extraction',
          '/glossary-review',
          '/document-translate',
        ].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              user ? (
                <GenericModulePage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        ))}

        {/* Default redirect: If authenticated go to /home, else /login */}
        <Route
          path="*"
          element={<Navigate to={user ? '/home' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
}

export default App;
