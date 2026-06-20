import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Check, RefreshCw } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useCartStore } from '@/store/useCartStore';
import { matchCombo, calcBuilderPrice, generateBrewId, formatPrice } from '@/utils/coffeeBuilder';
import { NAME_SUGGESTIONS } from '@/data/ingredients';
import { getProductById } from '@/data/products';
import SizeSelector from '@/components/SizeSelector/SizeSelector';
import toast from 'react-hot-toast';
import '../StepLayout.css';
import './Step5NameReview.css';

const BUILDER_SIZES = [
  { id: 'small', label: 'Small', ml: 250, modifier: 0 },
  { id: 'standard', label: 'Standard', ml: 360, modifier: 30 },
];

export default function Step5NameReview() {
  const navigate = useNavigate();
  const {
    concentrate,
    sweetener,
    milk,
    topping,
    brewName,
    setBrewName,
    size,
    setSize,
    reset,
  } = useBuilderStore();
  const { addItem } = useCartStore();

  const [suggestions, setSuggestions] = useState([]);
  const [matchedCombo, setMatchedCombo] = useState(null);

  // Match the combo
  useEffect(() => {
    if (concentrate && sweetener && milk && topping) {
      const match = matchCombo({
        concentrateId: concentrate.id,
        sweetenerId: sweetener.id,
        milkId: milk.id,
        toppingId: topping.id,
      });
      setMatchedCombo(match);

      // If not matched, generate name suggestions
      if (!match) {
        setSuggestions(NAME_SUGGESTIONS(concentrate, milk, sweetener));
      }
    }
  }, [concentrate, sweetener, milk, topping]);

  const handleRefreshSuggestions = () => {
    setSuggestions(NAME_SUGGESTIONS(concentrate, milk, sweetener));
  };

  const getActiveSizeObj = () => {
    return BUILDER_SIZES.find((s) => s.id === size) || BUILDER_SIZES[0];
  };

  const handleSizeChange = (sizeObj) => {
    setSize(sizeObj.id);
  };

  const matchedProduct = matchedCombo ? getProductById(matchedCombo.productId) : null;
  const basePrice = matchedProduct
    ? matchedProduct.basePrice
    : calcBuilderPrice(concentrate, sweetener, milk, topping, 'small');

  const finalPrice = matchedProduct
    ? matchedProduct.basePrice + (size === 'standard' ? 30 : 0)
    : calcBuilderPrice(concentrate, sweetener, milk, topping, size);

  const handleAddToCart = (shouldRedirect = false) => {
    let cartItem;

    if (matchedProduct) {
      cartItem = {
        id: matchedProduct.id,
        name: matchedProduct.name,
        price: finalPrice,
        size: size,
        image: matchedProduct.image,
        isCustom: false,
      };
    } else {
      const name = brewName.trim() || 'My Custom Brew';
      cartItem = {
        id: generateBrewId(),
        name: name,
        price: finalPrice,
        size: size,
        image: 'https://images.unsplash.com/photo-1579888944880-d98341148733?w=800&q=85&auto=format&fit=crop',
        isCustom: true,
        ingredients: {
          concentrate: concentrate?.name,
          sweetener: sweetener?.name,
          milk: milk?.name,
          topping: topping?.name,
        },
      };
    }

    addItem(cartItem);
    toast.success(`${cartItem.name} added to cart! ☕`);

    // Reset store
    reset();

    if (shouldRedirect) {
      navigate('/location');
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="step-layout step-5-review">
      <div className="step-layout__header">
        <span className="step-layout__emoji">✨</span>
        <h2 className="step-layout__title">Review & Name</h2>
        <p className="step-layout__desc">
          Here is your custom brew. Give it a name to finalize.
        </p>
      </div>

      <div className="review-card">
        {/* Ingredients Summary */}
        <div className="review-ingredients">
          <div className="review-item">
            <span className="review-item__label">☕ Base</span>
            <span className="review-item__value">{concentrate?.name || 'None'}</span>
          </div>
          <div className="review-item">
            <span className="review-item__label">🍯 Sweetener</span>
            <span className="review-item__value">{sweetener?.name || 'None'}</span>
          </div>
          <div className="review-item">
            <span className="review-item__label">🥛 Milk</span>
            <span className="review-item__value">{milk?.name || 'None'}</span>
          </div>
          <div className="review-item">
            <span className="review-item__label">✨ Topping</span>
            <span className="review-item__value">{topping?.name || 'None'}</span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="review-section">
          <h3 className="review-section__title">Select Size</h3>
          <SizeSelector
            sizes={BUILDER_SIZES}
            selected={getActiveSizeObj()}
            onChange={handleSizeChange}
            basePrice={basePrice}
          />
        </div>

        {/* Match / Name Your Brew */}
        <div className="review-section review-naming">
          {matchedProduct ? (
            <div className="matched-combo-alert">
              <div className="matched-emoji">🎉</div>
              <div className="matched-content">
                <h4>You matched a House Blend!</h4>
                <p>This exact combination is our premium <strong>{matchedProduct.name}</strong>.</p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="review-section__title">Name Your Brew</h3>
              <input
                id="brew-name-input"
                type="text"
                className="brew-name-input"
                placeholder="E.g., Sweet Morning Kick"
                value={brewName}
                onChange={(e) => setBrewName(e.target.value)}
                maxLength={25}
              />

              {/* Suggestions */}
              <div className="suggestions-box">
                <div className="suggestions-header">
                  <span>Need inspiration?</span>
                  <button className="refresh-suggestions" onClick={handleRefreshSuggestions} aria-label="Refresh suggestions">
                    <RefreshCw size={12} />
                  </button>
                </div>
                <div className="suggestions-list">
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      className="suggestion-chip"
                      onClick={() => setBrewName(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Order Details and Action Buttons */}
        <div className="review-actions">
          <div className="price-tag">
            <span className="price-label">Total Price</span>
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
