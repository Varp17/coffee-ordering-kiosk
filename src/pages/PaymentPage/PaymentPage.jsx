import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, QrCode, CreditCard, Wallet, Smartphone, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice, generateToken } from '@/utils/coffeeBuilder';
import toast from 'react-hot-toast';
import './PaymentPage.css';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { selectedLocation, orderType, placeOrder } = useOrderStore();

  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'wallet'
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState('');

  // Wallet State
  const [selectedWallet, setSelectedWallet] = useState('gpay');

  const subtotal = getTotalPrice();
  const tax = Math.round(subtotal * 0.05);
  const packaging = orderType === 'takeaway' ? 15 : 0;
  const grandTotal = subtotal + tax + packaging;

  // If cart is empty, redirect
  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate('/menu');
    }
  }, [items, success, navigate]);

  const handlePay = (e) => {
    e.preventDefault();

    // Verification check based on tab
    if (activeTab === 'upi') {
      if (!upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g. name@okhdfcbank) 💳');
        return;
      }
    } else if (activeTab === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid 16-digit card number.');
        return;
      }
      if (cvv.length < 3) {
        toast.error('Please enter a valid CVV.');
        return;
      }
    }

    setPaying(true);

    // Simulate payment process (2 seconds)
    setTimeout(async () => {
      const token = generateToken();
      const res = await placeOrder(token);
      
      setPaying(false);

      if (res && res.success === false) {
        toast.error(`Order placement failed: ${res.error || 'Please try again.'}`);
        setSuccess(false);
        return;
      }

      setSuccess(true);
      toast.success('Payment Received & Order Placed! 💸');

      // Clear cart
      clearCart();

      // Navigate to order-confirm page after a tiny success delay
      setTimeout(() => {
        navigate('/order-confirm');
      }, 1000);
    }, 2000);
  };

  // Card formatting
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setExpiry(val);
    }
  };

  return (
    <div className="payment-page page-wrapper">
      <div className="container payment-page__grid">
        {/* ── PAYMENT METHODS SELECTION ── */}
        <div className="payment-page__forms">
          <button className="payment-page__back" onClick={() => navigate('/checkout')}>
            <ArrowLeft size={18} /> Back to Checkout
          </button>

          <h1 className="payment-page__title">Choose Payment Mode</h1>

          {/* Payment Tabs */}
          <div className="payment-tabs" role="tablist" aria-label="Payment methods">
            <button
              className={`payment-tab ${activeTab === 'upi' ? 'payment-tab--active' : ''}`}
              onClick={() => setActiveTab('upi')}
              role="tab"
              aria-selected={activeTab === 'upi'}
            >
              <QrCode size={18} />
              <span>UPI / QR</span>
            </button>
            <button
              className={`payment-tab ${activeTab === 'card' ? 'payment-tab--active' : ''}`}
              onClick={() => setActiveTab('card')}
              role="tab"
              aria-selected={activeTab === 'card'}
            >
              <CreditCard size={18} />
              <span>Credit/Debit Card</span>
            </button>
            <button
              className={`payment-tab ${activeTab === 'wallet' ? 'payment-tab--active' : ''}`}
              onClick={() => setActiveTab('wallet')}
              role="tab"
              aria-selected={activeTab === 'wallet'}
            >
              <Wallet size={18} />
              <span>Net Banking / Wallets</span>
            </button>
          </div>

          <div className="payment-form-card">
            {/* ── ACTIVE TAB CONTENT (UPI/CARD/WALLET) ── */}
            {activeTab === 'upi' && (
              <div className="upi-payment">
                <div className="qr-container">
                  <div className="qr-box">
                    {/* Simulated QR Code using CSS grid */}
                    <div className="mock-qr-code">
                      <div className="mock-qr-dot" />
                      <div className="mock-qr-dot" />
                      <div className="mock-qr-dot" />
                      <div className="mock-qr-dot" />
                    </div>
                  </div>
                  <p className="qr-caption">Scan this QR code using any UPI App to pay</p>
                </div>

                <div className="divider-or">
                  <span>OR</span>
                </div>

                <form onSubmit={handlePay} className="upi-id-form">
                  <div className="input-group">
                    <label htmlFor="upi-id-input">Enter UPI ID</label>
                    <input
                      id="upi-id-input"
                      type="text"
                      className="form-input"
                      placeholder="e.g., username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary pay-submit-btn" disabled={paying}>
                    {paying ? (
                      <>
                        <Loader2 className="spin" size={18} style={{ marginRight: 8 }} /> Processing...
                      </>
                    ) : (
                      `Pay ${formatPrice(grandTotal)}`
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="card-payment">
                {/* 3D Flipping Card Visualizer */}
                <div className={`credit-card-preview ${isFlipped ? 'flipped' : ''}`}>
                  <div className="credit-card-preview__inner">
                    {/* Front */}
                    <div className="credit-card-preview__front">
                      <div className="card-chip" />
                      <div className="card-preview-number">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="card-preview-footer">
                        <div className="card-preview-holder">
                          <span className="card-meta-lbl">Card Holder</span>
                          <span className="card-meta-val">{cardName || 'YOUR NAME'}</span>
                        </div>
                        <div className="card-preview-expiry">
                          <span className="card-meta-lbl">Expires</span>
                          <span className="card-meta-val">{expiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="credit-card-preview__back">
                      <div className="card-magnetic-strip" />
                      <div className="card-preview-signature">
                        <div className="signature-bar" />
                        <div className="cvv-val">{cvv || '•••'}</div>
                      </div>
                      <div className="card-back-disclaimer">
                        This card is simulated for Chilld Coffee ordering.
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePay} className="credit-card-form">
                  <div className="input-group">
                    <label htmlFor="card-number-input">Card Number</label>
                    <input
                      id="card-number-input"
                      type="text"
                      className="form-input"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="card-holder-input">Card Holder Name</label>
                    <input
                      id="card-holder-input"
                      type="text"
                      className="form-input"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="card-expiry-input">Expiry Date</label>
                      <input
                        id="card-expiry-input"
                        type="text"
                        className="form-input"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="card-cvv-input">CVV</label>
                      <input
                        id="card-cvv-input"
                        type="password"
                        className="form-input"
                        placeholder="•••"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        onFocus={() => setIsFlipped(true)}
                        onBlur={() => setIsFlipped(false)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary pay-submit-btn" disabled={paying}>
                    {paying ? (
                      <>
                        <Loader2 className="spin" size={18} style={{ marginRight: 8 }} /> Securing transaction...
                      </>
                    ) : (
                      `Pay ${formatPrice(grandTotal)}`
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="wallet-payment">
                <form onSubmit={handlePay} className="wallet-form">
                  <div className="wallet-tiles-grid">
                    <button
                      type="button"
                      className={`wallet-tile ${selectedWallet === 'gpay' ? 'wallet-tile--selected' : ''}`}
                      onClick={() => setSelectedWallet('gpay')}
                    >
                      <Smartphone size={24} className="wallet-icon" />
                      <span>Google Pay</span>
                    </button>
                    <button
                      type="button"
                      className={`wallet-tile ${selectedWallet === 'paytm' ? 'wallet-tile--selected' : ''}`}
                      onClick={() => setSelectedWallet('paytm')}
                    >
                      <Smartphone size={24} className="wallet-icon" />
                      <span>Paytm</span>
                    </button>
                    <button
                      type="button"
                      className={`wallet-tile ${selectedWallet === 'netbanking' ? 'wallet-tile--selected' : ''}`}
                      onClick={() => setSelectedWallet('netbanking')}
                    >
                      <Smartphone size={24} className="wallet-icon" />
                      <span>Net Banking</span>
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary pay-submit-btn" disabled={paying}>
                    {paying ? (
                      <>
                        <Loader2 className="spin" size={18} style={{ marginRight: 8 }} /> Verifying wallet...
                      </>
                    ) : (
                      `Pay ${formatPrice(grandTotal)} via ${selectedWallet === 'gpay' ? 'GPay' : selectedWallet === 'paytm' ? 'Paytm' : 'Net Banking'}`
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ── ORDER SUMMARY & TRUST BADGES ── */}
        <div className="payment-page__summary">
          <div className="summary-sticky">
            <h2 className="section-title-small">Order Summary</h2>

            <div className="payment-summary-card">
              <div className="summary-cafe">
                <span className="summary-cafe__name">{selectedLocation?.shortName || 'Cafe'}</span>
                <span className="summary-cafe__type">
                  {orderType === 'dine-in' ? 'Dine In' : 'Takeaway'}
                </span>
              </div>

              <div className="summary-bill-details">
                <div className="bill-row">
                  <span>Grand Total</span>
                  <span className="bold-pay">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="secure-badge">
              <Shield size={16} />
              <span>PCI-DSS Compliant 256-bit Secure Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
