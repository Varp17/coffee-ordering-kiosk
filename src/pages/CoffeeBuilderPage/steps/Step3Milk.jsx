import { useBuilderStore } from '@/store/useBuilderStore';
import '../StepLayout.css';

const MILK_OPTIONS = [
  { id: 'Dairy Milk', label: 'Dairy Milk', cost: 20, img: '/images/CofeeBuilder/DairyMilk.png' },
  { id: 'Oat Milk', label: 'Oat Milk', cost: 30, img: '/images/CofeeBuilder/OatMilk.png' },
  { id: 'Coconut Milk', label: 'Coconut Milk', cost: 25, img: '/images/CofeeBuilder/CoconutMilk.png' },
  { id: 'Almond Milk', label: 'Almond Milk', cost: 35, img: '/images/CofeeBuilder/AlmondMilk.png' },
];

const QTY_PRESETS = [150, 155, 160, 165, 170, 175, 180];

function calcMilkCost(type, qty) {
  const base = MILK_OPTIONS.find(m => m.id === type)?.cost || 20;
  const n = parseInt(qty) || 170;
  return Math.round(base * (n / 100));
}

export default function Step3Milk() {
  const { milkType, milkQty, setMilkType, setMilkQty, selectedRecipe } = useBuilderStore();

  const recommended = selectedRecipe?.milkType || null;
  const recommendedQty = selectedRecipe?.milkQty || null;
  const isFixed = selectedRecipe?.remarks === 'Fixed Menu';
  const showWarning = milkType && recommended && milkType !== recommended;

  const handleMilkSelect = (id) => {
    const qty = recommendedQty || '170 gm';
    setMilkType(id, qty);
  };

  const handleQtyPreset = (q) => {
    const unit = recommendedQty?.includes('ml') ? 'ml' : 'gm';
    setMilkQty(`${q} ${unit}`);
  };

  const sorted = [...MILK_OPTIONS].sort((a, b) => {
    const aR = recommended && a.id.toLowerCase() === recommended.toLowerCase() ? 0 : 1;
    const bR = recommended && b.id.toLowerCase() === recommended.toLowerCase() ? 0 : 1;
    return aR - bR;
  });

  const qtyChanged = milkQty && recommendedQty && milkQty !== recommendedQty;
  const displayCost = calcMilkCost(milkType, milkQty);

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🥛</span>
        <h2 className="step-layout__title">Choose Body (Milk)</h2>
        <p className="step-layout__desc">Select milk type</p>
      </div>

      {showWarning && (
        <div className={`alert-banner ${isFixed ? 'alert-banner--fixed' : 'alert-banner--warn'}`}>
          {isFixed
            ? 'Fixed Menu item. Changing milk may break flavor.'
            : 'This change may affect the original flavor balance of this drink.'}
        </div>
      )}

      {qtyChanged && (
        <div className="alert-banner alert-banner--warn">
          Changing the quantity may affect the flavor.
        </div>
      )}

      <div className="split-panel">
        <div className="split-panel__left">
          <div className="milk-grid">
            {sorted.map((m) => {
              const isSelected = milkType === m.id;
              const isRec = recommended && recommended.toLowerCase() === m.id.toLowerCase();
              const itemCost = calcMilkCost(m.id, recommendedQty || '170 gm');
              return (
                <div
                  key={m.id}
                  className={`card milk-card ${isSelected ? 'selected' : ''} ${isRec && !isSelected ? 'recommended' : ''}`}
                  onClick={() => handleMilkSelect(m.id)}
                >
                  <div className="milk-card__img-wrap">
                    <img src={m.img} alt={m.label} className="milk-card__img" loading="lazy" decoding="async" />
                  </div>
                  <span className="milk-card__label">{m.label}</span>
                  <span className="milk-card__cost">₹{itemCost}</span>
                  {isRec && <span className="milk-card__rec">Recommended</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="split-panel__right">
          <div className="qty-panel">
            <h3 className="qty-panel__title">Quantity</h3>
            {milkType && <p className="qty-cost">Cost: ₹{displayCost}</p>}
            {recommendedQty && (
              <p className="qty-recommended">Recommended: {recommendedQty}</p>
            )}
            <div className="qty-presets">
              {QTY_PRESETS.map(q => (
                <button
                  key={q}
                  className={`qty-btn ${milkQty === `${q} gm` || milkQty === `${q} ml` ? 'qty-btn--active' : ''}`}
                  onClick={() => handleQtyPreset(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="qty-custom">
              <input
                type="text"
                className="qty-input"
                placeholder="Custom gm/ml"
                value={milkQty || ''}
                onChange={(e) => { const v = e.target.value; if (v) setMilkQty(v); }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}