import { Link, useLocation } from 'react-router-dom';
import { Home, Coffee, Store, Briefcase, BookOpen } from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/',        icon: Home,      label: 'Home' },
  { to: '/menu',    icon: Coffee,    label: 'Products' },
  { to: '/store',   icon: Store,     label: 'Store' },
  { to: '/b2b',     icon: Briefcase, label: 'B2B' },
  { to: '/recipes', icon: BookOpen,  label: 'Recipes' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="bottom-nav-wrapper">
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to || (to === '/menu' && pathname.startsWith('/menu'));
          return (
            <Link key={to} to={to} className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`} aria-label={label}>
              <div className="bottom-nav__icon-wrap">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="bottom-nav__label">{label}</span>
            </Link>
          );
        })}
      </nav>
      <Link to="/build" className="bottom-nav__action-btn" aria-label="Build your drink">
        <div className="action-btn__icon-wrap">
          <Coffee size={24} strokeWidth={2.3} />
        </div>
      </Link>
    </div>
  );
}
