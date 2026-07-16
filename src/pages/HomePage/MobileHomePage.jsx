import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Coffee,
  PlayCircle,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import Footer from '@/components/Footer/Footer';
import WhyChilldCup, { WHY_CHILLD_ITEMS } from '@/components/WhyChilldCup/WhyChilldCup';
import './MobileHomePage.css';

const ASSET_BASE = '/images/mobile-home/';

const COFFEE_CUP_IMAGES = {
  AMERICANO: {
    url: '/images/iced-coffee-cup.webp',
    mobileScale: 0.78,
    mobileY: -35,
  },
  AFFOGATO: {
    url: '/images/affogato.png',
    mobileScale: 0.60,
    mobileY: -50,
  },
  FRAPPE: {
    url: '/images/frappe.webp',
    mobileScale: 0.78,
    mobileY: -38,
  },
  LATTE: {
    url: '/images/LATTEeee.png',
    mobileScale: 0.54,
    mobileY: -55,
  },
  VIETNAMESE: {
    url: '/images/VIETNAMESE.png',
    mobileScale: 0.54,
    mobileY: -55,
  },
  CORTADO: {
    url: '/images/CATARDO.png',
    mobileScale: 0.50,
    mobileY: -60,
  },
  COLDBREW: {
    url: '/images/COLD BREW.png',
    mobileScale: 0.54,
    mobileY: -55,
  },
  ESPRESSO: {
    url: '/images/Esspresso.png',
    mobileScale: 0.55,
    mobileY: -60,
  },
};

const beanClasses = ['one', 'two', 'three', 'four', 'seven', 'eight', 'nine', 'ten'];

const storyNotes = [
  'Source, roast, grind, and slow-brew handled for you.',
  'Add milk, water, tonic, ice, or your own mix.',
  'Cafe-style cold coffee without a cafe-sized wait.',
];

const marqueeText = '100% real coffee…Only cold brew, nothing else…authentic coffee, without the fuss…for those who like it smooth…custom coded coffee …save money, drink Chilld…it’s not about the temperature…fuel for your next…Chilld before the next meeting… • ';



const popularDrinks = [
  {
    name: 'Mint Tonic',
    description: 'Bright, iced, and light.',
    image: `${ASSET_BASE}mint-coldbrew.png`,
    to: '/recipe-details/cold-brew-mint-tonic',
    tone: 'mint',
  },
  {
    name: 'Citrus Brew',
    description: 'Fresh cold brew, mellow finish.',
    image: `${ASSET_BASE}lemon-coldbrew.png`,
    to: '/recipe-details/cold-brew-orange',
    tone: 'citrus',
  },
  {
    name: 'Coffee Cloud',
    description: 'Creamy, soft, easy to love.',
    image: `${ASSET_BASE}latte-glass.png`,
    to: '/recipe-details/cold-brew-latte',
    tone: 'cloud',
  },
  {
    name: 'Cold Brew Core',
    description: 'The everyday clean base.',
    image: `${ASSET_BASE}cold-brew-cup.png`,
    to: '/recipe-details/cold-brew',
    tone: 'core',
  },
];

const SKIPPED_HERO_SLIDES = [
  {
    name: 'Vandy',
    suffix: 'Brew',
    formula: "Vandana’s Cold Brew",
    image: '/images/COLD BREW.png',
  },
  {
    name: 'Preri',
    suffix: 'Appe',
    formula: "Prerita’s Frappe",
    image: '/images/frappe.webp',
  },
  {
    name: 'Rishi',
    suffix: 'Latte',
    formula: "Rishima’s Latte",
    image: '/images/LATTEeee.png',
  },
];

function getCupConfigByUrl(imageUrl) {
  return Object.values(COFFEE_CUP_IMAGES).find((config) => config.url === imageUrl) || {
    url: imageUrl,
    mobileScale: 1.0,
    mobileY: 0,
  };
}

