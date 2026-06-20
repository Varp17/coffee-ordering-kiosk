import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/coffeeBuilder';
import SizeSelector from '@/components/SizeSelector/SizeSelector';
import { cardHover } from '@/utils/animations';
import toast from 'react-hot-toast';
import './ProductCard.css';

const BADGE_MAP = {
  bestseller:    { label: 'Bestseller',    color: '#C67C4E' },
  recommended:   { label: 'Recommended',  color: '#3D9B6B' },
  'most-preferred': { label: 'Fan Fav ❤️', color: '#D94F4F' },
  vegan:         { label: 'Vegan 🌱',      color: '#3D9B6B' },
};

export default function ProductCard({ product, compact = false }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isAdding,     setIsAdding]     = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const price = product.basePrice + (selectedSize?.modifier || 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAdding(true);
    addItem({
      id:       product.id,
      name:     product.name,
      price,
      size:     selectedSize?.id,
      image:    product.image,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`, {
      icon: '☕',
      style: {
        background: '#1F2A44',
        color: '#fff',
        fontFamily: 'Outfit, sans-serif',
      },
    });
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <motion.article
      className={`product-card ${compact ? 'product-card--compact' : ''}`}
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      onClick={() => navigate(`/menu/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/menu/${product.id}`)}
    >
      {/* Image */}
      <div className="product-card__img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-card__img"
        />
        {/* Badges */}
        <div className="product-card__badges">
          {product.badges.slice(0, 2).map((b) => (
            <span
              key={b}
              className="product-card__badge"
              style={{ background: BADGE_MAP[b]?.color || '#6B6560' }}
            >
              {BADGE_MAP[b]?.label || b}
            </span>
          ))}
        </div>
        {/* Caffeine */}
        <span className={`product-card__caffeine caffeine--${product.caffeine?.toLowerCase().replace(/\s/g, '-')}`}>
          ⚡ {product.caffeine}
        </span>
      </div>

      {/* Content */}
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        {!compact && (
          <p className="product-card__tagline">{product.tagline}</p>
        )}

        {/* Size selector */}
        <SizeSelector
          sizes={product.sizes}
          selected={selectedSize}
          onChange={setSelectedSize}
          basePrice={product.basePrice}
        />

        {/* Footer */}
        <div className="product-card__footer">
          <div className="product-card__price">
            <span className="product-card__price-label">from</span>
            <strong>{formatPrice(price)}</strong>
          </div>
          <motion.button
            className={`product-card__add-btn ${isAdding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            whileTap={{ scale: 0.9 }}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdding ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >✓</motion.span>
            ) : (
              <ShoppingBag size={16} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
