import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useUserStore } from '@/store/useUserStore';
import './HomePage.css';
import { PRODUCTS } from '@/data/products';

// ── HELPERS FOR SVG DOM MANIPULATION ─────────────────────────────────

function injectSvgStyles(svgDoc) {
  const styleElem = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleElem.textContent = `
    @keyframes slide-up {
      from {
        transform: translateY(900px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animated-cup {
      animation: slide-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transform-origin: center bottom;
    }
  `;
  svgDoc.documentElement.appendChild(styleElem);
}

function animateSvgCup(svgDoc) {
  // Cup is Rect 15 (filled with pattern3)
  const cupRect = svgDoc.querySelector('rect[fill^="url(#pattern3_"]');
  if (cupRect) {
    cupRect.classList.add('animated-cup');
  }
}

const HERO_TEXT_LAYOUT = {
  centerX: 756,
  baselineY: 340,
  maxTextWidth: 1100,
  maxFontSize: 400,
  minFontSize: 140,
};

function fitHeroText(textElem) {
  const { maxTextWidth, maxFontSize, minFontSize } = HERO_TEXT_LAYOUT;

  textElem.setAttribute('font-size', String(maxFontSize));

  const measuredWidth = textElem.getComputedTextLength();

  if (!Number.isFinite(measuredWidth) || measuredWidth <= 0) return;

  const fittedFontSize = Math.max(
    minFontSize,
    Math.min(maxFontSize, maxFontSize * (maxTextWidth / measuredWidth))
  );

  textElem.setAttribute('font-size', fittedFontSize.toFixed(2));
}

function updateDynamicHeroText(svgDoc, displayName, suffix) {
  const textElem = svgDoc.getElementById('dynamic-hero-text');
  if (!textElem) return;

  const nameSpan = textElem.querySelector('[data-hero-part="name"]');
  const drinkSpan = textElem.querySelector('[data-hero-part="drink"]');

  if (!nameSpan || !drinkSpan) return;

  // displayName = user's name (e.g. "ALEX")
  // suffix = last 4 chars of drink from store (e.g. " ESSO")
  nameSpan.textContent = displayName;
  drinkSpan.textContent = suffix;

  fitHeroText(textElem);
}

function injectDynamicHeroText(svgDoc, displayName, suffix) {
  const paths = svgDoc.querySelectorAll('path');
  let targetPath = null;
  for (const p of paths) {
    const d = p.getAttribute('d') || '';
    if (d.startsWith('M412.238 193.403H445.952V502.648')) {
      targetPath = p;
      break;
    }
  }

  if (targetPath) {
    const existingText = svgDoc.getElementById('dynamic-hero-text');
    if (existingText) {
      existingText.remove();
    }

    const textElem = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElem.setAttribute('id', 'dynamic-hero-text');
    textElem.setAttribute('x', String(HERO_TEXT_LAYOUT.centerX));
    textElem.setAttribute('y', String(HERO_TEXT_LAYOUT.baselineY));
    textElem.setAttribute('text-anchor', 'middle');
    textElem.setAttribute('font-family', 'Outfit, Inter, sans-serif');
    textElem.setAttribute('font-weight', '900');
    textElem.setAttribute('letter-spacing', '-0.018em');
    textElem.setAttribute('transform', 'scale(1,1.42)');

    const nameSpan = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    nameSpan.setAttribute('data-hero-part', 'name');
    nameSpan.setAttribute('fill', '#1844AB');

    const drinkSpan = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    drinkSpan.setAttribute('data-hero-part', 'drink');
    drinkSpan.setAttribute('fill', '#B9E0FF');
    drinkSpan.setAttribute('dx', '0.09em');

    textElem.appendChild(nameSpan);
    textElem.appendChild(drinkSpan);

    targetPath.parentNode.insertBefore(textElem, targetPath);

    // Typing effect trigger after delay
    const fullText = displayName + suffix;
    let charIndex = 0;
    let currentTyped = '';

    const typeNextChar = () => {
      if (charIndex < fullText.length) {
        currentTyped += fullText[charIndex];
        charIndex++;

        if (charIndex <= displayName.length) {
          nameSpan.textContent = currentTyped;
          drinkSpan.textContent = '';
        } else {
          nameSpan.textContent = displayName;
          drinkSpan.textContent = currentTyped.slice(displayName.length);
        }

        fitHeroText(textElem);

        setTimeout(typeNextChar, 80 + Math.random() * 40);
      }
    };

    setTimeout(typeNextChar, 500); // Trigger typing effect 500ms after cup animation starts
  }
}

