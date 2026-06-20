// =====================================================
// CHILLD COFFEE — Addon Recommendations
// Rules for suggesting addons based on cart items
// =====================================================

export const ADDONS = [
  {
    id: 'addon001',
    name: 'Extra Espresso Shot',
    description: 'Add an extra shot for that extra kick.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=85&auto=format&fit=crop',
    compatibleWith: ['espresso', 'latte', 'cappuccino', 'iced', 'cold-brew'],
  },
  {
    id: 'addon002',
    name: 'Oat Milk Upgrade',
    description: 'Switch to barista oat milk for a creamier, vegan experience.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&q=85&auto=format&fit=crop',
    compatibleWith: ['latte', 'cappuccino', 'matcha', 'iced'],
  },
  {
    id: 'addon003',
    name: 'Ceylon Cinnamon Dust',
    description: 'Freshly-ground cinnamon on top — aromatic and warming.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=85&auto=format&fit=crop',
    compatibleWith: ['cappuccino', 'latte', 'matcha', 'espresso'],
  },
  {
    id: 'addon004',
    name: 'Honey Drizzle',
    description: 'Cold-extracted wildflower honey drizzled on top.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=85&auto=format&fit=crop',
    compatibleWith: ['latte', 'cappuccino', 'cold-brew', 'matcha'],
  },
  {
    id: 'addon005',
    name: 'Cold Brew Ice Cubes',
    description: 'Coffee ice cubes so your drink never gets diluted.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=85&auto=format&fit=crop',
    compatibleWith: ['cold-brew', 'iced'],
  },
  {
    id: 'addon006',
    name: 'Vanilla Jaggery Syrup',
    description: 'House-made vanilla-jaggery syrup — earthy sweet notes.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=85&auto=format&fit=crop',
    compatibleWith: ['latte', 'cappuccino', 'iced', 'cold-brew'],
  },
];

/**
 * Get relevant addon recommendations for the current cart
 * Returns top 3 addons not already in cart
 */
export function getRecommendations(cartItems, maxCount = 3) {
  const cartCategories = cartItems.map((i) => i.category);
  const scored = ADDONS.map((addon) => {
    const score = addon.compatibleWith.filter((c) =>
      cartCategories.includes(c)
    ).length;
    return { ...addon, score };
  });
  return scored
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount);
}
