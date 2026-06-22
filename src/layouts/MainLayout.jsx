import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import BottomNav from '@/components/BottomNav/BottomNav';

export default function MainLayout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return (
    <div className="main-layout">
      <Navbar />
      <main>{children || <Outlet />}</main>
      {!isHome && <Footer />}
      {!isHome && <BottomNav />}
    </div>
  );
}
