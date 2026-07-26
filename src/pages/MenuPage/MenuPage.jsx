import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard/ProductCard';
import ComboDrawer from '@/components/ComboDrawer/ComboDrawer';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { productService } from '@/services/products';
import { unwrapList } from '@/utils/apiResponse';
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

  const [liveProducts, setLiveProducts] = useState(PRODUCTS);

  const loadLiveProducts = async () => {
    try {
      const res = await productService.getAll();
      const backendList = unwrapList(res);
      if (Array.isArray(backendList) && backendList.length > 0) {
        const backendById = new Map(backendList.map((p) => [p.id, p]));
        const backendByName = new Map(backendList.map((p) => [(p.name || '').toLowerCase().trim(), p]));

        // 1. Update static catalog with prices, stock and active visibility from CRM DB
        const mergedCatalog = PRODUCTS.map((staticItem) => {
          const match = backendById.get(staticItem.id) || backendByName.get((staticItem.name || '').toLowerCase().trim());
          if (match) {
            return {
              ...staticItem,
              ...match,
              basePrice: parseFloat(match.price ?? match.base_price ?? staticItem.basePrice) || staticItem.basePrice,
              is_active: match.is_active !== undefined ? Boolean(match.is_active) : true,
            };
          }
          return staticItem;
        }).filter((item) => item.is_active !== false);

        // 2. Append new products dynamically added in CRM
        const existingIds = new Set(PRODUCTS.map((p) => p.id));
        const existingNames = new Set(PRODUCTS.map((p) => (p.name || '').toLowerCase().trim()));

        backendList.forEach((bp) => {
          if (bp.is_active !== false && !existingIds.has(bp.id) && !existingNames.has((bp.name || '').toLowerCase().trim())) {
            const catSlug = bp.category?.slug || 'coffee-50-50';
            mergedCatalog.push({
              id: bp.id,
              name: bp.name,
              category: catSlug,
              concentrateType: bp.category?.name || 'Concentrate',
              tagline: bp.description || 'Artisan cold brew concentrate.',
              description: bp.description || '',
              basePrice: parseFloat(bp.price ?? bp.base_price ?? 390) || 390,
              cardImage: bp.image_url || '/images/products/BoldConcentrate325.png',
              image: bp.image_url || '/images/products/BoldConcentrate325.png',
              sizes: [
                { id: '325ml', label: '325 ml', ml: 325, modifier: 0 },
                { id: '1000ml', label: '1 Liter', ml: 1000, modifier: 1200 - (parseFloat(bp.price) || 390) }
              ],
              is_active: true,
            });
          }
        });

        setLiveProducts(mergedCatalog);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadLiveProducts();
    window.addEventListener('products:updated', loadLiveProducts);
    window.addEventListener('focus', loadLiveProducts);

    const timer = setInterval(loadLiveProducts, 10000);

    return () => {
      window.removeEventListener('products:updated', loadLiveProducts);
      window.removeEventListener('focus', loadLiveProducts);
      clearInterval(timer);
    };
  }, []);

  const filtered = liveProducts
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