function formatCoffeeName(coffeeType) {
  if (!coffeeType) return 'Cold Brew';
  return coffeeType.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

const benefits = ['8-10 serves per bottle', 'Ready in under a minute', 'Milk, tonic, ice, and mixers'];

function MobileButton({ to, href, children, variant = 'primary', className = '', icon: Icon, onClick }) {
  const classes = `mobile-home-button mobile-home-button--${variant} ${className}`.trim();
  const content = (
    <>
      {Icon && <Icon size={17} aria-hidden="true" />}
      <span>{children}</span>
      <ArrowRight size={16} aria-hidden="true" />
    </>
  );

  if (onClick) {
    return (
      <button className={classes} onClick={(e) => { e.preventDefault(); onClick(); }}>
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href}>
        {content}
      </a>
    );
  }

  return (
    <Link className={classes} to={to}>
      {content}
    </Link>
  );
}

function SectionHeading({ eyebrow, title, id, children }) {
  return (
    <div className="mobile-home-section-heading">
      <p>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {children && <span>{children}</span>}
    </div>
  );
}

export default function MobileHomePage() {
  const getHeroText = useUserStore((state) => state.getHeroText);
  const coffeeType = useUserStore((state) => state.coffeeType);
  const skippedWelcome = useUserStore((state) => state.skippedWelcome);
  const { displayName, suffix } = useMemo(() => getHeroText(), [getHeroText]);

  const [activeSlide, setActiveSlide] = useState(0);
  const whySectionRef = useRef(null);
  const [whyCupsVisible, setWhyCupsVisible] = useState(false);
  const navigate = useNavigate();
  const [cupSlam, setCupSlam] = useState(false);
  const [typedChars, setTypedChars] = useState(0);

  const allSlides = useMemo(() => {
    const mainSlide = {
      name: displayName || 'CHILLD',
      suffix: suffix || 'BREW',
      formula: `${displayName || 'CHILLD'}’s ${formatCoffeeName(coffeeType)}`,
      cup: COFFEE_CUP_IMAGES[coffeeType] || { url: `${ASSET_BASE}cold-brew-cup.png`, mobileScale: 1.0, mobileY: 0 },
    };

    const skipSlides = SKIPPED_HERO_SLIDES.map(slide => ({
      name: slide.name,
      suffix: slide.suffix,
      formula: slide.formula,
      cup: getCupConfigByUrl(slide.image),
    }));

    if (skippedWelcome) {
      return skipSlides;
    }
    return [mainSlide, ...skipSlides];
  }, [displayName, suffix, coffeeType, skippedWelcome]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % allSlides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [allSlides.length]);

  const heroState = allSlides[activeSlide] || allSlides[0];
  const fullName = `${heroState.name}${heroState.suffix}`;
  const heroLabel = fullName;

  const triggerCupSlam = (to) => {
    setCupSlam(true);
    setTimeout(() => {
      setCupSlam(false);
      navigate(to);
    }, 500);
  };

  useEffect(() => {
    if (typedChars < fullName.length) {
      const timer = setTimeout(() => setTypedChars((prev) => prev + 1), 80 + Math.random() * 40);
      return () => clearTimeout(timer);
    }
  }, [typedChars, fullName.length]);

  useEffect(() => {
    setTypedChars(0);
    const timer = setTimeout(() => setTypedChars(1), 500);
    return () => clearTimeout(timer);
  }, [activeSlide]);

  useEffect(() => {
    const section = whySectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWhyCupsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const nameLen = heroState.name.length;
  const visibleName = fullName.slice(0, Math.min(typedChars, nameLen));
  const visibleSuffix = fullName.slice(nameLen, Math.min(typedChars, fullName.length));

  return (
    <div className="mobile-home" data-testid="mobile-home-page">
      <section className={`mobile-home-hero${skippedWelcome ? ' mobile-home-hero--skipped' : ''}`} aria-labelledby="mobile-home-title">
        <div className="mobile-home-hero__title-wrap">
          <h1 className="mobile-home-hero__title" id="mobile-home-title" aria-label={`${heroLabel} cold brew`}>
            <span className="mobile-home-hero__name">{visibleName}</span>
            <span className="mobile-home-hero__suffix">{visibleSuffix}</span>
            {typedChars < fullName.length && <span className="mobile-home-hero__cursor" aria-hidden="true">|</span>}
          </h1>

          {heroState.formula && (
            <span className="mobile-home-hero__formula-text" role="note">
              {heroState.formula}
            </span>
          )}
        </div>

        <div className="mobile-home-hero__beans" aria-hidden="true">
          {beanClasses.map((beanClass) => (
            <div
              key={beanClass}
              className={`mobile-home-hero__bean-item mobile-home-hero__bean-item--${beanClass}`}
            >
              <img
                className={`mobile-home-hero__bean mobile-home-hero__bean--${beanClass}`}
                src={`${ASSET_BASE}coffee-bean.png`}
                alt=""
                fetchPriority="high"
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div className="mobile-home-hero__cup-stage">
          <div
            className="mobile-home-hero__cup-wrap"
            style={{
              transform: `scale(${(heroState.cup.mobileScale || 1.0) * 1.2}) translateY(${(heroState.cup.mobileY || 0) + 60}px)`,
              transformOrigin: 'center bottom',
              transition: 'transform 0.4s ease',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <img
              className={`mobile-home-hero__cup${cupSlam ? ' mobile-home-hero__cup--slam' : ''}`}
              src={heroState.cup.url}
              alt="Iced Chilld cold brew in a clear cup"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        <div className="mobile-home-hero__dots" aria-label="Featured coffee examples">
          {allSlides.map((slide, index) => (
            <button
              key={`${slide.name}-${index}`}
              type="button"
              className={index === activeSlide ? 'is-active' : ''}
              aria-label={`Show ${slide.name} ${slide.suffix}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>

        <div className="mobile-home-hero__actions" aria-label="Primary actions">
          {/* <MobileButton icon={Coffee} onClick={() => triggerCupSlam('/build')}>Create Your Drink</MobileButton> — kiosk-only */}
          <MobileButton icon={Coffee} onClick={() => triggerCupSlam('/menu')}>
            Shop Concentrates
          </MobileButton>
          <MobileButton variant="secondary" icon={ShoppingBag} onClick={() => triggerCupSlam('/recipes')}>
            Explore Recipes
          </MobileButton>
        </div>
      </section>

      <section className="mobile-home-marquee" aria-label="100% real coffee">
        <div className="mobile-home-marquee__track" aria-hidden="true">
          {[0, 1].map((setIndex) => (
            <span className="mobile-home-marquee__set" key={setIndex}>
              <span>{marqueeText}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="mobile-home-story" aria-labelledby="mobile-home-story-title">
        <video
          className="mobile-home-story__video"
          src={`${ASSET_BASE}coffeeswirl.mp4`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="mobile-home-story__shade" aria-hidden="true" />
        <div className="mobile-home-story__copy">
          <p className="mobile-home-eyebrow mobile-home-eyebrow--cream">Great coffee, made easy</p>
          <h2 id="mobile-home-story-title">We handled the hard part. The fun part is on you.</h2>
          <p>
            Chilld keeps the craft behind the scenes, so your daily cup stays quick,
            personal, and calm.
          </p>
          <ul>
            {storyNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <MobileButton to="/menu" variant="cream" icon={ShoppingBag}>
            Buy Cold Brew Core
          </MobileButton>
        </div>
      </section>

      <section
        ref={whySectionRef}
        className={`mobile-home-why-chilld${whyCupsVisible ? ' is-visible' : ''}`}
        aria-labelledby="mobile-home-cups-title"
      >
        <SectionHeading id="mobile-home-cups-title" eyebrow="Why Chilld" title="Small cups. Big reasons." />
        <div className="mobile-home-why-chilld__grid">
          {WHY_CHILLD_ITEMS.map((item, index) => (
            <WhyChilldCup
              key={item.id}
              item={item}
              className={`mobile-home-why-chilld__item item-${item.id}`}
              cupWrapClassName="mobile-home-why-chilld__cup-wrap"
              cupClassName="mobile-home-why-chilld__cup"
              style={{ '--why-cup-delay': `${index * 140}ms` }}
            />
          ))}
        </div>
      </section>

      <section className="mobile-home-process" aria-labelledby="mobile-home-process-title">
        <div className="mobile-home-process__media">
          <video
            src={`${ASSET_BASE}coffee-concentrate-with-glass.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <PlayCircle size={38} aria-hidden="true" />
        </div>
        <div className="mobile-home-process__copy">
          <p className="mobile-home-eyebrow">How they make it</p>
          <h2 id="mobile-home-process-title">Pour. Mix. Chill.</h2>
          <p>Concentrate, ice, milk or tonic. A premium cold coffee is ready before the ice settles.</p>
          {/* <MobileButton to="/build" variant="dark" icon={Coffee}>Open builder</MobileButton> — kiosk-only */}
          <MobileButton to="/menu" variant="dark" icon={Coffee}>
            Shop Concentrates
          </MobileButton>
        </div>
      </section>

      <section className="mobile-home-social" aria-labelledby="mobile-home-social-title">
        <SectionHeading id="mobile-home-social-title" eyebrow="What people are saying" title="Real Chilld moments." />
        <div className="mobile-home-review-grid">

          {/* Card 1: Garden Collection Image */}
          <article className="mobile-home-review-card mobile-home-review-card--media">
            <img src={`${ASSET_BASE}garden-collection.png`} alt="Chilld coffee recipe collection" loading="lazy" decoding="async" />
          </article>

          {/* Card 2: Swirl Video */}
          <article className="mobile-home-review-card mobile-home-review-card--video">
            <video
              src="/Videos/coffeeswirl1.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </article>

          {/* Card 3: Facebook */}
          <article className="mobile-home-review-card mobile-home-review-card--facebook">
            <p className="mobile-home-review-card__body">
              Finally a coffee brand that doesn't judge my weird combinations.
            </p>
            <div className="mobile-home-review-card__footer">
              <span className="mobile-home-review-card__handle">@bangalorebuzz</span>
              <span className="mobile-home-review-card__brand mobile-home-review-card__brand--facebook">
                facebook
              </span>
            </div>
          </article>

          {/* Card 4: Amazon Rating */}
          <article className="mobile-home-review-card mobile-home-review-card--amazon">
            <div className="mobile-home-review-card__amazon-logo">
              <span className="amazon-text">amazon</span>
              <svg viewBox="0 0 76 15" width="62" height="12" fill="none">
                <path d="M4 3c14 6.5 32 6.5 46 0" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M45.5 2c1.2.8 2.5 1.5 3 2.5-.5-.2-1.8-.8-3-1" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="mobile-home-review-card__stars">★★★★★</span>
            <div className="mobile-home-review-card__rating-info">
              <strong>5.0</strong>
              <span>Based on 128 reviews</span>
            </div>
          </article>

          {/* Card 5: Twitter / X */}
          <article className="mobile-home-review-card mobile-home-review-card--x">
            <p className="mobile-home-review-card__body">
              Meeting se pehle CHILLD leliya. Survived somehow.
            </p>
            <div className="mobile-home-review-card__footer">
              <span className="mobile-home-review-card__handle">@corporatelaunda</span>
              <span className="mobile-home-review-card__brand">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
            </div>
          </article>

          {/* Card 6: Reddit */}
          <article className="mobile-home-review-card mobile-home-review-card--reddit">
            <p className="mobile-home-review-card__body">
              Made my own drink and honestly... this might ruin normal coffee for me now.
            </p>
            <div className="mobile-home-review-card__footer">
              <span className="mobile-home-review-card__handle">@riyaworksallday</span>
              <span className="mobile-home-review-card__brand mobile-home-review-card__brand--reddit">
                <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '3px' }}>
                  <path d="M17.16 9.17a2.12 2.12 0 0 0-3.52-1.57c-1.2-.74-2.83-1.22-4.63-1.28L10 2.22l2.9.61c.03.52.46.94.99.94a1.03 1.03 0 1 0-1.03-1.03c0 .06.01.12.02.18l-3.23-.68a.43.43 0 0 0-.49.31L8.1 6.32c-1.83.04-3.5.52-4.73 1.27a2.12 2.12 0 0 0-2.4 3.19c-.06.24-.09.5-.09.76 0 3.2 3.82 5.8 8.54 5.8s8.54-2.6 8.54-5.8c0-.25-.03-.49-.08-.72a2.11 2.11 0 0 0 1.28-2.65ZM4.67 11.3a1.23 1.23 0 1 1 2.46 0 1.23 1.23 0 0 1-2.46 0Zm7.89 3.03c-.92.92-2.67.92-3.6 0a.39.39 0 1 1 .55-.55c.62.61 1.88.61 2.5 0a.39.39 0 1 1 .55.55Zm-.75-1.8a1.23 1.23 0 1 1 0-2.46 1.23 1.23 0 0 1 0 2.46Z" />
                </svg>
                reddit
              </span>
            </div>
          </article>

          {/* Card 7: Google Maps Card with video */}
          <article className="mobile-home-review-card mobile-home-review-card--google">
            <div className="mobile-home-review-card__google-promo">
              <span className="google-eyebrow">CHILLD COFFEE</span>
              <h3>Coffee should look like this.</h3>
              <p>Water shouldn't.</p>
              <video
                className="google-promo-media"
                src="/Videos/google-review-cup.mp4?v=20260705"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                width="320"
                height="320"
                aria-label="Iced coffee cup"
              />
            </div>
            <div className="google-comment-part">
              <div className="mobile-home-review-card__footer">
                <span className="mobile-home-review-card__handle">Khushi P.</span>
                <span className="mobile-home-review-card__brand mobile-home-review-card__brand--google">
                  <svg viewBox="0 0 24 24" width="12" height="12" style={{ verticalAlign: 'middle', marginRight: '3px' }}>
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.287 4.114a5.955 5.955 0 0 1-5.955-5.957 5.957 5.957 0 0 1 5.955-5.957c1.478 0 2.822.505 3.89 1.488l3.142-3.14C18.73 2.926 15.65 2 12.24 2 6.586 2 2 6.586 2 12.24s4.586 10.24 10.24 10.24c5.795 0 10.24-4.11-10.24-10.24 0-.627-.067-1.283-.24-1.955H12.24z" fill="#4285F4" />
                    <path d="M12.24 22.48c2.926 0 5.61-.967 7.747-2.615l-3.414-2.82c-1.186.79-2.703 1.275-4.333 1.275-3.327 0-6.143-2.25-7.148-5.284l-3.523 2.73c2.096 4.16 6.398 6.714 10.67 6.714z" fill="#34A853" />
                    <path d="M5.092 13.036a6.208 6.208 0 0 1 0-3.66l-3.523-2.73a10.228 10.228 0 0 0 0 9.12l3.523-2.73z" fill="#FBBC05" />
                    <path d="M12.24 5.76c1.82 0 3.456.627 4.745 1.822l3.504-3.5C18.32 1.944 15.485 1 12.24 1 7.968 1 3.666 3.554 1.57 7.714l3.523 2.73c1.005-3.034 3.82-5.284 7.147-5.284z" fill="#EA4335" />
                  </svg>
                  Google Maps
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="mobile-home-popular" aria-labelledby="mobile-home-popular-title">
        <SectionHeading id="mobile-home-popular-title" eyebrow="Trending mixes" title="Start with a favorite." />
        <div className="mobile-home-drink-marquee" aria-label="Popular drink recipes">
          <div className="mobile-home-drink-track">
            {[0, 1].map((setIndex) => (
              <div className="mobile-home-drink-set" key={setIndex} aria-hidden={setIndex > 0}>
                {popularDrinks.map((drink) => (
                  <Link
                    to={drink.to}
                    className={`mobile-home-drink-card mobile-home-drink-card--${drink.tone}`}
                    key={`${setIndex}-${drink.name}`}
                  >
                    <img src={drink.image} alt={drink.name} loading="lazy" decoding="async" />
                    <span>
                      <strong>{drink.name}</strong>
                      <small>{drink.description}</small>
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mobile-home-core" aria-labelledby="mobile-home-core-title">
        <div className="mobile-home-core__copy">
          <p className="mobile-home-eyebrow">Premium cold brew for your personal cafe.</p>
          <h2 id="mobile-home-core-title">One bottle. Many cups.</h2>
          <p>Keep Chilld concentrate ready and make a clean cold brew, creamy latte, tonic, or late-night mix.</p>
          <ul>
            {benefits.map((benefit) => (
              <li key={benefit}>
                <Sparkles size={15} aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
          <MobileButton to="/menu" variant="primary" icon={ShoppingBag}>
            Shop cold brew
          </MobileButton>
        </div>
        <div className="mobile-home-core__media" aria-hidden="true">
          <img
            className="mobile-home-core__image"
            src="/images/bgremoveconcentratebottels.png"
            alt=""
            loading="lazy"
            decoding="async"
            width="1080"
            height="1080"
          />
        </div>
      </section>



      <Footer />
    </div>
  );
}
