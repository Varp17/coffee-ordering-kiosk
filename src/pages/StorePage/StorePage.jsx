import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, Bell, Sparkles, X, ShoppingBag, Package, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import './StorePage.css';

const UPCOMING_PRODUCTS = [
  {
    id: 'concentrate-classic',
    name: 'Classic Cold Brew Concentrate',
    category: 'Concentrates',
    description: 'Our signature 24-hour slow-steeped Arabica blend. Makes 10–12 cups of smooth, rich cold brew.',
    badge: 'Best Seller',
    badgeColor: '#c67c4e',
    image: '/images/products/cold-brew.png',
    priceEst: '₹449',
    units: 127,
  },
  {
    id: 'concentrate-orange',
    name: 'Cold Brew Orange Burst',
    category: 'Concentrates',
    description: 'Zesty Valencia orange zest infused into our classic cold brew concentrate for a citrus twist.',
    badge: 'New Flavor',
    badgeColor: '#e8772e',
    image: '/images/products/Cold Brew Orange .png',
    priceEst: '₹499',
    units: 84,
  },
  {
    id: 'ice-latte',
    name: 'Iced Latte Ready-Mix',
    category: 'Ready Drinks',
    description: 'Pre-mixed iced latte with oat milk. Just pour over ice. No equipment needed.',
    badge: 'Fan Favorite',
    badgeColor: '#1844AB',
    image: '/images/products/Ice Latte.png',
    priceEst: '₹299',
    units: 203,
  },
  {
    id: 'mint-tonic',
    name: 'Cold Brew Mint Tonic',
    category: 'Sparkling',
    description: 'Effervescent cold brew meets garden-fresh mint and premium tonic water. Ice cold refreshment.',
    badge: 'Limited Edition',
    badgeColor: '#27ae60',
    image: '/images/products/Cold Brew Mint Tonic.png',
    priceEst: '₹349',
    units: 56,
  },
  {
    id: 'salted-caramel',
    name: 'Salted Caramel Jaggery',
    category: 'Specialty',
    description: 'Artisan jaggery caramel swirled into our cold brew. A dessert-worthy indulgence.',
    badge: 'Premium',
    badgeColor: '#8e44ad',
    image: '/images/products/Salted Caramel Jaggery.png',
    priceEst: '₹549',
    units: 41,
  },
  {
    id: 'sif-rocks',
    name: 'SIF on the Rocks',
    category: 'Heritage',
    description: 'South Indian Filter coffee tradition reimagined as a bold, iced concentrate serve.',
    badge: 'Desi Classic',
    badgeColor: '#d35400',
    image: '/images/products/SIFon the Rocks (South indian filter Coffee).png',
    priceEst: '₹399',
    units: 92,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function StorePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [waitlistProductEmail, setWaitlistProductEmail] = useState('');
  const [productWaitlistSuccess, setProductWaitlistSuccess] = useState(false);

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("You're on the list! We'll notify you first. ☕");
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!waitlistProductEmail) return;
    setProductWaitlistSuccess(true);
    toast.success(`Registered for ${selectedProduct.name}! 🚀`);
    setTimeout(() => {
      setSelectedProduct(null);
      setProductWaitlistSuccess(false);
      setWaitlistProductEmail('');
    }, 2500);
  };

  return (
    <main className="store-page">
      {/* ── HERO ── */}
      <section className="store-hero">
        <div className="store-hero__bg-pattern" aria-hidden="true" />
        <div className="store-hero__glow" aria-hidden="true" />

        <div className="container store-hero__inner">
          <motion.p
            className="store-hero__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag size={14} />
            <span>CHILLD BOUTIQUE</span>
          </motion.p>

          <motion.h1
            className="store-hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Premium Cold Brew,<br />Delivered to Your Door
          </motion.h1>

          <motion.p
            className="store-hero__desc"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Artisan concentrates, ready-to-drink blends, and curated coffee gear.
            Launching this fall — join the early list for exclusive pricing.
          </motion.p>

          <motion.div
            className="store-hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="stat-pill">
              <Package size={14} />
              <span><strong>6</strong> Products</span>
            </div>
            <div className="stat-pill">
              <Clock size={14} />
              <span>Fall <strong>2026</strong></span>
            </div>
            <div className="stat-pill">
              <Star size={14} />
              <span><strong>603</strong> Waitlisted</span>
            </div>
          </motion.div>
        </div>

        <div className="store-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,60 C320,100 620,20 960,60 C1200,90 1360,40 1440,50 L1440,100 L0,100 Z" fill="#f5f9fc" />
          </svg>
        </div>
      </section>

      {/* ── WAITLIST CTA ── */}
      <section className="store-waitlist">
        <div className="container">
          <motion.div
            className="waitlist-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="waitlist-card__left">
              <Sparkles size={20} className="waitlist-icon" />
              <div>
                <h2>Get Early Access</h2>
                <p>Be first to order + unlock 15% off your first purchase.</p>
              </div>
            </div>

            <div className="waitlist-card__right">
              {!submitted ? (
                <form onSubmit={handleGeneralSubmit} className="waitlist-form">
                  <div className="waitlist-input-wrap">
                    <Mail size={16} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary waitlist-btn">
                    <span>Notify Me</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <motion.div
                  className="waitlist-done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle2 size={20} />
                  <span>You're in! We'll email <strong>{email}</strong> first.</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRODUCT CATALOG ── */}
      <section className="store-catalog">
        <div className="container">
          <div className="catalog-header">
            <h2>Launching Collection</h2>
            <p>Click any product to reserve your slot in the first production batch.</p>
          </div>

          <motion.div
            className="catalog-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {UPCOMING_PRODUCTS.map((prod) => (
              <motion.article
                key={prod.id}
                className="catalog-card"
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
              >
                <div className="catalog-card__image">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="catalog-card__badge" style={{ background: prod.badgeColor }}>
                    {prod.badge}
                  </span>
                  <div className="catalog-card__hover-action">
                    <button
                      type="button"
                      className="card-alert-btn"
                      onClick={() => setSelectedProduct(prod)}
                    >
                      <Bell size={14} />
                      <span>Reserve Slot</span>
                    </button>
                  </div>
                </div>

                <div className="catalog-card__body">
                  <span className="catalog-card__category">{prod.category}</span>
                  <h3 className="catalog-card__name">{prod.name}</h3>
                  <p className="catalog-card__desc">{prod.description}</p>
                  <div className="catalog-card__footer">
                    <span className="catalog-card__price">{prod.priceEst}</span>
                    <span className="catalog-card__units">{prod.units} reserved</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRODUCT RESERVATION MODAL ── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="store-modal-backdrop" onClick={() => setSelectedProduct(null)}>
            <motion.div
              className="store-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            >
              <button
                type="button"
                className="store-modal__close"
                onClick={() => setSelectedProduct(null)}
              >
                <X size={18} />
              </button>

              {!productWaitlistSuccess ? (
                <>
                  <div className="store-modal__header">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="store-modal__img"
                    />
                    <div>
                      <span className="store-modal__cat">{selectedProduct.category}</span>
                      <h2>{selectedProduct.name}</h2>
                      <span className="store-modal__price">{selectedProduct.priceEst} (Est.)</span>
                    </div>
                  </div>

                  <p className="store-modal__desc">
                    First batch production capped at 500 units. Reserve below for priority access and launch-day pricing.
                  </p>

                  <form onSubmit={handleProductSubmit} className="store-modal__form">
                    <div className="store-modal__input-wrap">
                      <Mail size={16} />
                      <input
                        type="email"
                        placeholder="Your email for priority reservation"
                        value={waitlistProductEmail}
                        onChange={(e) => setWaitlistProductEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary store-modal__submit">
                      Reserve My Slot
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  className="store-modal__success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <CheckCircle2 size={44} />
                  <h3>Slot Reserved!</h3>
                  <p>We'll send <strong>{waitlistProductEmail}</strong> a checkout link on launch day for <strong>{selectedProduct.name}</strong>.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
