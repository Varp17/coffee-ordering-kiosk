import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu as MenuIcon, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import Logo from '@/components/Logo/Logo';
import './Navbar.css';

const SHOW_PROMO = false; // Set to true when we have a promo

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const { isLoggedIn, phone } = useAuthStore();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Hide only when scrolling down past the header height and mobile menu is closed
      const headerThreshold = SHOW_PROMO ? 110 : 70;
      if (currentScrollY > lastScrollY && currentScrollY > headerThreshold && !mobileOpen) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Products' },
    { to: '/recipe-details/georgesso', label: 'Recipes' },
    { to: '/#hard-part', label: 'About Us' },
    { to: '/location', label: 'Contact' },
  ];

  return (
    <>
      <header className={`header-wrapper ${visible ? '' : 'header-wrapper--hidden'}`}>
        {/* Top Announcement Bar
        <Link to="/menu" className="top-bar">
          <span>Summer Sale 30% OFF is Now Live &rarr;</span>
        </Link>
        */}

        <motion.nav
          className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="navbar__inner container">
            {/* Logo */}
            <Link to="/" className="navbar__logo" aria-label="Chilld Coffee Home">
              <Logo height="42px" width="auto" color="currentColor" />
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
                  <User size={22} />
                  <span className="navbar__username">Arya Kagathara</span>
                  <ChevronDown size={16} className="navbar__chevron" />
                </Link>
              ) : (
                <Link to="/auth" className="navbar__user-profile-new" aria-label="Account">
                  <User size={22} />
                  <span className="navbar__username">Login</span>
                </Link>
              )}

              <button
                className="navbar__cart-btn-new"
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingBag size={22} />
                <span className="navbar__cart-count">{totalItems}</span>
              </button>

              {/* Build your brew capsule call to action */}
              <Link to="/build" className="navbar__build-pill">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <path d="M6 8h12M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
                  <path d="M7 8l1.2 11c.1.9.9 1.6 1.8 1.6h4c.9 0 1.7-.7 1.8-1.6L17 8" />
                  <path d="M8.5 13h7" />
                </svg>
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
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
