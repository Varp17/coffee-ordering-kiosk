import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, ArrowRight, Activity, Award, Briefcase, Users, Coffee, Zap, Shield, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import './B2BPage.css';

const SERVICE_TIERS = [
  {
    icon: Briefcase,
    title: 'Managed Kiosks',
    desc: 'Fully stocked contactless smart kiosks with digital screen taps. Best suited for high-density tech hubs and shared spaces.',
    highlights: ['Zero maintenance', 'Real-time analytics', 'Custom UI branding'],
    color: '#1844AB',
    bgColor: 'rgba(24, 68, 171, 0.08)',
  },
  {
    icon: Award,
    title: 'Wholesale Supply',
    desc: 'Scheduled bulk delivery of classic, bold, and kaapi concentrates in food-grade carboys. Perfect for cafes and event hubs.',
    highlights: ['Flexible volumes', 'Monthly subscription', 'Priority delivery'],
    color: '#c67c4e',
    bgColor: 'rgba(198, 124, 78, 0.08)',
  },
  {
    icon: Building2,
    title: 'Private Labeling',
    desc: 'Custom co-branded concentrate bottles and cup packaging for corporate events or exclusive retail partnerships.',
    highlights: ['Your brand, our brew', 'Min 500 units', 'Full design support'],
    color: '#27ae60',
    bgColor: 'rgba(39, 174, 96, 0.08)',
  },
];

const TRUST_STATS = [
  { icon: Users, value: '120+', label: 'Corporate Clients' },
  { icon: Coffee, value: '2.5M', label: 'Cups Served' },
  { icon: Zap, value: '<2min', label: 'Avg Serve Time' },
  { icon: Shield, value: '99.8%', label: 'Uptime SLA' },
];

const containerAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function B2BPage() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [solution, setSolution] = useState('kiosk');
  const [employeesCount, setEmployeesCount] = useState(50);
  const [submitted, setSubmitted] = useState(false);

  const estimatedCupsPerMonth = employeesCount * 15;
  const concentrateLitresNeeded = Math.ceil(estimatedCupsPerMonth * 0.15);
  const estimatedMonthlyCost = Math.round(concentrateLitresNeeded * 42);

  const getRecommendedSolution = (count) => {
    if (count < 30) return 'Chilld Bulk Office Packs (Scheduled Delivery)';
    if (count <= 100) return 'Chilld Smart Kiosk Lite (Countertop)';
    return 'Chilld Enterprise Smart Kiosk (Free-standing, Dual-Tap)';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !companyName) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Partnership inquiry received! We'll be in touch soon.");
  };

  return (
    <main className="b2b-page">
      {/* ── HERO ── */}
      <section className="b2b-hero">
        <div className="b2b-hero__bg" aria-hidden="true" />
        <div className="b2b-hero__glow" aria-hidden="true" />

        <div className="container b2b-hero__inner">
          <motion.p
            className="b2b-hero__eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Building2 size={14} />
            <span>CHILLD ENTERPRISE</span>
          </motion.p>

          <motion.h1
            className="b2b-hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            Coffee Infrastructure<br />for Modern Workplaces
          </motion.h1>

          <motion.p
            className="b2b-hero__desc"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Smart self-service kiosks, wholesale concentrate supply, and custom
            enterprise branding — calm energy, engineered for productivity.
          </motion.p>

          <motion.div
            className="b2b-hero__cta-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <a href="#b2b-inquiry" className="b2b-btn b2b-btn--primary">
              <span>Get a Quote</span>
              <ArrowRight size={15} />
            </a>
            <a href="#b2b-estimator" className="b2b-btn b2b-btn--outline">
              <Activity size={15} />
              <span>Estimate Volume</span>
            </a>
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          className="b2b-trust-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36 }}
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="b2b-trust-stat">
              <stat.icon size={18} />
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="b2b-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,60 C320,95 620,25 960,55 C1200,80 1360,40 1440,50 L1440,100 L0,100 Z" fill="#f5f9fc" />
          </svg>
        </div>
      </section>

      {/* ── VOLUME ESTIMATOR ── */}
      <section className="b2b-estimator" id="b2b-estimator">
        <div className="container">
          <motion.div
            className="estimator-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="estimator-card__header">
              <div className="estimator-icon-wrap">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2>Office Coffee Volume Estimator</h2>
                <p>Drag the slider to estimate your team's monthly consumption and see our recommendation.</p>
              </div>
            </div>

            <div className="estimator-slider">
              <div className="estimator-slider__label">
                <span>Team Size</span>
                <strong>{employeesCount} Employees</strong>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={employeesCount}
                onChange={(e) => setEmployeesCount(Number(e.target.value))}
                className="estimator-range"
              />
              <div className="estimator-slider__scale">
                <span>5</span>
                <span>100</span>
                <span>200</span>
                <span>300</span>
              </div>
            </div>

            <div className="estimator-results">
              <div className="estimator-metric">
                <span className="estimator-metric__label">Cups / Month</span>
                <span className="estimator-metric__value">{estimatedCupsPerMonth.toLocaleString()}</span>
              </div>
              <div className="estimator-metric">
                <span className="estimator-metric__label">Concentrate / Month</span>
                <span className="estimator-metric__value">{concentrateLitresNeeded} L</span>
              </div>
              <div className="estimator-metric">
                <span className="estimator-metric__label">Est. Monthly Cost</span>
                <span className="estimator-metric__value">₹{estimatedMonthlyCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="estimator-rec">
              <span className="estimator-rec__label">Recommended Setup</span>
              <strong className="estimator-rec__value">{getRecommendedSolution(employeesCount)}</strong>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICE TIERS ── */}
      <section className="b2b-tiers">
        <div className="container">
          <div className="b2b-section-head">
            <h2>Our Service Tiers</h2>
            <p>End-to-end setups tailored to your business model</p>
          </div>

          <motion.div
            className="b2b-tiers-grid"
            variants={containerAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {SERVICE_TIERS.map((tier) => (
              <motion.div key={tier.title} className="b2b-tier-card" variants={cardAnim}>
                <div className="b2b-tier-card__icon" style={{ background: tier.bgColor, color: tier.color }}>
                  <tier.icon size={22} />
                </div>
                <h3>{tier.title}</h3>
                <p>{tier.desc}</p>
                <ul className="b2b-tier-card__highlights">
                  {tier.highlights.map((h) => (
                    <li key={h}>
                      <CheckCircle2 size={13} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── INQUIRY FORM ── */}
      <section className="b2b-form-section" id="b2b-inquiry">
        <div className="container">
          <motion.div
            className="b2b-form-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="b2b-form-card__left">
              <h2>Partner with Chilld</h2>
              <p>Fill in your details and our corporate desk will reach out within 1 business day with a tailored proposal.</p>

              <div className="b2b-form-perks">
                <div className="b2b-perk">
                  <CheckCircle2 size={16} />
                  <span>Free on-site assessment</span>
                </div>
                <div className="b2b-perk">
                  <CheckCircle2 size={16} />
                  <span>No long-term lock-in</span>
                </div>
                <div className="b2b-perk">
                  <CheckCircle2 size={16} />
                  <span>Custom branding available</span>
                </div>
                <div className="b2b-perk">
                  <CheckCircle2 size={16} />
                  <span>Dedicated account manager</span>
                </div>
              </div>
            </div>

            <div className="b2b-form-card__right">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="b2b-form">
                  <div className="b2b-field">
                    <label htmlFor="b2b-company">Company Name</label>
                    <input
                      type="text"
                      id="b2b-company"
                      placeholder="e.g. Acme Corporation"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="b2b-field">
                    <label htmlFor="b2b-email">Corporate Email</label>
                    <input
                      type="email"
                      id="b2b-email"
                      placeholder="e.g. facility@acme.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="b2b-field">
                    <label htmlFor="b2b-solution">Preferred Solution</label>
                    <select
                      id="b2b-solution"
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                    >
                      <option value="kiosk">Smart Kiosk Installation</option>
                      <option value="wholesale">Bulk Concentrate Supply</option>
                      <option value="branding">Co-Branding & Partnerships</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary b2b-submit">
                    <span>Register Interest</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <motion.div
                  className="b2b-success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <CheckCircle2 size={44} />
                  <h3>Inquiry Received!</h3>
                  <p>We've registered <strong>{companyName}</strong> for B2B solutions. Our team will email <strong>{email}</strong> within 1 business day.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
