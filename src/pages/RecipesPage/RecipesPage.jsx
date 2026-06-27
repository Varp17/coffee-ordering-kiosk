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
  const featuredRecipes = RECIPES.filter((r) => r.hasExactMedia || r.video).slice(0, 18);

  const categories = RECIPE_CATEGORIES;

  const filteredRecipes = selectedConcentrate === 'all'
    ? RECIPES
    : RECIPES.filter((r) => r.concentrate === selectedConcentrate);

  const totalRecipes = RECIPES.length;
  const totalConcentrates = new Set(RECIPES.map((r) => r.concentrate)).size;

  return (
    <main className="recipes-page">
      {/* ── HERO ── */}
      <section className="rp-hero">
        <div className="rp-hero__bg" aria-hidden="true" />
        <div className="rp-hero__glow" aria-hidden="true" />

        <div className="container rp-hero__inner">
          <motion.p
            className="rp-hero__eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon name="coffee" size={14} />
            <span>CHILLD BREW LAB</span>
          </motion.p>

          <motion.h1
            className="rp-hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            Discover Signature<br />Cold Brew Recipes
          </motion.h1>

          <motion.p
            className="rp-hero__desc"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Handcrafted recipes from our baristas and community — each one built
            around Chilld's slow-steeped concentrates. Create your own blend or
            find your next favourite drink.
          </motion.p>

          <motion.div
            className="rp-hero__actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <Link to="/build" className="rp-btn rp-btn--primary">
              <Icon name="coffee" size={16} />
              <span>Create Drink</span>
            </Link>
            <Link to="/create-recipe" className="rp-btn rp-btn--outline">
              <Icon name="plus" size={16} />
              <span>Share Recipe</span>
            </Link>
          </motion.div>

          <motion.div
            className="rp-hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
          >
            <div className="rp-stat">
              <strong>{totalRecipes}</strong>
              <span>Recipes</span>
            </div>
            <div className="rp-stat-divider" />
            <div className="rp-stat">
              <strong>{totalConcentrates}</strong>
              <span>Concentrates</span>
            </div>
            <div className="rp-stat-divider" />
            <div className="rp-stat">
              <strong>∞</strong>
              <span>Possibilities</span>
            </div>
          </motion.div>
        </div>

        <div className="rp-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,55 C280,90 580,20 900,55 C1120,80 1340,35 1440,45 L1440,100 L0,100 Z" fill="#f5f9fc" />
          </svg>
        </div>
      </section>

      {/* ── TRENDING SLIDER (auto-scroll) ── */}
      <section className="rp-slider-section">
        <div className="container">
          <div className="rp-section-head rp-section-head--stacked">
            <div>
              <h2>Trending Creations</h2>
              <p className="rp-section-sub">Most loved recipes from the community this week</p>
            </div>
          </div>
        </div>

        {/* Full-bleed auto-scroll marquee */}
        <div className="rp-marquee">
          <div className="rp-marquee__track">
            {/* Original set */}
            {featuredRecipes.map((recipe) => (
              <article key={recipe.id} className="rp-slide-card">
                <Link to={`/recipe-details/${recipe.id}`} className="rp-slide-card__link">
                  <div className="rp-slide-card__img-wrap">
                    <RecipeMedia
                      recipe={recipe}
                      alt={recipe.name}
                      className="rp-slide-card__img"
                    />
                    {recipe.video && <span className="rp-slide-card__video-tag">Video</span>}
                    <span className="rp-slide-card__likes-tag">
                      <Icon name="heart" size={12} />
                      <span>{recipe.likes}</span>
                    </span>
                  </div>
                  <div className="rp-slide-card__body">
                    <div className="rp-slide-card__meta">
                      <span className="rp-slide-card__concentrate">{recipe.concentrate}</span>
                      <span className="rp-slide-card__mood">{recipe.mood}</span>
                    </div>
                    <h3>{recipe.name}</h3>
                    <p>{recipe.description}</p>
                  </div>
                </Link>
              </article>
            ))}
            {/* Duplicate set for seamless loop */}
            {featuredRecipes.map((recipe) => (
              <article key={`dup-${recipe.id}`} className="rp-slide-card" aria-hidden="true">
                <Link to={`/recipe-details/${recipe.id}`} className="rp-slide-card__link" tabIndex={-1}>
                  <div className="rp-slide-card__img-wrap">
                    <RecipeMedia
                      recipe={recipe}
                      alt={recipe.name}
                      className="rp-slide-card__img"
                    />
                    {recipe.video && <span className="rp-slide-card__video-tag">Video</span>}
                    <span className="rp-slide-card__likes-tag">
                      <Icon name="heart" size={12} />
                      <span>{recipe.likes}</span>
                    </span>
                  </div>
                  <div className="rp-slide-card__body">
                    <div className="rp-slide-card__meta">
                      <span className="rp-slide-card__concentrate">{recipe.concentrate}</span>
                      <span className="rp-slide-card__mood">{recipe.mood}</span>
                    </div>
                    <h3>{recipe.name}</h3>
                    <p>{recipe.description}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

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
            key={selectedConcentrate}
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
                <p>No recipes found for this concentrate yet.</p>
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
