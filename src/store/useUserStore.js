import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Stores the user's personalisation from the Welcome page.
 * - name: the name they entered
 * - coffeeType: their favourite coffee selection
 * - hasCompletedWelcome: whether they've submitted the Welcome form
 */

/* Coffee type → suffix mapping for the personalised hero text */
const COFFEE_SUFFIXES = {
  ESPRESSO:   'RESSO',
  AMERICANO:  'CANO',
  CAPPUCCINO: 'CCINO',
  LATTE:      'LATTE',
  COLDBREW:   'BREW',
  CORTARDO:   'TARDO',
  FRAPPE:     'RAPPE',
  AFFOGATO:   'GATO',
};

export const COFFEE_TYPES = Object.keys(COFFEE_SUFFIXES);

export const useUserStore = create(
  persist(
    (set, get) => ({
      name: '',
      coffeeType: '',
      hasCompletedWelcome: false,

      setName: (name) => set({ name }),
      setCoffeeType: (coffeeType) => set({ coffeeType }),

      completeWelcome: (name, coffeeType) =>
        set({ name, coffeeType, hasCompletedWelcome: true }),

      /** Returns the personalised hero text: NAME + coffee suffix */
      getHeroText: () => {
        const { name } = get();
        const displayName = (name || 'CHILLD').toUpperCase();
        const suffix = 'KANO';
        return { displayName, suffix };
      },

      resetWelcome: () =>
        set({ name: '', coffeeType: '', hasCompletedWelcome: false }),
    }),
    { name: 'chilld-user' }
  )
);
