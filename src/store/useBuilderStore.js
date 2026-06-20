import { create } from 'zustand';

export const useBuilderStore = create((set, get) => ({
  step:       1,
  maxStep:    5,
  direction:  1, // 1 = forward, -1 = back

  concentrate: null,
  sweetener:   null,
  milk:        null,
  topping:     null,
  brewName:    '',
  size:        'small',

  setConcentrate: (c) => set({ concentrate: c }),
  setSweetener:   (s) => set({ sweetener: s }),
  setMilk:        (m) => set({ milk: m }),
  setTopping:     (t) => set({ topping: t }),
  setBrewName:    (n) => set({ brewName: n }),
  setSize:        (s) => set({ size: s }),

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
    set({ step: s, direction: s > step ? 1 : -1 });
  },

  reset: () =>
    set({
      step:        1,
      direction:   1,
      concentrate: null,
      sweetener:   null,
      milk:        null,
      topping:     null,
      brewName:    '',
      size:        'small',
    }),

  isComplete: () => {
    const { concentrate, sweetener, milk, topping } = get();
    return !!(concentrate && sweetener && milk && topping);
  },

  getSelection: () => {
    const { concentrate, sweetener, milk, topping } = get();
    return { concentrate, sweetener, milk, topping };
  },
}));
