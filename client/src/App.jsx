import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import BottomNav from './components/BottomNav.jsx';
import InstallBanner from './components/InstallBanner.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Assignments from './pages/Assignments.jsx';
import Profile from './pages/Profile.jsx';
import Notes from './pages/Notes.jsx';

export default function App() {
  const { state } = useApp();

  return (
    <div className="app-shell">
      {!state.isOnline && (
        <div className="offline-banner" role="alert">
          You are offline — showing cached data
        </div>
      )}
      <InstallBanner />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
