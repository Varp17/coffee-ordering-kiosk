// =====================================================
// CHILLD COFFEE - Concentrate Product Catalog
// =====================================================

const PLACEHOLDER_IMAGE = '/images/products/coffee-concentrate-bottle.png';

const BOTTLE_SIZES = [
  { id: '250ml', label: '250 ml', ml: 250, modifier: 0 },
  { id: '500ml', label: '500 ml', ml: 500, modifier: 300 },
  { id: '1000ml', label: '1 L', ml: 1000, modifier: 700 },
];

const galleryFor = (slug, name) => [
  {
    id: `${slug}-front`,
    label: 'Bottle front',
    src: PLACEHOLDER_IMAGE,
    alt: `${name} bottle front`,
  },
  {
    id: `${slug}-label`,
    label: 'Label detail',
    src: PLACEHOLDER_IMAGE,
    alt: `${name} label detail`,
  },
  {
    id: `${slug}-serve`,
    label: 'Serving idea',
    src: PLACEHOLDER_IMAGE,
    alt: `${name} serving suggestion`,
  },
  {
    id: `${slug}-lifestyle`,
    label: 'Lifestyle shot',
    src: PLACEHOLDER_IMAGE,
    alt: `${name} lifestyle shot`,
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'All' },
  { id: 'coffee-50-50', label: 'Coffee 50:50', icon: '50' },
  { id: 'classic-cb', label: 'Classic CB', icon: 'CB' },
  { id: 'coffee-70-30', label: 'Coffee 70:30', icon: '70' },
  { id: 'sif', label: 'SIF', icon: 'SF' },
  { id: 'cascara', label: 'Cascara', icon: 'CS' },
];

