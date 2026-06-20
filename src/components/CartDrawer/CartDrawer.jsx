import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { drawerVariants } from '@/utils/animations';
import { formatPrice } from '@/utils/coffeeBuilder';
import './CartDrawer.css';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="cart-drawer"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="cart-drawer__header">
              <div className="cart-drawer__title">
                <ShoppingBag size={20} />
                <span>Your Order</span>
              </div>
              <button onClick={onClose} className="cart-drawer__close" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="cart-drawer__body">
              {items.length === 0 ? (
                <div className="cart-drawer__empty">
                  <div className="cart-drawer__empty-icon">☕</div>
                  <p>Your cart is empty</p>
                  <span>Add something delicious from the menu!</span>
                  <Link to="/menu" className="btn btn-primary" onClick={onClose} style={{ marginTop: '1rem' }}>
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <ul className="cart-drawer__list">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.cartKey}
                        className="cart-item"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                        layout
                      >
                        {item.image && (
                          <div className="cart-item__img">
                            <img src={item.image} alt={item.name} loading="lazy" />
                          </div>
                        )}
                        <div className="cart-item__info">
                          <p className="cart-item__name">{item.name}</p>
                          <p className="cart-item__meta">
                            {item.size === 'small' ? 'Small' : 'Standard'}
                            {item.isCustom && ' · Custom Brew'}
                          </p>
                          {/* Addons List */}
                          {item.addons && item.addons.length > 0 && (
                            <div className="cart-item__addons-list">
                              {item.addons.map((a) => (
                                <span key={a.id} className="cart-item__addon-tag">
                                  + {a.name}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Custom Ingredients */}
                          {item.isCustom && item.ingredients && (
                            <div className="cart-item__addons-list">
                              <span className="cart-item__ing-tag">Base: {item.ingredients.concentrate}</span>
                              <span className="cart-item__ing-tag">Sweetener: {item.ingredients.sweetener}</span>
                              <span className="cart-item__ing-tag">Milk: {item.ingredients.milk}</span>
                              <span className="cart-item__ing-tag">Topping: {item.ingredients.topping}</span>
                            </div>
                          )}
                          <p className="cart-item__price">{formatPrice(item.price)}</p>
                        </div>
                        <div className="cart-item__actions">
                          <div className="cart-item__qty">
                            <button onClick={() => updateQty(item.cartKey, item.qty - 1)} aria-label="Decrease">
                              <Minus size={14} />
                            </button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateQty(item.cartKey, item.qty + 1)} aria-label="Increase">
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            className="cart-item__remove"
                            onClick={() => removeItem(item.cartKey)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="cart-drawer__footer">
                <div className="cart-drawer__total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <Link
                  to="/location"
                  className="btn btn-primary cart-drawer__checkout"
                  onClick={onClose}
                >
                  Proceed to Order →
                </Link>
                <button
                  className="cart-drawer__clear"
                  onClick={clearCart}
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
