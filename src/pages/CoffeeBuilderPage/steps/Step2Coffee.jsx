import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { coffeeRecipes, normalize } from '../CoffeeBuilder/coffeeRecipes';
import '../StepLayout.css';

const ITEMS_PER_PAGE = 40;

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

function randCost(name) {
  return 120 + (hashStr(name) % 81);
}

function pickRecommended(drinks, concentrateType) {
  const seed = hashStr(concentrateType || 'all');
  const count = Math.min(3, drinks.length);
  const picked = new Set();
  const result = new Set();
  for (let i = 0; i < count; i++) {
    const idx = ((seed * (i + 1) * 7) % drinks.length);
    if (!picked.has(idx)) {
      picked.add(idx);
      result.add(drinks[idx].name);
    }
  }
  return result;
}

export default function Step2Coffee() {
  const { selectedRecipe, setSelectedRecipe, concentrateType, coffeePage, setCoffeePage } = useBuilderStore();

  const filtered = useMemo(() => {
    if (!concentrateType) return coffeeRecipes;
    return coffeeRecipes.filter(r =>
      normalize(r.concentrateType) === normalize(concentrateType)
    );
  }, [concentrateType]);

  const recommended = useMemo(() => pickRecommended(filtered, concentrateType), [filtered, concentrateType]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const page = Math.min(coffeePage, totalPages || 1);
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    .sort((a, b) => {
      const aRec = recommended.has(a.name) ? 0 : 1;
      const bRec = recommended.has(b.name) ? 0 : 1;
      return aRec - bRec;
    });

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">☕</span>
        <h2 className="step-layout__title">Choose Your Drink</h2>
        <p className="step-layout__desc">
          {filtered.length} drinks available{concentrateType ? ` for ${concentrateType}` : ''}
        </p>
      </div>

      <div className="drink-grid">
        {pageItems.map((drink) => {
          const isSelected = selectedRecipe?.name === drink.name;
          const isRec = recommended.has(drink.name);
          const cost = randCost(drink.name);
          return (
            <div
              key={drink.name}
              className={`card drink-card ${isSelected ? 'selected' : ''} ${isRec ? 'drink-card--recommended' : ''}`}
              onClick={() => setSelectedRecipe(drink)}
            >
              {isRec && (
                <div className="drink-card__rec-badge">
                  <Star size={10} fill="currentColor" /> Highly Recommended
                </div>
              )}
              <div className="drink-card__img-wrap">
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="drink-card__img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="drink-card__name">{drink.name}</span>
              <span className="drink-card__cost">₹{cost}</span>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination__btn"
            disabled={page <= 1}
            onClick={() => setCoffeePage(page - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="pagination__info">Page {page} of {totalPages}</span>
          <button
            className="pagination__btn"
            disabled={page >= totalPages}
            onClick={() => setCoffeePage(page + 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {selectedRecipe && (
        <div className="step-continue">
          <p>Selected: {selectedRecipe.name}</p>
        </div>
      )}
    </div>
  );
}