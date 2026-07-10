import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import WhyChilldCup, { WHY_CHILLD_ITEMS } from '@/components/WhyChilldCup/WhyChilldCup';
import TestimonialsBento from '@/components/TestimonialsBento/TestimonialsBento';
import Footer from '@/components/Footer/Footer';
import './HomePage.css';

const coffeeCup = '/images/LATTEeee.png';

const SKIPPED_HERO_SLIDES = [
  {
    name: 'Vandy',
    suffix: 'Brew',
    formula: '/ "Vandana" + "Cold Brew" /',
    image: '/images/COLD BREW.png',
  },
  {
    name: 'Preri',
    suffix: 'Appe',
    formula: '/ "Prerita" + "Frappe" /',
    image: '/images/frappe.webp',
  },
  {
    name: 'Rishi',
    suffix: 'Latte',
    formula: '/ "Rishima" + "Latte" /',
    image: coffeeCup,
  },
];

const COFFEE_CUP_IMAGES = {
  AMERICANO: {
    url: '/images/iced-coffee-cup.webp',
    scale: 1.15,
    yOffset: 0,
    maxHeight: '75dvh',
    ctaTop: '54%',
    width: 634,
    height: 1024,
  },
  AFFOGATO: {
    url: '/images/affogato.png',
    scale: 1.10,
    yOffset: 0,
    maxHeight: '70dvh',
    ctaTop: '56%',
    width: 1080,
    height: 1080,
  },

  FRAPPE: {
    url: '/images/frappe.webp',
    scale: 1.6,
    yOffset: 240,
    maxHeight: '77dvh',
    ctaTop: '50%',
    width: 1980,
    height: 1480,
  },
  LATTE: {
    url: coffeeCup,
    scale: 1.12,
    yOffset: 0,
    maxHeight: '78dvh',
    ctaTop: '54%',
    width: 1632,
    height: 2582,
  },
  VIETNAMESE: {
    url: '/images/VIETNAMESE.png',
    scale: 1.12,
    yOffset: 0,
    maxHeight: '76dvh',
    ctaTop: '58%',
    width: 1080,
    height: 1080,
  },
  CORTADO: {
    url: '/images/CATARDO.png',
    scale: 1.12,
    yOffset: 0,
    maxHeight: '76dvh',
    ctaTop: '59%',
    width: 1080,
    height: 1080,
  },
  COLDBREW: {
    url: '/images/COLD BREW.png',
    scale: 1.12,
    yOffset: 0,
    maxHeight: '77dvh',
    ctaTop: '59%',
    width: 1632,
    height: 2582,
  },
  ESPRESSO: {
    url: '/images/Esspresso.png',
    scale: 1.25,
    yOffset: 0,
    maxHeight: '76dvh',
    ctaTop: '54%',
    width: 1080,
    height: 1080,
  },
};

const FALLBACK_CUP = {
  url: '/images/iced-coffee-cup.webp',
  scale: 1.12,
  yOffset: 70,
  maxHeight: '75dvh',
  ctaTop: '54%',
  width: 634,
  height: 1024,
};


const TRENDING_MIXES = [
  {
    id: 'rajpresso',
    name: 'Rajpresso',
    image: '/images/image11_366_1172.png',
    description: 'Rajpresso',
    tags: ['#Coffee', '#Signature'],
    likes: '1.2K Likes',
  },
  {
    id: 'vandy-mood-mocha',
    name: 'Vandy Mood Mocha',
    image: '/images/image12_366_1172.png',
    description: 'Vandy Mood Mocha',
    tags: ['#Mocha', '#Signature'],
    likes: '890 Likes',
  },
  {
    id: 'kishorappe',
    name: 'Kishorappe',
    image: '/images/image13_366_1172.png',
    description: 'Kishorappe',
    tags: ['#Coffee', '#Bold'],
    likes: '650 Likes',
  },
  {
    id: 'rishi-latte',
    name: 'RishiLatte',
    image: '/images/image14_366_1172.png',
    description: 'RishiLatte',
    tags: ['#Latte', '#Creamy'],
    likes: '1.5K Likes',
  },
];

