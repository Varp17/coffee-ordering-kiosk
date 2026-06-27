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
  bestseller: { label: 'Bestseller', color: '#C67C4E' },
  featured: { label: 'Featured', color: '#1F4BA8' },
  classic: { label: 'Classic', color: '#5F6F52' },
  smooth: { label: 'Smooth', color: '#3D7E8C' },
  'best-value': { label: 'Best Value', color: '#3D9B6B' },
  bold: { label: 'Bold', color: '#1F2A44' },
  regional: { label: 'Regional', color: '#7D4E24' },
  rich: { label: 'Rich', color: '#8A3B2A' },
  refreshing: { label: 'Refreshing', color: '#2E8B74' },
  'low-caffeine': { label: 'Low Caffeine', color: '#6B7D8F' },
};

export default function ProductCard({ product, compact = false }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const price = product.basePrice + (selectedSize?.modifier || 0);
  const image = product.gallery?.[0]?.src || product.image;
  const rating = product.reviews?.rating;
  const reviewCount = product.reviews?.count;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price,
      size: selectedSize?.id,
      image,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`, {
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
      <div className="product-card__img-wrap">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="product-card__img"
        />
        <div className="product-card__badges">
          {product.badges?.slice(0, 2).map((b) => (
            <span
              key={b}
              className="product-card__badge"
              style={{ background: BADGE_MAP[b]?.color || '#6B6560' }}
            >
              {BADGE_MAP[b]?.label || b}
            </span>
          ))}
        </div>
        <span className={`product-card__caffeine caffeine--${product.caffeine?.toLowerCase().replace(/\s/g, '-')}`}>
          Caffeine: {product.caffeine}
        </span>
      </div>

      <div className="product-card__body">
        <div>
          <h3 className="product-card__name">{product.name}</h3>
          {!compact && (
            <p className="product-card__tagline">{product.tagline}</p>
          )}
        </div>

        {rating && (
          <div className="product-card__reviews" aria-label={`${rating} out of 5 from ${reviewCount} reviews`}>
            <Star size={14} fill="currentColor" />
            <strong>{rating.toFixed(1)}</strong>
            <span>({reviewCount} reviews)</span>
          </div>
        )}

        <SizeSelector
          sizes={product.sizes}
          selected={selectedSize}
          onChange={setSelectedSize}
          basePrice={product.basePrice}
        />

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
              >
                OK
              </motion.span>
            ) : (
              <ShoppingBag size={16} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
