import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Coffee,
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
    url: '/images/coffee-cups/iced-coffee-cup.png',
    mobileScale: 0.78,
    mobileY: -35,
  },
  AFFOGATO: {
    url: '/images/coffee-cups/affogato.png',
    mobileScale: 0.60,
    mobileY: -50,
  },
  FRAPPE: {
    url: '/images/coffee-cups/circular/frappe_with_logo.png',
    mobileScale: 0.78,
    mobileY: -38,
  },
  LATTE: {
    url: '/images/coffee-cups/circular/latte_with_logo.png',
    mobileScale: 0.54,
    mobileY: -55,
  },
  VIETNAMESE: {
    url: '/images/coffee-cups/VIETNAMESE.png',
    mobileScale: 0.54,
    mobileY: -55,
  },
  CORTADO: {
    url: '/images/coffee-cups/CATARDO.png',
    mobileScale: 0.50,
    mobileY: -60,
  },
  COLDBREW: {
    url: '/images/coffee-cups/circular/Cold Brew_With_Logo.png',
    mobileScale: 0.54,
    mobileY: -55,
  },
  ESPRESSO: {
    url: '/images/coffee-cups/Esspresso.png',
    mobileScale: 0.55,
    mobileY: -60,
  },
  VANDY_SLIDE: {
    url: '/images/coffee-cups/circular/Cold Brew_With_Logo.png',
    mobileScale: 0.72,
    mobileY: 90,
  },
  PRERI_SLIDE: {
    url: '/images/coffee-cups/circular/frappe_with_logo.png',
    mobileScale: 0.72,
    mobileY: 90,
  },
  RISHI_SLIDE: {
    url: '/images/coffee-cups/circular/latte_with_logo.png',
    mobileScale: 0.72,
    mobileY: 90,
  },
};

const beanClasses = ['one', 'two', 'three', 'four', 'seven', 'eight', 'nine', 'ten'];

const SKIPPED_HERO_SLIDES = [
  {
    name: 'Vandy',
    suffix: 'Brew',
    formula: "Vandana’s Cold Brew",
    image: '/images/coffee-cups/circular/Cold Brew_With_Logo.png',
    cup: {
      url: '/images/coffee-cups/circular/Cold Brew_With_Logo.png',
      mobileScale: 0.72,
      mobileY: 90,
    }
  },
  {
    name: 'Preri',
    suffix: 'Appe',
    formula: "Prerita’s Frappe",
    image: '/images/coffee-cups/circular/frappe_with_logo.png',
    cup: {
      url: '/images/coffee-cups/circular/frappe_with_logo.png',
      mobileScale: 0.72,
      mobileY: 90,
    }
  },
  {
    name: 'Rishi',
    suffix: 'Latte',
    formula: "Rishima’s Latte",
    image: '/images/coffee-cups/circular/latte_with_logo.png',
    cup: {
      url: '/images/coffee-cups/circular/latte_with_logo.png',
      mobileScale: 0.72,
      mobileY: 90,
    }
  },
];

const TRENDING_MIXES = [
  {
    id: 'rajpresso',
    name: 'RajPresso',
    image: '/images/image11_366_1172.png',
    description: 'A silky-smooth Espresso Martini kissed with rich Cold Coffee concentrate...',
    tags: ['COLD COFFEE', 'SWEET'],
    likes: '50 Likes',
  },
  {
    id: 'vandy-mood-mocha',
    name: 'Vandy Mood Mocha',
    image: '/images/image12_366_1172.png',
    description: 'A silky-smooth Nitro Espresso Martini kissed with rich chocolate liqueur...',
    tags: ['MACHA', 'BITTER'],
    likes: '30 Likes',
  },
  {
    id: 'kishorappe',
    name: 'Kishorappe',
    image: '/images/image13_366_1172.png',
    description: 'A silky-smooth Nitro Espresso Martini kissed with rich chocolate liqueur...',
    tags: ['CHILLD', 'LEMON'],
    likes: '+1K Likes',
  },
  {
    id: 'rishi-latte',
    name: 'RishiLatte',
    image: '/images/image14_366_1172.png',
    description: 'A silky-smooth Nitro Espresso Martini kissed with rich chocolate liqueur...',
    tags: ['COLD COFFEE', 'STRONG'],
    likes: '250 Likes',
  },
];

