import { create } from 'zustand';

export const useBuilderStore = create((set, get) => ({
  step:           1,
  maxStep:        6,
  direction:      1,

  // Category & recipe
  category:       null,
  selectedRecipe: null,

  // Auto-filled recipe fields
  name:           '',
  concentrateType:'',
  concentrateQty: '',
  sweetener:      '',
  sweetenerQty:   '',
  milkType:       '',
  milkQty:        '',
  topping:        '',
  remarks:        '',
  image:          '',

  warnings:       [],

  setCategory:    (cat) => set({ category: cat }),

  setSelectedRecipe: (recipe) => {
    const imagePath = recipe.image || '/images/products/coffee-concentrate-bottle.png';
    set({
      selectedRecipe: recipe,
      name:           recipe.name,
      concentrateType:recipe.concentrateType,
      concentrateQty: recipe.concentrateQty,
      sweetener:      recipe.sweetener,
      sweetenerQty:   recipe.sweetenerQty,
      milkType:       recipe.milkType,
      milkQty:        recipe.milkQty,
      topping:        recipe.topping === '-' ? '' : recipe.topping,
      remarks:        recipe.remarks,
      image:          imagePath,
      warnings:       [],
    });
  },

  setConcentrate: (type) => set({ concentrateType: type }),
  setConcentrateQty: (qty) => set({ concentrateQty: qty }),
  setSweetener:   (s) => set({ sweetener: s }),
  setSweetenerQty:(qty) => set({ sweetenerQty: qty }),
  setMilkType:    (m) => set({ milkType: m }),
  setMilkQty:     (qty) => set({ milkQty: qty }),
  setTopping:     (t) => set({ topping: t }),
  setRemarks:     (r) => set({ remarks: r }),
  setImage:       (img) => set({ image: img }),
  setName:        (n) => set({ name: n }),

  goNext: () => {
    const { step, maxStep } = get();
    if (step < maxStep) set({ step: step + 1, direction: 1 });
  },

  goBack: () => {
    const { step } = get();
    if (step > 1) set({ step: step - 1, direction: -1 });
  },

  goToStep: (s) => {
    const { step } = get();
    if (s >= 1 && s <= get().maxStep) {
      set({ step: s, direction: s > step ? 1 : -1 });
    }
  },

  reset: () =>
    set({
      step:           1,
      direction:      1,
      category:       null,
      selectedRecipe: null,
      name:           '',
      concentrateType:'',
      concentrateQty: '',
      sweetener:      '',
      sweetenerQty:   '',
      milkType:       '',
      milkQty:        '',
      topping:        '',
      remarks:        '',
      image:          '',
      warnings:       [],
    }),

  isComplete: () => {
    const { name, concentrateType, sweetener, milkType, topping } = get();
    return !!(name && concentrateType && sweetener && milkType && topping !== undefined);
  },

  getSelection: () => {
    const { name, concentrateType, concentrateQty, sweetener, sweetenerQty, milkType, milkQty, topping, remarks } = get();
    return { name, concentrateType, concentrateQty, sweetener, sweetenerQty, milkType, milkQty, topping, remarks };
  },

  checkWarnings: () => {
    const { selectedRecipe, concentrateType, sweetener, milkType, topping } = get();
    const warnings = [];
    if (!selectedRecipe) return warnings;

    const isFixed = selectedRecipe.remarks === 'Fixed Menu';

    if (milkType && selectedRecipe.milkType !== milkType) {
      warnings.push({
        field: 'milkType',
        type: isFixed ? 'error' : 'warning',
        message: isFixed
          ? 'This is a fixed menu recipe. Changing this value may break the intended flavor profile.'
          : 'This change may affect the original flavor balance of this drink.'
      });
    }

    if (sweetener && selectedRecipe.sweetener !== sweetener) {
      warnings.push({
        field: 'sweetener',
        type: isFixed ? 'error' : 'warning',
        message: isFixed
          ? 'This is a fixed menu recipe. Changing this value may break the intended flavor profile.'
          : 'This change may affect the original flavor balance of this drink.'
      });
    }

    if (topping !== undefined && selectedRecipe.topping !== topping && selectedRecipe.topping !== '-') {
      warnings.push({
        field: 'topping',
        type: isFixed ? 'error' : 'warning',
        message: isFixed
          ? 'This is a fixed menu recipe. Changing this value may break the intended flavor profile.'
          : 'This change may affect the original flavor balance of this drink.'
      });
    }

    if (concentrateType && selectedRecipe.concentrateType !== concentrateType) {
      warnings.push({
        field: 'concentrateType',
        type: isFixed ? 'error' : 'warning',
        message: isFixed
          ? 'This is a fixed menu recipe. Changing this value may break the intended flavor profile.'
          : 'This change may affect the original flavor balance of this drink.'
      });
    }

    set({ warnings });
    return warnings;
  },
}));
