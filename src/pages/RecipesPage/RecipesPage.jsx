import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RecipeMedia from '@/components/RecipeMedia/RecipeMedia';
import { RECIPES } from '@/data/recipes';
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
  { id: 'all', label: 'All Recipes' },
  ...Array.from(new Set(RECIPES.map((r) => r.concentrate))).map((c) => ({
    id: c,
    label: c,
  })),
];

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

  const categories = RECIPE_CATEGORIES;

  const filteredRecipes = RECIPES.filter((r) => {
    const concentrateMatch = selectedConcentrate === 'all' || r.concentrate === selectedConcentrate;
    const query = searchQuery.toLowerCase().trim();
    const queryMatch = query
      ? r.name.toLowerCase().includes(query) ||
        r.concentrate.toLowerCase().includes(query) ||
        (r.milk && r.milk.toLowerCase().includes(query)) ||
        (r.topping && r.topping.toLowerCase().includes(query))
      : true;
    return concentrateMatch && queryMatch;
  });

  return (
    <main className="recipes-page">
      {/* ── HEADER & SEARCH ── */}
      <header className="recipes-header">
        <div className="container">
          <motion.h1
            className="recipes-header__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            Chilld Coffee Recipes
          </motion.h1>
          <motion.p
            className="recipes-header__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            Explore our collection of custom recipes crafted around Chilld concentrates.
          </motion.p>

          <motion.div
            className="recipes-search"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
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
          </motion.div>
        </div>
      </header>

      {/* ── FILTERABLE RECIPE GRID ── */}
      <section className="rp-grid-section">
        <div className="container">
          <div className="rp-section-head rp-section-head--stacked">
            <div>
              <h2>Browse by Concentrate</h2>
              <p className="rp-section-sub">
                Every recipe is crafted around a specific Chilld concentrate — pick yours
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="rp-filter-bar" role="tablist" aria-label="Filter by concentrate">
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={selectedConcentrate === cat.id}
                className={`rp-filter-chip ${selectedConcentrate === cat.id ? 'rp-filter-chip--active' : ''}`}
                onClick={() => setSelectedConcentrate(cat.id)}
              >
                {cat.label}
              </button>
            ))}
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
                      <span className="rp-grid-card__badge">{recipe.concentrate}</span>
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
    </main>
  );
}