export const PRODUCTS = [
  {
    id: 'coffee-50-50-concentrate',
    category: 'coffee-50-50',
    concentrateType: 'Coffee 50:50',
    name: 'Coffee 50:50 Cold Brew Concentrate',
    tagline: 'Balanced Arabica and Robusta for everyday cold coffee.',
    description:
      'A smooth, dependable cold brew concentrate designed for creamy lattes, classic cold coffee, and quick cafe-style serves at home or in-store.',
    image: PLACEHOLDER_IMAGE,
    gallery: galleryFor('coffee-50-50', 'Coffee 50:50 Cold Brew Concentrate'),
    basePrice: 399,
    sizes: BOTTLE_SIZES,
    badges: ['featured', 'classic'],
    tags: ['coffee 50:50', 'cold brew', 'balanced', 'latte', 'concentrate'],
    ingredients: ['Cold brew coffee concentrate', 'Arabica coffee', 'Robusta coffee', 'Filtered water'],
    caffeine: 'High',
    servings: '8-10 serves',
    brewRatio: '1:3 with milk or water',
    roast: 'Medium dark',
    beanProfile: '50% Arabica, 50% Robusta',
    reviews: {
      rating: 4.8,
      count: 126,
      summary: 'Loved for its rounded body and easy cold coffee base.',
      quotes: [
        'Makes a cafe-style cold coffee in under a minute.',
        'Balanced taste, not too bitter, great with dairy milk.',
      ],
    },
    isAvailable: true,
  },
  {
    id: 'classic-cb-concentrate',
    category: 'classic-cb',
    concentrateType: 'Classic CB',
    name: 'Classic CB Cold Brew Concentrate',
    tagline: 'Clean, mellow, and slow-steeped for a lighter finish.',
    description:
      'A classic cold brew profile made for drinkers who want coffee clarity, low bitterness, and a flexible base for cold brew, tonics, and black serves.',
    image: PLACEHOLDER_IMAGE,
    gallery: galleryFor('classic-cb', 'Classic CB Cold Brew Concentrate'),
    basePrice: 429,
    sizes: BOTTLE_SIZES,
    badges: ['smooth', 'best-value'],
    tags: ['classic cb', 'cold brew', 'smooth', 'black coffee', 'concentrate'],
    ingredients: ['Cold brew coffee concentrate', 'Arabica coffee', 'Filtered water'],
    caffeine: 'Medium High',
    servings: '8-10 serves',
    brewRatio: '1:3 with water, tonic, or milk',
    roast: 'Medium plus',
    beanProfile: 'Arabica washed and natural blend',
    reviews: {
      rating: 4.7,
      count: 94,
      summary: 'A clean concentrate that works well for black cold brew.',
      quotes: [
        'Very smooth over ice, no harsh aftertaste.',
        'Perfect for simple cold brew and tonic recipes.',
      ],
    },
    isAvailable: true,
  },
  {
    id: 'coffee-70-30-concentrate',
    category: 'coffee-70-30',
    concentrateType: 'Coffee 70:30',
    name: 'Coffee 70:30 Bold Cold Brew Concentrate',
    tagline: 'A stronger cup with deeper body and bolder coffee notes.',
    description:
      'Built for recipes that need more punch. This bold concentrate holds its flavor in milk-heavy lattes, jaggery blends, mocha drinks, and dessert-style cold coffee.',
    image: PLACEHOLDER_IMAGE,
    gallery: galleryFor('coffee-70-30', 'Coffee 70:30 Bold Cold Brew Concentrate'),
    basePrice: 449,
    sizes: BOTTLE_SIZES,
    badges: ['bold', 'bestseller'],
    tags: ['coffee 70:30', 'bold', 'strong', 'jaggery latte', 'concentrate'],
    ingredients: ['Bold cold brew coffee concentrate', 'Arabica coffee', 'Robusta coffee', 'Filtered water'],
    caffeine: 'Very High',
    servings: '8-10 serves',
    brewRatio: '1:3 with milk for a bold latte',
    roast: 'Medium dark',
    beanProfile: '70% Arabica, 30% Robusta',
    reviews: {
      rating: 4.9,
      count: 158,
      summary: 'The strongest option for creamy and sweet cold coffee recipes.',
      quotes: [
        'The coffee flavor still comes through after milk and jaggery.',
        'Strong, rich, and very consistent for daily cold coffee.',
      ],
    },
    isAvailable: true,
  },
  {
    id: 'sif-concentrate',
    category: 'sif',
    concentrateType: 'SIF',
    name: 'SIF Coffee Concentrate',
    tagline: 'South Indian filter-inspired depth in a chilled format.',
    description:
      'A nostalgic South Indian filter coffee style concentrate with a fuller roast character, made for chilled kaapi, condensed milk serves, and rich cafe recipes.',
    image: PLACEHOLDER_IMAGE,
    gallery: galleryFor('sif', 'SIF Coffee Concentrate'),
    basePrice: 459,
    sizes: BOTTLE_SIZES,
    badges: ['regional', 'rich'],
    tags: ['sif', 'south indian filter', 'kaapi', 'condensed milk', 'concentrate'],
    ingredients: ['Coffee concentrate', 'South Indian filter style coffee blend', 'Filtered water'],
    caffeine: 'High',
    servings: '8-10 serves',
    brewRatio: '1:3 with milk or condensed milk blend',
    roast: 'Dark',
    beanProfile: 'Filter coffee style blend',
    reviews: {
      rating: 4.8,
      count: 87,
      summary: 'Popular for kaapi-style cold coffee and richer milk recipes.',
      quotes: [
        'Tastes close to filter coffee but works cold.',
        'Great with condensed milk and ice.',
      ],
    },
    isAvailable: true,
  },
  {
    id: 'cascara-concentrate',
    category: 'cascara',
    concentrateType: 'Cascara',
    name: 'Cascara Coffee Cherry Concentrate',
    tagline: 'A lighter coffee cherry base for fruity refreshers.',
    description:
      'A bright cascara concentrate made from coffee cherry notes. Use it for iced tea-style refreshers, citrus coolers, tonics, and lower-caffeine signature drinks.',
    image: PLACEHOLDER_IMAGE,
    gallery: galleryFor('cascara', 'Cascara Coffee Cherry Concentrate'),
    basePrice: 379,
    sizes: BOTTLE_SIZES,
    badges: ['refreshing', 'low-caffeine'],
    tags: ['cascara', 'coffee cherry', 'tonic', 'iced tea', 'concentrate'],
    ingredients: ['Cascara concentrate', 'Coffee cherry extract', 'Filtered water'],
    caffeine: 'Low',
    servings: '8-10 serves',
    brewRatio: '1:4 with soda, tonic, or chilled water',
    roast: 'Coffee cherry infusion',
    beanProfile: 'Cascara coffee cherry',
    reviews: {
      rating: 4.6,
      count: 73,
      summary: 'A fruit-forward concentrate for refreshing non-latte recipes.',
      quotes: [
        'Light, refreshing, and very different from regular coffee.',
        'Works beautifully with tonic and citrus.',
      ],
    },
    isAvailable: true,
  },
];

// The custom builder should not route to removed cafe drinks.
export const KNOWN_COMBOS = [];

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id);
export const getProductsByCategory = (cat) =>
  cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
