import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/coffeeBuilder';
import { getDrinkImage } from '../CoffeeBuilder/coffeeRecipes';
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
    name, setName, concentrateType, concentrateQty,
    sweetener, sweetenerQty, milkType, milkQty,
    topping, selectedRecipe,
    getTotalCost, getCostBreakdown, reset,
  } = useBuilderStore();
  const { addItem } = useCartStore();

  const [size, setSize] = useState('small');
  const sizeMod = size === 'standard' ? 30 : 0;
  const breakdown = getCostBreakdown();
  const totalCost = getTotalCost() + sizeMod;
  const recipeName = selectedRecipe?.name || name;

  const drinkImg = selectedRecipe?.image
    || getDrinkImage(recipeName)
    || '/images/products/cold-brew.png';

  const handleAddToCart = (shouldRedirect = false) => {
    const brewName = name.trim() || selectedRecipe?.name || 'My Custom Brew';
    const cartItem = {
      id: `brew_${Date.now()}`,
      name: brewName,
      price: totalCost,
      size,
      image: drinkImg,
      isCustom: !selectedRecipe,
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
        <p className="step-layout__desc">Review your creation</p>
      </div>

      <div className="review-card">
        <div className="review-drink-img">
          <img src={drinkImg} alt={recipeName} className="review-drink-img__img" />
        </div>

        <div className="review-ingredients">
          {concentrateType && (
            <div className="review-item">
              <span className="review-item__label">☕ Base</span>
              <span className="review-item__value">{concentrateType} — {concentrateQty}</span>
            </div>
          )}
          {sweetener && (
            <div className="review-item">
              <span className="review-item__label">🍯 Sweetener</span>
              <span className="review-item__value">{sweetener} — {sweetenerQty}</span>
            </div>
          )}
          {milkType && (
            <div className="review-item">
              <span className="review-item__label">🥛 Milk</span>
              <span className="review-item__value">{milkType} — {milkQty}</span>
            </div>
          )}
          {topping && (
            <div className="review-item">
              <span className="review-item__label">✨ Garnish</span>
              <span className="review-item__value">{topping}</span>
            </div>
          )}
        </div>

        <div className="cost-breakdown">
          <h3 className="cost-breakdown__title">Cost Breakdown</h3>
          <div className="cost-breakdown__item">
            <span>Base price</span>
            <span>₹{breakdown.base}</span>
          </div>
          {breakdown.concentrate.name && (
            <div className="cost-breakdown__item">
              <span>Concentrate ({breakdown.concentrate.name})</span>
              <span>₹{breakdown.concentrate.cost}</span>
            </div>
          )}
          {breakdown.sweetener.name && (
            <div className="cost-breakdown__item">
              <span>Sweetener ({breakdown.sweetener.name})</span>
              <span>₹{breakdown.sweetener.cost}</span>
            </div>
          )}
          {breakdown.milk.name && (
            <div className="cost-breakdown__item">
              <span>Milk ({breakdown.milk.name})</span>
              <span>₹{breakdown.milk.cost}</span>
            </div>
          )}
          {breakdown.topping.name && (
            <div className="cost-breakdown__item">
              <span>Topping ({breakdown.topping.name})</span>
              <span>₹{breakdown.topping.cost}</span>
            </div>
          )}
          {breakdown.extraToppings.map((e) => (
            <div key={e.name} className="cost-breakdown__item cost-breakdown__item--extra">
              <span>Extra: {e.name}</span>
              <span>₹{e.cost}</span>
            </div>
          ))}
          {sizeMod > 0 && (
            <div className="cost-breakdown__item">
              <span>Size upgrade ({getActiveSizeObj().label})</span>
              <span>₹{sizeMod}</span>
            </div>
          )}
          <div className="cost-breakdown__total">
            <span>Total</span>
            <span>₹{totalCost}</span>
          </div>
        </div>

        <div className="review-section">
          <h3 className="review-section__title">Select Size</h3>
          <SizeSelector sizes={SIZES} selected={getActiveSizeObj()} onChange={(s) => setSize(s.id)} basePrice={totalCost - sizeMod} />
        </div>

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

        <div className="review-actions">
          <div className="price-tag">
            <span className="price-label">Total</span>
            <span className="price-value">{formatPrice(totalCost)}</span>
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