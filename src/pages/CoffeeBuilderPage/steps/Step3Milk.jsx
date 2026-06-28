import { useBuilderStore } from '@/store/useBuilderStore';
import '../StepLayout.css';

const MILK_OPTIONS = [
  { id: 'Dairy', label: 'Dairy', emoji: '🥛' },
  { id: 'Dairy Milk', label: 'Dairy Milk', emoji: '🥛' },
  { id: 'Oat Milk', label: 'Oat Milk', emoji: '🌾' },
  { id: 'Coconut Milk', label: 'Coconut Milk', emoji: '🥥' },
];

const QTY_PRESETS = [150, 155, 160, 165, 170, 175, 180];

export default function Step3Milk() {
  const { milkType, milkQty, setMilkType, setMilkQty, selectedRecipe } = useBuilderStore();
  const isFixed = selectedRecipe?.remarks === 'Fixed Menu';
  const recipeMilk = selectedRecipe?.milkType;
  const showWarning = milkType && recipeMilk && milkType !== recipeMilk;

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🥛</span>
        <h2 className="step-layout__title">Choose Body (Milk)</h2>
        <p className="step-layout__desc">Select milk type and quantity</p>
      </div>

      {showWarning && (
        <div className={`alert-banner ${isFixed ? 'alert-banner--fixed' : 'alert-banner--warn'}`}>
          {isFixed
            ? 'This is a Fixed Menu item. Changing the milk type may break the intended flavor profile.'
            : `Recipe suggests ${recipeMilk}. This change may affect the flavor balance.`}
        </div>
      )}

      <div className="split-panel">
        {/* Left: 2×2 milk grid */}
        <div className="split-panel__left">
          <div className="milk-grid">
            {MILK_OPTIONS.map(m => {
              const isSelected = milkType === m.id;
              return (
                <div
                  key={m.id}
                  className={`card milk-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setMilkType(m.id)}
                >
                  <span className="milk-card__emoji">{m.emoji}</span>
                  <span className="milk-card__label">{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: quantity selector */}
        <div className="split-panel__right">
          <div className="qty-panel">
            <h3 className="qty-panel__title">Quantity</h3>
            <div className="qty-presets">
              {QTY_PRESETS.map(q => (
                <button
                  key={q}
                  className={`qty-btn ${milkQty === `${q} gm` || milkQty === `${q} ml` ? 'qty-btn--active' : ''}`}
                  onClick={() => setMilkQty(`${q} gm`)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="qty-custom">
              <input
                type="number"
                className="qty-input"
                placeholder="Custom gm/ml"
                value={milkQty.replace(/[^\d]/g, '')}
                onChange={e => {
                  const v = e.target.value;
                  setMilkQty(v ? `${v} gm` : '');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}