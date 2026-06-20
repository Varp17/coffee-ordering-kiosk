import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Sparkles, AlertCircle, Plus, Minus, Info } from 'lucide-react';
import { PRODUCTS, getProductById } from '@/data/products';
import { ADDONS } from '@/data/recommendations';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/coffeeBuilder';
import SizeSelector from '@/components/SizeSelector/SizeSelector';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="product-detail-page page-wrapper container product-not-found">
        <AlertCircle size={48} className="error-icon" />
        <h2>Product Not Found</h2>
        <p>The drink you're looking for doesn't exist or has been removed.</p>
        <Link to="/menu" className="btn btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  // Find standard size as default
  const defaultSize = product.sizes.find((s) => s.id === 'standard') || product.sizes[0];
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [qty, setQty] = useState(1);

  // Compatible addons
  const compatibleAddons = ADDONS.filter((addon) =>
    addon.compatibleWith.includes(product.category)
  );

  const toggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleQtyChange = (val) => {
    if (val < 1) return;
    setQty(val);
  };

  // Price calculations
  const basePrice = product.basePrice;
  const sizePrice = basePrice + selectedSize.modifier;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = sizePrice + addonsTotal;
  const totalPrice = unitPrice * qty;

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: unitPrice,
      size: selectedSize.id,
      image: product.image,
      isCustom: false,
      qty: qty,
      addons: selectedAddons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
    };

    addItem(cartItem);
    toast.success(`${product.name} added to cart! ☕`);
    navigate('/menu');
  };

  return (
    <div className="product-detail-page page-wrapper">
      <div className="container">
        {/* Back navigation */}
        <button className="product-detail__back" onClick={() => navigate('/menu')}>
          <ArrowLeft size={18} /> Back to Menu
        </button>

        <div className="product-detail__grid">
          {/* Left Column: Image with parallax wrapper */}
          <div className="product-detail__image-area">
            <motion.div
              className="product-detail__img-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img src={product.image} alt={product.name} className="product-detail__img" />
              {product.badges && product.badges.map((b) => (
                <span key={b} className={`product-detail__badge badge--${b}`}>
                  {b === 'bestseller' ? '🔥 Bestseller' : b === 'recommended' ? '⭐ Rec' : b === 'vegan' ? '🌿 Vegan' : b}
                </span>
              ))}
            </motion.div>

            {/* Info specs */}
            <div className="product-detail__specs">
              <div className="spec-tile">
                <span className="spec-title">Caffeine</span>
                <span className="spec-value">{product.caffeine}</span>
              </div>
              <div className="spec-tile">
                <span className="spec-title">Ingredients</span>
                <span className="spec-value">{product.ingredients.length} items</span>
              </div>
            </div>
          </div>

          {/* Right Column: Configurator */}
          <div className="product-detail__info-area">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="product-detail__category">{product.category}</span>
              <h1 className="product-detail__title">{product.name}</h1>
              <p className="product-detail__tagline">{product.tagline}</p>
              <p className="product-detail__desc">{product.description}</p>
            </motion.div>

            {/* Ingredients detail */}
            <div className="product-detail__section product-detail__ingredients">
              <h3 className="section-title-small">What's Inside</h3>
              <div className="ingredients-pills">
                {product.ingredients.map((ing) => (
                  <span key={ing} className="ingredient-pill">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="product-detail__section">
              <h3 className="section-title-small">Choose Size</h3>
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onChange={setSelectedSize}
                basePrice={basePrice}
              />
            </div>

            {/* Addons Selector */}
            {compatibleAddons.length > 0 && (
              <div className="product-detail__section">
                <h3 className="section-title-small">Customize Your Drink</h3>
                <div className="addons-grid">
                  {compatibleAddons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        className={`addon-tile ${isSelected ? 'addon-tile--selected' : ''}`}
                        onClick={() => toggleAddon(addon)}
                        type="button"
                      >
                        <div className="addon-tile__check" />
                        <div className="addon-tile__info">
                          <span className="addon-tile__name">{addon.name}</span>
                          <span className="addon-tile__desc">{addon.description}</span>
                        </div>
                        <span className="addon-tile__price">+{formatPrice(addon.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer Order Box */}
            <div className="product-detail__order-box">
              <div className="qty-selector">
                <button
                  className="qty-btn"
                  onClick={() => handleQtyChange(qty - 1)}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="qty-number">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleQtyChange(qty + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="order-price">
                <span className="price-label">Price</span>
                <span className="price-val">{formatPrice(totalPrice)}</span>
              </div>

              <button className="btn btn-primary order-add-btn" onClick={handleAddToCart}>
                <ShoppingBag size={16} style={{ marginRight: 8 }} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
