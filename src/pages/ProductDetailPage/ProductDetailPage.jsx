import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, AlertCircle, Plus, Minus, Star } from 'lucide-react';
import { getProductById } from '@/data/products';
import { ADDONS } from '@/data/recommendations';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/coffeeBuilder';
import SizeSelector from '@/components/SizeSelector/SizeSelector';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const formatBadge = (badge) =>
  badge
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const product = getProductById(id);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="product-detail-page page-wrapper container product-not-found">
        <AlertCircle size={48} className="error-icon" />
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/menu" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const gallery = product.gallery?.length
    ? product.gallery
    : [{ id: `${product.id}-image`, label: 'Product image', src: product.image, alt: product.name }];
  const defaultSize = product.sizes.find((s) => s.id === '250ml') || product.sizes[0];
  const selectedSize = product.sizes.find((s) => s.id === selectedSizeId) || defaultSize;
  const activeImage = gallery.find((item) => item.id === activeImageId) || gallery[0];

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

  const basePrice = product.basePrice;
  const sizePrice = basePrice + selectedSize.modifier;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = sizePrice + addonsTotal;
  const totalPrice = unitPrice * qty;
  const rating = product.reviews?.rating;

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: unitPrice,
      size: selectedSize.id,
      image: product.image,
      category: product.category,
      isCustom: false,
      qty,
      addons: selectedAddons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
    };

    addItem(cartItem);
    toast.success(`${product.name} added to cart!`);
    navigate('/menu');
  };

  return (
    <div className="product-detail-page page-wrapper">
      <div className="container">
        <button className="product-detail__back" onClick={() => navigate('/menu')}>
          <ArrowLeft size={18} /> Back to Products
        </button>

        <div className="product-detail__grid">
          <div className="product-detail__image-area">
            <motion.div
              className="product-detail__img-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="product-detail__img"
                fetchPriority="high"
                decoding="async"
                width="960"
                height="960"
              />
              {product.badges?.length > 0 && (
                <div className="product-detail__badge-stack">
                  {product.badges.slice(0, 3).map((badge) => (
                    <span key={badge} className={`product-detail__badge badge--${badge}`}>
                      {formatBadge(badge)}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            <div className="product-detail__gallery" aria-label="Product images">
              {gallery.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`product-detail__thumb ${activeImage.id === item.id ? 'product-detail__thumb--active' : ''}`}
                  onClick={() => setActiveImageId(item.id)}
                  aria-label={`View ${item.label}`}
                  aria-pressed={activeImage.id === item.id}
                >
                  <img src={item.src} alt="" loading="lazy" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="product-detail__specs">
              <div className="spec-tile">
                <span className="spec-title">Caffeine</span>
                <span className="spec-value">{product.caffeine}</span>
              </div>
              <div className="spec-tile">
                <span className="spec-title">Servings</span>
                <span className="spec-value">{product.servings}</span>
              </div>
              <div className="spec-tile">
                <span className="spec-title">Ratio</span>
                <span className="spec-value">{product.brewRatio}</span>
              </div>
            </div>
          </div>

          <div className="product-detail__info-area">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="product-detail__category">{product.concentrateType}</span>
              <h1 className="product-detail__title">{product.name}</h1>
              <p className="product-detail__tagline">{product.tagline}</p>
              {rating && (
                <div className="product-detail__rating" aria-label={`${rating} out of 5 from ${product.reviews.count} reviews`}>
                  <Star size={16} fill="currentColor" />
                  <strong>{rating.toFixed(1)}</strong>
                  <span>{product.reviews.count} reviews</span>
                </div>
              )}
              <p className="product-detail__desc">{product.description}</p>
            </motion.div>

            <div className="product-detail__section product-detail__ingredients">
              <h3 className="section-title-small">Product Details</h3>
              <div className="product-detail__facts">
                <div>
                  <span>Roast</span>
                  <strong>{product.roast}</strong>
                </div>
                <div>
                  <span>Profile</span>
                  <strong>{product.beanProfile}</strong>
                </div>
                <div>
                  <span>Best Mix</span>
                  <strong>{product.brewRatio}</strong>
                </div>
              </div>
              <div className="ingredients-pills">
                {product.ingredients.map((ing) => (
                  <span key={ing} className="ingredient-pill">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {product.reviews && (
              <div className="product-detail__section product-detail__reviews">
                <h3 className="section-title-small">Reviews</h3>
                <p>{product.reviews.summary}</p>
                <div className="review-quotes">
                  {product.reviews.quotes.map((quote) => (
                    <span key={quote}>{quote}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="product-detail__section">
              <h3 className="section-title-small">Choose Bottle Size</h3>
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onChange={(size) => setSelectedSizeId(size.id)}
                basePrice={basePrice}
              />
            </div>

            {compatibleAddons.length > 0 && (
              <div className="product-detail__section">
                <h3 className="section-title-small">Optional Add-ons</h3>
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
                <ShoppingBag size={16} className="order-add-btn__icon" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
