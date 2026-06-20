import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import BottomNav from '@/components/BottomNav/BottomNav';

export default function MainLayout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!isHome && <Footer />}
      {!isHome && <BottomNav />}
    </>
  );
}
