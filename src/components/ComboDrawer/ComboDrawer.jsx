import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { PRODUCTS as CATALOG_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import './ComboDrawer.css';

export default function ComboDrawer({ isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState('325ml'); // '325ml' or '1000ml'
  const [comboItems, setComboItems] = useState([]);
  const addItemToCart = useCartStore((state) => state.addItem);

  // Lock body scroll and pause smooth Lenis scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen]);

  // Filter concentrates by size
  const concentrateProducts = CATALOG_PRODUCTS.filter((p) => p.category !== 'sampler');

  const getProductPrice = (product, sizeId) => {
    if (sizeId === '1000ml') return 1200;
    return product.basePrice || 390;
  };

  const getProductImage = (product, sizeId) => {
    if (sizeId === '1000ml' && product.imageLtr) return product.imageLtr;
    return product.cardImage || product.image;
  };

  const addToCombo = (product) => {
    if (comboItems.length >= 3) {
      toast.error('Maximum 3 bottles allowed in a single combo!');
      return;
    }
    const newItem = {
      instanceId: `${product.id}-${selectedSize}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      id: product.id,
      name: product.name,
      concentrateType: product.concentrateType,
      sizeId: selectedSize,
      sizeLabel: selectedSize === '1000ml' ? '1 Liter' : '325 ml',
      price: getProductPrice(product, selectedSize),
      image: getProductImage(product, selectedSize),
    };
    setComboItems((prev) => [...prev, newItem]);
    toast.success(`Added ${product.name} (${newItem.sizeLabel}) to combo!`);
  };

  const removeFromCombo = (instanceId) => {
    setComboItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
  };

  // Calculations
  const itemCount = comboItems.length;
  const rawSubtotal = comboItems.reduce((sum, item) => sum + item.price, 0);

  let discount = 0;
  let offerBadgeText = '';
  if (itemCount === 2) {
    discount = 40;
    offerBadgeText = '₹40 OFF APPLIED!';
  } else if (itemCount >= 3) {
    discount = 75;
    offerBadgeText = '₹75 OFF APPLIED!';
  }

  const finalTotal = Math.max(0, rawSubtotal - discount);

  const handleAddComboToMainCart = () => {
    if (comboItems.length < 2) {
      toast.error('Add at least 2 bottles to claim your combo discount!');
      return;
    }

    // Add each bottle to cart
    comboItems.forEach((item) => {
      addItemToCart({
        id: item.id,
        name: `${item.name} (Custom Combo)`,
        price: item.price,
        size: item.sizeLabel,
        image: item.image,
        qty: 1,
      });
    });

    toast.success(`Combo added to cart with ₹${discount} total savings! 🎉`);
    setComboItems([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="combo-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="combo-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="combo-drawer__header">
              <div className="combo-drawer__title-wrap">
                <Sparkles size={20} className="sparkle-icon" />
                <h2>Create Your Combo</h2>
              </div>
              <button type="button" className="combo-drawer__close" onClick={onClose} aria-label="Close combo builder">
                <X size={20} />
              </button>
            </div>

            {/* Offer Banner */}
            <div className="combo-drawer__offer-banner">
              <div className="offer-pill">
                <span className={itemCount === 2 ? 'active-offer' : ''}>Buy 2 Get ₹40 OFF</span>
                <span className="divider">•</span>
                <span className={itemCount >= 3 ? 'active-offer' : ''}>Buy 3 Get ₹75 OFF</span>
              </div>
              <p className="offer-sub">Mix and match any bottle size!</p>
            </div>

            {/* Size Filter Tabs */}
            <div className="combo-drawer__size-tabs">
              <button
                type="button"
                className={`size-tab ${selectedSize === '325ml' ? 'size-tab--active' : ''}`}
                onClick={() => setSelectedSize('325ml')}
              >
                325 ml Bottles
              </button>
              <button
                type="button"
                className={`size-tab ${selectedSize === '1000ml' ? 'size-tab--active' : ''}`}
                onClick={() => setSelectedSize('1000ml')}
              >
                1 Liter Bottles
              </button>
            </div>

            {/* Products Selection List */}
            <div className="combo-drawer__body" data-lenis-prevent="true">
              <h3 className="section-subtitle">Choose Bottles ({selectedSize === '1000ml' ? '1 Liter' : '325ml'})</h3>
              <div className="combo-products-grid">
                {concentrateProducts.map((p) => {
                  const itemPrice = getProductPrice(p, selectedSize);
                  const itemImg = getProductImage(p, selectedSize);
                  return (
                    <div key={p.id + selectedSize} className="combo-product-card">
                      <div className="combo-product-card__img-wrap">
                        <img src={itemImg} alt={p.name} />
                      </div>
                      <div className="combo-product-card__info">
                        <h4>{p.name}</h4>
                        <span className="combo-product-card__type">{p.concentrateType}</span>
                        <div className="combo-product-card__price-row">
                          <span className="price">₹{itemPrice}</span>
                          <button
                            type="button"
                            className="combo-add-btn"
                            onClick={() => addToCombo(p)}
                            disabled={comboItems.length >= 3}
                          >
                            <Plus size={16} /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Combo Slots Preview */}
              <div className="combo-slots-section">
                <div className="slots-header">
                  <h3>Your Custom Combo</h3>
                  <span className="slots-count">{itemCount} / 3 Bottles</span>
                </div>

                {comboItems.length === 0 ? (
                  <div className="combo-slots-empty">
                    <p>Select bottles above to build your custom combo box!</p>
                  </div>
                ) : (
                  <div className="combo-slots-list">
                    {comboItems.map((item) => (
                      <div key={item.instanceId} className="combo-slot-item">
                        <img src={item.image} alt={item.name} className="slot-img" />
                        <div className="slot-details">
                          <strong>{item.name}</strong>
                          <span>{item.sizeLabel} • ₹{item.price}</span>
                        </div>
                        <button
                          type="button"
                          className="slot-remove-btn"
                          onClick={() => removeFromCombo(item.instanceId)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Summary */}
            <div className="combo-drawer__footer">
              {discount > 0 && (
                <div className="discount-applied-badge">
                  <Check size={14} /> {offerBadgeText}
                </div>
              )}
              <div className="price-summary-row">
                <div className="summary-left">
                  <span className="subtotal-label">Total Price:</span>
                  {discount > 0 && <span className="original-price">₹{rawSubtotal}</span>}
                  <span className="final-price">₹{finalTotal}</span>
                </div>
                <button
                  type="button"
                  className="combo-checkout-btn"
                  onClick={handleAddComboToMainCart}
                  disabled={comboItems.length < 2}
                >
                  <ShoppingBag size={18} />
                  <span>Add Combo to Cart</span>
                </button>
              </div>
              {itemCount < 2 && (
                <p className="footer-tip">Add 1 more bottle to unlock ₹40 OFF!</p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
