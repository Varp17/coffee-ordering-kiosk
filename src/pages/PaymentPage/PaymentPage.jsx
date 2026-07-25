import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2, QrCode, Shield, Wallet } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { loadRazorpayCheckout } from '@/services/razorpay';
import { formatPrice } from '@/utils/coffeeBuilder';
import toast from 'react-hot-toast';
import './PaymentPage.css';

const PAYMENT_METHODS = [
  { label: 'UPI & QR', icon: QrCode },
  { label: 'Credit / Debit Cards', icon: CreditCard },
  { label: 'Net Banking & Wallets', icon: Wallet },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { selectedLocation, orderType, createPaymentOrder, completePayment } = useOrderStore();
  const { phone, userName } = useAuthStore();
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = getTotalPrice();
  const tax = Math.round(subtotal * 0.05);
  const packaging = orderType === 'takeaway' ? 15 : 0;
  const estimatedTotal = subtotal + tax + packaging;

  useEffect(() => {
    if (items.length === 0 && !success) navigate('/menu');
  }, [items.length, navigate, success]);

  const handlePayment = async () => {
    if (paying) return;
    if (!selectedLocation) {
      toast.error('Please select a collection location first.');
      navigate('/location');
      return;
    }

    setPaying(true);
    try {
      const Razorpay = await loadRazorpayCheckout();
      const paymentOrder = await createPaymentOrder({ name: userName, phone });

      if (!paymentOrder.success) {
        throw new Error(paymentOrder.error || 'Unable to create a payment order');
      }

      const { order, razorpayOrder, keyId } = paymentOrder;
      const checkout = new Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'CHILLD Coffee',
        description: `Order ${order.id.slice(0, 8).toUpperCase()}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: userName || '',
          contact: phone || '',
        },
        notes: {
          order_id: order.id,
          collection_location: selectedLocation.name,
        },
        theme: { color: '#1844AB' },
        retry: { enabled: true },
        modal: {
          confirm_close: true,
          ondismiss: () => setPaying(false),
        },
        handler: async (response) => {
          const verification = await completePayment(response);
          if (!verification.success) {
            setPaying(false);
            toast.error(verification.error || 'Payment verification failed');
            return;
          }

          setSuccess(true);
          clearCart();
          toast.success('Payment verified and order placed');
          navigate('/order-confirm');
        },
      });

      checkout.on('payment.failed', (response) => {
        setPaying(false);
        toast.error(response.error?.description || 'Payment failed. Please try again.');
      });

      checkout.open();
    } catch (error) {
      setPaying(false);
      toast.error(error.message || 'Unable to open the secure payment window');
    }
  };

  return (
    <div className="payment-page page-wrapper">
      <div className="container payment-page__grid">
        <div className="payment-page__forms">
          <button className="payment-page__back" onClick={() => navigate('/checkout')}>
            <ArrowLeft size={18} /> Back to Checkout
          </button>

          <h1 className="payment-page__title">Secure Payment</h1>

          <div className="payment-form-card razorpay-checkout-card">
            <div className="razorpay-checkout-card__icon">
              <Shield size={32} />
            </div>
            <h2>Pay with Razorpay</h2>
            <p>
              Your payment details are collected securely inside Razorpay Checkout.
              CHILLD never receives or stores your card number, CVV, UPI PIN, or banking password.
            </p>

            <div className="razorpay-methods" aria-label="Available payment methods">
              {PAYMENT_METHODS.map(({ label, icon: Icon }) => (
                <div key={label} className="razorpay-method">
                  <Icon size={20} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-primary pay-submit-btn"
              onClick={handlePayment}
              disabled={paying || items.length === 0}
            >
              {paying ? (
                <>
                  <Loader2 className="spin" size={18} /> Opening secure checkout...
                </>
              ) : (
                `Pay ${formatPrice(estimatedTotal)} Securely`
              )}
            </button>
          </div>
        </div>

        <div className="payment-page__summary">
          <div className="summary-sticky">
            <h2 className="section-title-small">Order Summary</h2>
            <div className="payment-summary-card">
              <div className="summary-cafe">
                <span className="summary-cafe__name">{selectedLocation?.shortName || selectedLocation?.name || 'Cafe'}</span>
                <span className="summary-cafe__type">
                  {orderType === 'dine-in' ? 'Dine In' : 'Takeaway'}
                </span>
              </div>
              <div className="summary-bill-details">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="bill-row">
                  <span>GST (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {packaging > 0 && (
                  <div className="bill-row">
                    <span>Packaging</span>
                    <span>{formatPrice(packaging)}</span>
                  </div>
                )}
                <div className="bill-row">
                  <strong>To Pay</strong>
                  <strong className="bold-pay">{formatPrice(estimatedTotal)}</strong>
                </div>
              </div>
            </div>
            <div className="secure-badge">
              <Shield size={16} />
              <span>Payment is verified on the CHILLD server before the order is confirmed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
