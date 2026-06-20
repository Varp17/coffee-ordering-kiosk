import { KNOWN_COMBOS } from '@/data/products';

/**
 * Check if a given combination matches an existing product
 * @returns {Object|null} matching combo or null
 */
export function matchCombo({ concentrateId, sweetenerId, milkId, toppingId }) {
  return (
    KNOWN_COMBOS.find(
      (c) =>
        c.concentrateId === concentrateId &&
        c.sweetenerId   === sweetenerId &&
        c.milkId        === milkId &&
        c.toppingId     === toppingId
    ) || null
  );
}

/**
 * Calculate price for a custom brew
 */
export function calcBuilderPrice(concentrate, sweetener, milk, topping, size) {
  const base = 140;
  const sizeModifier = size === 'standard' ? 30 : 0;
  const ingredientCost =
    (concentrate?.priceModifier || 0) +
    (sweetener?.priceModifier || 0) +
    (milk?.priceModifier || 0) +
    (topping?.priceModifier || 0);
  return base + sizeModifier + ingredientCost;
}

/**
 * Generate a unique brew ID
 */
export function generateBrewId() {
  return `brew_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Get the liquid color based on concentrate + milk selection
 */
export function getLiquidColor(concentrateId, milkId) {
  const baseColors = {
    espresso:  '#3b1f13',
    'cold-brew': '#261103',
    matcha:    '#4c6e3b',
    chai:      '#7a3010',
    cascara:   '#8B4513',
  };

  const milkTints = {
    oat:     0.45,
    dairy:   0.55,
    almond:  0.4,
    coconut: 0.35,
    none:    0,
  };

  const base = baseColors[concentrateId] || '#3b1f13';
  const tint = milkTints[milkId] || 0;

  if (tint === 0) return base;

  // Simple hex blend towards cream
  const hexToRgb = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const rgbToHex = ([r, g, b]) =>
    '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

  const [r1, g1, b1] = hexToRgb(base);
  const cream = [210, 180, 140];
  const blended = [
    r1 + (cream[0] - r1) * tint,
    g1 + (cream[1] - g1) * tint,
    b1 + (cream[2] - b1) * tint,
  ];

  return rgbToHex(blended);
}

/**
 * Generate order token (3-digit padded)
 */
export function generateToken() {
  return String(Math.floor(Math.random() * 900) + 100);
}

/**
 * Format price in INR
 */
export function formatPrice(amount) {
  return `₹${amount}`;
}
