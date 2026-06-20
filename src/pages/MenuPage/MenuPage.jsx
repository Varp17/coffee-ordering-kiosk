import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { containerVariants, itemVariants } from '@/utils/animations';
import './MenuPage.css';

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(params.get('cat') || 'all');
  const [searchQuery,    setSearchQuery]    = useState('');

  useEffect(() => {
    const cat = params.get('cat');
    if (cat) setActiveCategory(cat);
  }, [params]);

  const filtered = PRODUCTS.filter((p) => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    const qMatch   = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return catMatch && qMatch;
  });

  const handleCatChange = (id) => {
    setActiveCategory(id);
    setParams(id !== 'all' ? { cat: id } : {});
  };

  return (
    <div className="menu-page page-wrapper">
      {/* Page header */}
      <div className="menu-page__header">
        <div className="container">
          <motion.h1
            className="menu-page__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            Our Menu
          </motion.h1>
          <motion.p
            className="menu-page__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            Every drink crafted with intention and care.
          </motion.p>

          {/* Search */}
          <motion.div
            className="menu-search"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <input
              id="menu-search"
              type="search"
              placeholder="Search drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search__input"
              aria-label="Search menu"
            />
          </motion.div>
        </div>
      </div>

      <div className="container">
        {/* Category tabs */}
        <div className="menu-tabs" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`menu-tab ${activeCategory === cat.id ? 'menu-tab--active' : ''}`}
              onClick={() => handleCatChange(cat.id)}
              whileTap={{ scale: 0.96 }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {activeCategory === cat.id && (
                <motion.div className="menu-tab__indicator" layoutId="tab-indicator" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Results count */}
        <p className="menu-results-count">
          {filtered.length} drink{filtered.length !== 1 ? 's' : ''}
          {searchQuery && ` for "${searchQuery}"`}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            className="menu-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={activeCategory + searchQuery}
          >
            {filtered.map((p) => (
              <motion.div key={p.id} variants={itemVariants} className="animate-on-scroll">
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="menu-empty">
            <span>🔍</span>
            <p>No drinks found</p>
            <span>Try searching something else or browse all drinks</span>
          </div>
        )}
      </div>
    </div>
  );
}
