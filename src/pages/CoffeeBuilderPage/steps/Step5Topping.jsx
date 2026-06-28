import { useBuilderStore } from '@/store/useBuilderStore';
import '../StepLayout.css';

const TOPPING_GROUPS = [
  { label: 'Drizzle', toppings: ['Chocolate Drizzle', 'Honey Drizzle', 'Maple Drizzle', 'Caramel Drizzle'] },
  { label: 'Powder', toppings: ['Cinnamon Powder', 'Cocoa Powder', 'Nutmeg Powder', 'Cacao Powder', 'Brown Sugar Dust'] },
  { label: 'Syrups', toppings: ['Vanilla Syrup', 'Hazelnut Syrup', 'Lavender Syrup'] },
  { label: 'Flakes & Crush', toppings: ['Almond Flakes', 'Coconut Flakes', 'Almond Cashew Crush'] },
  { label: 'Special', toppings: ['Salted Caramel', 'Strawberry Crush', 'Mango Pulp', 'Thick Milk Foam', 'Cinnamon', 'Ice Cubes', 'Rainbow Sprinkles', 'Golden Cream', 'Honey Nutmeg', 'Cocoa Almond Flakes', 'Cocoa Cinnamon', 'Cinnamon Cacao Powder', 'Cinnamon Nutmeg', 'Elaichi Pinch'] },
  { label: 'Others', toppings: ['Fresh Cream', 'Chocolate Syrup'] },
];

export default function Step5Topping() {
  const { topping, setTopping, selectedRecipe } = useBuilderStore();
  const isFixed = selectedRecipe?.remarks === 'Fixed Menu';
  const recipeTopping = selectedRecipe?.topping;
  const showWarning = topping && recipeTopping && topping !== recipeTopping && recipeTopping !== '-';

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🎨</span>
        <h2 className="step-layout__title">Choose Garnish</h2>
        <p className="step-layout__desc">Select toppings, drizzles, and garnishes</p>
      </div>

      {showWarning && (
        <div className={`alert-banner ${isFixed ? 'alert-banner--fixed' : 'alert-banner--warn'}`}>
          {isFixed
            ? 'This is a Fixed Menu item. Changing the garnish may break the intended flavor profile.'
            : `Recipe suggests ${recipeTopping}. This change may affect the flavor balance.`}
        </div>
      )}

      <div className="topping-groups">
        {TOPPING_GROUPS.map((group, gi) => {
          const dir = gi % 2 === 0 ? 'ltr' : 'rtl';
          const duplicated = [...group.toppings, ...group.toppings, ...group.toppings];
          return (
            <div key={group.label} className="topping-group">
              <h3 className="topping-group__label">{group.label}</h3>
              <div className={`scroll-row__inner scroll-row__inner--${dir}`}>
                <div className="scroll-row__track">
                  {duplicated.map((t, i) => {
                    const isSelected = topping === t;
                    return (
                      <div
                        key={`${t}-${i}`}
                        className={`topping-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => setTopping(isSelected ? '' : t)}
                      >
                        {t}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {topping && (
        <div className="step-continue" style={{ marginTop: 16 }}>
          <p>Selected garnish: {topping}</p>
        </div>
      )}
    </div>
  );
}