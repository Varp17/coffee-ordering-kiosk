import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, User, ClipboardList } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatPrice } from '@/utils/coffeeBuilder';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCartStore();
  const { selectedLocation, orderType, tableNumber } = useOrderStore();
  const { isLoggedIn } = useAuthStore();

  const subtotal = getTotalPrice();
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const packaging = orderType === 'takeaway' ? 15 : 0;
  const grandTotal = subtotal + tax + packaging;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty! ☕');
      return;
    }

    if (!selectedLocation) {
      toast.error('Please select a location first.');
      navigate('/location');
      return;
    }

    if (!isLoggedIn) {
      toast.error('Please login to place your order.');
      navigate('/auth?redirect=/payment');
    } else {
      navigate('/payment');
    }
  };

  return (
    <div className="checkout-page page-wrapper">
      <div className="container checkout-page__grid">
        {/* Left Column: Order Summary & Review */}
        <div className="checkout-page__review">
          <button className="checkout-page__back" onClick={() => navigate('/location')}>
            <ArrowLeft size={18} /> Back to Location
          </button>

          <h1 className="checkout-page__title">Review Order</h1>

          {/* ── STORE & LOCATION SUMMARY ── */}
          <div className="checkout-card checkout-location">
            <div className="checkout-card__header">
              <MapPin size={18} className="icon-gold" />
              <h3>Collection Details</h3>
              <Link to="/location" className="edit-link">
                Edit
              </Link>
            </div>
            <div className="checkout-card__body">
              {selectedLocation ? (
                <>
                  <p className="location-name">{selectedLocation.name}</p>
                  <p className="location-address">{selectedLocation.address}</p>
                  <div className="type-badge-container">
                    <span className="type-badge">
                      {orderType === 'dine-in' ? '☕ Dine In' : '🛍️ Takeaway'}
                    </span>
                    {orderType === 'dine-in' && tableNumber && (
                      <span className="table-badge">Table #{tableNumber}</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="location-missing">
                  <p>No location selected</p>
                  <Link to="/location" className="btn btn-outline">
                    Select Location
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── CART ITEMS REVIEW ── */}
          <div className="checkout-card checkout-items">
            <div className="checkout-card__header">
              <ClipboardList size={18} className="icon-gold" />
              <h3>Items Summary</h3>
              <Link to="/menu" className="edit-link">
                Add items
              </Link>
            </div>
            <div className="checkout-card__body">
              {items.length === 0 ? (
                <p className="empty-review">No items in your cart.</p>
              ) : (
                <div className="review-items-list">
                  {items.map((item) => (
                    <div key={item.cartKey} className="review-item-row">
                      {item.image && (
                        <div className="review-item-row__img">
                          <img src={item.image} alt={item.name} loading="lazy" />
                        </div>
                      )}
                      <div className="review-item-row__details">
                        <h4>
                          {item.name} <span className="qty-tag">x{item.qty}</span>
                        </h4>
                        <p className="meta-text">
                          Size: {item.size === 'small' ? 'Small' : 'Standard'}
                          {item.isCustom && ' · Custom Brew'}
                        </p>

                        {/* Addons List */}
                        {item.addons && item.addons.length > 0 && (
                          <div className="review-item-addons">
                            {item.addons.map((addon) => (
                              <span key={addon.id} className="addon-pill">
                                + {addon.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Custom Brew Ingredients List */}
                        {item.isCustom && item.ingredients && (
                          <div className="review-item-addons">
                            <span className="ingredient-pill-mini">Base: {item.ingredients.concentrate}</span>
                            <span className="ingredient-pill-mini">Sweetener: {item.ingredients.sweetener}</span>
                            <span className="ingredient-pill-mini">Milk: {item.ingredients.milk}</span>
                            <span className="ingredient-pill-mini">Topping: {item.ingredients.topping}</span>
                          </div>
                        )}
                      </div>
                      <span className="review-item-row__price">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── BILL DETAILS & ACTIONS ── */}
        <div className="checkout-page__summary">
          <div className="summary-sticky">
            <h2 className="section-title-small">Bill Details</h2>

            <div className="bill-card">
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
                  <span>Packaging Charge</span>
                  <span>{formatPrice(packaging)}</span>
                </div>
              )}
              <hr className="bill-divider" />
              <div className="bill-row bill-row--grand">
                <span>To Pay</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              className={`btn btn-primary place-order-btn ${items.length === 0 || !selectedLocation ? 'disabled' : ''}`}
              onClick={handlePlaceOrder}
              disabled={items.length === 0 || !selectedLocation}
            >
              {isLoggedIn ? (
                <>
                  <CreditCard size={18} style={{ marginRight: 8 }} /> Proceed to Payment
                </>
              ) : (
                <>
                  <User size={18} style={{ marginRight: 8 }} /> Login to Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
