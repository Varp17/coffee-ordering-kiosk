import { useBuilderStore } from '@/store/useBuilderStore';
import '../StepLayout.css';

const SWEETENERS = [
  { id: 'Sugar Syrup', label: 'Sugar Syrup', cost: 10, img: '/images/CofeeBuilder/SugarSyrup.png' },
  { id: 'Jaggery Syrup', label: 'Jaggery Syrup', cost: 12, img: '/images/CofeeBuilder/JaggerySyrup.png' },
];

const QTY_PRESETS_GM = [12, 15, 20, 25];
const QTY_PRESETS_ML = ['15ml', '20ml'];

function calcSweetCost(type, qty) {
  const base = SWEETENERS.find(s => s.id === type)?.cost || 10;
  const n = parseInt(qty) || 15;
  return Math.round(base * (n / 15));
}

export default function Step4Sweetener() {
  const { sweetener, sweetenerQty, setSweetener, setSweetenerQty, selectedRecipe } = useBuilderStore();

  const recommended = selectedRecipe?.sweetener || null;
  const recommendedQty = selectedRecipe?.sweetenerQty || null;
  const isFixed = selectedRecipe?.remarks === 'Fixed Menu';
  const showWarning = sweetener && recommended && sweetener !== recommended;

  const sorted = [...SWEETENERS].sort((a, b) => {
    const aR = recommended && a.id.toLowerCase() === recommended.toLowerCase() ? 0 : 1;
    const bR = recommended && b.id.toLowerCase() === recommended.toLowerCase() ? 0 : 1;
    return aR - bR;
  });

  const qtyChanged = sweetenerQty && recommendedQty && sweetenerQty !== recommendedQty;
  const displayCost = calcSweetCost(sweetener, sweetenerQty);

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🍯</span>
        <h2 className="step-layout__title">Choose Sweetener</h2>
        <p className="step-layout__desc">Select sweetener type</p>
      </div>

      {showWarning && (
        <div className={`alert-banner ${isFixed ? 'alert-banner--fixed' : 'alert-banner--warn'}`}>
          {isFixed
            ? 'Fixed Menu item. Changing sweetener may break flavor.'
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
          <div className="sweetener-row">
            {sorted.map((s) => {
              const isSelected = sweetener === s.id;
              const isRec = recommended && recommended.toLowerCase() === s.id.toLowerCase();
              const itemCost = calcSweetCost(s.id, recommendedQty || '15 gm');
              return (
                <div
                  key={s.id}
                  className={`card sweetener-card ${isSelected ? 'selected' : ''} ${isRec && !isSelected ? 'recommended' : ''}`}
                  onClick={() => { const qty = recommendedQty || '15 gm'; setSweetener(s.id, qty); }}
                >
                  <div className="sweetener-card__img-wrap">
                    <img src={s.img} alt={s.label} className="sweetener-card__img" loading="lazy" decoding="async" />
                  </div>
                  <span className="sweetener-card__label">{s.label}</span>
                  <span className="sweetener-card__cost">₹{itemCost}</span>
                  {isRec && <span className="sweetener-card__rec">Recommended</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="split-panel__right">
          <div className="qty-panel">
            <h3 className="qty-panel__title">Quantity</h3>
            {sweetener && <p className="qty-cost">Cost: ₹{displayCost}</p>}
            {recommendedQty && (
              <p className="qty-recommended">Recommended: {recommendedQty}</p>
            )}
            <div className="qty-presets">
              {QTY_PRESETS_GM.map(q => (
                <button key={q} className={`qty-btn ${sweetenerQty === `${q} gm` ? 'qty-btn--active' : ''}`} onClick={() => setSweetenerQty(`${q} gm`)}>
                  {q}g
                </button>
              ))}
              {QTY_PRESETS_ML.map(q => (
                <button key={q} className={`qty-btn ${sweetenerQty === q ? 'qty-btn--active' : ''}`} onClick={() => setSweetenerQty(q)}>
                  {q}
                </button>
              ))}
            </div>
            <div className="qty-custom">
              <input
                type="text"
                className="qty-input"
                placeholder="Custom gm"
                value={sweetenerQty || ''}
                onChange={(e) => { const v = e.target.value; if (v) setSweetenerQty(v); }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}