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
    scale: 1.0,
    yOffset: 0,
    maxHeight: '66dvh',
    ctaTop: '54%',
    width: 634,
    height: 1024,
  },
  AFFOGATO: {
    url: '/images/affogato.png',
    scale: 1.0,
    yOffset: 0,
    maxHeight: '64dvh',
    ctaTop: '56%',
    width: 1080,
    height: 1080,
  },
  FRAPPE: {
    url: '/images/frappe.webp',
    scale: 1.0,
    yOffset: 0,
    maxHeight: '66dvh',
    ctaTop: '49%',
    width: 1080,
    height: 1080,
  },
  LATTE: {
    url: coffeeCup,
    scale: 1.0,
    yOffset: 0,
    maxHeight: '76dvh',
    ctaTop: '59%',
    width: 1632,
    height: 2582,
  },
  VIETNAMESE: {
    url: '/images/VIETNAMESE.png',
    scale: 1.0,
    yOffset: 0,
    maxHeight: '72dvh',
    ctaTop: '58%',
    width: 1080,
    height: 1080,
  },
  CORTADO: {
    url: '/images/CATARDO.png',
    scale: 1.0,
    yOffset: 0,
    maxHeight: '72dvh',
    ctaTop: '59%',
    width: 1080,
    height: 1080,
  },
  COLDBREW: {
    url: '/images/COLD BREW.png',
    scale: 1.0,
    yOffset: 0,
    maxHeight: '74dvh',
    ctaTop: '59%',
    width: 1632,
    height: 2582,
  },
  ESPRESSO: {
    url: '/images/expresso.webp',
    scale: 1.0,
    yOffset: 0,
    maxHeight: '62dvh',
    ctaTop: '56%',
    width: 1080,
    height: 1080,
  },
};

const FALLBACK_CUP = {
  url: '/images/iced-coffee-cup.webp',
  scale: 1,
  yOffset: 70,
  maxHeight: '66dvh',
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

  const titleFontSize = useMemo(() => {
    const totalLength = (heroState.name || '').length + (heroState.suffix || '').length;
    if (totalLength > 12) return 'clamp(11rem, 16vw, 15rem)';
    if (totalLength > 9) return 'clamp(14rem, 20vw, 19rem)';
    return 'clamp(17rem, 24vw, 23rem)';
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
        aria-label={`${heroState.name} ${heroState.suffix}`}
      >
        <span className="homepage-react-hero__name">{heroState.name}</span>
        <span className="homepage-react-hero__suffix">{heroState.suffix}</span>
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
        {!skippedWelcome && (
          <Link to="/build" className="homepage-react-hero__cup-cta">
            <Coffee size={18} aria-hidden="true" />
            <span>Code Your Own Coffee</span>
          </Link>
        )}
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

  return (
    <>
      <section className="skip-hard-part" aria-labelledby="skip-hard-part-title">
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
        <svg className="skip-hard-part__top-wave" viewBox="0 0 1512 230" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <path
              id="skip-hard-part-wave-text"
              d="M -180 236 C -120 236, -60 181.3, 0 208 L 63 179.96 C 126 152.35, 252 95.65, 378 95.97 C 504 95.65, 630 152.35, 756 179.96 C 882 208, 1008 208, 1134 179.96 C 1260 152.35, 1386 95.65, 1449 68.03 L 1512 40 C 1572 13.3, 1632 -14, 1692 -14"
            />
          </defs>
          <text className="skip-hard-part__top-wave-text" dy="0.85em">
            <textPath href="#skip-hard-part-wave-text" startOffset="-8%">
              Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......
              <animate attributeName="startOffset" from="-45%" to="35%" dur="34s" repeatCount="indefinite" />
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
          <path d="M0 46 C178 96 348 138 532 137 C724 136 850 82 1026 82 C1210 82 1336 130 1512 176 L1512 220 L0 220 Z" fill="#ffffff" />
        </svg>
      </section>

      <section
        ref={whySectionRef}
        className={`skip-why-chilld${whyVisible ? ' is-visible' : ''}`}
        aria-labelledby="skip-why-chilld-title"
      >
        <div className="skip-why-chilld__background" aria-hidden="true">
          <img src="/Subtract (2).svg" alt="" />
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

      <section className="skip-feature-video" aria-label="Chilld cold brew concentrate video">
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
          <h2 id="lower-flow-b2b-title">Premium Cold Brew for your Restaurant &amp; Café</h2>
          <p>
            Tailored Solutions for Cloud Kitchens, bars, restaurants and caterers
          </p>

          <dl className="lower-flow-b2b__stats" aria-label="Cold brew business benefits">
            <div>
              <dt>&lt;72h</dt>
              <dd>Freshly Brewed</dd>
            </div>
            <div>
              <dt>0</dt>
              <dd>Zero Capex</dd>
            </div>
            <div>
              <dt>∞</dt>
              <dd>Menu Uses</dd>
            </div>
            <div>
              <dt>NO</dt>
              <dd>Special Manpower</dd>
            </div>
          </dl>

          <div className="lower-flow-b2b__cta">
            <h3>Request a free tasting session</h3>
            <p>No commitment. We'll demo recipes tailored to your menu.</p>
            <a href="tel:+918693852250">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
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