function hideStaticPlaceholders(svgDoc) {
  // Remove the static background image and pattern from the SVG defs to prevent any overlap
  const bgImg = svgDoc.getElementById('image0_366_1172') || svgDoc.querySelector('image[id^="image0_"]');
  if (bgImg) bgImg.remove();
  const bgPattern = svgDoc.getElementById('pattern0_366_1172') || svgDoc.querySelector('pattern[id^="pattern0_"]');
  if (bgPattern) bgPattern.remove();

  // Remove all SVG background header elements (y < 120) to prevent overlap with the React fixed Navbar
  // Remove rects with height < 150 that start at y < 120 (either via y attribute or vertical translate)
  const rects = svgDoc.querySelectorAll('rect');
  for (const rect of rects) {
    const hAttr = rect.getAttribute('height');
    const hVal = parseFloat(hAttr || '0');

    // Extract y coordinate
    const yAttr = rect.getAttribute('y');
    const transform = rect.getAttribute('transform') || '';
    let yVal = 0;
    if (yAttr) {
      yVal = parseFloat(yAttr);
    } else {
      const transMatch = transform.match(/translate\(\s*[\d.-]+\s+([\d.-]+)\)/i);
      if (transMatch) {
        yVal = parseFloat(transMatch[1]);
      }
    }

    if (hVal > 0 && hVal < 150) {
      if (yVal < 120) {
        rect.remove();
        continue;
      }
    }

    // Remove the static image pattern0 rect to prevent it from overlapping with the transparent coffeeswirl2 video
    const fillAttr = rect.getAttribute('fill') || '';
    if (fillAttr.includes('pattern0_')) {
      rect.remove();
    }
  }

  // Remove the original full-width video placeholder. The React overlay supplies this video.
  const videoRect = svgDoc.querySelector('rect[y="3460"]');
  if (videoRect) videoRect.remove();

  const pathsList = svgDoc.querySelectorAll('path');
  for (const p of pathsList) {
    const d = p.getAttribute('d') || '';
    const fill = p.getAttribute('fill') || '';

    // Remove the static bottom marquee texts (both the linear gradient outline and the solid blue outline)
    if (fill.includes('paint1_linear_')) {
      p.remove();
      continue;
    }
    if (fill.toUpperCase() === '#1F2A44' && (d.startsWith('M185.8') || d.length > 20000)) {
      p.remove();
      continue;
    }

    const match = d.match(/^M\s*([\d.-]+)\s+([\d.-]+)/i);
    if (match) {
      const yVal = parseFloat(match[2]);
      if (!isNaN(yVal)) {
        // Remove paths that start at y < 120 (header)
        if (yVal < 120) {
          p.remove();
          continue;
        }
      }
    }

    // Bottom marquee background wave (#1F2A44) - Do not remove this, otherwise we get a white gap above the footer.
    // if (d.startsWith('M0 7396') && fill.toUpperCase() === '#1F2A44') {
    //   p.remove();
    //   continue;
    // }

    // Original play controls inside the exported SVG.
    if (
      d.startsWith('M786.321 3804.13') ||
      d.startsWith('M786.321 4730.13')
    ) {
      p.remove();
    }
  }

  // Remove every exported trending-card element after the section title. This is
  // intentionally done by inspecting the clip-path value rather than relying on a
  // brittle CSS selector, so the original tags/arrows cannot leak below the live rail.
  const staticMixesGroup = Array.from(svgDoc.querySelectorAll('g')).find((group) =>
    group.getAttribute('clip-path')?.includes('clip25_366_1172')
  );

  if (staticMixesGroup) {
    Array.from(staticMixesGroup.children).forEach((child, index) => {
      // Keep only: 0 = pale section background, 1 = original section heading.
      if (index >= 2) {
        child.remove();
      }
    });
  }

  // Remove the black bento-video placeholder. coffeeswirl1.mp4 replaces it.
  const bentoVideoPlaceholder = svgDoc.querySelector(
    'rect[x="422"][y="4478"]'
  );
  if (bentoVideoPlaceholder) bentoVideoPlaceholder.remove();
}

// ── INFINITE TRENDING MIXES CAROUSEL ──────────────────────────────────
const TRENDING_MIXES = PRODUCTS.filter((product) => product.category === 'custom');

const MIX_LIKES = {
  p013: '50 Likes',
  p014: '30 Likes',
  p015: '+1K Likes',
  p016: '250 Likes',
};

function TrendingMixCards({ duplicate = false }) {
  return TRENDING_MIXES.map((mix) => (
    <Link
      key={`${mix.id}-${duplicate ? 'duplicate' : 'original'}`}
      to={`/menu/${mix.id}`}
      className="trending-mix-card"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate ? 'true' : undefined}
    >
      <div className="trending-mix-card__image">
        <img src={mix.image} alt={duplicate ? '' : mix.name} />
        <span className="trending-mix-card__likes">
          {MIX_LIKES[mix.id] ?? 'Trending'}
        </span>
      </div>

      <div className="trending-mix-card__content">
        <h3>{mix.name}</h3>
        <p>{mix.description}</p>

        <div className="trending-mix-card__tags">
          {(mix.tags ?? []).slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  ));
}


// ── BENTO SOCIAL POSTS: ROTATING SLIDE SETS ────────────────────────────
const BENTO_SOCIAL_SLOTS = ['quote', 'amazon', 'tweet', 'reddit', 'googleReview'];

