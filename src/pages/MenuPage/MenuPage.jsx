import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard/ProductCard';
import ComboDrawer from '@/components/ComboDrawer/ComboDrawer';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { containerVariants, itemVariants } from '@/utils/animations';
import './MenuPage.css';

function rankProduct(product) {
  return product.order ?? Number.MAX_SAFE_INTEGER;
}

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get('cat') || 'all';
  const activeCategory = CATEGORIES.some((c) => c.id === rawCategory) ? rawCategory : 'all';
  const [comboDrawerOpen, setComboDrawerOpen] = useState(false);

  const filtered = PRODUCTS
    .filter((p) => activeCategory === 'all' || p.category === activeCategory)
    .sort((a, b) => rankProduct(a) - rankProduct(b));

  return (
    <div className="menu-page page-wrapper">
      {/* ── HEADER & COMBO ACTION ── */}
      <div className="menu-page__header">
        <div className="container">
          <div className="menu-page__top-row">
            <div>
              <motion.h2
                className="menu-page__title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                Cold Brew Concentrates
              </motion.h2>
              <motion.p
                className="menu-page__sub"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                Shop the Chilld concentrate line for cold brew coffee, gift packs and signature merchandise.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <button
                type="button"
                className="menu-page__combo-btn"
                onClick={() => setComboDrawerOpen(true)}
              >
                <Sparkles size={16} />
                <span>Create Your Combo</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container">
        <p className="menu-results-count">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
        </p>

        {/* ── PRODUCT GRID ── */}
        {filtered.length > 0 ? (
          <motion.div
            className="menu-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={activeCategory}
          >
            {filtered.map((p) => (
              <motion.div key={p.id} variants={itemVariants} className="animate-on-scroll">
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="menu-empty">
            <span>Search</span>
            <p>No products found</p>
            <span>Try searching another concentrate or browse all products</span>
          </div>
        )}
      </div>

      <ComboDrawer isOpen={comboDrawerOpen} onClose={() => setComboDrawerOpen(false)} />
    </div>
  );
}
