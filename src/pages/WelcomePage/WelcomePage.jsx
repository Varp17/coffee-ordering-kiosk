import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import { useUserStore, COFFEE_TYPES } from '@/store/useUserStore';
import Logo from '@/components/Logo/Logo';
import './WelcomePage.css';

export default function WelcomePage() {
  const navigate = useNavigate();
  const completeWelcome = useUserStore((s) => s.completeWelcome);
  const skipWelcome = useUserStore((s) => s.skipWelcome);

  const [name, setName] = useState('');
  const [selectedCoffee, setSelectedCoffee] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const canSubmit = name.trim().length > 0 && selectedCoffee;

  const handleSubmit = () => {
    if (!canSubmit) return;
    completeWelcome(name.trim(), selectedCoffee);
    setIsExiting(true);
    /* Short delay for exit animation */
    setTimeout(() => navigate('/', { replace: true }), 500);
  };

  const handleSkip = () => {
    skipWelcome();
    setIsExiting(true);
    setTimeout(() => navigate('/', { replace: true }), 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && canSubmit) handleSubmit();
  };

  return (
    <motion.div
      className="welcome-page"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.05 : 1 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      {/* ── GRAFFITI ARTWORK ── */}
      <div className="welcome-figma-graffiti" aria-hidden="true">
        <img
          src="/Subtract.svg"
          alt=""
          draggable="false"
        />
      </div>

      {/* ── LOGO ── */}
      <motion.div
        className="welcome-logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Logo width="clamp(100px, 15vw, 150px)" height="auto" color="white" />
      </motion.div>

      {/* ── MAIN CONTENT ── */}
      <div className="welcome-content">
        {/* Heading */}
        <motion.h1
          className="welcome-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          How do you like to be called?
        </motion.h1>

        {/* Name Input */}
        <motion.div
          className="welcome-input-wrapper"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <input
            type="text"
            className="welcome-input"
            
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={20}
            autoFocus
            id="welcome-name-input"
          />
        </motion.div>

        {/* Coffee Type Selection */}
        <motion.p
          className="welcome-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          Your favourite coffee?
        </motion.p>

        <motion.div
          className="welcome-pills"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {COFFEE_TYPES.map((type) => (
            <button
              key={type}
              className={`welcome-pill ${selectedCoffee === type ? 'welcome-pill--active' : ''}`}
              onClick={() => setSelectedCoffee(type)}
              type="button"
              id={`coffee-pill-${type.toLowerCase()}`}
            >
              {type}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── CTA BUTTONS ── */}
      <motion.div
        className="welcome-cta-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          className={`welcome-cta ${canSubmit ? 'welcome-cta--ready' : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
          id="welcome-submit-btn"
        >
          <Coffee size={18} />
          <span>Code Your Own Coffee</span>
        </button>

        <button
          className="welcome-skip-btn"
          onClick={handleSkip}
          type="button"
          id="welcome-skip-btn"
        >
          Skip Interactivity
        </button>
      </motion.div>
    </motion.div>
  );
}
