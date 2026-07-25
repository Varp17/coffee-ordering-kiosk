import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin, CreditCard, Shield, Plus, Minus, Trash2, Check,
  QrCode, Wallet, Truck, ChevronRight, Lock, ArrowLeft, User, Phone
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useAuthStore } from '@/store/useAuthStore';
import { loadRazorpayCheckout } from '@/services/razorpay';
import { formatPrice } from '@/utils/coffeeBuilder';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const PAYMENT_METHODS = [
  { id: 'upi', title: 'UPI / QR Code', subtitle: 'Google Pay, PhonePe, Paytm', icon: QrCode, badge: 'Recommended' },
  { id: 'card', title: 'Credit or Debit Card', subtitle: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'wallet', title: 'Net Banking & Wallets', subtitle: 'All Major Banks, CRED', icon: Wallet },
  { id: 'cod', title: 'Cash on Delivery', subtitle: 'Pay when your coffee arrives', icon: Truck },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, getTotalPrice, clearCart } = useCartStore();
  const { createPaymentOrder, completePayment } = useOrderStore();
  const { phone: authPhone, userName: authName } = useAuthStore();

  const [selectedAddressId, setSelectedAddressId] = useState('home');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: 'home', type: 'Home', name: authName || 'Arya Kagathara', phone: authPhone || '+91 98765 43210', line1: 'Flat 402, Sunshine Heights', line2: '100 Feet Road, Indiranagar', city: 'Bengaluru', pincode: '560038', isDefault: true },
  ]);
  const [newAddr, setNewAddr] = useState({ name: authName || '', phone: authPhone || '', line1: '', line2: '', city: 'Bengaluru', pincode: '', type: 'Home' });

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + tax;
  const currentAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.line1 || !newAddr.pincode) {
      toast.error('Please fill all required fields.');
      return;
    }
    const created = { ...newAddr, id: `addr_${Date.now()}`, isDefault: false };
    setAddresses([created, ...addresses]);
    setSelectedAddressId(created.id);
    setShowAddressForm(false);
    setNewAddr({ name: '', phone: '', line1: '', line2: '', city: 'Bengaluru', pincode: '', type: 'Home' });
    toast.success('Address added!');
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) { toast.error('Your cart is empty!'); return; }
    if (!currentAddress) { toast.error('Please select a delivery address.'); return; }
    setIsProcessing(true);

    if (paymentMethod === 'cod') {
      try {
        const orderRes = await createPaymentOrder({ name: currentAddress.name, phone: currentAddress.phone, shippingAddress: currentAddress });
        if (orderRes.success) { clearCart(); toast.success('Order placed! Pay on delivery.'); navigate('/order-confirm'); }
        else { toast.error(orderRes.error || 'Failed to place order.'); setIsProcessing(false); }
      } catch { setIsProcessing(false); toast.error('Order creation failed.'); }
      return;
    }

    try {
      const Razorpay = await loadRazorpayCheckout();
      const paymentOrder = await createPaymentOrder({ name: currentAddress.name, phone: currentAddress.phone, shippingAddress: currentAddress });
      if (!paymentOrder.success) throw new Error(paymentOrder.error || 'Unable to initialize checkout');

      const { order, razorpayOrder, keyId } = paymentOrder;
      const checkout = new Razorpay({
        key: keyId, amount: razorpayOrder.amount, currency: razorpayOrder.currency || 'INR',
        name: 'CHILLD Coffee', description: `Order #${order.order_number || order.id.slice(0, 8).toUpperCase()}`,
        order_id: razorpayOrder.id, prefill: { name: currentAddress.name, contact: currentAddress.phone },
        notes: { order_id: order.id, delivery_address: `${currentAddress.line1}, ${currentAddress.city}` },
        theme: { color: '#1844AB' }, retry: { enabled: true },
        modal: { confirm_close: true, ondismiss: () => setIsProcessing(false) },
        handler: async (response) => {
          const verification = await completePayment(response);
          if (!verification.success) { setIsProcessing(false); toast.error(verification.error || 'Payment verification failed'); return; }
          clearCart(); toast.success('Payment verified! Order placed'); navigate('/order-confirm');
        },
      });
      checkout.on('payment.failed', (response) => { setIsProcessing(false); toast.error(response.error?.description || 'Payment failed.'); });
      checkout.open();
    } catch (error) { setIsProcessing(false); toast.error(error.message || 'Unable to open payment window'); }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Browse our freshly roasted coffee concentrates!</p>
          <Link to="/menu" className="btn-checkout-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <Link to="/" className="checkout-brand">
            <span className="brand-name">Chilld</span>
            <span className="brand-divider">|</span>
            <span className="brand-page">Checkout</span>
          </Link>
          <div className="checkout-secure"><Lock size={14} /> Secure Checkout</div>
        </div>
      </header>

      <div className="checkout-container">
        <div className="checkout-grid">
          <div className="checkout-main">
            {/* Address Section */}
            <section className="checkout-section">
              <div className="section-header">
                <span className="section-num">1</span>
                <h3>Delivery Address</h3>
              </div>
              <div className="address-list">
                {addresses.map(addr => (
                  <label key={addr.id} className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} />
                    <div className="address-content">
                      <div className="address-top">
                        <span className="address-type">{addr.type}</span>
                        {addr.isDefault && <span className="default-badge">Default</span>}
                      </div>
                      <p className="address-name">{addr.name}</p>
                      <p className="address-text">{addr.line1}, {addr.line2}</p>
                      <p className="address-text">{addr.city} — {addr.pincode}</p>
                      <p className="address-phone"><Phone size={12} /> {addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button type="button" className="add-address-toggle" onClick={() => setShowAddressForm(!showAddressForm)}>
                <Plus size={16} /> {showAddressForm ? 'Cancel' : 'Add New Address'}
              </button>
              {showAddressForm && (
                <form className="address-form" onSubmit={handleAddAddress}>
                  <div className="form-row">
                    <div className="form-field"><label>Full Name *</label><input required value={newAddr.name} onChange={e => setNewAddr({ ...newAddr, name: e.target.value })} /></div>
                    <div className="form-field"><label>Phone *</label><input required value={newAddr.phone} onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })} /></div>
                  </div>
                  <div className="form-field"><label>Address Line 1 *</label><input required placeholder="Flat/House, Building" value={newAddr.line1} onChange={e => setNewAddr({ ...newAddr, line1: e.target.value })} /></div>
                  <div className="form-field"><label>Address Line 2</label><input placeholder="Street, Area" value={newAddr.line2} onChange={e => setNewAddr({ ...newAddr, line2: e.target.value })} /></div>
                  <div className="form-row">
                    <div className="form-field"><label>City</label><input value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} /></div>
                    <div className="form-field"><label>Pincode *</label><input required value={newAddr.pincode} onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })} /></div>
                  </div>
                  <button type="submit" className="btn-checkout-primary">Save Address</button>
                </form>
              )}
            </section>

            {/* Items Section */}
            <section className="checkout-section">
              <div className="section-header">
                <span className="section-num">2</span>
                <h3>Order Items</h3>
              </div>
              <div className="delivery-badge"><Truck size={16} /> Express delivery in 30-45 mins</div>
              <div className="items-list">
                {items.map(item => (
                  <div key={item.cartKey} className="item-row">
                    {item.image && <div className="item-img"><img src={item.image} alt={item.name} /></div>}
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p className="item-meta">Size: {item.size === 'small' ? 'Small' : 'Standard'}{item.isCustom && ' · Custom'}</p>
                    </div>
                    <div className="item-qty">
                      <button onClick={() => updateQty(item.cartKey, item.qty - 1)}><Minus size={14} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.cartKey, item.qty + 1)}><Plus size={14} /></button>
                    </div>
                    <div className="item-price">{formatPrice(item.price * item.qty)}</div>
                    <button className="item-remove" onClick={() => removeItem(item.cartKey)}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Section */}
            <section className="checkout-section">
              <div className="section-header">
                <span className="section-num">3</span>
                <h3>Payment Method</h3>
              </div>
              <div className="payment-list">
                {PAYMENT_METHODS.map(({ id, title, subtitle, icon: Icon, badge }) => (
                  <label key={id} className={`payment-card ${paymentMethod === id ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} />
                    <Icon size={20} className="payment-icon" />
                    <div className="payment-info">
                      <div className="payment-title-row">
                        <span className="payment-title">{title}</span>
                        {badge && <span className="payment-badge">{badge}</span>}
                      </div>
                      <span className="payment-sub">{subtitle}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Summary Sidebar */}
          <aside className="checkout-sidebar">
            <div className="summary-card">
              <button className="btn-checkout-primary btn-place" onClick={handlePlaceOrder} disabled={isProcessing || items.length === 0}>
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
              <p className="summary-terms">By placing, you agree to CHILLD's <Link to="/policies">privacy</Link> & <Link to="/policies">terms</Link>.</p>
              <div className="summary-divider" />
              <h4 className="summary-title">Order Summary</h4>
              <div className="summary-row"><span>Items ({items.length})</span><span>{formatPrice(subtotal)}</span></div>
              <div className="summary-row"><span>Delivery</span><span>{deliveryFee === 0 ? <span className="free-tag">FREE</span> : formatPrice(deliveryFee)}</span></div>
              <div className="summary-row"><span>GST (5%)</span><span>{formatPrice(tax)}</span></div>
              <div className="summary-divider" />
              <div className="summary-total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
              {currentAddress && (
                <div className="summary-address">
                  <span className="addr-label">Delivering to</span>
                  <p className="addr-name">{currentAddress.name}</p>
                  <p className="addr-text">{currentAddress.line1}, {currentAddress.city} - {currentAddress.pincode}</p>
                </div>
              )}
              <div className="summary-secure"><Shield size={14} /> SSL Encrypted</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
