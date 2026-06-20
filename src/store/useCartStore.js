import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(
          (i) =>
            i.id === item.id &&
            i.size === item.size &&
            JSON.stringify(i.addons || []) === JSON.stringify(item.addons || [])
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id &&
              i.size === item.size &&
              JSON.stringify(i.addons || []) === JSON.stringify(item.addons || [])
                ? { ...i, qty: i.qty + (item.qty || 1) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                ...item,
                qty: item.qty || 1,
                cartKey: `${item.id}_${item.size}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
              },
            ],
          });
        }
      },

      removeItem: (cartKey) => {
        set({ items: get().items.filter((i) => i.cartKey !== cartKey) });
      },

      updateQty: (cartKey, qty) => {
        if (qty <= 0) {
          get().removeItem(cartKey);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.cartKey === cartKey ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, i) => acc + i.qty, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
    }),
    { name: 'chilld-cart' }
  )
);
