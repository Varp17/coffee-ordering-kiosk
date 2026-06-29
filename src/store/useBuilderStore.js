import { create } from 'zustand';

const CONCENTRATE_BASE_COST = {
  'Coffee 50:50': 40, 'Coffee 70:30': 45, 'Sif': 35,
  'Cascara': 50, '100% Arabica': 55, '60-40': 42,
};

const SWEETENER_COST = {
  'Sugar Syrup': 10, 'Jaggery Syrup': 12, 'Honey Drizzle': 15,
  'Vanilla Syrup': 10, 'Salted Caramel': 12, 'Hazelnut Syrup': 12,
  'Chocolate Drizzle': 12, 'Cinnamon': 8, 'Cacao Powder': 10,
  'Nutmeg Powder': 10, 'Cinnamon Cacao Powder': 12, 'Cocoa Cinnamon': 12,
  'Cocoa Powder Sprinkle': 10, 'Brown Sugar Dust': 8, 'Condensed Milk': 15,
  'Orange Syrup': 10, 'Ginger Syrup': 10, 'Sugar Free': 12, 'Indian Tonic Water': 15,
};

const MILK_COST = {
  'Dairy': 20, 'Dairy Milk': 20, 'Oat Milk': 30,
  'Coconut Milk': 25, 'Almond Milk': 35,
};

const TOPPING_COST = {
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

function calcCost(type, name, qty) {
  if (!name || name === '-' || name === '') return 0;
  const map = type === 'concentrate' ? CONCENTRATE_BASE_COST
    : type === 'sweetener' ? SWEETENER_COST
    : type === 'milk' ? MILK_COST : TOPPING_COST;
  const base = map[name] || 10;
  const n = parseInt(qty) || 0;
  const factor = (type === 'concentrate' || type === 'milk') ? (n / 100) : (n / 15);
  return Math.round(base * Math.max(0.5, factor));
}

export const useBuilderStore = create((set, get) => ({
  step: 1, maxStep: 6, direction: 1,
  category: null, selectedRecipe: null,
  concentrateType: '', concentrateQty: '',
  sweetener: '', sweetenerQty: '',
  milkType: '', milkQty: '',
  topping: '', remarks: '', image: '',
  extraToppings: [],
  warnings: [],
  concentrateCost: 0, sweetenerCost: 0, milkCost: 0, toppingCost: 0, basePrice: 60,
  coffeePage: 1,

  setCoffeePage: (p) => set({ coffeePage: p }),
  setCategory: (cat) => set({ category: cat }),

  setSelectedRecipe: (recipe) => {
    const img = recipe.image || '/images/products/coffee-concentrate-bottle.png';
    const cc = calcCost('concentrate', recipe.concentrateType, recipe.concentrateQty);
    const sc = calcCost('sweetener', recipe.sweetener, recipe.sweetenerQty);
    const mc = calcCost('milk', recipe.milkType, recipe.milkQty);
    const tc = calcCost('topping', recipe.topping, recipe.toppingQty || recipe.topping);
    set({
      selectedRecipe: recipe,
      concentrateType: recipe.concentrateType, concentrateQty: recipe.concentrateQty,
      sweetener: recipe.sweetener, sweetenerQty: recipe.sweetenerQty,
      milkType: recipe.milkType, milkQty: recipe.milkQty,
      topping: recipe.topping === '-' ? '' : recipe.topping,
      remarks: recipe.remarks, image: img,
      warnings: [], extraToppings: [],
      concentrateCost: cc, sweetenerCost: sc, milkCost: mc, toppingCost: tc,
    });
  },

  setConcentrate: (type, qty) => set({ concentrateType: type, concentrateQty: qty, concentrateCost: calcCost('concentrate', type, qty) }),
  setConcentrateQty: (qty) => set(s => ({ concentrateQty: qty, concentrateCost: calcCost('concentrate', s.concentrateType, qty) })),
  setSweetener: (s, qty) => set({ sweetener: s, sweetenerQty: qty, sweetenerCost: calcCost('sweetener', s, qty) }),
  setSweetenerQty: (qty) => set(s => ({ sweetenerQty: qty, sweetenerCost: calcCost('sweetener', s.sweetener, qty) })),
  setMilkType: (m, qty) => set({ milkType: m, milkQty: qty, milkCost: calcCost('milk', m, qty) }),
  setMilkQty: (qty) => set(s => ({ milkQty: qty, milkCost: calcCost('milk', s.milkType, qty) })),
  setTopping: (t, qty) => {
    const cost = calcCost('topping', t, qty);
    set({ topping: t, toppingCost: cost, extraToppings: [] });
  },

  addExtraTopping: (name) => {
    const { extraToppings, topping } = get();
    if (name === topping || extraToppings.some(e => e.name === name)) return;
    const cost = calcCost('topping', name, '15');
    set({ extraToppings: [...extraToppings, { name, cost }] });
  },
  removeExtraTopping: (name) => set(s => ({ extraToppings: s.extraToppings.filter(e => e.name !== name) })),

  setRemarks: (r) => set({ remarks: r }),
  setImage: (img) => set({ image: img }),
  setName: (n) => set({ name: n }),

  getTotalCost: () => {
    const { basePrice, concentrateCost, sweetenerCost, milkCost, toppingCost, extraToppings } = get();
    const extraCost = extraToppings.reduce((sum, e) => sum + e.cost, 0);
    return basePrice + concentrateCost + sweetenerCost + milkCost + toppingCost + extraCost;
  },

  getCostBreakdown: () => {
    const s = get();
    return {
      base: s.basePrice,
      concentrate: { name: s.concentrateType, qty: s.concentrateQty, cost: s.concentrateCost },
      sweetener: { name: s.sweetener, qty: s.sweetenerQty, cost: s.sweetenerCost },
      milk: { name: s.milkType, qty: s.milkQty, cost: s.milkCost },
      topping: { name: s.topping || null, cost: s.toppingCost },
      extraToppings: s.extraToppings,
    };
  },

  goNext: () => { const { step, maxStep } = get(); if (step < maxStep) set({ step: step + 1, direction: 1 }); },
  goBack: () => { const { step } = get(); if (step > 1) set({ step: step - 1, direction: -1 }); },
  goToStep: (s) => { const { step } = get(); if (s >= 1 && s <= get().maxStep) set({ step: s, direction: s > step ? 1 : -1 }); },

  reset: () => set({
    step: 1, direction: 1, category: null, selectedRecipe: null,
    concentrateType: '', concentrateQty: '', sweetener: '', sweetenerQty: '',
    milkType: '', milkQty: '', topping: '', remarks: '', image: '',
    extraToppings: [], warnings: [],
    concentrateCost: 0, sweetenerCost: 0, milkCost: 0, toppingCost: 0,
    coffeePage: 1,
  }),
}));