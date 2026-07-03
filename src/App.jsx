import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

/* Scroll to top of the page on route transition */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import MainLayout from '@/layouts/MainLayout';
import WelcomePage from '@/pages/WelcomePage/WelcomePage';
import DeviceLayoutSelector from '@/components/DeviceLayoutSelector';
import MenuPage from '@/pages/MenuPage/MenuPage';
import ProductDetailPage from '@/pages/ProductDetailPage/ProductDetailPage';
import CoffeeBuilderPage from '@/pages/CoffeeBuilderPage/CoffeeBuilderPage';
import LocationPage from '@/pages/LocationPage/LocationPage';
import CheckoutPage from '@/pages/CheckoutPage/CheckoutPage';
import AuthPage from '@/pages/AuthPage/AuthPage';
import PaymentPage from '@/pages/PaymentPage/PaymentPage';
import OrderConfirmPage from '@/pages/OrderConfirmPage/OrderConfirmPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import CreateRecipePage from '@/pages/CreateRecipePage/create-recipe-page';
import RecipeDetailsPage from '@/pages/RecipeDetailsPage/recipe-details-page';
import RecipesPage from '@/pages/RecipesPage/RecipesPage';
import ContactPage from '@/pages/ContactPage/ContactPage';
import StorePage from '@/pages/StorePage/StorePage';
import B2BPage from '@/pages/B2BPage/B2BPage';
import { useUserStore } from '@/store/useUserStore';
import './App.css';

/* Guard: redirect to /welcome if user hasn't completed onboarding */
function RequireWelcome({ children }) {
  const hasCompleted = useUserStore((s) => s.hasCompletedWelcome);
  if (!hasCompleted) return <Navigate to="/welcome" replace />;
  return children;
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
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

      <Routes>
        {/* Welcome page — no layout chrome */}
        <Route path="/welcome" element={<WelcomePage />} />

        {/* All main routes wrapped in layout + welcome guard */}
        <Route element={
          <RequireWelcome>
            <MainLayout />
          </RequireWelcome>
        }>
          <Route path="/" element={<DeviceLayoutSelector />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<ProductDetailPage />} />
          <Route path="/build" element={<CoffeeBuilderPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-confirm" element={<OrderConfirmPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-recipe" element={<CreateRecipePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipe-details/:id" element={<RecipeDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/b2b" element={<B2BPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
