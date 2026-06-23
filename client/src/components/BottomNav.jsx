import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/assignments', icon: '📋', label: 'Tasks' },
  { to: '/profile', icon: '👤', label: 'Profile' },
  { to: '/notes', icon: '📷', label: 'Notes' }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-tab${isActive ? ' nav-tab--active' : ''}`}
        >
          <span className="nav-tab__icon" aria-hidden="true">{icon}</span>
          <span className="nav-tab__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
