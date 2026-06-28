import { useMemo } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { coffeeRecipes } from '../CoffeeBuilder/coffeeRecipes';
import '../StepLayout.css';

const CATEGORY_MAP = {
  dairy: ['Dairy', 'Dairy Milk'],
  oat: ['Oat Milk'],
  coconut: ['Coconut Milk'],
  sugar: ['Sugar Syrup'],
  jaggery: ['Jaggery Syrup'],
  coffee50: ['Coffee 50:50'],
  coffee70: ['Coffee 70-30'],
};

function getGroupKey(r) {
  return `${r.concentrateType}||${r.sweetener}||${r.milkType}`;
}

export default function Step2Coffee() {
  const { category, selectedRecipe, setSelectedRecipe, goNext } = useBuilderStore();

  const filtered = useMemo(() => {
    let list = coffeeRecipes;
    if (category && CATEGORY_MAP[category]) {
      const vals = CATEGORY_MAP[category];
      list = list.filter(r =>
        vals.includes(r.sweetener) ||
        vals.includes(r.milkType) ||
        vals.includes(r.concentrateType)
      );
    }
    return list;
  }, [category]);

  const rows = useMemo(() => {
    const groups = {};
    filtered.forEach(r => {
      const key = getGroupKey(r);
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    const entries = Object.entries(groups);
    const maxRows = Math.min(entries.length, 8);
    const result = [];
    for (let i = 0; i < maxRows; i++) {
      const [, drinks] = entries[i];
      result.push({ rowIndex: i, drinks });
    }
    return result;
  }, [filtered]);

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">☕</span>
        <h2 className="step-layout__title">Choose Your Coffee</h2>
        <p className="step-layout__desc">{filtered.length} drinks available{category ? ` in selected category` : ''}</p>
      </div>

      <div className="scroll-rows">
        {rows.map(({ rowIndex, drinks }) => {
          const dir = rowIndex % 2 === 0 ? 'ltr' : 'rtl';
          const duplicated = [...drinks, ...drinks, ...drinks];
          return (
            <div key={`row-${rowIndex}`} className="scroll-row">
              <div className={`scroll-row__inner scroll-row__inner--${dir}`}>
                <div className="scroll-row__track">
                  {duplicated.map((drink, i) => {
                    const isSelected = selectedRecipe?.name === drink.name;
                    return (
                      <div
                        key={`${drink.name}-${i}`}
                        className={`scroll-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => { setSelectedRecipe(drink); setTimeout(() => goNext(), 300); }}
                      >
                        <div className="scroll-card__img-wrap">
                          <img
                            src={drink.image}
                            alt={drink.name}
                            className="scroll-card__img"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <span className="scroll-card__name">{drink.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRecipe && (
        <div className="step-continue" style={{ marginTop: 16 }}>
          <p>Selected: {selectedRecipe.name}</p>
        </div>
      )}
    </div>
  );
}