const BENTO_POST_SETS = [
  {
    quote: {
      kind: 'social',
      platform: 'facebook',
      author: 'Bangalore Buzz',
      handle: '@bangalorebuzz',
      body: 'Finally a coffee brand that doesn’t judge my weird combinations.',
      source: 'facebook',
    },
    feature: {
      kind: 'promo',
      eyebrow: 'CHILLD COFFEE',
      headline: 'Coffee should look like this.',
      supporting: 'Water shouldn’t.',
      imageProductId: 'p016',
      tone: 'blue',
    },
    amazon: {
      kind: 'rating',
      platform: 'amazon',
      score: '5.0',
      stars: '★★★★★',
      body: 'Based on 128 reviews',
      source: 'amazon',
    },
    tweet: {
      kind: 'social',
      platform: 'x',
      author: 'Corporate Launda',
      handle: '@corporatelaunda',
      body: 'Meeting se pehle CHILLD leliya. Survived somehow.',
      source: '𝕏',
    },
    reddit: {
      kind: 'social',
      platform: 'reddit',
      author: 'Riya Works All Day',
      handle: '@riyaworksallday',
      body: 'Made my own drink and honestly… this might ruin normal coffee for me now.',
      source: 'reddit',
    },
    googleReview: {
      kind: 'social',
      platform: 'google',
      author: 'Khushi P.',
      handle: 'Khushi P.',
      body: 'Finally a coffee brand that doesn’t judge my weird combinations.',
      source: 'Google Maps',
    },
  },
  {
    quote: {
      kind: 'social',
      platform: 'facebook',
      author: 'Coffee Corner',
      handle: '@coffee_corner',
      body: 'Effort will collide to roast the fear they and quick delivery.',
      source: 'facebook',
    },
    feature: {
      kind: 'promo',
      eyebrow: 'BREWED FOR YOU',
      headline: 'Pure energy in every cup.',
      supporting: 'Built for slow mornings.',
      imageProductId: 'p013',
      tone: 'espresso',
    },
    amazon: {
      kind: 'rating',
      platform: 'amazon',
      score: '5.0',
      stars: '★★★★★',
      body: 'Based on 128 reviews',
      source: 'amazon',
    },
    tweet: {
      kind: 'social',
      platform: 'x',
      author: 'Aman',
      handle: '@living.learned',
      body: 'Have a latte must try ❤️ A perfect morning latte!!!',
      source: '𝕏',
    },
    reddit: {
      kind: 'social',
      platform: 'reddit',
      author: 'Rohit B.',
      handle: '@rohit_brews',
      body: 'This perfect morning latte I have stored is making me want another right now.',
      source: 'reddit',
    },
    googleReview: {
      kind: 'social',
      platform: 'google',
      author: 'Khushi P.',
      handle: 'Khushi P.',
      body: 'Finally a coffee brand that doesn’t judge my weird combinations.',
      source: 'Google Maps',
    },
  },
  {
    quote: {
      kind: 'social',
      platform: 'instagram',
      author: 'Caffeine Journal',
      handle: '@caffeinejournal',
      body: 'The one coffee stop that gets your strange order exactly right.',
      source: 'instagram',
    },
    feature: {
      kind: 'promo',
      eyebrow: 'GARDEN COLLECTION',
      headline: 'A little calm in every pour.',
      supporting: 'Bright, soft, and brewed fresh.',
      imageProductId: 'p014',
      tone: 'garden',
    },
    amazon: {
      kind: 'rating',
      platform: 'amazon',
      score: '5.0',
      stars: '★★★★★',
      body: 'Worth the five-star morning',
      source: 'amazon',
    },
    tweet: {
      kind: 'social',
      platform: 'x',
      author: 'Aler R.',
      handle: '@aler_sips',
      body: 'When coffee news is both fun and there’s more coffee in it… what else do you need?',
      source: '𝕏',
    },
    reddit: {
      kind: 'social',
      platform: 'reddit',
      author: 'Made by You',
      handle: '@madebyyou',
      body: 'Not many of the unique coffee recipe ideas I’ve ever seen made this simple.',
      source: 'reddit',
    },
    googleReview: {
      kind: 'social',
      platform: 'google',
      author: 'Khushi P.',
      handle: 'Khushi P.',
      body: 'Finally a coffee brand that doesn’t judge my weird combinations.',
      source: 'Google Maps',
    },
  },
];

const BENTO_PLATFORM_LABELS = {
  facebook: 'f',
  instagram: '◎',
  x: '𝕏',
  reddit: '●',
  amazon: 'amazon',
  google: 'G',
};

