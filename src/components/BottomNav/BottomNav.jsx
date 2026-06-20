import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, Sparkles, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/',       icon: Home,           label: 'Home' },
  { to: '/menu',   icon: UtensilsCrossed,label: 'Menu' },
  { to: '/build',  icon: Sparkles,       label: 'Build' },
  { to: '/checkout', icon: ShoppingBag,  label: 'Cart' },
  { to: '/auth',   icon: User,           label: 'Me' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const isActive = pathname === to || (to === '/menu' && pathname.startsWith('/menu'));
        const showBadge = to === '/checkout' && totalItems > 0;
        return (
          <Link key={to} to={to} className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`} aria-label={label}>
            <div className="bottom-nav__icon-wrap">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {showBadge && <span className="bottom-nav__badge">{totalItems}</span>}
            </div>
            <span className="bottom-nav__label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
