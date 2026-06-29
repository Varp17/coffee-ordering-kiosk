import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import Footer from '@/components/Footer/Footer';
import './MobileHomePage.css';

const ASSET_BASE = '/images/mobile-home/';

const beanLayout = [
  { x: '-5%', y: '31%', size: 72, rotate: -18, delay: '0ms', fromX: '-120vw', fromY: '-28vh', fromR: '-520deg', floatX: '7px', floatY: '-16px' },
  { x: '15%', y: '66%', size: 46, rotate: 22, delay: '110ms', fromX: '-105vw', fromY: '48vh', fromR: '420deg', floatX: '-5px', floatY: '-14px' },
  { x: '33%', y: '35%', size: 36, rotate: -28, delay: '190ms', fromX: '-36vw', fromY: '-88vh', fromR: '-640deg', floatX: '4px', floatY: '-11px' },
  { x: '79%', y: '30%', size: 44, rotate: 34, delay: '250ms', fromX: '62vw', fromY: '-95vh', fromR: '600deg', floatX: '-4px', floatY: '-13px' },
  { x: '88%', y: '56%', size: 64, rotate: -25, delay: '80ms', fromX: '130vw', fromY: '-18vh', fromR: '-590deg', floatX: '-8px', floatY: '-18px' },
  { x: '70%', y: '80%', size: 42, rotate: -9, delay: '330ms', fromX: '118vw', fromY: '52vh', fromR: '-430deg', floatX: '5px', floatY: '-15px' },
  { x: '52%', y: '58%', size: 30, rotate: -16, delay: '440ms', fromX: '20vw', fromY: '84vh', fromR: '-420deg', floatX: '-3px', floatY: '-10px' },
];

const vibeCards = [
  {
    eyebrow: 'Built for the grind',
    title: 'A coffee that keeps up.',
    image: `${ASSET_BASE}chilld-collage-reference.png`,
    contain: true,
  },
  {
    eyebrow: 'Made for movement',
    title: 'Coffee in the middle of life.',
    image: `${ASSET_BASE}chilld-people-grid.png`,
    position: '52% center',
  },
  {
    eyebrow: 'Your time matters',
    title: 'Slow brewed. Ready fast.',
    image: `${ASSET_BASE}coffee-hourglass.png`,
    contain: true,
  },
  {
    eyebrow: 'Brewed for the bold',
    title: 'Your kind of coffee.',
    image: `${ASSET_BASE}chilld-city-people.png`,
    position: '50% center',
  },
  {
    eyebrow: 'Pick a feeling',
    title: 'Make a small moment yours.',
    image: `${ASSET_BASE}garden-collection.png`,
    contain: true,
  },
];

const recipeLoop = [
  {
    name: 'Espresso Martini',
    type: 'For late nights',
    image: `${ASSET_BASE}espresso-martini.png`,
    to: '/recipes',
    tone: 'blue',
  },
  {
    name: 'Mint Tonic',
    type: 'Bright and iced',
    image: `${ASSET_BASE}mint-coldbrew.png`,
    to: '/recipe-details/cold-brew-mint-tonic',
    tone: 'mint',
  },
  {
    name: 'Citrus Brew',
    type: 'Fresh and mellow',
    image: `${ASSET_BASE}lemon-coldbrew.png`,
    to: '/recipe-details/cold-brew-orange',
    tone: 'lemon',
  },
  {
    name: 'Soft Coffee Cloud',
    type: 'Creamy and slow',
    image: `${ASSET_BASE}latte-glass.png`,
    to: '/recipe-details/cold-brew-latte',
    tone: 'latte',
  },
  {
    name: 'Cold Brew Core',
    type: 'The everyday one',
    image: `${ASSET_BASE}cold-brew-cup.png`,
    to: '/recipe-details/cold-brew',
    tone: 'core',
  },
];

const quickActions = [
  { label: 'Create your drink', to: '/build' },
  { label: 'Shop cold brew', to: '/menu?cat=cold-brew' },
];

