import './SizeSelector.css';
import { formatPrice } from '@/utils/coffeeBuilder';

export default function SizeSelector({ sizes, selected, onChange }) {
  return (
    <div className="size-selector" role="group" aria-label="Select size">
      {sizes.map((size) => {
        const isActive = selected?.id === size.id;
        return (
          <button
            key={size.id}
            className={`size-selector__btn ${isActive ? 'size-selector__btn--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onChange(size); }}
            aria-pressed={isActive}
          >
            <span className="size-selector__label">{size.label}</span>
            <span className="size-selector__ml">{size.ml}ml</span>
            {size.modifier > 0 && (
              <span className="size-selector__diff">+{formatPrice(size.modifier)}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
