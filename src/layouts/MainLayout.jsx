import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import BottomNav from '@/components/BottomNav/BottomNav';

export default function MainLayout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className="main-layout">
      <Navbar />
      <main>{children || <Outlet />}</main>
      {!isHome && <Footer />}
      {!isHome && <BottomNav />}
    </div>
  );
}
