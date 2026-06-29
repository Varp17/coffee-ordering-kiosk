import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import './IngredientCard.css';

export default function IngredientCard({ item, selected, onSelect, type }) {
  const isActive = selected?.id === item.id;

  return (
    <motion.button
      className={`ingredient-card ${isActive ? 'ingredient-card--selected' : ''}`}
      onClick={() => onSelect(item)}
      whileTap={{ scale: 0.97 }}
      layout
      aria-pressed={isActive}
    >
      {/* Image */}
      <div
        className="ingredient-card__img-wrap"
        style={{ '--liquid-color': item.color }}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="ingredient-card__img"
        />

        {/* Selected checkmark */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="ingredient-card__check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Check size={18} strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge */}
        {item.badge && (
          <span className={`ingredient-card__badge badge--${item.badge}`}>
            {item.badge === 'recommended' ? '⭐ Rec' : item.badge === 'most-preferred' ? '❤️ Fav' : item.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="ingredient-card__body">
        <p className="ingredient-card__name">{item.name}</p>
        <p className="ingredient-card__label">{item.label}</p>

        {/* Type-specific metadata */}
        {type === 'concentrate' && item.aroma && (
          <p className="ingredient-card__meta">
            <span className="meta-tag">{item.temp}</span>
            <span className="meta-tag">{item.extraction}</span>
          </p>
        )}
        {type === 'sweetener' && item.sweetness && (
          <p className="ingredient-card__meta">
            <span className="meta-tag">Sweetness: {item.sweetness}</span>
          </p>
        )}
        {type === 'milk' && item.texture && (
          <p className="ingredient-card__meta">
            <span className="meta-tag">{item.texture}</span>
            <span className="meta-tag">{item.fat} fat</span>
          </p>
        )}
        {item.priceModifier > 0 ? (
          <p className="ingredient-card__price-add">+₹{item.priceModifier}</p>
        ) : (
          <p className="ingredient-card__price-add price-free">Free</p>
        )}
      </div>
    </motion.button>
  );
}