function getCupConfigByUrl(imageUrl) {
  return Object.values(COFFEE_CUP_IMAGES).find((config) => config.url === imageUrl) || {
    url: imageUrl,
    scale: 1,
    yOffset: 70,
    maxHeight: '66dvh',
    ctaTop: '54%',
    width: 1080,
    height: 1080,
  };
}

function formatCoffeeName(coffeeType) {
  if (!coffeeType) return 'Cold Brew';
  return coffeeType.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function TrendingMixCards({ duplicate = false }) {
  return TRENDING_MIXES.map((mix) => (
    <Link
      key={`${mix.id}-${duplicate ? 'duplicate' : 'original'}`}
      to={`/recipe-details/${mix.id}`}
      className="trending-mix-card"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate ? 'true' : undefined}
    >
      <div className="trending-mix-card__image">
        <img src={mix.image} alt={duplicate ? '' : mix.name} loading="lazy" decoding="async" />
        <span className="trending-mix-card__likes">{mix.likes}</span>
      </div>

      <div className="trending-mix-card__content">
        <h3>{mix.name}</h3>
        <p>{mix.description}</p>

        <div className="trending-mix-card__tags">
          {mix.tags.slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  ));
}

function HomeHero({ skippedWelcome, displayName, suffix, coffeeType }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (!skippedWelcome) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % SKIPPED_HERO_SLIDES.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [skippedWelcome]);

  const heroState = useMemo(() => {
    if (skippedWelcome) {
      const slide = SKIPPED_HERO_SLIDES[activeSlide];
      return {
        name: slide.name,
        suffix: slide.suffix,
        formula: slide.formula,
        cup: getCupConfigByUrl(slide.image),
      };
    }

    return {
      name: displayName || 'CHILLD',
      suffix: suffix || 'BREW',
      drinkLabel: formatCoffeeName(coffeeType),
      cup: COFFEE_CUP_IMAGES[coffeeType] || FALLBACK_CUP,
    };
  }, [activeSlide, coffeeType, displayName, skippedWelcome, suffix]);

  const fullName = `${heroState.name}${heroState.suffix}`;

  const formulaDetails = useMemo(() => {
    if (!skippedWelcome) return null;
    if (heroState.name === 'Vandy') {
      return {
        inputName: 'Vandana',
        inputCoffee: 'Cold Brew',
        heroName: 'Vandy',
        heroSuffix: 'Brew',
      };
    }
    if (heroState.name === 'Preri') {
      return {
        inputName: 'Prerita',
        inputCoffee: 'Frappe',
        heroName: 'Preri',
        heroSuffix: 'Appe',
      };
    }
    if (heroState.name === 'Rishi') {
      return {
        inputName: 'Rishima',
        inputCoffee: 'Latte',
        heroName: 'Rishi',
        heroSuffix: 'Latte',
      };
    }
    return {
      inputName: heroState.name,
      inputCoffee: heroState.drinkLabel || 'Cold Brew',
      heroName: heroState.name,
      heroSuffix: heroState.suffix,
    };
  }, [skippedWelcome, heroState]);

  useEffect(() => {
    if (skippedWelcome) return;
    if (typedChars < fullName.length) {
      const timer = setTimeout(() => setTypedChars(typedChars + 1), 80 + Math.random() * 40);
      return () => clearTimeout(timer);
    }
  }, [typedChars, fullName.length, skippedWelcome]);

  const nameLen = heroState.name.length;
  const visibleName = fullName.slice(0, Math.min(typedChars, nameLen));
  const visibleSuffix = fullName.slice(nameLen, Math.min(typedChars, fullName.length));

  const titleFontSize = useMemo(() => {
    const totalLength = (heroState.name || '').length + (heroState.suffix || '').length;
    if (totalLength > 15) return 'clamp(10rem, 15vw, 13rem)';
    if (totalLength > 12) return 'clamp(13rem, 19vw, 17rem)';
    if (totalLength > 9) return 'clamp(16rem, 23vw, 21rem)';
    if (totalLength > 7) return 'clamp(18rem, 26vw, 24rem)';
    return 'clamp(20rem, 29vw, 27rem)';
  }, [heroState.name, heroState.suffix]);

  return (
    <section
      className={`homepage-react-hero${skippedWelcome ? ' homepage-react-hero--skipped' : ''}`}
      aria-labelledby="homepage-react-hero-title"
    >
      <h1
        id="homepage-react-hero-title"
        className="homepage-react-hero__title"
        style={{ fontSize: titleFontSize }}
        aria-label={`${heroState.name}${heroState.suffix}`}
      >
        {skippedWelcome ? (
          <>
            <span className="homepage-react-hero__name">{heroState.name}</span>
            <span className="homepage-react-hero__suffix">{heroState.suffix}</span>
          </>
        ) : (
          <>
            <span className="homepage-react-hero__name">{visibleName}</span>
            <span className="homepage-react-hero__suffix">{visibleSuffix}</span>
            {typedChars < fullName.length && <span className="homepage-react-hero__cursor" aria-hidden="true">|</span>}
          </>
        )}

        {skippedWelcome && formulaDetails && (
          <span className="homepage-react-hero__formula-text" role="note">
            <span className="formula-text__name">{formulaDetails.inputName}</span>
            <span className="formula-text__operator">+</span>
            <span className="formula-text__coffee">{formulaDetails.inputCoffee}</span>

            <span className="homepage-react-hero__formula-tooltip" role="tooltip">
              <span className="formula-tooltip__title">Hero Title Naming Logic</span>
              <span className="formula-tooltip__math">
                <span className="math-input">{formulaDetails.inputName}</span>
                <span className="math-operator">+</span>
                <span className="math-input">{formulaDetails.inputCoffee}</span>
              </span>
              <span className="formula-tooltip__arrow">➔</span>
              <span className="formula-tooltip__result">
                <span className="result-name">{formulaDetails.heroName}</span>
                <span className="result-suffix">{formulaDetails.heroSuffix}</span>
              </span>
              <span className="formula-tooltip__desc">
                We take your name and blend it with your favorite coffee type to generate your custom <strong>Hero Title</strong>!
              </span>
            </span>
          </span>
        )}
      </h1>

      <img
        className="homepage-react-hero__beans-svg"
        src="/coffeebeans.svg"
        alt=""
        decoding="async"
        fetchPriority="high"
        aria-hidden="true"
      />

      <div
        className="homepage-react-hero__cup-wrap"
        style={{
          '--hero-cup-scale': heroState.cup.scale,
          '--hero-cup-offset': `${heroState.cup.yOffset}px`,
          '--hero-cup-max-height': heroState.cup.maxHeight,
          '--hero-cta-top': heroState.cup.ctaTop,
        }}
      >
        <img
          key={heroState.cup.url}
          className="homepage-react-hero__cup"
          src={heroState.cup.url}
          alt={`${heroState.drinkLabel || `${heroState.name} ${heroState.suffix}`} iced coffee`}
          width={heroState.cup.width}
          height={heroState.cup.height}
          decoding="async"
          fetchPriority="high"
        />
        <div className="homepage-react-hero__glass-headline">
          <svg
            className="glass-headline-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            {/* Takeaway cup lid */}
            <path d="M6 9h12" />
            <path d="M5 6h14a1 1 0 0 1 1 1v2H4V7a1 1 0 0 1 1-1z" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            {/* Takeaway cup body */}
            <path d="M6 9l1.8 11.5c.1.9.9 1.5 1.7 1.5h5c.8 0 1.5-.6 1.7-1.5L18 9" />
          </svg>
          <span>Code Your Own Coffee</span>
        </div>
        {/* <Link to="/build" className="homepage-react-hero__cup-cta">
          <span>Code Your Own Coffee</span>
        </Link> */}
      </div>

      {skippedWelcome && (
        <div className="homepage-react-hero__dots" aria-label="Featured coffee examples">
          {SKIPPED_HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.name}
              type="button"
              className={index === activeSlide ? 'is-active' : ''}
              aria-label={`Show ${slide.name} ${slide.suffix}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      )}

    </section>
  );
}

function SkipHomepageMiddleFlow() {
  const whySectionRef = useRef(null);
  const [whyVisible, setWhyVisible] = useState(false);
  const videoSentinelRef = useRef(null);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const hardPartRef = useRef(null);

  const [waveAnim, setWaveAnim] = useState({ from: '0%', to: '-50%' });
  const topWavePathRef = useRef(null);
  const topWaveTextRef = useRef(null);

  useEffect(() => {
    const measureWave = () => {
      if (!topWavePathRef.current || !topWaveTextRef.current) return;
      try {
        const pathLength = topWavePathRef.current.getTotalLength();
        const textLength = topWaveTextRef.current.getComputedTextLength();
        const repetitions = 5;
        const oneRepetitionLength = textLength / repetitions;
        const shiftPercent = (oneRepetitionLength / pathLength) * 100;
        setWaveAnim({
          from: '0%',
          to: `-${shiftPercent}%`
        });
      } catch (e) {
        console.error(e);
      }
    };

    measureWave();
    window.addEventListener('resize', measureWave);

    if (document.fonts) {
      document.fonts.ready.then(measureWave);
    }

    const timer = setTimeout(measureWave, 500);

    return () => {
      window.removeEventListener('resize', measureWave);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const section = whySectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWhyVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = whySectionRef.current;
    if (!section) return undefined;

    const items = section.querySelectorAll('.skip-why-chilld__item');

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalRange = viewportHeight + rect.height;
      const currentScroll = viewportHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalRange));

      items.forEach((item) => {
        let range = 150;
        let distortion = 0;
        let isOdd = false;

        if (item.classList.contains('skip-why-chilld__item--one')) {
          range = 140;
          distortion = 12;
          isOdd = true;
        } else if (item.classList.contains('skip-why-chilld__item--three')) {
          range = 130;
          distortion = -15;
          isOdd = true;
        } else if (item.classList.contains('skip-why-chilld__item--two')) {
          range = 150;
          distortion = -10;
        } else if (item.classList.contains('skip-why-chilld__item--four')) {
          range = 160;
          distortion = 18;
        }

        const direction = isOdd ? 1 : -1;
        const parallaxY = (progress - 0.5) * range * direction + distortion;
        item.style.setProperty('--why-cup-parallax-y', `${parallaxY}px`);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [whyVisible]);

  useEffect(() => {
    const sentinel = videoSentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVideoExpanded(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px 0px -20% 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = hardPartRef.current;
    if (!section) return undefined;

    const video = section.querySelector('.skip-hard-part__video');

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const totalRange = viewportHeight + sectionHeight;
      const currentScroll = viewportHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalRange));

      const objectY = 50 - progress * 45;
      video.style.objectPosition = `42% ${objectY}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section ref={hardPartRef} className="skip-hard-part" aria-labelledby="skip-hard-part-title">
        <div className="skip-hard-part__media">
          <video
            className="skip-hard-part__video"
            src="/Videos/coffeeswirl2.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="skip-hard-part__shade" />
        </div>
        <svg className="skip-hard-part__top-wave" viewBox="0 0 1512 230" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <path
              ref={topWavePathRef}
              id="skip-hard-part-wave-text"
              d="M -180 236 C -120 236, -60 181.3, 0 208 L 63 179.96 C 126 152.35, 252 95.65, 378 95.97 C 504 95.65, 630 152.35, 756 179.96 C 882 208, 1008 208, 1134 179.96 C 1260 152.35, 1386 95.65, 1449 68.03 L 1512 40 C 1572 13.3, 1632 -14, 1692 -14"
            />
          </defs>
          <text className="skip-hard-part__top-wave-text" dy="0.85em">
            <textPath
              ref={topWaveTextRef}
              href="#skip-hard-part-wave-text"
              startOffset="0%"
            >
              100% real coffee…Only cold brew, nothing else…authentic coffee, without the fuss…for those who like it smooth…custom coded coffee …save money, drink Chilld…it’s not about the temperature…fuel for your next…Chilld before the next meeting… • 100% real coffee…Only cold brew, nothing else…authentic coffee, without the fuss…for those who like it smooth…custom coded coffee …save money, drink Chilld…it’s not about the temperature…fuel for your next…Chilld before the next meeting… • 100% real coffee…Only cold brew, nothing else…authentic coffee, without the fuss…for those who like it smooth…custom coded coffee …save money, drink Chilld…it’s not about the temperature…fuel for your next…Chilld before the next meeting… • 100% real coffee…Only cold brew, nothing else…authentic coffee, without the fuss…for those who like it smooth…custom coded coffee …save money, drink Chilld…it’s not about the temperature…fuel for your next…Chilld before the next meeting… • 100% real coffee…Only cold brew, nothing else…authentic coffee, without the fuss…for those who like it smooth…custom coded coffee …save money, drink Chilld…it’s not about the temperature…fuel for your next…Chilld before the next meeting… •
              <animate
                key={`${waveAnim.from}-${waveAnim.to}`}
                attributeName="startOffset"
                from={waveAnim.from}
                to={waveAnim.to}
                dur="34s"
                repeatCount="indefinite"
              />
            </textPath>
          </text>
        </svg>

        <div className="skip-hard-part__content">
          <h2 id="skip-hard-part-title">We handled the hard part, the fun part's on you</h2>
          <span className="skip-hard-part__rule" aria-hidden="true" />
          <p className="skip-hard-part__intro">
            We get you exceptional coffee concentrate. We take care of the nitty-gritties of sourcing, grinding and brewing.
            After that, you are free to tailor your daily coffee to your liking. Add water, if you are in a hurry for your
            presentation. Add syrup, milk, experiment with everyday ingredients in your kitchen, if you feel like it.
          </p>
          <p className="skip-hard-part__middle">
            If you've been on-call all night, add an extra spoon of our cold brew concentrate. If you get jittery but
            enjoy the occasional pick-me-up, add a spoon less. No one's judging you.
          </p>
          <p className="skip-hard-part__promise">
            We guarantee that it will taste good; we promise that it won't eat into your wallet.
          </p>
          <p className="skip-hard-part__quote">"Coffee is too much work?"</p>
          <p className="skip-hard-part__simple">
            If you can make lemonade or iced-water, this is a walk in the park.
          </p>
          <p className="skip-hard-part__closing">
            Chilld is built for people who like things their way. From milk choices to sweetness levels, every drink is designed
            by you. No complicated menus. Just cold coffee made for your mood, your routine, and your kind of day.
          </p>
          <div className="skip-hard-part__actions">
            <Link to="/menu" className="skip-hard-part__primary">Cold Brew Concentrate</Link>
            <Link to="/recipes" className="skip-hard-part__secondary">Explore Recipes</Link>
          </div>
        </div>

        <svg className="skip-hard-part__bottom-wave" viewBox="0 0 1512 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 46 C178 96 348 138 532 137 C724 136 850 82 1026 82 C1210 82 1336 130 1512 176 L1512 220 L0 220 Z" fill="#EBF5FF" />
        </svg>
      </section>

      <section
        ref={whySectionRef}
        className={`skip-why-chilld${whyVisible ? ' is-visible' : ''}`}
        aria-labelledby="skip-why-chilld-title"
      >
        <div className="skip-why-chilld__background" aria-hidden="true">
          <img src="/images/WhyChilldSubtract.svg" alt="" />
        </div>
        <h2 id="skip-why-chilld-title">Why Chilld?</h2>
        <div className="skip-why-chilld__grid">
          {WHY_CHILLD_ITEMS.map((item, index) => (
            <WhyChilldCup
              key={item.id}
              item={item}
              className={`skip-why-chilld__item skip-why-chilld__item--${item.id}`}
              cupWrapClassName="skip-why-chilld__cup-wrap"
              cupClassName="skip-why-chilld__cup"
              style={{ '--why-reveal-delay': `${index * 180}ms` }}
            />
          ))}
        </div>
      </section>

      <div ref={videoSentinelRef} aria-hidden="true" />
      <section
        className={`skip-feature-video${videoExpanded ? ' is-expanded' : ''}`}
        aria-label="Chilld cold brew concentrate video"
      >
        <video
          src="/Videos/coffee_concentrate_with_glass.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          width="1180"
          height="664"
        />
      </section>
    </>
  );
}

function HomepageLowerFlow() {
  return (
    <section className="homepage-lower-flow" aria-label="Chilld social proof and cafe offer">
      <TestimonialsBento />

      <section className="lower-flow-trending" aria-labelledby="lower-flow-trending-title">
        <h2 id="lower-flow-trending-title">Trending Mixes</h2>

        <div className="lower-flow-trending__rail" aria-label="Trending coffee mixes">
          <div className="lower-flow-trending__track">
            <TrendingMixCards />
            <TrendingMixCards duplicate />
          </div>
        </div>

        <div className="lower-flow-trending__actions">
          <div className="lower-flow-trending__arrows" aria-hidden="true">
            <span>&lt;</span>
            <span>&gt;</span>
          </div>
          <p>
            Tag your mix with <strong>#ChilldByYou</strong>
          </p>
          <Link to="/recipes" className="lower-flow-trending__button">
            Explore Recipes
          </Link>
        </div>
      </section>

      <section className="lower-flow-b2b" aria-labelledby="lower-flow-b2b-title">
        <div className="lower-flow-b2b__content">
          <h2 id="lower-flow-b2b-title">B2B - The Cold Brew Factory for your Restaurant &amp; Cafe</h2>
          <p>
            Authentic taste, Consistent quality, Customised blends for HoReCa clients. More than 70% of your clients are drinking cold beverages. Unleash the creativity of your chefs with an operationally easy core.
          </p>

          <dl className="lower-flow-b2b__stats" aria-label="Cold brew business benefits">
            <div>
              <dt>&lt;48h</dt>
              <dd>Fresh Brew</dd>
            </div>
            <div>
              <dt>0</dt>
              <dd>Zero Capex</dd>
            </div>
            <div>
              <dt>2L</dt>
              <dd>Small MOQ</dd>
            </div>
            <div>
              <dt>₹₹₹</dt>
              <dd>Low TCO</dd>
            </div>
          </dl>

          <div className="lower-flow-b2b__cta">
            <h3>Request a free tasting session</h3>
            <p>No commitment. We'll demo recipes tailored to your menu.</p>
            <a href="tel:+918693852250">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <span>Call +91 86938 52250</span>
            </a>
          </div>
        </div>

        <div className="lower-flow-b2b__visual" aria-hidden="true">
          <img
            src="/images/COFFEBOTTLES.png"
            alt=""
            width="1080"
            height="1080"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <Footer className="footer--homepage-lower-flow" />
    </section>
  );
}

function DesktopHomePage() {
  const getHeroText = useUserStore((state) => state.getHeroText);
  const coffeeType = useUserStore((state) => state.coffeeType);
  const skippedWelcome = useUserStore((state) => state.skippedWelcome);
  const { displayName, suffix } = useMemo(() => getHeroText(), [getHeroText]);

  return (
    <div className="homepage-react-container">
      <div className="skip-homepage-flow">
        <HomeHero
          skippedWelcome={skippedWelcome}
          displayName={displayName}
          suffix={suffix}
          coffeeType={coffeeType}
        />
        <SkipHomepageMiddleFlow />
        <HomepageLowerFlow />
      </div>
    </div>
  );
}

export default DesktopHomePage;
