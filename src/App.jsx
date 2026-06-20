import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage/HomePage';
import MenuPage from '@/pages/MenuPage/MenuPage';
import ProductDetailPage from '@/pages/ProductDetailPage/ProductDetailPage';
import CoffeeBuilderPage from '@/pages/CoffeeBuilderPage/CoffeeBuilderPage';
import LocationPage from '@/pages/LocationPage/LocationPage';
import CheckoutPage from '@/pages/CheckoutPage/CheckoutPage';
import AuthPage from '@/pages/AuthPage/AuthPage';
import PaymentPage from '@/pages/PaymentPage/PaymentPage';
import OrderConfirmPage from '@/pages/OrderConfirmPage/OrderConfirmPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import './App.css';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--color-dark)',
            color: '#fff',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: '#fff',
            },
          },
        }}
      />
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<ProductDetailPage />} />
          <Route path="/build" element={<CoffeeBuilderPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-confirm" element={<OrderConfirmPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
