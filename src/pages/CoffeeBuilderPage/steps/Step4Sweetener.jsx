import { useBuilderStore } from '@/store/useBuilderStore';
import '../StepLayout.css';

const SWEETENERS = [
  { id: 'Sugar Syrup', label: 'Sugar Syrup', emoji: '🍯' },
  { id: 'Jaggery Syrup', label: 'Jaggery Syrup', emoji: '🍬' },
];

const QTY_PRESETS_GM = [12, 15, 20, 25];
const QTY_PRESETS_ML = ['15ml', '20ml'];

export default function Step4Sweetener() {
  const { sweetener, sweetenerQty, setSweetener, setSweetenerQty, selectedRecipe } = useBuilderStore();
  const isFixed = selectedRecipe?.remarks === 'Fixed Menu';
  const recipeSweet = selectedRecipe?.sweetener;
  const showWarning = sweetener && recipeSweet && sweetener !== recipeSweet;

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🍯</span>
        <h2 className="step-layout__title">Choose Sweetener</h2>
        <p className="step-layout__desc">Select sweetener type and quantity</p>
      </div>

      {showWarning && (
        <div className={`alert-banner ${isFixed ? 'alert-banner--fixed' : 'alert-banner--warn'}`}>
          {isFixed
            ? 'This is a Fixed Menu item. Changing the sweetener may break the intended flavor profile.'
            : `Recipe suggests ${recipeSweet}. This change may affect the flavor balance.`}
        </div>
      )}

      <div className="split-panel">
        {/* Left: 2 sweetener cards */}
        <div className="split-panel__left">
          <div className="sweetener-row">
            {SWEETENERS.map(s => {
              const isSelected = sweetener === s.id;
              return (
                <div
                  key={s.id}
                  className={`card sweetener-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSweetener(s.id)}
                >
                  <span className="sweetener-card__emoji">{s.emoji}</span>
                  <span className="sweetener-card__label">{s.label}</span>
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
              {QTY_PRESETS_GM.map(q => (
                <button
                  key={q}
                  className={`qty-btn ${sweetenerQty === `${q} gm` ? 'qty-btn--active' : ''}`}
                  onClick={() => setSweetenerQty(`${q} gm`)}
                >
                  {q}g
                </button>
              ))}
              {QTY_PRESETS_ML.map(q => (
                <button
                  key={q}
                  className={`qty-btn ${sweetenerQty === q ? 'qty-btn--active' : ''}`}
                  onClick={() => setSweetenerQty(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="qty-custom">
              <input
                type="number"
                className="qty-input"
                placeholder="Custom gm"
                value={sweetenerQty.replace(/[^\d]/g, '')}
                onChange={e => {
                  const v = e.target.value;
                  setSweetenerQty(v ? `${v} gm` : '');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}