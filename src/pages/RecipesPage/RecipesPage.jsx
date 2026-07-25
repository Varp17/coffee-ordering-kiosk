import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeMedia from '@/components/RecipeMedia/RecipeMedia';
import { RECIPES } from '@/data/recipes';
import { api } from '@/services/api';
import { unwrapList } from '@/utils/apiResponse';
import './RecipesPage.css';

/* ── Inline SVG Icon helper ── */
function Icon({ name, size = 20, stroke = 'currentColor' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    heart: <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />,
    arrowLeft: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    coffee: <><path d="M4.5 8.5h11v6.2a4.1 4.1 0 0 1-4.1 4.1H8.6a4.1 4.1 0 0 1-4.1-4.1V8.5Z" /><path d="M15.5 10.2h1.3a2.7 2.7 0 1 1 0 5.4h-1.3" /><path d="M8 4.5c0 1.3-1.3 1.6-1.3 3" /><path d="M12 4.5c0 1.3-1.3 1.6-1.3 3" /></>,
    plus: <path d="M5 12h14M12 5v14" />,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const RECIPE_CATEGORIES = [
  { id: 'all', label: 'All Recipes', description: 'Explore our complete selection of cold brew recipes tailored to every preference.' },
  { id: 'Classic', label: 'Classic', description: 'A 100% arabica coffee. Smooth, balanced, subtle. Ideal for those who like it black' },
  { id: 'Bold', label: 'Bold', description: 'A heady mix of arabica and robusta. Flavour plus strength. Recommended for milky, juicy or sweet recipes' },
  { id: 'Kappi', label: 'Kappi', description: 'Contains more than a dash of chicory if you long for that bitter after taste of south Indian filter.' }
];

const getConcentrateLabel = (concentrate) => {
  if (concentrate === 'Coffee & Chicory' || concentrate === 'Kaapi') return 'Kappi';
  return concentrate;
};

const containerAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function RecipesPage() {
  const [selectedConcentrate, setSelectedConcentrate] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [liveRecipes, setLiveRecipes] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadRecipes = async () => {
      try {
        const res = await api.get('/recipes');
        const list = unwrapList(res);
        if (isMounted && Array.isArray(list)) {
          const approvedOnly = list.filter((r) => r.status === 'approved' || (r.status === undefined && r.is_published !== false));
          setLiveRecipes(approvedOnly);
        }
      } catch (_) {
        // Fallback to static if backend unreached
      }
    };
    loadRecipes();
    return () => { isMounted = false; };
  }, []);

  const categories = RECIPE_CATEGORIES;

  const activeCatId = hoveredCategory || selectedConcentrate;
  const activeCat = categories.find((c) => c.id === activeCatId);
  const activeDescription = activeCat ? activeCat.description : '';

  const recipeSource = liveRecipes !== null ? liveRecipes : RECIPES;

  const filteredRecipes = recipeSource.filter((r) => {
    const concentrateMatch = selectedConcentrate === 'all' || r.concentrate === selectedConcentrate || (r.concentrate || '').toLowerCase().includes(selectedConcentrate.toLowerCase());
    const query = searchQuery.toLowerCase().trim();
    const queryMatch = query
      ? r.name.toLowerCase().includes(query) ||
        (r.concentrate && r.concentrate.toLowerCase().includes(query)) ||
        (r.milk && r.milk.toLowerCase().includes(query)) ||
        (r.topping && r.topping.toLowerCase().includes(query))
      : true;
    return concentrateMatch && queryMatch;
  });

  return (
    <main className="recipes-page page-wrapper">
      {/* ── HEADER & SEARCH ── */}
      <header className="recipes-header">
        <div className="container">
          <div className="recipes-header__top-row">
            <div>
              <motion.h2
                className="recipes-header__title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                One Cold Brew, Many Vibes
              </motion.h2>
              <motion.p
                className="recipes-header__sub"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                Why invent when prompting can do? Get inspired or just copy, do what you like with our collection of cold brew recipes created by the enthu types.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <Link to="/create-recipe" className="recipes-header__create-btn">
                <Icon name="plus" size={16} />
                <span>Create Your Own Recipe</span>
                <Icon name="arrow-right" size={16} />
              </Link>
            </motion.div>
          </div>

          {/* ── Infinite Marquee of Recipe Cards ── */}
          <motion.div
            className="recipes-header__marquee"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="recipes-header__marquee-track">
              {[...RECIPES, ...RECIPES].map((recipe, i) => (
                <Link key={`${recipe.id}-${i}`} to={`/recipe-details/${recipe.id}`} className="rp-marquee-card">
                  <div className="rp-marquee-card__img-wrap">
                    <RecipeMedia recipe={recipe} alt={recipe.name} className="rp-marquee-card__img" />
                  </div>
                  <div className="rp-marquee-card__body">
                    <h4>{recipe.name}</h4>
                    <span className="rp-marquee-card__likes">
                      <Icon name="heart" size={10} /> {recipe.likes}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── FILTERABLE RECIPE GRID ── */}
      <section className="rp-grid-section">
        <div className="container">
          <div className="rp-section-head" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div>
              <h2>Browse by Cold Brew variety</h2>
              <p className="rp-section-sub">
                All men were born equal (really?). Not all cold brew was made equal. Check the recipes that go best with your type of coffee.
              </p>
            </div>
          </div>

          {/* Controls Row: Filter Tabs + Search */}
          <div className="rp-controls-row">
            {/* Filter tabs */}
            <div className="rp-filter-bar" role="tablist" aria-label="Filter by cold brew variety">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={selectedConcentrate === cat.id}
                  className={`rp-filter-chip ${selectedConcentrate === cat.id ? 'rp-filter-chip--active' : ''}`}
                  onClick={() => setSelectedConcentrate(cat.id)}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="recipes-search">
              <div className="recipes-search__wrapper">
                <span className="recipes-search__icon-wrap">
                  <Icon name="search" size={16} />
                </span>
                <input
                  id="recipes-search"
                  type="search"
                  placeholder="Search recipes (e.g. Mocha, Latte, Jaggery...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="recipes-search__input"
                  aria-label="Search recipes"
                />
              </div>
            </div>
          </div>

          {/* Category description display with smooth height/opacity transition */}
          <div className="rp-category-desc-container">
            <AnimatePresence mode="wait">
              {activeDescription && (
                <motion.div
                  key={activeCatId}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="rp-category-description"
                >
                  <span className="rp-category-description__label">{activeCat.label}:</span>
                  <span className="rp-category-description__text">{activeDescription}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Grid */}
          <motion.div
            className="rp-grid"
            variants={containerAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            key={`${selectedConcentrate}-${searchQuery}`}
          >
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <motion.article key={recipe.id} className="rp-grid-card" variants={cardAnim}>
                  <Link to={`/recipe-details/${recipe.id}`}>
                    <div className="rp-grid-card__img-wrap">
                      <RecipeMedia recipe={recipe} alt={recipe.name} className="rp-grid-card__img" />
                      <span className="rp-grid-card__badge">{getConcentrateLabel(recipe.concentrate)}</span>
                    </div>
                    <div className="rp-grid-card__body">
                      <h3>{recipe.name}</h3>
                      <p>{recipe.description}</p>
                      <div className="rp-grid-card__foot">
                        <span className="rp-grid-card__likes">
                          <Icon name="heart" size={12} /> {recipe.likes}
                        </span>
                        <span className="rp-grid-card__author">By {recipe.author}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))
            ) : (
              <div className="rp-grid-empty">
                <Icon name="search" size={28} />
                <p>No recipes found matching your search criteria.</p>
                <Link to="/create-recipe" className="rp-btn rp-btn--primary" style={{ marginTop: '1rem' }}>
                  Create One
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Link to="/create-recipe" className="rp-create-floating-btn" aria-label="Create new recipe">
        <Icon name="plus" size={24} />
      </Link>
    </main>
  );
}