const peopleCards = [
  {
    type: 'image',
    className: 'mobile-home-social-card--garden',
    image: `${ASSET_BASE}garden-collection.png`,
    alt: 'The Garden Collection coffee moodboard',
  },
  {
    type: 'video',
    className: 'mobile-home-social-card--swirl',
    src: `${ASSET_BASE}coffeeswirl.mp4`,
  },
  {
    type: 'rating',
    className: 'mobile-home-social-card--rating',
    platform: 'amazon',
    score: '5.0',
    body: 'Based on 128 reviews',
  },
  {
    type: 'quote',
    className: 'mobile-home-social-card--quote',
    body: 'Have a latte must try. A perfect morning latte!!!',
    handle: '@living_learned',
    source: 'reddit',
  },
  {
    type: 'quote',
    className: 'mobile-home-social-card--quote mobile-home-social-card--quote-blue',
    body: 'Coffee should look like this. Water should not.',
    handle: '@coffee_corner',
    source: 'facebook',
  },
  {
    type: 'quote',
    className: 'mobile-home-social-card--quote',
    body: 'Finally a coffee brand that does not judge my weird combinations.',
    handle: 'Khushi P.',
    source: 'Google Maps',
  },
];

function MobileButton({ to, href, children, variant = 'light', className = '', showArrow = true, onClick }) {
  const classes = `mobile-home-button mobile-home-button--${variant} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      {showArrow && <ArrowRight size={16} aria-hidden="true" />}
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <Link className={classes} to={to} onClick={onClick}>
      {content}
    </Link>
  );
}

function CurvedTicker() {
  const tickerText = 'GREAT COFFEE, MADE EASY  /  GREAT COFFEE, MADE EASY  /  GREAT COFFEE, MADE EASY  /  GREAT COFFEE, MADE EASY  /  ';

  return (
    <section className="mobile-home-ticker" aria-label="Great coffee, made easy">
      <svg
        className="mobile-home-ticker__arc"
        viewBox="0 0 1440 214"
        preserveAspectRatio="none"
        role="img"
        aria-label="Moving Great coffee, made easy message"
      >
        <defs>
          <path id="mobileHomeTickerCurve" d="M -160 142 C 170 5 470 19 721 91 C 948 155 1206 128 1600 18" />
        </defs>
        <path d="M 0 119 C 248 -4 498 20 721 86 C 957 153 1197 128 1440 24 L 1440 214 L 0 214 Z" fill="#171313" />
        <text className="mobile-home-ticker__text" aria-hidden="true">
          <textPath href="#mobileHomeTickerCurve" startOffset="0%">
            {tickerText}
            <animate attributeName="startOffset" values="0%;-34%" dur="17s" repeatCount="indefinite" />
          </textPath>
        </text>
      </svg>
    </section>
  );
}

function VibeCarousel() {
  const trackRef = useRef(null);

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.max(260, track.clientWidth * 0.7), behavior: 'smooth' });
  };

  return (
    <section className="mobile-home-vibe" id="mobile-vibe">
      <div className="mobile-home-section-heading mobile-home-section-heading--row">
        <div>
          <p>The Chilld vibe</p>
          <h2>For every version of your day.</h2>
        </div>
        <div className="mobile-home-carousel-controls" aria-label="Slide Chilld vibe cards">
          <button type="button" onClick={() => move(-1)} aria-label="Previous vibe">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next vibe">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mobile-home-vibe__track" ref={trackRef} aria-label="Swipeable Chilld vibe gallery">
        {vibeCards.map((card) => (
          <article className="mobile-home-vibe-card" key={card.title}>
            <div className={`mobile-home-vibe-card__cup ${card.contain ? 'mobile-home-vibe-card__cup--contain' : ''}`}>
              <span className="mobile-home-vibe-card__lid" aria-hidden="true" />
              <img src={card.image} alt="" style={{ objectPosition: card.position || 'center' }} loading="lazy" decoding="async" />
            </div>
            <p>{card.eyebrow}</p>
            <h3>{card.title}</h3>
          </article>
        ))}
      </div>

      <p className="mobile-home-vibe__message">Your order is on no menu. It lives in your head, now in your cup.</p>
    </section>
  );
}

function RecipeCardGroup({ duplicate = false, groupRef = null }) {
  return (
    <div
      ref={groupRef}
      className="mobile-home-recipes__group"
      aria-hidden={duplicate ? 'true' : undefined}
    >
      {recipeLoop.map((recipe) => (
        <Link
          className={`mobile-home-recipe-card mobile-home-recipe-card--${recipe.tone}`}
          to={recipe.to}
          key={`${duplicate ? 'copy-' : ''}${recipe.name}`}
          tabIndex={duplicate ? -1 : undefined}
        >
          <span>{recipe.type}</span>
          <img src={recipe.image} alt={duplicate ? '' : recipe.name} loading="lazy" decoding="async" />
          <h3>{recipe.name}</h3>
        </Link>
      ))}
    </div>
  );
}

function RecipeRail() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const firstGroupRef = useRef(null);
  const frameRef = useRef(0);
  const resumeTimerRef = useRef(0);
  const pausedRef = useRef(false);
  const offsetRef = useRef(0);
  const groupWidthRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0 });

  const normalizeOffset = useCallback(() => {
    const groupWidth = groupWidthRef.current;
    if (!groupWidth) return;

    while (offsetRef.current >= groupWidth * 2) offsetRef.current -= groupWidth;
    while (offsetRef.current < groupWidth) offsetRef.current += groupWidth;
  }, []);

  const syncTrackOffset = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;

    let previousTime = performance.now();
    let initFrame = 0;

    const getFirstGroup = () =>
      firstGroupRef.current || viewport.querySelector('.mobile-home-recipes__group');

    const measure = () => {
      const firstGroup = getFirstGroup();
      const groupWidth = firstGroup?.getBoundingClientRect().width || 0;
      groupWidthRef.current = groupWidth;
      if (groupWidth && offsetRef.current < 1) {
        offsetRef.current = groupWidth;
      }
      normalizeOffset();
      syncTrackOffset();
    };

    const tick = (time) => {
      const elapsed = Math.min(time - previousTime, 64);
      previousTime = time;

      if (!groupWidthRef.current) measure();

      if (!pausedRef.current && groupWidthRef.current) {
        offsetRef.current += elapsed * 0.035;
        normalizeOffset();
        syncTrackOffset();
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    initFrame = requestAnimationFrame(() => {
      measure();
      previousTime = performance.now();
      frameRef.current = requestAnimationFrame(tick);
    });

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measure)
      : null;
    resizeObserver?.observe(getFirstGroup() || viewport);
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(initFrame);
      cancelAnimationFrame(frameRef.current);
      window.clearTimeout(resumeTimerRef.current);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [normalizeOffset, syncTrackOffset]);

  const pause = () => {
    pausedRef.current = true;
    window.clearTimeout(resumeTimerRef.current);
  };

  const resume = (delay = 700) => {
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  };

  const move = (direction) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    pause();
    offsetRef.current += direction * Math.max(240, viewport.clientWidth * 0.72);
    normalizeOffset();
    syncTrackOffset();
    resume(1200);
  };

  const handlePointerDown = (event) => {
    pause();
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startOffset: offsetRef.current,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active) return;
    const distance = event.clientX - dragRef.current.startX;
    offsetRef.current = dragRef.current.startOffset - distance;
    normalizeOffset();
    syncTrackOffset();
  };

  const handlePointerEnd = (event) => {
    dragRef.current.active = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    resume();
  };

  return (
    <section className="mobile-home-recipes" id="mobile-recipes">
      <div className="mobile-home-section-heading">
        <p>Mix your mood</p>
        <h2>Five cups. Infinite ways to Chilld.</h2>
        <span>Swipe through quick recipes, then open the full recipe or build your own.</span>
      </div>

      <div className="mobile-home-recipes__wrap">
        <div
          className="mobile-home-recipes__viewport"
          ref={viewportRef}
          onMouseEnter={pause}
          onMouseLeave={() => resume()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onFocusCapture={pause}
          onBlurCapture={() => resume()}
          aria-label="Looping Chilld recipe cards"
        >
          <div className="mobile-home-recipes__track" ref={trackRef}>
            <RecipeCardGroup groupRef={firstGroupRef} />
            <RecipeCardGroup duplicate />
            <RecipeCardGroup duplicate />
          </div>
        </div>
      </div>

      <div className="mobile-home-recipes__controls" aria-label="Recipe card navigation">
        <button type="button" onClick={() => move(-1)} aria-label="Previous recipes">
          <ChevronLeft size={18} />
        </button>
        <MobileButton to="/build" variant="blue">Create your recipe</MobileButton>
        <button type="button" onClick={() => move(1)} aria-label="Next recipes">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

function PeopleSayingSection() {
  return (
    <section className="mobile-home-social" id="mobile-social">
      <div className="mobile-home-section-heading">
        <p>Real Chilld moments</p>
        <h2>What people are saying about CHILLD</h2>
      </div>

      <div className="mobile-home-social__grid" data-mobile-home-reveal>
        {peopleCards.map((card, index) => {
          if (card.type === 'image') {
            return (
              <article className={`mobile-home-social-card ${card.className}`} key={card.type + index}>
                <img src={card.image} alt={card.alt} loading="lazy" decoding="async" />
              </article>
            );
          }

          if (card.type === 'video') {
            return (
              <article className={`mobile-home-social-card ${card.className}`} key={card.type + index}>
                <video src={card.src} autoPlay muted loop playsInline preload="metadata" />
              </article>
            );
          }

          if (card.type === 'rating') {
            return (
              <article className={`mobile-home-social-card ${card.className}`} key={card.type + index}>
                <strong>{card.platform}</strong>
                <span>★★★★★</span>
                <p><b>{card.score}</b> {card.body}</p>
              </article>
            );
          }

          return (
            <article className={`mobile-home-social-card ${card.className}`} key={card.type + index}>
              <p>{card.body}</p>
              <div>
                <span>{card.handle}</span>
                <strong>{card.source}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function MobileHomePage() {
  const navigate = useNavigate();
  const getHeroText = useUserStore((state) => state.getHeroText);
  const { displayName, suffix } = useMemo(() => getHeroText(), [getHeroText]);
  const fullHeroText = `${displayName}${suffix}`;
  const [typedHeroText, setTypedHeroText] = useState('');
  const [isCupSlamming, setIsCupSlamming] = useState(false);
  const slamInProgressRef = useRef(false);
  const slamTimeoutRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.14 }
    );

    document.querySelectorAll('[data-mobile-home-reveal]').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let timer = 0;
    let index = 0;

    const resetTimer = window.setTimeout(() => {
      if (prefersReducedMotion) {
        setTypedHeroText(fullHeroText);
        return;
      }

      setTypedHeroText('');
      timer = window.setInterval(() => {
        index += 1;
        setTypedHeroText(fullHeroText.slice(0, index));
        if (index >= fullHeroText.length) window.clearInterval(timer);
      }, 64);
    }, 0);

    return () => {
      window.clearTimeout(resetTimer);
      window.clearInterval(timer);
    };
  }, [fullHeroText]);

  useEffect(() => () => window.clearTimeout(slamTimeoutRef.current), []);

  const handleHeroNavigation = useCallback((to) => (event) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    if (slamInProgressRef.current) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      navigate(to);
      return;
    }

    slamInProgressRef.current = true;
    setIsCupSlamming(true);
    window.clearTimeout(slamTimeoutRef.current);
    slamTimeoutRef.current = window.setTimeout(() => {
      navigate(to);
    }, 560);
  }, [navigate]);

  const typedName = typedHeroText.slice(0, displayName.length);
  const typedSuffix = typedHeroText.slice(displayName.length);
  const heroTextSizeClass = fullHeroText.length > 16
    ? 'mobile-home-hero__title--small'
    : fullHeroText.length > 12
      ? 'mobile-home-hero__title--medium'
      : '';

  return (
    <div className="mobile-home" data-testid="mobile-home-page">
      <section className="mobile-home-hero">
        <div className="mobile-home-hero__sky" aria-hidden="true" />
        <div className={`mobile-home-hero__title ${heroTextSizeClass}`} aria-label={fullHeroText}>
          <span className="mobile-home-hero__name">{typedName || '\u00A0'}</span>
          <span className="mobile-home-hero__suffix">{typedSuffix || '\u00A0'}</span>
        </div>
        <p className="mobile-home-hero__kicker">Brewed slow. Poured fast.</p>

        <div className="mobile-home-hero__beans" aria-hidden="true">
          {beanLayout.map((bean, index) => (
            <img
              key={index}
              src={`${ASSET_BASE}coffee-bean.png`}
              alt=""
              style={{
                left: bean.x,
                top: bean.y,
                width: bean.size,
                '--bean-rotate': `${bean.rotate}deg`,
                '--bean-delay': bean.delay,
                '--bean-from-x': bean.fromX,
                '--bean-from-y': bean.fromY,
                '--bean-from-r': bean.fromR,
                '--bean-float-x': bean.floatX,
                '--bean-float-y': bean.floatY,
              }}
            />
          ))}
        </div>

        <div className={`mobile-home-hero__cup-wrap ${isCupSlamming ? 'mobile-home-hero__cup-wrap--slam' : ''}`}>
          <img
            className="mobile-home-hero__cup"
            src={`${ASSET_BASE}cold-brew-cup.png`}
            alt="A glass of iced Chilld cold brew"
            fetchPriority="high"
            decoding="async"
          />
          <span className="mobile-home-hero__shadow" aria-hidden="true" />
        </div>

        <div className={`mobile-home-hero__actions ${isCupSlamming ? 'mobile-home-hero__actions--locked' : ''}`} data-mobile-home-reveal>
          <MobileButton
            to="/build"
            variant="light"
            className="mobile-home-hero__primary"
            onClick={handleHeroNavigation('/build')}
          >
            Code your own coffee
          </MobileButton>
          <Link className="mobile-home-hero__text-link" to="/recipes" onClick={handleHeroNavigation('/recipes')}>
            Explore recipes
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CurvedTicker />

      <section className="mobile-home-story" id="mobile-story">
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
        <div className="mobile-home-story__inner" data-mobile-home-reveal>
          <p className="mobile-home-eyebrow mobile-home-eyebrow--cream">Coffee made practical</p>
          <h1>We handled the hard part. The fun part is on you.</h1>
          <p>
            We source, roast, grind and slow-brew the hard way, so your daily cup
            takes only a minute.
          </p>
          <div className="mobile-home-story__notes" aria-label="How Chilld works">
            <article><span>01</span><p>Keep it in the fridge.</p></article>
            <article><span>02</span><p>Add water, milk or ice.</p></article>
            <article><span>03</span><p>Make it your own.</p></article>
          </div>
          <div className="mobile-home-action-row">
            <MobileButton to="/menu?cat=cold-brew" variant="cream">Buy CHILLD Cold Brew Core</MobileButton>
          </div>
        </div>
      </section>

      <section className="mobile-home-quick" aria-label="Quick actions">
        {quickActions.map((action) => (
          <Link to={action.to} key={action.label}>
            <Sparkles size={16} aria-hidden="true" />
            <span>{action.label}</span>
          </Link>
        ))}
      </section>

      <section className="mobile-home-pour" id="mobile-pour">
        <div className="mobile-home-pour__video-wrap" data-mobile-home-reveal>
          <video
            className="mobile-home-pour__video"
            src={`${ASSET_BASE}coffee-concentrate-with-glass.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <PlayCircle className="mobile-home-pour__play" size={44} aria-hidden="true" />
        </div>
        <div className="mobile-home-pour__copy" data-mobile-home-reveal>
          <p className="mobile-home-eyebrow">One pour, many possibilities</p>
          <h2>Concentrate. Ice. A little imagination.</h2>
          <p>
            Watch the core turn into a smooth, cafe-quality cold brew. Pour it
            short, make it creamy, or take it anywhere your day goes.
          </p>
          <div className="mobile-home-action-row mobile-home-action-row--left">
            <MobileButton to="/build" variant="blue">Make one your way</MobileButton>
            <MobileButton to="/menu" variant="outline">Shop menu</MobileButton>
          </div>
        </div>
      </section>

      <VibeCarousel />
      <PeopleSayingSection />
      <RecipeRail />

      <section className="mobile-home-core" id="mobile-core">
        <div className="mobile-home-core__copy" data-mobile-home-reveal>
          <p className="mobile-home-eyebrow mobile-home-eyebrow--cream">The cold brew core</p>
          <h2>Not a recipe. A shortcut to your favorite one.</h2>
          <p>
            A small pour of Chilld becomes crisp over ice, creamy with milk, a
            late-night martini, or a quick cup before you run out the door.
          </p>
          <MobileButton to="/build" variant="cream">Start with your mood</MobileButton>
        </div>
        <div className="mobile-home-core__stage" data-mobile-home-reveal>
          <img src={`${ASSET_BASE}cold-brew-bottles.png`} alt="Chilld cold brew bottles" loading="lazy" decoding="async" />
          <img src={`${ASSET_BASE}coffee-bean.png`} alt="" aria-hidden="true" className="mobile-home-core__bean mobile-home-core__bean--one" />
          <img src={`${ASSET_BASE}coffee-bean.png`} alt="" aria-hidden="true" className="mobile-home-core__bean mobile-home-core__bean--two" />
        </div>
      </section>

      <section className="mobile-home-b2b" id="mobile-b2b">
        <div data-mobile-home-reveal>
          <p className="mobile-home-eyebrow mobile-home-eyebrow--cream">For cafes and events</p>
          <h2>Need Chilld at scale?</h2>
          <p>Talk to us for B2B cold brew concentrates, cafe formats and event service.</p>
          <div className="mobile-home-action-row">
            <MobileButton href="tel:+918693852250" variant="cream">
              <Phone size={16} aria-hidden="true" />
              Call us
            </MobileButton>
            <MobileButton to="/b2b" variant="ghost">View B2B</MobileButton>
          </div>
        </div>
      </section>

      <Footer className="footer--mobile-home" />
    </div>
  );
}