const TESTIMONIALS_DATA = [
  {
    x: {
      body: 'Meeting se pehle CHILLD leliya. Survived somehow.',
      handle: '@corporatelaunda',
    },
    reddit: {
      body: 'Made my own drink and honestly... this might ruin normal coffee for me now.',
      handle: '@riyaworksallday',
    },
    facebook: {
      body: "Finally a coffee brand that doesn't judge my weird combinations.",
      handle: '@bangalorebuzz',
    }
  },
  {
    x: {
      body: 'Client call at 9, CHILLD at 8:55. Personality restored.',
      handle: '@deadlinebrew',
    },
    reddit: {
      body: 'I thought concentrate would taste flat. It absolutely did not.',
      handle: '@brewthread',
    },
    facebook: {
      body: 'Best option for quick iced lattes. Just add milk and ice, done in 20 seconds.',
      handle: '@coffeelover_ind',
    }
  },
  {
    x: {
      body: 'Two spoons, milk, ice. Suddenly I am the office coffee person.',
      handle: '@pantryupgrade',
    },
    reddit: {
      body: 'The build-your-own drink thing is dangerously convenient.',
      handle: '@coldbrewcommittee',
    },
    facebook: {
      body: 'No artificial sugars, pure coffee flavour. Loving the Bold variant.',
      handle: '@healthybrewlife',
    }
  }
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
  const hardPartRef = useRef(null);
  const trendingRailRef = useRef(null);

  const [whyCupsVisible, setWhyCupsVisible] = useState(false);
  const cupSlam = false;

  const [typedChars, setTypedChars] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isPlaying1, setIsPlaying1] = useState(true);
  const [isPlaying2, setIsPlaying2] = useState(true);
  const [isProcessPlaying, setIsProcessPlaying] = useState(true);

  const topWavePathRef = useRef(null);
  const topWaveTextRef = useRef(null);
  const [waveAnim, setWaveAnim] = useState({ from: '0%', to: '-50%' });

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
      cup: slide.cup,
    }));

    if (skippedWelcome) {
      return skipSlides;
    }
    return [mainSlide];
  }, [displayName, suffix, coffeeType, skippedWelcome]);

  useEffect(() => {
    if (!skippedWelcome) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % allSlides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [skippedWelcome, allSlides.length]);

  // Testimonials rotation
  useEffect(() => {
    const timer = window.setInterval(() => {
      setReviewIndex((current) => (current + 1) % TESTIMONIALS_DATA.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  const heroState = allSlides[activeSlide] || allSlides[0];
  const fullName = `${heroState.name}${heroState.suffix}`;
  const heroLabel = fullName;

  const formulaDetails = useMemo(() => {
    if (skippedWelcome) {
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
    }
    return {
      inputName: heroState.name,
      inputCoffee: formatCoffeeName(coffeeType),
      heroName: heroState.name,
      heroSuffix: heroState.suffix,
    };
  }, [skippedWelcome, heroState, coffeeType]);



  useEffect(() => {
    if (skippedWelcome) return;
    if (typedChars < fullName.length) {
      const timer = setTimeout(() => setTypedChars((prev) => prev + 1), 80 + Math.random() * 40);
      return () => clearTimeout(timer);
    }
  }, [typedChars, fullName.length, skippedWelcome]);

  useEffect(() => {
    if (!skippedWelcome) return;
    let t1, t2;
    t1 = setTimeout(() => {
      setTypedChars(0);
      t2 = setTimeout(() => setTypedChars(1), 500);
    }, 0);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeSlide, skippedWelcome]);

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
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Why Chilld 3D Parallax scroll effect
  useEffect(() => {
    const section = whySectionRef.current;
    if (!section) return undefined;

    const items = section.querySelectorAll('.mobile-home-why-chilld__item');

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalRange = viewportHeight + rect.height;
      const currentScroll = viewportHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalRange));

      items.forEach((item) => {
        let range = 60; // Slightly smaller range for mobile screens
        let distortion = 0;
        let isOdd = false;

        if (item.classList.contains('item-one')) {
          range = 50;
          distortion = 6;
          isOdd = true;
        } else if (item.classList.contains('item-three')) {
          range = 45;
          distortion = -8;
          isOdd = true;
        } else if (item.classList.contains('item-two')) {
          range = 55;
          distortion = -5;
        } else if (item.classList.contains('item-four')) {
          range = 65;
          distortion = 10;
        }

        const direction = isOdd ? 1 : -1;
        const parallaxY = (progress - 0.5) * range * direction + distortion;
        item.style.setProperty('--why-cup-parallax-y', `${parallaxY}px`);

        const imageParallaxY = (progress - 0.5) * -35 * direction;
        item.style.setProperty('--why-image-parallax-y', `${imageParallaxY}px`);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [whyCupsVisible]);

  // We handled the hard part scroll parallax video
  useEffect(() => {
    const section = hardPartRef.current;
    if (!section) return undefined;

    const video = section.querySelector('.mobile-home-hard-part__video');
    if (!video) return undefined;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const totalRange = viewportHeight + sectionHeight;
      const currentScroll = viewportHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalRange));

      const translateY = (progress - 0.5) * -70; // Mobile vertical parallax translation
      video.style.transform = `translate3d(0, ${translateY}px, 0)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const isManuallyScrollingRef = useRef(false);

  useEffect(() => {
    const rail = trendingRailRef.current;
    if (!rail) return undefined;

    let animId;
    let isPaused = false;

    const step = () => {
      if (!isPaused && !isManuallyScrollingRef.current) {
        rail.scrollLeft += 0.8;
        if (rail.scrollLeft >= rail.scrollWidth / 2) {
          rail.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    rail.addEventListener('mouseenter', pause);
    rail.addEventListener('mouseleave', resume);
    rail.addEventListener('touchstart', pause, { passive: true });
    rail.addEventListener('touchend', resume, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      rail.removeEventListener('mouseenter', pause);
      rail.removeEventListener('mouseleave', resume);
      rail.removeEventListener('touchstart', pause);
      rail.removeEventListener('touchend', resume);
    };
  }, []);

  const handleMarqueeScroll = (direction) => {
    const rail = trendingRailRef.current;
    if (!rail) return;

    isManuallyScrollingRef.current = true;

    const scrollAmount = 256;
    let targetScroll = rail.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    const halfWidth = rail.scrollWidth / 2;

    if (targetScroll < 0) {
      rail.scrollLeft = halfWidth + rail.scrollLeft;
      targetScroll = halfWidth + targetScroll;
    } else if (targetScroll >= halfWidth) {
      rail.scrollLeft = rail.scrollLeft - halfWidth;
      targetScroll = targetScroll - halfWidth;
    }

    rail.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isManuallyScrollingRef.current = false;
    }, 600);
  };

  const nameLen = heroState.name.length;
  const visibleName = fullName.slice(0, Math.min(typedChars, nameLen));
  const visibleSuffix = fullName.slice(nameLen, Math.min(typedChars, fullName.length));

  const currentReviews = TESTIMONIALS_DATA[reviewIndex];

  return (
    <div className="mobile-home" data-testid="mobile-home-page">
      <section className={`mobile-home-hero${skippedWelcome ? ' mobile-home-hero--skipped' : ''}`} aria-labelledby="mobile-home-title">
        <div className="mobile-home-hero__title-wrap">
          <h1 className="mobile-home-hero__title" id="mobile-home-title" aria-label={`${heroLabel} cold brew`}>
            {skippedWelcome ? (
              <>
                <span className="mobile-home-hero__name">{heroState.name}</span>
                <span className="mobile-home-hero__suffix">{heroState.suffix}</span>
              </>
            ) : (
              <>
                <span className="mobile-home-hero__name">{visibleName}</span>
                <span className="mobile-home-hero__suffix">{visibleSuffix}</span>
                {typedChars < fullName.length && <span className="mobile-home-hero__cursor" aria-hidden="true">|</span>}
              </>
            )}
          </h1>

          {formulaDetails && (
            <span className="mobile-home-hero__formula-text" role="note">
              <span className="formula-text__name">{formulaDetails.inputName}’s </span>
              <span className="formula-text__coffee">{formulaDetails.inputCoffee}</span>

              <span className="mobile-home-hero__formula-tooltip" role="tooltip">
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
              transform: `translateY(${(heroState.cup.mobileY || 0) + 10}px)`,
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
              style={{
                '--cup-scale': heroState.cup.mobileScale || 1.0,
                transformOrigin: 'center bottom',
                transition: 'transform 0.4s ease',
              }}
            />
            <div key={`tagline-mobile-${heroState.cup.url}`} className="mobile-home-hero__cup-overlay-text">
              Code Your Own Coffee
            </div>
          </div>
        </div>

        {skippedWelcome && (
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
        )}
      </section>

      <section ref={hardPartRef} className="mobile-home-hard-part" aria-labelledby="mobile-home-story-title">
        <div className="mobile-home-hard-part__media">
          <video
            className="mobile-home-hard-part__video"
            src="/Videos/coffeeswirl2.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="mobile-home-hard-part__shade" />
        </div>

        <svg className="mobile-home-hard-part__top-wave" viewBox="0 0 1512 230" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <path
              ref={topWavePathRef}
              id="mobile-home-hard-part-wave-text"
              d="M -180 236 C -120 236, -60 181.3, 0 208 L 63 179.96 C 126 152.35, 252 95.65, 378 95.97 C 504 95.65, 630 152.35, 756 179.96 C 882 208, 1008 208, 1134 179.96 C 1260 152.35, 1386 95.65, 1449 68.03 L 1512 40 C 1572 13.3, 1632 -14, 1692 -14"
            />
          </defs>
          <text className="mobile-home-hard-part__top-wave-text" dy="0.85em">
            <textPath
              ref={topWaveTextRef}
              href="#mobile-home-hard-part-wave-text"
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

        <div className="mobile-home-hard-part__copy">
          <h2 id="mobile-home-story-title">We handled the hard part,<br />the fun part's on you</h2>
          <p>
            We get you exceptional coffee concentrate. We take care of the nitty-gritties of sourcing, grinding and brewing.<br />
            After that, you are free to tailor your daily coffee to your liking. Add water, if you are in a hurry for your<br />
            presentation. Add syrup, milk, experiment with everyday ingredients in your kitchen, if you feel like it.
          </p>
          <p>
            If you've been on-call all night, add an extra spoon of our cold brew concentrate. If you get jittery but<br />
            enjoy the occasional pick-me-up, add a spoon less. No one's judging you.
          </p>
          <p>
            We guarantee that it will taste good; we promise that it won't eat into your wallet.
          </p>
          <p className="mobile-home-hard-part__quote">"Coffee is too much work?"</p>
          <p>
            If you can make lemonade or iced-water, this is a walk in the park.
          </p>
          <p>
            Chilld is built for people who like things their way. From milk choices to sweetness levels, every drink is designed<br />
            by you. No complicated menus. Just cold coffee made for your mood, your routine, and your kind of day.
          </p>
          <div className="mobile-home-hard-part__actions">
            <Link to="/menu" className="mobile-home-hard-part__primary">Cold Brew Concentrate</Link>
            <Link to="/recipes" className="mobile-home-hard-part__secondary">Explore Recipes</Link>
          </div>
        </div>

        <svg className="mobile-home-hard-part__bottom-wave" viewBox="0 0 1512 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 46 C178 96 348 138 532 137 C724 136 850 82 1026 82 C1210 82 1336 130 1512 176 L1512 220 L0 220 Z" fill="#ffffff" />
        </svg>
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
        <button
          className={`mobile-home-process__media ${isProcessPlaying ? 'is-playing' : 'is-paused'}`}
          type="button"
          onClick={(e) => {
            const video = e.currentTarget.querySelector('video');
            if (video) {
              if (video.paused) {
                video.play();
                setIsProcessPlaying(true);
              } else {
                video.pause();
                setIsProcessPlaying(false);
              }
            }
          }}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'block', width: '100%' }}
        >
          <video
            src="/Videos/coffee_concentrate_with_glass_new.webm"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <span className="bento-video__control-btn" aria-hidden="true" />
        </button>
        <div className="mobile-home-process__copy">
          <p className="mobile-home-eyebrow">How they make it</p>
          <h2 id="mobile-home-process-title">Pour. Mix. Chill.</h2>
          <p>Concentrate, ice, milk or tonic. A premium cold coffee is ready before the ice settles.</p>
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
          <button
            className={`mobile-home-review-card mobile-home-review-card--video ${isPlaying1 ? 'is-playing' : 'is-paused'}`}
            type="button"
            onClick={(e) => {
              const video = e.currentTarget.querySelector('video');
              if (video) {
                if (video.paused) {
                  video.play();
                  setIsPlaying1(true);
                } else {
                  video.pause();
                  setIsPlaying1(false);
                }
              }
            }}
          >
            <video
              src="/Videos/coffeeswirl1.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <span className="bento-video__control-btn" aria-hidden="true" />
          </button>

          {/* Card 3: Facebook */}
          <article className="mobile-home-review-card mobile-home-review-card--facebook" key={`fb-${reviewIndex}`}>
            <p className="mobile-home-review-card__body">
              {currentReviews.facebook.body}
            </p>
            <div className="mobile-home-review-card__footer">
              <span className="mobile-home-review-card__handle">{currentReviews.facebook.handle}</span>
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
          <article className="mobile-home-review-card mobile-home-review-card--x" key={`x-${reviewIndex}`}>
            <p className="mobile-home-review-card__body">
              {currentReviews.x.body}
            </p>
            <div className="mobile-home-review-card__footer">
              <span className="mobile-home-review-card__handle">{currentReviews.x.handle}</span>
              <span className="mobile-home-review-card__brand">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
            </div>
          </article>

          {/* Card 6: Reddit */}
          <article className="mobile-home-review-card mobile-home-review-card--reddit" key={`reddit-${reviewIndex}`}>
            <p className="mobile-home-review-card__body">
              {currentReviews.reddit.body}
            </p>
            <div className="mobile-home-review-card__footer">
              <span className="mobile-home-review-card__handle">{currentReviews.reddit.handle}</span>
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
            <button
              className={`mobile-home-review-card__google-promo ${isPlaying2 ? 'is-playing' : 'is-paused'}`}
              type="button"
              onClick={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) {
                  if (video.paused) {
                    video.play();
                    setIsPlaying2(true);
                  } else {
                    video.pause();
                    setIsPlaying2(false);
                  }
                }
              }}
              style={{ border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <span className="google-eyebrow">CHILLD COFFEE</span>
              <h3>Coffee should look like this.</h3>
              <p>Water shouldn't.</p>
              <div className="google-promo-video-wrap">
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
                <span className="bento-video__control-btn" aria-hidden="true" />
              </div>
            </button>
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

        <div className="mobile-home-trending__slider-wrap">
          <button
            type="button"
            onClick={() => handleMarqueeScroll('left')}
            className="trending-nav-btn trending-nav-btn--left"
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            ref={trendingRailRef}
            className="lower-flow-trending__rail"
            aria-label="Trending coffee mixes"
          >
            <div className="lower-flow-trending__track">
              {/* Main List */}
              {TRENDING_MIXES.map((mix) => (
                <Link key={mix.id} to={`/recipe-details/${mix.id}`} className="trending-mix-card">
                  <div className="trending-mix-card__image-wrapper">
                    <div className="trending-mix-card__image">
                      <img src={mix.image} alt={mix.name} loading="lazy" decoding="async" />
                      <span className="trending-mix-card__likes">{mix.likes}</span>
                    </div>
                  </div>
                  <div className="trending-mix-card__content">
                    <h3>{mix.name}</h3>
                    <p>{mix.description}</p>
                    <div className="trending-mix-card__tags">
                      {mix.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
              {/* Duplicate List */}
              {TRENDING_MIXES.map((mix) => (
                <Link key={`${mix.id}-dup`} to={`/recipe-details/${mix.id}`} className="trending-mix-card" tabIndex={-1} aria-hidden="true">
                  <div className="trending-mix-card__image-wrapper">
                    <div className="trending-mix-card__image">
                      <img src={mix.image} alt="" loading="lazy" decoding="async" />
                      <span className="trending-mix-card__likes">{mix.likes}</span>
                    </div>
                  </div>
                  <div className="trending-mix-card__content">
                    <h3>{mix.name}</h3>
                    <p>{mix.description}</p>
                    <div className="trending-mix-card__tags">
                      {mix.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleMarqueeScroll('right')}
            className="trending-nav-btn trending-nav-btn--right"
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="lower-flow-trending__actions">
          <p>
            Tag your mix with <strong>#MadeByMe</strong>
          </p>
          <Link to="/builder" className="mobile-home-trending-btn">
            Create your Recipe
          </Link>
        </div>
      </section>

      <section className="mobile-home-core" aria-labelledby="mobile-home-core-title">
        <div className="mobile-home-core__copy">
          <p className="mobile-home-eyebrow">B2B - The Cold Brew Factory</p>
          <h2 id="mobile-home-core-title">Cold Brew for your Restaurant &amp; Cafe</h2>
          <p>
            Authentic taste, Consistent quality, Customised blends for HoReCa clients. More than 70% of your clients are drinking cold beverages. Unleash the creativity of your chefs with an operationally easy core.
          </p>
          <ul>
            <li>
              <Sparkles size={15} aria-hidden="true" />
              &lt;48h Fresh Brew
            </li>
            <li>
              <Sparkles size={15} aria-hidden="true" />
              0 Zero Capex
            </li>
            <li>
              <Sparkles size={15} aria-hidden="true" />
              2L Small MOQ
            </li>
            <li>
              <Sparkles size={15} aria-hidden="true" />
              ₹₹₹ Low TCO
            </li>
          </ul>
          <a href="tel:+919819927327" className="mobile-home-button mobile-home-button--primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
            Call +91 98199 27327
          </a>
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
