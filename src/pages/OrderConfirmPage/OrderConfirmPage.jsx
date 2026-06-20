import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Coffee, ArrowRight, ShieldCheck, MapPin, ClipboardList, HelpCircle } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice } from '@/utils/coffeeBuilder';
import toast from 'react-hot-toast';
import './OrderConfirmPage.css';

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const {
    orderId,
    token,
    status,
    selectedLocation,
    orderType,
    tableNumber,
    resetOrder,
  } = useOrderStore();

  const [localStatus, setLocalStatus] = useState(status || 'preparing');

  // If order details are missing (e.g. page refreshed without placing order), redirect to home
  useEffect(() => {
    if (!token && !orderId) {
      navigate('/menu');
    }
  }, [token, orderId, navigate]);

  // Simulate order completion steps
  useEffect(() => {
    if (!token) return;

    // After 10 seconds: change preparing to ready
    const timerReady = setTimeout(() => {
      setLocalStatus('ready');
      toast.success('Your order is ready at the counter! ☕');
    }, 10000);

    // After 25 seconds: change ready to picked up
    const timerDone = setTimeout(() => {
      setLocalStatus('done');
      toast('Thank you for choosing Chilld Coffee! ❤️', { icon: '☕' });
    }, 25000);

    return () => {
      clearTimeout(timerReady);
      clearTimeout(timerDone);
    };
  }, [token]);

  const handleFinish = () => {
    resetOrder();
    navigate('/menu');
  };

  const getStatusText = () => {
    if (localStatus === 'preparing') return 'Preparing your brew... ☕';
    if (localStatus === 'ready') return 'Ready at the counter! 🎉';
    return 'Collected & Enjoyed! ❤️';
  };

  return (
    <div className="order-confirm-page page-wrapper">
      <div className="confetti-container" aria-hidden="true">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              '--delay': `${(i * 0.15).toFixed(2)}s`,
              '--left': `${Math.floor(Math.random() * 100)}%`,
              '--color': i % 3 === 0 ? 'var(--color-primary)' : i % 3 === 1 ? 'var(--color-accent)' : '#fff',
              '--rotation': `${Math.floor(Math.random() * 360)}deg`,
            }}
          />
        ))}
      </div>

      <div className="container confirm-container">
        <motion.div
          className="confirm-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header check icon */}
          <div className="confirm-icon-wrap">
            <CheckCircle2 size={54} className="confirm-check-icon" />
          </div>

          <span className="confirm-eyebrow">Order Placed Successfully</span>
          <h1 className="confirm-title">Thank you for your order!</h1>
          <p className="confirm-order-id">Order ID: <strong>{orderId}</strong></p>

          {/* Token Box */}
          <div className="token-display-box">
            <span className="token-lbl">Your Token</span>
            <div className="token-number">{token}</div>
            <p className="token-desc">
              Show this token number at the pickup counter or table.
            </p>
          </div>

          {/* Live Order Status Tracking */}
          <div className="order-status-tracker">
            <h3 className="status-indicator-title">{getStatusText()}</h3>

            <div className="progress-bar-track">
              <div
                className={`progress-bar-fill ${
                  localStatus === 'preparing'
                    ? 'progress-bar-fill--preparing'
                    : localStatus === 'ready'
                    ? 'progress-bar-fill--ready'
                    : 'progress-bar-fill--done'
                }`}
              />
            </div>

            <div className="status-steps">
              <div className={`status-step ${localStatus !== 'idle' ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <span>Placed</span>
              </div>
              <div className={`status-step ${localStatus !== 'idle' ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <span>Preparing</span>
              </div>
              <div className={`status-step ${localStatus === 'ready' || localStatus === 'done' ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span>Ready</span>
              </div>
              <div className={`status-step ${localStatus === 'done' ? 'active' : ''}`}>
                <div className="step-circle">4</div>
                <span>Enjoyed</span>
              </div>
            </div>
          </div>

          {/* Location Summary card */}
          <div className="confirm-location-card">
            <MapPin size={16} />
            <div className="loc-card-details">
              <h4>{selectedLocation?.shortName || 'Cafe Location'}</h4>
              <p>{orderType === 'dine-in' ? `Dine In — Table #${tableNumber || 'Pending'}` : 'Takeaway Counter'}</p>
            </div>
          </div>

          <div className="confirm-actions">
            <button className="btn btn-primary finish-btn" onClick={handleFinish}>
              Back to Menu <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
