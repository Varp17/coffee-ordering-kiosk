import { useEffect, useRef } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import '../StepLayout.css';

const TOPPING_COST_MAP = {
  'Golden Cream': 15, 'Ice Cubes': 5, 'Vanilla Syrup': 10,
  'Salted Caramel': 12, 'Cinnamon': 8, 'Honey Drizzle': 12,
  'Honey Nutmeg': 12, 'Honey Almond': 12, 'Cinnamon Powder': 8,
  'Cinnamon Nutmeg': 10, 'Chocolate Drizzle': 12, 'Chocolate Syrup 10 ml': 10,
  'Almond Flakes': 12, 'Almond Cashew Crush': 12, 'Cocoa Cinnamon': 12,
  'Cocoa Powder Almond Flakes': 14, 'Cocoa Powder Sprinkle': 10, 'Cacao Powder': 10,
  'Cinnamon Cacao Powder': 12, 'Coconut Flakes': 10, 'Nutmeg Powder': 10,
  'Brown Sugar Dust': 8, 'Rainbow Sprinkles': 10, 'Maple Drizzle': 12,
  'Lavender Syrup': 12, 'Hazelnut Syrup': 12, 'Mango Pulp': 15,
  'Strawberry Crush': 15, 'Thick Milk Foam': 10, 'Elaichi Pinch': 8,
  'Fresh Cream 20 ml': 15, 'Milk Cream': 12, 'Cocoa Dust': 10,
  'Caramel': 12, 'Honey Pollen Almond Crush': 15, 'Lemon': 5, 'Lemon Mint': 5,
};

const TOPPING_GROUPS = [
  {
    label: 'Drizzle',
    items: [
      { name: 'Chocolate Drizzle', img: '/images/CofeeBuilder/ChocolateDrizzel.png' },
      { name: 'Honey Drizzle', img: '/images/CofeeBuilder/HoneyDrizzel.png' },
      { name: 'Caramel', img: '/images/CofeeBuilder/SaltedCaramel.png' },
    ],
  },
  {
    label: 'Powders',
    items: [
      { name: 'Cinnamon Powder', img: '/images/CofeeBuilder/CinnamonPowder.png' },
      { name: 'Cacao Powder', img: '/images/CofeeBuilder/CacaoPowder.png' },
      { name: 'Nutmeg Powder', img: '/images/CofeeBuilder/NutmegPowder.png' },
      { name: 'Cocoa Cinnamon', img: '/images/CofeeBuilder/CacaoPowder.png' },
      { name: 'Cinnamon Cacao Powder', img: '/images/CofeeBuilder/CacaoPowder.png' },
    ],
  },
  {
    label: 'Syrups',
    items: [
      { name: 'Vanilla Syrup', img: '/images/CofeeBuilder/VanillaSyrup.png' },
      { name: 'Hazelnut Syrup', img: '/images/CofeeBuilder/HazelnutSyrup.png' },
      { name: 'Lavender Syrup', img: '/images/CofeeBuilder/VanillaSyrup.png' },
      { name: 'Orange Syrup', img: '/images/CofeeBuilder/OrangeSyrup.png' },
      { name: 'Strawberry Syrup', img: '/images/CofeeBuilder/StrawberySyrup.png' },
      { name: 'Raspberry Syrup', img: '/images/CofeeBuilder/RaspberrySyrup.png' },
    ],
  },
  {
    label: 'Flakes & Crunch',
    items: [
      { name: 'Almond Flakes', img: '/images/CofeeBuilder/AlmondFlakes.png' },
      { name: 'Coconut Flakes', img: '/images/CofeeBuilder/CoconutFlakes.png' },
      { name: 'Almond Cashew Crush', img: '/images/CofeeBuilder/AlmondFlakes.png' },
      { name: 'Rainbow Sprinkles', img: '/images/CofeeBuilder/RainbowSprinkels.png' },
    ],
  },
  {
    label: 'Creams & Foam',
    items: [
      { name: 'Golden Cream', img: '/images/CofeeBuilder/GoldenCream.png' },
      { name: 'Thick Milk Foam', img: '/images/CofeeBuilder/VanillaFoam.png' },
      { name: 'Whipped Cream', img: '/images/CofeeBuilder/WhipedCream.png' },
      { name: 'Milk Cream', img: '/images/CofeeBuilder/DairyMilk.png' },
      { name: 'Fresh Cream 20 ml', img: '/images/CofeeBuilder/DairyMilk.png' },
    ],
  },
  {
    label: 'Fruits & Other',
    items: [
      { name: 'Mango Pulp', img: '/images/CofeeBuilder/StrawberySyrup.png' },
      { name: 'Strawberry Crush', img: '/images/CofeeBuilder/StrawberySyrup.png' },
      { name: 'Lemon', img: '/images/CofeeBuilder/LemonSlice.png' },
      { name: 'Lemon Mint', img: '/images/CofeeBuilder/LemonSlice.png' },
      { name: 'Ice Cubes', img: '/images/CofeeBuilder/LemonSlice.png' },
    ],
  },
];

