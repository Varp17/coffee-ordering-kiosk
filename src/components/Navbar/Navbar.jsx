import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu as MenuIcon, X, Coffee, Sparkles, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const { isLoggedIn, phone } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/menu', label: 'Products' },
    { to: '/build', label: 'Recipes' },
    { to: '/location', label: 'About Us' },
    { to: '/location', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="top-bar">
        <div className="container top-bar__inner">
          <span>Summer Sale 30% OFF is Now Live</span>
          <Link to="/menu" className="top-bar__link">
            Shop Now <span className="arrow">→</span>
          </Link>
        </div>
      </div>

      <motion.nav
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="navbar__inner container">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span>Chilld,</span>
          </Link>

          {/* Desktop links */}
          <ul className="navbar__links">
            {navLinks.map(({ to, label }) => (
              <li key={label + to}>
                <Link
                  to={to}
                  className={`navbar__link ${location.pathname === to ? 'navbar__link--active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="navbar__actions">
            {isLoggedIn ? (
              <Link to="/profile" className="navbar__user-profile-new">
                <User size={18} />
                <span className="navbar__username">Arya Kagathara</span>
                <ChevronDown size={14} className="navbar__chevron" />
              </Link>
            ) : (
              <Link to="/auth" className="navbar__user-profile-new" aria-label="Account">
                <User size={18} />
                <span className="navbar__username">Login</span>
              </Link>
            )}

            <button
              className="navbar__cart-btn-new"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              <span className="navbar__cart-count">{totalItems}</span>
            </button>

            {/* Build your brew capsule call to action */}
            <Link to="/build" className="navbar__build-pill">
              <Coffee size={16} />
              <span>Create Your Drink</span>
            </Link>

            {/* Hamburger (mobile) */}
            <button
              className="navbar__hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="navbar__mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`navbar__mobile-link ${location.pathname === to ? 'active' : ''}`}
                >
                  {label}
                </Link>
              ))}
              {isLoggedIn ? (
                <Link to="/profile" className="navbar__mobile-link">
                  Arya Kagathara (My Account)
                </Link>
              ) : (
                <Link to="/auth" className="navbar__mobile-link">
                  Login
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
