import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/coffeeBuilder';
import SizeSelector from '@/components/SizeSelector/SizeSelector';
import toast from 'react-hot-toast';
import '../StepLayout.css';
import './Step6Review.css';

const SIZES = [
  { id: 'small', label: 'Small', ml: 250, modifier: 0 },
  { id: 'standard', label: 'Standard', ml: 360, modifier: 30 },
];

export default function Step6Review() {
  const navigate = useNavigate();
  const {
    name, setName,
    concentrateType,
    sweetener,
    milkType,
    topping, image,
    reset,
  } = useBuilderStore();
  const { addItem } = useCartStore();

  const [size, setSize] = useState('small');

  const basePrice = 140;
  const finalPrice = basePrice + (size === 'standard' ? 30 : 0);

  const handleAddToCart = (shouldRedirect = false) => {
    const brewName = name.trim() || 'My Custom Brew';
    const cartItem = {
      id: `brew_${Date.now()}`,
      name: brewName,
      price: finalPrice,
      size,
      image: image || '/images/products/coffee-concentrate-bottle.png',
      isCustom: true,
      ingredients: { concentrateType, sweetener, milkType, topping },
    };

    addItem(cartItem);
    toast.success(`${brewName} added to cart!`);
    reset();
    navigate(shouldRedirect ? '/location' : '/menu');
  };

  const getActiveSizeObj = () => SIZES.find(s => s.id === size) || SIZES[0];

  return (
    <div className="step-layout step-6-review">
      <div className="step-layout__header">
        <span className="step-layout__emoji">✨</span>
        <h2 className="step-layout__title">Review & Checkout</h2>
        <p className="step-layout__desc">Review your creation and add it to cart</p>
      </div>

      <div className="review-card">
        {/* Ingredients Summary */}
        <div className="review-ingredients">
          <div className="review-item">
            <span className="review-item__label">☕ Base</span>
            <span className="review-item__value">{concentrateType || 'None'}</span>
          </div>
          <div className="review-item">
            <span className="review-item__label">🍯 Sweetener</span>
            <span className="review-item__value">{sweetener || 'None'}</span>
          </div>
          <div className="review-item">
            <span className="review-item__label">🥛 Milk</span>
            <span className="review-item__value">{milkType || 'None'}</span>
          </div>
          <div className="review-item">
            <span className="review-item__label">✨ Garnish</span>
            <span className="review-item__value">{topping || 'None'}</span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="review-section">
          <h3 className="review-section__title">Select Size</h3>
          <SizeSelector
            sizes={SIZES}
            selected={getActiveSizeObj()}
            onChange={(s) => setSize(s.id)}
            basePrice={basePrice}
          />
        </div>

        {/* Name Input */}
        <div className="review-section">
          <h3 className="review-section__title">Name Your Brew</h3>
          <input
            type="text"
            className="brew-name-input"
            placeholder="E.g., Sweet Morning Kick"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={25}
          />
        </div>

        {/* Order Details and Actions */}
        <div className="review-actions">
          <div className="price-tag">
            <span className="price-label">Total</span>
            <span className="price-value">{formatPrice(finalPrice)}</span>
          </div>

          <div className="action-buttons-group">
            <button className="btn btn-outline" onClick={() => handleAddToCart(false)}>
              Add to Cart
            </button>
            <button className="btn btn-primary" onClick={() => handleAddToCart(true)}>
              Order Now <Sparkles size={16} style={{ marginLeft: 6 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}