const TOPPING_IMG_MAP = {};
TOPPING_GROUPS.forEach(g => g.items.forEach(i => { TOPPING_IMG_MAP[i.name.toLowerCase()] = i.img; }));

function getCost(name) {
  return TOPPING_COST_MAP[name] || 10;
}

export default function Step5Topping() {
  const { topping, extraToppings, setTopping, addExtraTopping, removeExtraTopping, selectedRecipe } = useBuilderStore();

  const recommended = selectedRecipe?.topping && selectedRecipe.topping !== '-' ? selectedRecipe.topping : null;
  const isFixed = selectedRecipe?.remarks === 'Fixed Menu';
  const showWarning = topping && recommended && topping !== recommended;

  const cleared = useRef(false);
  useEffect(() => {
    if (!cleared.current && topping && recommended && topping === recommended) {
      setTopping('');
      cleared.current = true;
    }
  }, [topping, recommended, setTopping]);

  const handleToggle = (name) => {
    if (topping === name) {
      setTopping('');
      return;
    }
    if (extraToppings.some(e => e.name === name)) {
      removeExtraTopping(name);
      return;
    }
    if (!topping) {
      setTopping(name);
    } else {
      addExtraTopping(name);
    }
  };

  const isSelected = (name) => topping === name || extraToppings.some(e => e.name === name);

  const recImg = recommended ? TOPPING_IMG_MAP[recommended.toLowerCase()] : null;
  const extraTotal = extraToppings.reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🎨</span>
        <h2 className="step-layout__title">Choose Garnish</h2>
        <p className="step-layout__desc">Select toppings & garnishes</p>
      </div>

      {showWarning && (
        <div className={`alert-banner ${isFixed ? 'alert-banner--fixed' : 'alert-banner--warn'}`}>
          {isFixed
            ? 'Fixed Menu item. Changing garnish may break flavor.'
            : 'This change may affect the original flavor balance of this drink.'}
        </div>
      )}

      {recommended && (
        <div className="recommended-banner">
          <span className="recommended-banner__label">Recommended:</span>
          <div
            className={`topping-item ${topping === recommended && extraToppings.every(e => e.name !== recommended) ? 'selected' : ''}`}
            onClick={() => handleToggle(recommended)}
          >
            {recImg && <img src={recImg} alt={recommended} className="topping-item__img" />}
            <span className="topping-item__name">{recommended}</span>
            <span className="topping-item__cost">₹{getCost(recommended)}</span>
          </div>
        </div>
      )}

      {topping && (
        <div className="topping-selection-summary">
          <span className="topping-selection-summary__label">Primary: {topping} (₹{getCost(topping)})</span>
          {extraToppings.length > 0 && (
            <span className="topping-selection-summary__extra">
              + {extraToppings.length} extra (₹{extraTotal})
            </span>
          )}
        </div>
      )}

      <div className="topping-groups">
        {TOPPING_GROUPS.map((group) => (
          <div key={group.label} className="topping-group">
            <h3 className="topping-group__label">{group.label}</h3>
            <div className="topping-group__items">
              {group.items.map((item) => {
                const sel = isSelected(item.name);
                const isMain = topping === item.name;
                const isRec = recommended && recommended.toLowerCase() === item.name.toLowerCase();
                return (
                  <div
                    key={item.name}
                    className={`topping-item ${sel ? 'selected' : ''} ${isMain ? 'topping-item--main' : ''} ${isRec && !sel ? 'recommended' : ''}`}
                    onClick={() => handleToggle(item.name)}
                  >
                    <img src={item.img} alt={item.name} className="topping-item__img" loading="lazy" decoding="async" />
                    <span className="topping-item__name">{item.name}</span>
                    <span className="topping-item__cost">₹{getCost(item.name)}</span>
                    {isRec && !sel && <span className="topping-item__rec">Rec.</span>}
                    {isMain && <span className="topping-item__badge">Main</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}