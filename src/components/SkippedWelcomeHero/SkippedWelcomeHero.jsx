import { useEffect, useRef } from 'react';
import './SkippedWelcomeHero.css';

const NAMES_BANK = [
  'ALEX', 'VARUN', 'AJAY', 'SOPHIA', 'EMMA', 'LIAM', 'CHILLD', 'COFFEE LOVER', 'ROASTER', 'BARISTA', 'BREWMASTER'
];

const DRINKS_BANK = [
  'CLASSIC ESPRESSO', 'SMOOTH AMERICANO', 'OAT MILK LATTE', 'HONEY LATTE', 'CAPPUCCINO', 'CINNAMON CAP', 'MATCHA LATTE', 'COLD BREW CORE', 'KAAPI CLASSIC', 'BOLD BREW'
];

const IMAGES_BANK = [
  '/images/image1_366_1172.png',
  '/images/image3_366_1172.png',
  '/images/image9_366_1172.png',
  '/images/image10_366_1172.png',
  '/images/image11_366_1172.png',
  '/images/image12_366_1172.png',
  '/images/image13_366_1172.png',
  '/images/image14_366_1172.png'
];

export default function SkippedWelcomeHero() {
  const nameTrackRef = useRef(null);
  const drinkTrackRef = useRef(null);
  const imageTrackRef = useRef(null);

  useEffect(() => {
    // Add infinite scrolling animations dynamically or let CSS handle it
  }, []);

  return (
    <div className="skipped-hero">
      <div className="skipped-hero__overlay"></div>
      
      <div className="skipped-hero__content">
        <h2 className="skipped-hero__title">SKIP STRAIGHT TO BREWING</h2>
        <p className="skipped-hero__subtitle">Swipe through our options or code your own drink below</p>
      </div>

      <div className="skipped-hero__sliders">
        {/* Slider 1: Names */}
        <div className="skipped-slider skipped-slider--names">
          <div className="skipped-slider__track" ref={nameTrackRef}>
            {[...NAMES_BANK, ...NAMES_BANK].map((name, i) => (
              <span key={`name-${i}`} className="skipped-slider__item skipped-slider__item--name">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Slider 2: Drinks */}
        <div className="skipped-slider skipped-slider--drinks">
          <div className="skipped-slider__track" ref={drinkTrackRef} style={{ animationDirection: 'reverse' }}>
            {[...DRINKS_BANK, ...DRINKS_BANK].map((drink, i) => (
              <span key={`drink-${i}`} className="skipped-slider__item skipped-slider__item--drink">
                {drink}
              </span>
            ))}
          </div>
        </div>

        {/* Slider 3: Images */}
        <div className="skipped-slider skipped-slider--images">
          <div className="skipped-slider__track" ref={imageTrackRef}>
            {[...IMAGES_BANK, ...IMAGES_BANK].map((img, i) => (
              <div key={`img-${i}`} className="skipped-slider__item skipped-slider__item--image">
                <img src={img} alt="Coffee selection" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
