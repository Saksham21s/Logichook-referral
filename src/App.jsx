import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import Profile from './pages/Profile';
import './assets/styles/main.scss';

const App = () => {
  return (
    <Router>
      <AppWithAuth />
    </Router>
  );
};

const AppWithAuth = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-container">
      {/* Navbar appears only when user is logged in and not on auth pages */}
      {currentUser && !['/', '/auth'].includes(location.pathname) && <Navbar user={currentUser} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={currentUser ? <Navigate to="/dashboard" replace /> : <Landing />} />
          
          {/* If user is logged in, redirect to dashboard from /auth */}
          <Route path="/auth" element={currentUser ? <Navigate to="/dashboard" replace /> : <Auth />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/leaderboard" element={
            <RequireAuth>
              <Leaderboard />
            </RequireAuth>
          } />
          <Route path="/rewards" element={
            <RequireAuth>
              <Rewards />
            </RequireAuth>
          } />
          <Route path="/analytics" element={
            <RequireAuth>
              <Analytics />
            </RequireAuth>
          } />
          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

// RequireAuth component that protects routes
const RequireAuth = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default App;
