import heroCoffee from '../assets/hero-coffee.png';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg-pattern">
        {/* Coffee bean shapes */}
        <svg className="bean bean-1" viewBox="0 0 40 50" fill="none">
          <ellipse cx="20" cy="25" rx="12" ry="18" stroke="rgba(147,197,253,0.35)" strokeWidth="1.5" fill="none" />
          <line x1="20" y1="10" x2="20" y2="40" stroke="rgba(147,197,253,0.25)" strokeWidth="1" />
        </svg>
        <svg className="bean bean-2" viewBox="0 0 40 50" fill="none">
          <ellipse cx="20" cy="25" rx="12" ry="18" stroke="rgba(147,197,253,0.3)" strokeWidth="1.5" fill="none" transform="rotate(30 20 25)" />
          <line x1="20" y1="10" x2="20" y2="40" stroke="rgba(147,197,253,0.2)" strokeWidth="1" transform="rotate(30 20 25)" />
        </svg>
        <svg className="bean bean-3" viewBox="0 0 40 50" fill="none">
          <ellipse cx="20" cy="25" rx="12" ry="18" stroke="rgba(147,197,253,0.2)" strokeWidth="1.5" fill="none" transform="rotate(-15 20 25)" />
          <line x1="20" y1="10" x2="20" y2="40" stroke="rgba(147,197,253,0.15)" strokeWidth="1" transform="rotate(-15 20 25)" />
        </svg>
        {/* Coffee cup outlines */}
        <svg className="cup-outline cup-1" viewBox="0 0 50 50" fill="none">
          <path d="M10 15 L14 42 C14 45 20 48 25 48 C30 48 36 45 36 42 L40 15" stroke="rgba(147,197,253,0.25)" strokeWidth="1.5" fill="none" />
          <path d="M40 20 C48 20 50 28 50 32 C50 36 48 40 40 40" stroke="rgba(147,197,253,0.2)" strokeWidth="1.5" fill="none" />
        </svg>
        <svg className="cup-outline cup-2" viewBox="0 0 50 50" fill="none">
          <path d="M10 15 L14 42 C14 45 20 48 25 48 C30 48 36 45 36 42 L40 15" stroke="rgba(147,197,253,0.2)" strokeWidth="1.5" fill="none" transform="rotate(20 25 25)" />
        </svg>
        {/* Abstract circles */}
        <div className="pattern-circle c1"></div>
        <div className="pattern-circle c2"></div>
        <div className="pattern-circle c3"></div>
        <div className="pattern-circle c4"></div>
        <div className="pattern-circle c5"></div>
        <div className="pattern-circle c6"></div>
        {/* Dots pattern */}
        <div className="dot d1"></div>
        <div className="dot d2"></div>
        <div className="dot d3"></div>
        <div className="dot d4"></div>
        <div className="dot d5"></div>
        <div className="dot d6"></div>
        <div className="dot d7"></div>
        <div className="dot d8"></div>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">Nehacano</h1>
            <p className="hero-subtitle">/ 'Neha' + 'Americano' /</p>
            <p className="hero-tagline">Code your own Coffee</p>
          </div>
          <div className="hero-right">
            <div className="hero-image-wrapper">
              <img src={heroCoffee} alt="Iced Coffee" className="hero-image" />
            </div>
          </div>
        </div>
      </div>
      <div className="hero-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 80 C200 30 400 10 720 50 C1040 90 1240 40 1440 60V120H0V80Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
