import { useLectures } from '../hooks/useLectures.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useApp } from '../context/AppContext.jsx';
import LectureCard from '../components/LectureCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export default function Dashboard() {
  const { lectures, loading, error } = useLectures();
  const [profile] = useLocalStorage('sc_profile', null);
  const { state } = useApp();

  const today = DAYS[new Date().getDay()];
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const now = new Date();
  const safeAssignments = Array.isArray(state.assignments) ? state.assignments : [];
  const pendingCount = safeAssignments.filter(
    a => a.status === 'pending' && new Date(a.dueDate) >= now
  ).length;
  const overdueCount = safeAssignments.filter(
    a => a.status === 'pending' && new Date(a.dueDate) < now
  ).length;

  return (
    <div className="page">
      <header className="page-header dashboard-header">
        <div className="dashboard-header__text">
          <p className="page-header__greeting">{getGreeting()}</p>
          <h1 className="page-header__title">{profile?.studentName || 'Student'}</h1>
          <p className="page-header__date">{today}, {dateStr}</p>
        </div>
        <div className="page-header__avatar" aria-hidden="true">
          {(profile?.studentName?.[0] || 'S').toUpperCase()}
        </div>
      </header>

      <div className="stats-row" aria-label="Quick summary">
        <div className="stat-card">
          <span className="stat-card__value">{lectures.length}</span>
          <span className="stat-card__label">Classes Today</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{pendingCount}</span>
          <span className="stat-card__label">Pending</span>
        </div>
        <div className={`stat-card${overdueCount > 0 ? ' stat-card--danger' : ''}`}>
          <span className="stat-card__value">{overdueCount}</span>
          <span className="stat-card__label">Overdue</span>
        </div>
      </div>

      <section className="section">
        <h2 className="section__title">Today's Schedule</h2>

        {loading && <Loader text="Loading lectures…" />}
        {error && !loading && (
          <ErrorBanner message={`Could not load lectures: ${error}`} />
        )}
        {!loading && !error && lectures.length === 0 && (
          <div className="empty-state">
            <p className="empty-state__icon">🎉</p>
            <p className="empty-state__text">No lectures today!</p>
            <p className="empty-state__sub">Enjoy your free day.</p>
          </div>
        )}
        {lectures.length > 0 && (
          <div className="lecture-list">
            {lectures.map(l => (
              <LectureCard key={l._id} lecture={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
