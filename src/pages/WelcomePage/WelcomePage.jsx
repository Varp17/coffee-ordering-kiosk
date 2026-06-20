import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee } from 'lucide-react';
import { useUserStore, COFFEE_TYPES } from '@/store/useUserStore';
import Logo from '@/components/Logo/Logo';
import './WelcomePage.css';

export default function WelcomePage() {
  const navigate = useNavigate();
  const completeWelcome = useUserStore((s) => s.completeWelcome);

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
      {/* Exact Figma graffiti artwork — /public/Subtract.svg */}
      <div className="welcome-figma-graffiti" aria-hidden="true">
        <img
          src="/Subtract.svg"
          alt=""
          draggable="false"
        />
      </div>

      {/* Logo */}
      <motion.div
        className="welcome-logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Logo width="clamp(100px, 15vw, 150px)" height="auto" color="white" />
      </motion.div>

      {/* Main Content */}
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
            placeholder="Enter your name"
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

      {/* CTA Button */}
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
      </motion.div>
    </motion.div>
  );
}
