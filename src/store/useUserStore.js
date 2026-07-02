import { create } from 'zustand';

/**
 * Stores the user's personalisation from the Welcome page.
 * - name: the name they entered
 * - coffeeType: their favourite coffee selection
 * - hasCompletedWelcome: whether they've submitted the Welcome form
 * - skippedWelcome: whether the user chose to skip onboarding
 */

const COFFEE_SUFFIXES = {
  AMERICANO: 'cano',
  AFFOGATO: 'gato',
  FRAPPE: 'appe',
  LATTE: 'Latte',
  VIETNAMESE: 'Viet',
  CORTADO: 'tado',
  COLDBREW: 'Brew',
  ESPRESSO: 'esso',
};

export const COFFEE_TYPES = Object.keys(COFFEE_SUFFIXES);

export const useUserStore = create(
  (set, get) => ({
    name: '',
    coffeeType: '',
    hasCompletedWelcome: false,
    skippedWelcome: false,

    setName: (name) => set({ name }),
    setCoffeeType: (coffeeType) => set({ coffeeType }),

    completeWelcome: (name, coffeeType) =>
      set({ name, coffeeType, hasCompletedWelcome: true, skippedWelcome: false }),

    skipWelcome: () =>
      set({ name: '', coffeeType: '', hasCompletedWelcome: true, skippedWelcome: true }),

    getHeroText: () => {
      const { name, coffeeType, skippedWelcome } = get();
      if (skippedWelcome) {
        return { displayName: 'CHILLD', suffix: 'BREW' };
      }
      const raw = (name || '').trim();
      const displayName = (raw.slice(0, 5) || 'CHILLD').toUpperCase();
      const suffix = (COFFEE_SUFFIXES[coffeeType] || 'KANO').toUpperCase();
      return { displayName, suffix };
    },

    resetWelcome: () =>
      set({ name: '', coffeeType: '', hasCompletedWelcome: false, skippedWelcome: false }),
  })
);

