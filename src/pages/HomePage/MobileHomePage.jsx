import { useMemo } from 'react';
import { Link } from 'react-router-dom';
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

const beanClasses = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];

const storyNotes = [
  'Source, roast, grind, and slow-brew handled for you.',
  'Add milk, water, tonic, ice, or your own mix.',
  'Cafe-style cold coffee without a cafe-sized wait.',
];

const marqueeItems = ['Great coffee, made easy', 'Great coffee, made easy', 'Great coffee, made easy'];

const whyChilldCards = [
  {
    title: 'Built for the grind',
    text: 'Extra shot days, soft mornings, and everything between.',
    image: `${ASSET_BASE}chilld-people-grid.png`,
    alt: 'People enjoying Chilld cold coffee together',
  },
  {
    title: 'Brewed for the bold',
    text: 'Your order lives in your head, now in your cup.',
    image: `${ASSET_BASE}chilld-city-people.png`,
    alt: 'Chilld cold coffee in a city lifestyle setting',
  },
  {
    title: 'Time is money',
    text: 'Cafe-style cold coffee without waiting in line.',
    image: `${ASSET_BASE}chilld-collage-reference.png`,
    alt: 'Chilld cold coffee lifestyle collage',
  },
  {
    title: 'Money is money',
    text: 'A premium cup that still makes sense every day.',
    image: `${ASSET_BASE}garden-collection.png`,
    alt: 'Chilld cold coffee recipe collection',
  },
];

const reviewCards = [
  {
    kind: 'quote',
    title: 'Have a latte must try.',
    text: 'A perfect morning latte, fast and smooth.',
    meta: '@living_learned',
  },
  {
    kind: 'stat',
    title: '4.8/5',
    text: 'Average rating from Chilld regulars.',
    meta: '128+ reviews',
  },
  {
    kind: 'quote',
    title: 'No menu stress.',
    text: 'Finally a coffee brand that understands custom drinks.',
    meta: 'Khushi P.',
  },
];

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

const benefits = ['8-10 serves per bottle', 'Ready in under a minute', 'Milk, tonic, ice, and mixers'];

function MobileButton({ to, href, children, variant = 'primary', className = '', icon: Icon }) {
  const classes = `mobile-home-button mobile-home-button--${variant} ${className}`.trim();
  const content = (
    <>
      {Icon && <Icon size={17} aria-hidden="true" />}
      <span>{children}</span>
      <ArrowRight size={16} aria-hidden="true" />
    </>
  );

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
  const { displayName, suffix } = useMemo(() => getHeroText(), [getHeroText]);
  const heroLabel = `${displayName} ${suffix}`.trim();

  return (
    <div className="mobile-home" data-testid="mobile-home-page">
      <section className="mobile-home-hero" aria-labelledby="mobile-home-title">
        <h1 className="mobile-home-hero__title" id="mobile-home-title" aria-label={`${heroLabel} cold brew`}>
          <span className="mobile-home-hero__name">{displayName}</span>
          <span className="mobile-home-hero__suffix">{suffix}</span>
        </h1>

        <div className="mobile-home-hero__beans" aria-hidden="true">
          {beanClasses.map((beanClass) => (
            <img
              key={beanClass}
              className={`mobile-home-hero__bean mobile-home-hero__bean--${beanClass}`}
              src={`${ASSET_BASE}coffee-bean.png`}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          ))}
        </div>

        <div className="mobile-home-hero__cup-stage">
          <img
            className="mobile-home-hero__cup"
            src={`${ASSET_BASE}cold-brew-cup.png`}
            alt="Iced Chilld cold brew in a clear cup"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="mobile-home-hero__actions" aria-label="Primary actions">
          <MobileButton to="/build" icon={Coffee}>
            Create Your Drink
          </MobileButton>
          <MobileButton to="/menu?cat=cold-brew" variant="secondary" icon={ShoppingBag}>
            Shop Cold Brew
          </MobileButton>
        </div>
      </section>

      <section className="mobile-home-marquee" aria-label="Great coffee, made easy">
        <div className="mobile-home-marquee__track" aria-hidden="true">
          {[0, 1].map((setIndex) => (
            <span className="mobile-home-marquee__set" key={setIndex}>
              {marqueeItems.map((item, itemIndex) => (
                <span key={`${setIndex}-${itemIndex}`}>...{item}...</span>
              ))}
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
          <MobileButton to="/menu?cat=cold-brew" variant="cream" icon={ShoppingBag}>
            Buy Cold Brew Core
          </MobileButton>
        </div>
      </section>

      <section className="mobile-home-cups" aria-labelledby="mobile-home-cups-title">
        <SectionHeading id="mobile-home-cups-title" eyebrow="Why Chilld" title="Small cups. Big reasons." />
        <div className="mobile-home-why-stack">
          {whyChilldCards.map((moment, index) => (
            <article
              className={`mobile-home-why-card ${index % 2 === 1 ? 'mobile-home-why-card--offset' : ''}`}
              key={moment.title}
            >
              <img src={moment.image} alt={moment.alt} loading="lazy" decoding="async" />
              <span>
                <h3>{moment.title}</h3>
                <p>{moment.text}</p>
              </span>
            </article>
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
          <MobileButton to="/build" variant="dark" icon={Coffee}>
            Open builder
          </MobileButton>
        </div>
      </section>

      <section className="mobile-home-social" aria-labelledby="mobile-home-social-title">
        <SectionHeading id="mobile-home-social-title" eyebrow="What people are saying" title="Real Chilld moments." />
        <div className="mobile-home-review-grid">
          <article className="mobile-home-review-card mobile-home-review-card--media">
            <img src={`${ASSET_BASE}garden-collection.png`} alt="Chilld coffee recipe collection" loading="lazy" decoding="async" />
          </article>
          {reviewCards.map((review) => (
            <article className={`mobile-home-review-card mobile-home-review-card--${review.kind}`} key={`${review.kind}-${review.title}`}>
              <strong>{review.title}</strong>
              <p>{review.text}</p>
              <span>{review.meta}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="mobile-home-popular" aria-labelledby="mobile-home-popular-title">
        <SectionHeading id="mobile-home-popular-title" eyebrow="Trending mixes" title="Start with a favorite." />
        <div className="mobile-home-drink-grid" aria-label="Popular drink recipes">
          {popularDrinks.map((drink) => (
            <Link
              to={drink.to}
              className={`mobile-home-drink-card mobile-home-drink-card--${drink.tone}`}
              key={drink.name}
            >
              <img src={drink.image} alt={drink.name} loading="lazy" decoding="async" />
              <span>
                <strong>{drink.name}</strong>
                <small>{drink.description}</small>
              </span>
            </Link>
          ))}
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
          <MobileButton to="/menu?cat=cold-brew" variant="primary" icon={ShoppingBag}>
            Shop cold brew
          </MobileButton>
        </div>
        <img
          className="mobile-home-core__image"
          src={`${ASSET_BASE}cold-brew-bottles.png`}
          alt="Chilld cold brew concentrate bottles"
          loading="lazy"
          decoding="async"
        />
      </section>

      <nav className="mobile-home-sticky" aria-label="Mobile home quick order">
        <Link to="/menu?cat=cold-brew">
          <ShoppingBag size={17} aria-hidden="true" />
          Shop
        </Link>
        <Link to="/build" className="mobile-home-sticky__primary">
          <Coffee size={17} aria-hidden="true" />
          Build
        </Link>
      </nav>

      <Footer className="footer--mobile-home" />
    </div>
  );
}
