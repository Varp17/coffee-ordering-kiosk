import { useEffect, useState } from 'react';
import coffeeCup from '../../pages/SkipPageHome/assets/iced-coffee-cup.png';
import './SkippedWelcomeHero.css';

const SLIDES = [
  {
    name: "Vandy",
    suffix: "Brew",
    formula: "/ 'Vandana' + 'Cold Brew' /",
    title: "Code your own Coffee",
    bgColor: "#b8dffe",
    textColor: "#1e2944"
  },
  {
    name: "Preri",
    suffix: "Appe",
    formula: "/ 'Prerita' + 'Frappe' /",
    title: "Code your own Coffee",
    bgColor: "#b8dffe",
    textColor: "#1e2944"
  },
  {
    name: "Rishi",
    suffix: "Latte",
    formula: "/ 'Rishima' + 'Latte' /",
    title: "Code your own Coffee",
    bgColor: "#b8dffe",
    textColor: "#1e2944"
  }
];

function HeroPattern() {
  return (
    <svg
      className="neha-hero__pattern"
      viewBox="0 0 631 421"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M310 -18c36 0 58 18 51 42-7 24-54 29-57 54-3 25 35 27 31 51" />
        <path d="M367 13c8 17 42 21 43 46 1 17-24 32-47 40-28 10-35 28-17 46 12 12 32 16 42 32" />
        <path d="M455 -23c-10 19 2 37 26 42 27 6 43-5 55 10 13 15 1 35-16 44-18 10-36 11-41 30-6 23 17 31 37 34" />
        <path d="M565 -3c-15 16-4 35 14 42 17 7 37 7 39 25 2 17-19 27-36 31" />
        <path d="M316 105c18-13 42-9 52 8 10 17 3 39-17 48-20 9-13 29 6 39 21 11 23 34 4 50" />
        <path d="M407 86c20 3 29 23 20 39-9 15-29 19-35 34-8 20 9 35 27 35 20 0 35 13 36 31" />
        <path d="M509 86c-10 13-6 32 11 39 17 7 39 8 43 27 4 19-15 31-31 35-17 4-25 23-13 38 12 14 37 15 51 5" />
        <path d="M601 94c-12 15-2 31 14 36 12 4 18 12 15 26" />
        <path d="M300 200c18-5 30 9 28 25-2 16-24 20-30 36-7 18 11 33 28 30 17-3 25 15 16 30" />
        <path d="M364 202c12 14 36 17 41 36 4 16-15 25-30 30-17 6-19 28-2 36 15 7 31-1 41 9" />
        <path d="M443 209c18 7 37 5 47 22 10 17-4 37-20 44-18 8-10 31 8 37 19 6 22 26 6 39" />
        <path d="M538 205c9 18 32 20 39 37 8 18-10 31-24 36-17 6-17 27-1 35 17 9 31 6 41 21" />
        <path d="M603 236c11 7 15 22 7 33-8 12-24 13-31 25" />
      </g>
    </svg>
  );
}

export default function SkippedWelcomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[activeSlide];

  return (
    <div 
      className="skipped-hero" 
      style={{ 
        backgroundColor: slide.bgColor, 
        color: slide.textColor,
        transition: 'background-color 0.8s ease, color 0.8s ease'
      }}
    >
      <HeroPattern />

      <div className="neha-hero__copy">
        <h1 className="neha-logo" style={{ color: slide.textColor }}>
          {slide.name}<span>{slide.suffix}</span>
        </h1>
        <p className="neha-tagline" style={{ color: slide.textColor }}>{slide.formula}</p>
        <h2 style={{ color: slide.textColor }}>{slide.title}</h2>

        <div className="hero-dots" aria-label={`Slide ${activeSlide + 1} of ${SLIDES.length}`}>
          {SLIDES.map((_, idx) => (
            <span 
              key={idx} 
              className={idx === activeSlide ? "is-active" : ""} 
              style={{ 
                background: idx === activeSlide ? slide.textColor : 'rgba(255,255,255,0.98)',
                transition: 'background-color 0.8s ease'
              }} 
            />
          ))}
        </div>
      </div>

      <img className="neha-hero__coffee" src={coffeeCup} alt="Iced coffee" />

      <svg
        className="neha-wave"
        viewBox="0 0 631 421"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 421C59 392 123 359 203 355C281 350 351 367 424 391C468 406 500 405 531 395C572 382 601 362 631 354V421H0Z" />
      </svg>
    </div>
  );
}