function renderFooterBrand(platform, source) {
  if (platform === 'facebook') {
    return (
      <span className="bento-social-card__brand bento-social-card__brand--facebook" style={{ color: '#1877F2', fontWeight: '800', fontFamily: 'var(--font-body)' }}>
        facebook
      </span>
    );
  }
  if (platform === 'x') {
    return (
      <span className="bento-social-card__brand bento-social-card__brand--x" style={{ color: '#000000', display: 'inline-flex', alignItems: 'center' }}>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </span>
    );
  }
  if (platform === 'reddit') {
    return (
      <span className="bento-social-card__brand bento-social-card__brand--reddit" style={{ color: '#FF4500', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
        <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <g>
            <path d="M17.16 9.17a2.12 2.12 0 0 0-3.52-1.57c-1.2-.74-2.83-1.22-4.63-1.28L10 2.22l2.9.61c.03.52.46.94.99.94a1.03 1.03 0 1 0-1.03-1.03c0 .06.01.12.02.18l-3.23-.68a.43.43 0 0 0-.49.31L8.1 6.32c-1.83.04-3.5.52-4.73 1.27a2.12 2.12 0 0 0-2.4 3.19c-.06.24-.09.5-.09.76 0 3.2 3.82 5.8 8.54 5.8s8.54-2.6 8.54-5.8c0-.25-.03-.49-.08-.72a2.11 2.11 0 0 0 1.28-2.65ZM4.67 11.3a1.23 1.23 0 1 1 2.46 0 1.23 1.23 0 0 1-2.46 0Zm7.89 3.03c-.92.92-2.67.92-3.6 0a.39.39 0 1 1 .55-.55c.62.61 1.88.61 2.5 0a.39.39 0 1 1 .55.55Zm-.75-1.8a1.23 1.23 0 1 1 0-2.46 1.23 1.23 0 0 1 0 2.46Z" />
          </g>
        </svg>
        reddit
      </span>
    );
  }
  if (platform === 'google') {
    return (
      <span className="bento-social-card__brand bento-social-card__brand--google" style={{ color: '#1F2A44', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
        <svg viewBox="0 0 24 24" width="14" height="14" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.287 4.114a5.955 5.955 0 0 1-5.955-5.957 5.957 5.957 0 0 1 5.955-5.957c1.478 0 2.822.505 3.89 1.488l3.142-3.14C18.73 2.926 15.65 2 12.24 2 6.586 2 2 6.586 2 12.24s4.586 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.627-.067-1.283-.24-1.955H12.24z" fill="#4285F4" />
          <path d="M12.24 22.48c2.926 0 5.61-.967 7.747-2.615l-3.414-2.82c-1.186.79-2.703 1.275-4.333 1.275-3.327 0-6.143-2.25-7.148-5.284l-3.523 2.73c2.096 4.16 6.398 6.714 10.67 6.714z" fill="#34A853" />
          <path d="M5.092 13.036a6.208 6.208 0 0 1 0-3.66l-3.523-2.73a10.228 10.228 0 0 0 0 9.12l3.523-2.73z" fill="#FBBC05" />
          <path d="M12.24 5.76c1.82 0 3.456.627 4.745 1.822l3.504-3.5C18.32 1.944 15.485 1 12.24 1 7.968 1 3.666 3.554 1.57 7.714l3.523 2.73c1.005-3.034 3.82-5.284 7.147-5.284z" fill="#EA4335" />
        </svg>
        Google Maps
      </span>
    );
  }
  return <span>{source}</span>;
}

function renderRatingBrand(platform) {
  if (platform === 'amazon') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
        <span style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.45rem)', fontWeight: '900', letterSpacing: '-0.04em', color: '#FFFFFF', fontFamily: 'var(--font-body)' }}>
          amazon
        </span>
        <svg viewBox="0 0 76 15" width="62" height="12" fill="none" style={{ marginTop: '1px', display: 'block' }}>
          <path d="M4 3c14 6.5 32 6.5 46 0" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M45.5 2c1.2.8 2.5 1.5 3 2.5-.5-.2-1.8-.8-3-1" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (platform === 'google') {
    return (
      <span className="bento-social-card__rating-google-logo" style={{ fontFamily: 'Product Sans, var(--font-heading)', fontWeight: 'bold', fontSize: '20px', letterSpacing: '-0.05em', display: 'block', margin: '0 auto' }}>
        <span style={{ color: '#4285F4' }}>G</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#FBBC05' }}>o</span>
        <span style={{ color: '#4285F4' }}>g</span>
        <span style={{ color: '#34A853' }}>l</span>
        <span style={{ color: '#EA4335' }}>e</span>
      </span>
    );
  }
  return <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{platform}</span>;
}

function BentoSocialCard({ slot, post, phase, cycle }) {
  const productImage = post.imageProductId
    ? PRODUCTS.find((product) => product.id === post.imageProductId)?.image
    : null;

  const cardClassName = [
    'bento-social-card',
    `bento-social-card--${slot}`,
    `bento-social-card--${post.kind}`,
    post.platform ? `bento-social-card--${post.platform}` : '',
    post.tone ? `bento-social-card--${post.tone}` : '',
    `bento-social-card--${phase}`,
  ].filter(Boolean).join(' ');

  if (post.kind === 'promo') {
    return (
      <article
        key={`${slot}-${phase}-${cycle}`}
        className={cardClassName}
        aria-label={post.headline}
      >
        <div className="bento-social-card__promo-copy">
          <span className="bento-social-card__promo-eyebrow">{post.eyebrow}</span>
          <h3>{post.headline}</h3>
          <p>{post.supporting}</p>
        </div>

        {productImage && (
          <img
            className="bento-social-card__promo-image"
            src={productImage}
            alt=""
            aria-hidden="true"
          />
        )}
      </article>
    );
  }

  if (post.kind === 'rating') {
    return (
      <article
        key={`${slot}-${phase}-${cycle}`}
        className={cardClassName}
        aria-label={`${post.platform} rating ${post.score}`}
      >
        <div className="bento-social-card__rating-logo-wrapper" style={{ marginBottom: '6px' }}>
          {renderRatingBrand(post.platform)}
        </div>
        <span className="bento-social-card__rating-stars">{post.stars}</span>
        <div className="bento-social-card__rating-row">
          <strong>{post.score}</strong>
          <span>{post.body}</span>
        </div>
      </article>
    );
  }

  return (
    <article
      key={`${slot}-${phase}-${cycle}`}
      className={cardClassName}
      aria-label={`${post.platform} post by ${post.author}`}
    >
      <p className="bento-social-card__body">{post.body}</p>

      <div className="bento-social-card__footer">
        <span>{post.handle}</span>
        {renderFooterBrand(post.platform, post.source)}
      </div>
    </article>
  );
}

export default function HomePage() {
  const getHeroText = useUserStore((state) => state.getHeroText);
  const { displayName, suffix } = useMemo(() => getHeroText(), [getHeroText]);


  const videoRef = useRef(null);
  const scrollVideoTriggerRef = useRef(null);
  const scrollVideoFullscreenRef = useRef(null);
  const scrollVideoModeRef = useRef('inline');
  const scrollVideoExitTimerRef = useRef(null);
  const bentoVideoRef = useRef(null);
  const hardPartParallaxRef = useRef(null);
  const hardPartVideoRef = useRef(null);
  const bentoOutgoingTimerRef = useRef(null);
  const bentoActiveSetRef = useRef(0);
  const carouselTrackRef = useRef(null);
  const carouselFirstGroupRef = useRef(null);
  const carouselFrameRef = useRef(null);
  const carouselPositionRef = useRef(0);
  const carouselGroupWidthRef = useRef(0);
  const carouselPausedRef = useRef(false);
  const carouselResumeTimerRef = useRef(null);
  const carouselPointerStartRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);
  const [scrollVideoMode, setScrollVideoMode] = useState('inline');
  const [activeBentoPostSet, setActiveBentoPostSet] = useState(0);
  const [outgoingBentoPostSet, setOutgoingBentoPostSet] = useState(null);

  const videoStyles = {
    position: 'absolute',
    left: '5.291%',
    top: '41.54%',
    width: '89.42%',
    height: '8.403%',
    borderRadius: '24px',
    zIndex: 10,
    overflow: 'hidden'
  };

  const updateScrollVideoMode = (nextMode) => {
    if (scrollVideoModeRef.current === nextMode) return;
    scrollVideoModeRef.current = nextMode;
    setScrollVideoMode(nextMode);
  };

  const handleVideoClick = (event, targetVideoRef = videoRef) => {
    event.stopPropagation();

    const video = targetVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = true;
      video.play().catch(() => { });
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    try {
      const objectElem = document.querySelector('.figma-svg-object');
      if (!objectElem) return;
      const svgDoc = objectElem.contentDocument;
      if (!svgDoc) return;

      updateDynamicHeroText(svgDoc, displayName, suffix);
    } catch (err) {
      console.error('Error updating dynamic SVG text:', err);
    }
  }, [displayName, suffix]);

  // Keep the central social-grid video playing as soon as the browser allows it.
  useEffect(() => {
    const video = bentoVideoRef.current;
    if (!video) return undefined;

    const forcePlay = () => {
      video.muted = true;
      video.play().catch(() => { });
    };

    forcePlay();
    video.addEventListener('canplay', forcePlay);
    document.addEventListener('visibilitychange', forcePlay);

    return () => {
      video.removeEventListener('canplay', forcePlay);
      document.removeEventListener('visibilitychange', forcePlay);
    };
  }, []);

  // coffeeswirl2 is the moving texture behind the "We handled the hard part" copy.
  // It lives below the exported SVG, so the original heading, paragraph and CTA
  // remain crisp above it while the coffee motion drifts at a slower scroll speed.
  useEffect(() => {
    const layer = hardPartParallaxRef.current;
    const video = hardPartVideoRef.current;
    if (!layer || !video) return undefined;

    const forcePlay = () => {
      if (document.visibilityState === 'hidden') return;
      video.muted = true;
      video.play().catch(() => { });
    };

    let frameId = 0;
    const updateParallax = () => {
      const rect = layer.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const layerCenter = rect.top + rect.height / 2;
      const distanceFromCenter = viewportCenter - layerCenter;
      const shift = Math.max(-54, Math.min(54, distanceFromCenter * 0.11));

      layer.style.setProperty('--hard-part-parallax-shift', `${shift.toFixed(1)}px`);
      frameId = 0;
    };

    const queueParallaxUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateParallax);
    };

    forcePlay();
    queueParallaxUpdate();

    video.addEventListener('canplay', forcePlay);
    document.addEventListener('visibilitychange', forcePlay);
    window.addEventListener('scroll', queueParallaxUpdate, { passive: true });
    window.addEventListener('resize', queueParallaxUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      video.removeEventListener('canplay', forcePlay);
      document.removeEventListener('visibilitychange', forcePlay);
      window.removeEventListener('scroll', queueParallaxUpdate);
      window.removeEventListener('resize', queueParallaxUpdate);
    };
  }, []);

  // The inline video becomes a true viewport layer when the user reaches it.
  // Scroll remains enabled: moving beyond the video triggers a short exit animation.
  useEffect(() => {
    const updateScrollVideoFromPosition = () => {
      const trigger = scrollVideoTriggerRef.current;
      if (!trigger) return;

      const triggerTop = trigger.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const enterLine = viewportHeight * 0.70;
      const exitLine = -viewportHeight * 0.56;

      if (triggerTop > enterLine) {
        window.clearTimeout(scrollVideoExitTimerRef.current);
        updateScrollVideoMode('inline');
        return;
      }

      if (triggerTop > exitLine) {
        window.clearTimeout(scrollVideoExitTimerRef.current);
        updateScrollVideoMode('fullscreen');
        return;
      }

      if (
        scrollVideoModeRef.current !== 'exiting' &&
        scrollVideoModeRef.current !== 'after'
      ) {
        updateScrollVideoMode('exiting');
        window.clearTimeout(scrollVideoExitTimerRef.current);
        scrollVideoExitTimerRef.current = window.setTimeout(() => {
          updateScrollVideoMode('after');
        }, 560);
      }
    };

    let frameId = 0;
    const handleScrollOrResize = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        updateScrollVideoFromPosition();
        frameId = 0;
      });
    };

    updateScrollVideoFromPosition();
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(scrollVideoExitTimerRef.current);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  // Handoff playback between the inline card and its fixed fullscreen counterpart.
  useEffect(() => {
    const inlineVideo = videoRef.current;
    const fullscreenVideo = scrollVideoFullscreenRef.current;
    const isFullscreenStage =
      scrollVideoMode === 'fullscreen' || scrollVideoMode === 'exiting';

    if (isFullscreenStage && fullscreenVideo) {
      if (inlineVideo && Number.isFinite(inlineVideo.currentTime)) {
        try {
          fullscreenVideo.currentTime = inlineVideo.currentTime;
        } catch {
          // Setting currentTime can be blocked until metadata has loaded; autoplay still works.
        }
      }

      inlineVideo?.pause();
      fullscreenVideo.muted = true;
      fullscreenVideo.play().catch(() => { });
      setIsPaused(false);
      return;
    }

    if (scrollVideoMode === 'inline' && inlineVideo) {
      if (fullscreenVideo && Number.isFinite(fullscreenVideo.currentTime)) {
        try {
          inlineVideo.currentTime = fullscreenVideo.currentTime;
        } catch {
          // The inline video continues from its current frame when metadata is unavailable.
        }
      }

      fullscreenVideo?.pause();
      inlineVideo.muted = true;
      inlineVideo.play().catch(() => { });
      setIsPaused(false);
    }

    if (scrollVideoMode === 'after') {
      fullscreenVideo?.pause();
    }
  }, [scrollVideoMode]);

  // Each set replaces the social cards every 4.8 seconds. The prior set is kept
  // for a short moment so it can slide out while the next set slides in.
  useEffect(() => {
    const rotateBentoPosts = () => {
      const current = bentoActiveSetRef.current;
      const next = (current + 1) % BENTO_POST_SETS.length;

      setOutgoingBentoPostSet(current);
      setActiveBentoPostSet(next);
      bentoActiveSetRef.current = next;

      window.clearTimeout(bentoOutgoingTimerRef.current);
      bentoOutgoingTimerRef.current = window.setTimeout(() => {
        setOutgoingBentoPostSet(null);
      }, 650);
    };

    const intervalId = window.setInterval(rotateBentoPosts, 4800);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(bentoOutgoingTimerRef.current);
    };
  }, []);

  // The carousel moves with translate3d instead of native scrollLeft. This avoids
  // smooth-scroll and requestAnimationFrame fighting each other on smaller devices.
  const normalizeCarouselPosition = () => {
    const groupWidth = carouselGroupWidthRef.current;
    if (!groupWidth) return;

    while (carouselPositionRef.current <= -groupWidth * 2) {
      carouselPositionRef.current += groupWidth;
    }

    while (carouselPositionRef.current > -groupWidth) {
      carouselPositionRef.current -= groupWidth;
    }
  };

  const renderCarouselPosition = (animated = false) => {
    const track = carouselTrackRef.current;
    if (!track) return;

    track.style.transition = animated
      ? 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'none';
    track.style.transform = `translate3d(${carouselPositionRef.current}px, 0, 0)`;
  };

  const pauseMixCarousel = () => {
    carouselPausedRef.current = true;
    window.clearTimeout(carouselResumeTimerRef.current);
  };

  const resumeMixCarousel = (delay = 350) => {
    window.clearTimeout(carouselResumeTimerRef.current);
    carouselResumeTimerRef.current = window.setTimeout(() => {
      carouselPausedRef.current = false;
    }, delay);
  };

  // Measure after paint and whenever the viewport changes so every device starts
  // from the middle duplicate set with a valid, seamless loop position.
  useEffect(() => {
    const measureCarousel = () => {
      const groupWidth = carouselFirstGroupRef.current?.getBoundingClientRect().width || 0;
      if (!groupWidth) return;

      carouselGroupWidthRef.current = groupWidth;
      carouselPositionRef.current = -groupWidth;
      renderCarouselPosition(false);
    };

    const frameId = requestAnimationFrame(measureCarousel);
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measureCarousel)
      : null;

    if (carouselFirstGroupRef.current) {
      resizeObserver?.observe(carouselFirstGroupRef.current);
    }

    window.addEventListener('resize', measureCarousel);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureCarousel);
    };
  }, []);

  // Continuous automatic movement. It is deliberately paused while hovering,
  // touching, focusing, or using navigation so the rail never feels stuck.
  useEffect(() => {
    let previousTime = performance.now();

    const animateCarousel = (currentTime) => {
      const elapsed = Math.min(currentTime - previousTime, 64);
      previousTime = currentTime;

      if (!carouselPausedRef.current && carouselGroupWidthRef.current) {
        carouselPositionRef.current -= elapsed * 0.024;
        normalizeCarouselPosition();
        renderCarouselPosition(false);
      }

      carouselFrameRef.current = requestAnimationFrame(animateCarousel);
    };

    carouselFrameRef.current = requestAnimationFrame(animateCarousel);

    return () => cancelAnimationFrame(carouselFrameRef.current);
  }, []);

  const moveMixCarousel = (direction) => {
    const card = carouselTrackRef.current?.querySelector('.trending-mix-card');
    const group = carouselFirstGroupRef.current;
    const groupWidth = carouselGroupWidthRef.current;
    if (!card || !group || !groupWidth) return;

    const styles = window.getComputedStyle(group);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const moveDistance = card.getBoundingClientRect().width + gap;

    pauseMixCarousel();
    carouselPositionRef.current -= direction * moveDistance;
    normalizeCarouselPosition();
    renderCarouselPosition(true);
    resumeMixCarousel(900);
  };

  const handleCarouselPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    carouselPointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
    pauseMixCarousel();
  };

  const handleCarouselPointerUp = (event) => {
    const start = carouselPointerStartRef.current;
    carouselPointerStartRef.current = null;

    if (!start) {
      resumeMixCarousel();
      return;
    }

    const xDistance = event.clientX - start.x;
    const yDistance = event.clientY - start.y;

    if (Math.abs(xDistance) > 42 && Math.abs(xDistance) > Math.abs(yDistance)) {
      moveMixCarousel(xDistance > 0 ? -1 : 1);
      return;
    }

    resumeMixCarousel();
  };

  useEffect(() => () => {
    window.clearTimeout(carouselResumeTimerRef.current);
  }, []);

  return (
    <div className="homepage-figma-container">
      {/* ── DESKTOP & MOBILE UNIFIED FIGMA SVG LAYOUT ───────────────────────── */}
      <div className="figma-svg-wrapper">
        <object
          data="/Homepage.svg?v=1.7"
          type="image/svg+xml"
          className="figma-svg-object"
          aria-label="Figma Homepage Design"
          onLoad={(e) => {
            try {
              const svgDoc = e.target.contentDocument;
              if (!svgDoc) return;

              injectSvgStyles(svgDoc);
              animateSvgCup(svgDoc);
              injectDynamicHeroText(svgDoc, displayName, suffix);
              hideStaticPlaceholders(svgDoc);
            } catch (err) {
              console.error('Error injecting dynamic assets into SVG:', err);
            }
          }}
        />

        {/* ── HARD-PART SECTION: COFFEESWIRL2, CLIPPED TO FIGMA WAVES ── */}
        <div className="hard-part-parallax-clip" aria-hidden="true">
          <div
            ref={hardPartParallaxRef}
            className="hard-part-parallax-video"
          >
            <video
              ref={hardPartVideoRef}
              src="/Videos/coffeeswirl2.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
        </div>

        {/* ── BENTO GRID: CENTRAL COFFEESWIRL1 VIDEO ── */}
        <div className="bento-video-card">
          <video
            ref={bentoVideoRef}
            src="/Videos/coffeeswirl1.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Coffee swirl video"
          />
        </div>

        {/* ── BENTO GRID: STATIC POSTER + ROTATING SOCIAL POSTS ── */}
        <div className="bento-grid-hover-card bento-grid-hover-card--poster" aria-hidden="true" />

        {outgoingBentoPostSet !== null && BENTO_SOCIAL_SLOTS.map((slot) => (
          <BentoSocialCard
            key={`bento-leave-${outgoingBentoPostSet}-${slot}`}
            slot={slot}
            post={BENTO_POST_SETS[outgoingBentoPostSet][slot]}
            phase="leave"
            cycle={outgoingBentoPostSet}
          />
        ))}

        {BENTO_SOCIAL_SLOTS.map((slot) => (
          <BentoSocialCard
            key={`bento-enter-${activeBentoPostSet}-${slot}`}
            slot={slot}
            post={BENTO_POST_SETS[activeBentoPostSet][slot]}
            phase="enter"
            cycle={activeBentoPostSet}
          />
        ))}

        {/* ── INFINITE TRENDING MIXES CAROUSEL ── */}
        <section
          className="trending-mixes-marquee"
          aria-label="Trending coffee mixes"
          onMouseEnter={pauseMixCarousel}
          onMouseLeave={() => resumeMixCarousel()}
          onFocusCapture={pauseMixCarousel}
          onBlurCapture={() => resumeMixCarousel()}
          onPointerDown={handleCarouselPointerDown}
          onPointerUp={handleCarouselPointerUp}
          onPointerCancel={() => resumeMixCarousel()}
        >
          <div className="trending-mixes-marquee__viewport">
            <div
              ref={carouselTrackRef}
              className="trending-mixes-marquee__track"
            >
              <div
                ref={carouselFirstGroupRef}
                className="trending-mixes-marquee__group"
              >
                <TrendingMixCards />
              </div>

              <div
                className="trending-mixes-marquee__group"
                aria-hidden="true"
              >
                <TrendingMixCards duplicate />
              </div>

              <div
                className="trending-mixes-marquee__group"
                aria-hidden="true"
              >
                <TrendingMixCards duplicate />
              </div>
            </div>
          </div>
        </section>

        {/* ── TRENDING MIXES CONTROLS ──
            Keeping the arrows inside this footer keeps them fixed, centered,
            and vertically separated from the tagline on every screen size. */}
        <div className="trending-mixes-footer">
          <div className="trending-mixes-navigation" aria-label="Trending mixes navigation">
            <button
              type="button"
              className="trending-mixes-nav-button"
              aria-label="Show previous mixes"
              onClick={() => moveMixCarousel(-1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.5 5 7.5 12l7 7" />
              </svg>
            </button>

            <button
              type="button"
              className="trending-mixes-nav-button"
              aria-label="Show next mixes"
              onClick={() => moveMixCarousel(1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9.5 5 7 7-7 7" />
              </svg>
            </button>
          </div>

          <p>
            Tag your mix with <strong>#MadeByYou</strong>
          </p>

          <Link to="/build" className="trending-mixes-create-link">
            Create your Recipe
          </Link>
        </div>

        {/* ── SCROLL-TRIGGERED INLINE VIDEO ── */}
        <div
          ref={scrollVideoTriggerRef}
          className={`scroll-video-wrapper ${scrollVideoMode !== 'inline' ? 'scroll-video-wrapper--covered' : ''
            }`}
          style={videoStyles}
        >
          <div className="video-container-inner">
            <video
              ref={videoRef}
              src="/Videos/coffeeswirl.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onClick={(event) => handleVideoClick(event, videoRef)}
              className="fullscreen-scroll-video"
            />
            {isPaused && scrollVideoMode === 'inline' && (
              <button
                type="button"
                className="video-play-overlay"
                aria-label="Play coffee swirl video"
                onClick={(event) => handleVideoClick(event, videoRef)}
              >
                <svg viewBox="0 0 24 24" fill="white" width="64" height="64">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── LOOPING WAVY MARQUEE OVERLAYS ── */}
        <svg
          viewBox="0 0 1512 8329"
          className="marquee-overlay-svg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 6
          }}
        >
          <defs>
            {/* Top Wave Curve aligned exactly with the SVG wave border and extended off-screen */}
            <path
              id="marquee-path-top"
              d="M-150 1185 L0 1119 L63 1090.97 C126 1063.35 252 1006.65 378 979.035 C504 951 630 951 756 979.035 C882 1006.65 1008 1063.35 1134 1063.04 C1260 1063.35 1386 1006.65 1449 979.035 L1512 951 L1662 885"
            />
            {/* Bottom Wave Curve aligned exactly with the top border of the navy blue wave and extended off-screen */}
            <path
              id="marquee-path-bottom"
              d="M-150 7462 L0 7396 L63 7367.96 C126 7340.35 252 7283.65 378 7283.97 C504 7283.65 630 7340.35 756 7367.96 C882 7396 1008 7396 1134 7367.96 C1260 7340.35 1386 7283.65 1449 7256.03 L1512 7228 L1662 7162"
            />
          </defs>

          {/* Top Wave Text - Left-to-Right Infinite Marquee */}
          <text
            fill="#FFFFFF"
            fontSize="34"
            fontWeight="800"
            fontFamily="var(--font-heading)"
            letterSpacing="0.08em"
            dy="30"
          >
            <textPath href="#marquee-path-top" startOffset="0%">
              Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......
              <animate attributeName="startOffset" from="-100%" to="0%" dur="22s" repeatCount="indefinite" />
            </textPath>
          </text>

          {/* Bottom Wave Text - Left-to-Right Infinite Marquee */}
          <text
            fill="#1F2A44"
            fontSize="34"
            fontWeight="800"
            fontFamily="var(--font-heading)"
            letterSpacing="0.08em"
            dy="-5"
          >
            <textPath href="#marquee-path-bottom" startOffset="0%">
              Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......
              <animate attributeName="startOffset" from="-100%" to="0%" dur="22s" repeatCount="indefinite" />
            </textPath>
          </text>
        </svg>

        {/* ── DESKTOP SVG CLICKABLE OVERLAYS (EXCLUDING HEADER) ── */}
        {/* Code Your Own Coffee Hero Button */}
        <Link
          to="/build"
          className="homepage-link link-hero-build"
          style={{ left: '40.94%', top: '9.58%', width: '18.12%', height: '0.60%' }}
          title="Code Your Own Coffee"
        />

        {/* Buy CHILLD Cold Brew Core Swirl Button */}
        <Link
          to="/menu?cat=cold-brew"
          className="homepage-link link-swirl-buy"
          style={{ left: '34.19%', top: '23.19%', width: '18.45%', height: '0.60%' }}
          title="Buy Cold Brew Core"
        />

        {/* Static Figma mix-card link overlays removed: the live carousel cards above own all interaction. */}

        {/* Original SVG trending CTA is hidden; the live React CTA above owns this action. */}

        {/* B2B Call Button */}
        <a
          href="tel:+918693852250"
          className="homepage-link link-b2b-call"
          style={{ left: '7.94%', top: '84.56%', width: '17.26%', height: '0.60%' }}
          title="Call Us"
        />

        {/* Footer Link - Cold Brew Core */}
        <Link
          to="/menu?cat=cold-brew"
          className="homepage-link link-footer-shop-1"
          style={{ left: '55.49%', top: '93.65%', width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Shop Cold Brew Core"
        />

        {/* Footer Link - Ceremonial Matcha */}
        <Link
          to="/menu?cat=matcha"
          className="homepage-link link-footer-shop-2"
          style={{ left: '55.49%', top: '94.13%', width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Shop Ceremonial Matcha"
        />

        {/* Footer Link - Create Your Mix */}
        <Link
          to="/build"
          className="homepage-link link-footer-shop-3"
          style={{ left: '55.49%', top: '94.61%', width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Code Your Drink"
        />

        {/* Footer Link - Indiranagar */}
        <Link
          to="/location"
          className="homepage-link link-footer-visit-1"
          style={{ left: '72.75%', top: '93.65%', width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Indiranagar Cafe"
        />

        {/* Footer Link - Koramangala */}
        <Link
          to="/location"
          className="homepage-link link-footer-visit-2"
          style={{ left: '72.75%', top: '94.13%', width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Koramangala Cafe"
        />

        {/* Footer Link - HSR Layout */}
        <Link
          to="/location"
          className="homepage-link link-footer-visit-3"
          style={{ left: '72.75%', top: '94.61%', width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="HSR Layout Cafe"
        />
      </div>

      {typeof document !== 'undefined' && createPortal(
        (scrollVideoMode === 'fullscreen' || scrollVideoMode === 'exiting') && (
          <section
            className={`scroll-video-stage scroll-video-stage--${scrollVideoMode}`}
            aria-label="Fullscreen coffee swirl video"
          >
            <video
              ref={scrollVideoFullscreenRef}
              src="/Videos/coffeeswirl.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="scroll-video-stage__video"
              onClick={(event) => handleVideoClick(event, scrollVideoFullscreenRef)}
            />

            <div className="scroll-video-stage__shade" aria-hidden="true" />

            {isPaused && (
              <button
                type="button"
                className="scroll-video-stage__play"
                aria-label="Resume coffee swirl video"
                onClick={(event) => handleVideoClick(event, scrollVideoFullscreenRef)}
              >
                <svg viewBox="0 0 24 24" fill="white" width="72" height="72" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </section>
        ),
        document.body
      )}
    </div>
  );
}
