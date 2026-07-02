import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useUserStore } from '@/store/useUserStore';
import './HomePage.css';
import { PRODUCTS } from '@/data/products';
import WhyChilldCup, { WHY_CHILLD_ITEMS } from '@/components/WhyChilldCup/WhyChilldCup';

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

    g[data-cup-hover-wrapper] {
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
      transform-origin: center center;
      transform-box: fill-box;
      cursor: pointer;
    }

    g[data-cup-hover-wrapper]:hover {
      transform: scale(1.06);
      filter: drop-shadow(0 14px 28px rgba(31, 42, 68, 0.18));
    }
  `;
  svgDoc.documentElement.appendChild(styleElem);
}

const HERO_CONTENT_LIFT = 48;

function animateSvgCup(svgDoc) {
  const cupRect = svgDoc.querySelector('rect[fill^="url(#pattern3_"]');
  if (!cupRect) return;

  const currentY = parseFloat(cupRect.getAttribute('y') || '0');
  if (Number.isFinite(currentY)) {
    cupRect.setAttribute('y', String(currentY - HERO_CONTENT_LIFT));
  }

  cupRect.classList.add('animated-cup');

  const parent = cupRect.parentNode;
  if (parent && !parent.getAttribute?.('data-hero-cup-parallax-wrapper')) {
    const wrapper = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.setAttribute('data-hero-cup-parallax-wrapper', 'true');
    wrapper.style.transformBox = 'view-box';
    wrapper.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
    parent.insertBefore(wrapper, cupRect);
    wrapper.appendChild(cupRect);
  }
}

const HERO_BEAN_ENTRANCES = {
  4: { x: -420, y: -220, delay: 120, duration: 920, floatX: 3, floatY: -7, floatDuration: 3900, floatRotate: 3, floatScale: 0.97, baseRotate: 12 },
  5: { x: -560, y: 80, delay: 260, duration: 980, floatX: -4, floatY: 6, floatDuration: 4300, floatRotate: -4, floatScale: 1.03, baseRotate: -8 },
  6: { x: -500, y: 300, delay: 420, duration: 900, floatX: 4, floatY: -5, floatDuration: 3600, floatRotate: 2, floatScale: 0.98, baseRotate: 22 },
  7: { x: -220, y: 420, delay: 560, duration: 980, floatX: -3, floatY: -8, floatDuration: 4600, floatRotate: -3, floatScale: 1.02, baseRotate: -15 },
  8: { x: -340, y: 140, delay: 700, duration: 860, floatX: 2, floatY: 5, floatDuration: 3400, floatRotate: 4, floatScale: 0.97, baseRotate: 5 },
  9: { x: 360, y: 320, delay: 240, duration: 980, floatX: -4, floatY: -6, floatDuration: 4200, floatRotate: -2, floatScale: 1.02, baseRotate: -18 },
  10: { x: 520, y: 120, delay: 400, duration: 880, floatX: 3, floatY: 5, floatDuration: 3700, floatRotate: 3, floatScale: 0.98, baseRotate: 25 },
  11: { x: 540, y: -260, delay: 80, duration: 1040, floatX: -3, floatY: 7, floatDuration: 4500, floatRotate: -4, floatScale: 1.03, baseRotate: -10 },
  12: { x: 260, y: -300, delay: 620, duration: 820, floatX: 2, floatY: -5, floatDuration: 3300, floatRotate: 2, floatScale: 0.98, baseRotate: 15 },
  13: { x: 380, y: 180, delay: 760, duration: 860, floatX: -2, floatY: 6, floatDuration: 3800, floatRotate: -3, floatScale: 1.02, baseRotate: -22 },
  14: { x: 520, y: 240, delay: 900, duration: 900, floatX: 3, floatY: -6, floatDuration: 4100, floatRotate: 4, floatScale: 0.97, baseRotate: 8 },
};

function getHeroBeanPatternNumber(node) {
  const fill = node.getAttribute('fill') || '';
  const match = fill.match(/^url\(#pattern(\d+)_/);
  if (!match) return null;

  const patternNumber = Number(match[1]);
  return patternNumber >= 4 && patternNumber <= 14 ? patternNumber : null;
}

function startHeroBeanFloat(wrapper, entrance) {
  const base = entrance.baseRotate || 0;
  const rotate = entrance.floatRotate || 0;
  const scale = entrance.floatScale || 1;
  const midRotate = Number.isFinite(rotate) ? rotate * 0.6 : 0;
  wrapper.animate(
    [
      { transform: `translate(0, 0) rotate(${base}deg) scale(1)` },
      { transform: `translate(${entrance.floatX * 0.5}px, ${entrance.floatY * 0.5}px) rotate(${base + midRotate}deg) scale(${1 + (scale - 1) * 0.5})` },
      { transform: `translate(${entrance.floatX}px, ${entrance.floatY}px) rotate(${base + rotate}deg) scale(${scale})` },
      { transform: `translate(${entrance.floatX * 0.5}px, ${entrance.floatY * 0.5}px) rotate(${base - midRotate}deg) scale(${1 + (scale - 1) * 0.5})` },
      { transform: `translate(0, 0) rotate(${base}deg) scale(1)` },
    ],
    {
      duration: entrance.floatDuration,
      delay: entrance.delay % 320,
      easing: 'ease-in-out',
      iterations: Infinity,
    }
  );
}

function animateHeroBeans(svgDoc) {
  const prefersReducedMotion = svgDoc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const beanRects = Array.from(svgDoc.querySelectorAll('rect')).filter((rect) =>
    getHeroBeanPatternNumber(rect) !== null
  );

  beanRects.forEach((rect) => {
    const patternNumber = getHeroBeanPatternNumber(rect);
    const entrance = HERO_BEAN_ENTRANCES[patternNumber];
    const parent = rect.parentNode;

    if (!parent || !entrance || parent.getAttribute?.('data-hero-bean-wrapper') === 'true') {
      return;
    }

    const base = entrance.baseRotate || 0;

    // Outer wrapper handles scroll-driven exit transforms only
    const parallaxWrapper = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
    parallaxWrapper.setAttribute('data-hero-bean-parallax-wrapper', String(patternNumber));
    parallaxWrapper.style.transformBox = 'view-box';
    parallaxWrapper.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';

    // Inner wrapper handles entrance animation, base rotation, and float
    const wrapper = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.setAttribute('data-hero-bean-wrapper', 'true');
    wrapper.setAttribute('data-hero-bean-pattern', String(patternNumber));
    wrapper.style.transformOrigin = 'center center';
    wrapper.style.transformBox = 'fill-box';

    parent.insertBefore(parallaxWrapper, rect);
    parallaxWrapper.appendChild(wrapper);
    wrapper.appendChild(rect);

    if (prefersReducedMotion) {
      wrapper.style.opacity = '1';
      wrapper.style.transform = `rotate(${base}deg)`;
      return;
    }

    wrapper.style.opacity = '0';
    wrapper.style.transform = `translate(${entrance.x}px, ${entrance.y}px) rotate(${base}deg)`;

    const animation = wrapper.animate(
      [
        {
          opacity: 0,
          transform: `translate(${entrance.x}px, ${entrance.y}px) rotate(${base}deg)`,
        },
        {
          opacity: 1,
          transform: `translate(0, 0) rotate(${base}deg)`,
        },
      ],
      {
        duration: entrance.duration,
        delay: entrance.delay,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      }
    );

    animation.finished
      .then(() => {
        wrapper.style.opacity = '1';
        wrapper.style.transform = `translate(0, 0) rotate(${base}deg)`;
        animation.cancel();
        startHeroBeanFloat(wrapper, entrance);
      })
      .catch(() => {});
  });
}

const LOWER_SECTION_COMPACT_Y = 6516;
const LOWER_SECTION_COMPACT_SHIFT = 260;
const LOWER_SECTION_COMPACT_SHIFT_PERCENT = `${((LOWER_SECTION_COMPACT_SHIFT / 8329) * 100).toFixed(2)}%`;

function getSvgNodeStartY(node) {
  const yAttr = node.getAttribute('y');
  if (yAttr) return parseFloat(yAttr);

  const transform = node.getAttribute('transform') || '';
  const translateMatch = transform.match(/translate\(\s*[\d.-]+[\s,]+([\d.-]+)\)/i);
  if (translateMatch) return parseFloat(translateMatch[1]);

  const d = node.getAttribute('d') || '';
  const pathMatch = d.match(/^M\s*[\d.-]+\s+([\d.-]+)/i);
  if (pathMatch) return parseFloat(pathMatch[1]);

  return Number.NaN;
}

function compactLowerHomepageSections(svgDoc) {
  const nodes = svgDoc.querySelectorAll('rect, path, image, g');

  nodes.forEach((node) => {
    const yVal = getSvgNodeStartY(node);
    if (!Number.isFinite(yVal) || yVal < LOWER_SECTION_COMPACT_Y) return;

    const transform = node.getAttribute('transform') || '';
    node.setAttribute('transform', `${transform} translate(0 -${LOWER_SECTION_COMPACT_SHIFT})`.trim());
  });
}

const HERO_TEXT_LAYOUT = {
  centerX: 756,
  baselineY: 340 - HERO_CONTENT_LIFT,
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

function wrapCupElements(svgDoc, cupIndex, nextSiblingCount) {
  const gMask = svgDoc.querySelector(`g[mask^="url(#mask${cupIndex}_"]`);
  if (!gMask) return;

  const parent = gMask.parentNode;
  if (!parent) return;

  // 1. Create Parallax Wrapper (handles translateY)
  const parallaxWrapper = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
  parallaxWrapper.setAttribute('data-cup-parallax-wrapper', String(cupIndex));
  parallaxWrapper.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
  parallaxWrapper.style.transformBox = 'view-box';

  // 2. Create Hover Wrapper (handles scale and drop shadow on hover)
  const hoverWrapper = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
  hoverWrapper.setAttribute('data-cup-hover-wrapper', String(cupIndex));

  parent.insertBefore(parallaxWrapper, gMask);
  parallaxWrapper.appendChild(hoverWrapper);
  
  // Move elements inside the hover wrapper
  hoverWrapper.appendChild(gMask);

  let currentSibling = parallaxWrapper.nextSibling;
  for (let k = 0; k < nextSiblingCount; k++) {
    if (currentSibling) {
      const next = currentSibling.nextSibling;
      hoverWrapper.appendChild(currentSibling);
      currentSibling = next;
    }
  }
}

// ── INFINITE TRENDING MIXES CAROUSEL ──────────────────────────────────
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
        <img src={mix.image} alt={duplicate ? '' : mix.name} />
        <span className="trending-mix-card__likes">
          {mix.likes}
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

function DesktopHomePage() {
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

  const reactCup1Ref = useRef(null);
  const reactCup2Ref = useRef(null);
  const reactCup3Ref = useRef(null);
  const reactCup4Ref = useRef(null);

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
      const enterLine = viewportHeight * 0.45;
      const exitLine = viewportHeight * 0.40;

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
    let pauseResetTimer = 0;

    if (inlineVideo) {
      inlineVideo.muted = true;
      inlineVideo.play().catch(() => { });
    }
    if (fullscreenVideo) {
      fullscreenVideo.muted = true;
      fullscreenVideo.play().catch(() => { });
    }
    pauseResetTimer = window.setTimeout(() => setIsPaused(false), 0);

    return () => window.clearTimeout(pauseResetTimer);
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

  // Scroll parallax effect for the "Why Chilld?" section cups
  useEffect(() => {
    let frameId = 0;
    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        try {
          const objectElem = document.querySelector('.figma-svg-object');
          if (!objectElem) return;
          const svgDoc = objectElem.contentDocument;
          if (!svgDoc) return;

          const svgRect = objectElem.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          const scale = svgRect.height / 8329;

          // Cup centers in SVG space
          const cupCenters = [2650, 2900, 2700, 2950];
          const cupSpeeds = [0.22, -0.22, 0.16, -0.16];

          const reactCups = [reactCup1Ref.current, reactCup2Ref.current, reactCup3Ref.current, reactCup4Ref.current];
          for (let i = 1; i <= 4; i++) {
            const el = reactCups[i - 1];
            if (el) {
              const screenCenter = svgRect.top + cupCenters[i - 1] * scale;
              const distanceFromCenter = viewportCenter - screenCenter;
              const shift = distanceFromCenter * cupSpeeds[i - 1];

              el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
            }
          }

          const heroCupWrapper = svgDoc.querySelector('g[data-hero-cup-parallax-wrapper]');
          if (heroCupWrapper) {
            const heroShift = window.scrollY * 0.6;
            heroCupWrapper.style.transform = `translate3d(0, ${heroShift.toFixed(1)}px, 0)`;
          }

          const beanWrappers = svgDoc.querySelectorAll('g[data-hero-bean-parallax-wrapper]');
          if (beanWrappers.length) {
            const sy = window.scrollY;
            for (const bw of beanWrappers) {
              const pn = parseInt(bw.getAttribute('data-hero-bean-parallax-wrapper'), 10);
              const dir = pn >= 4 && pn <= 8 ? -1 : 1;
              bw.style.transform = `translate3d(${(sy * 0.9 * dir).toFixed(1)}px, ${(sy * 0.25).toFixed(1)}px, 0)`;
            }
          }
        } catch {
          // Ignore loaded SVG access errors
        }
        frameId = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => () => {
    window.clearTimeout(carouselResumeTimerRef.current);
  }, []);

  return (
    <div className="homepage-figma-container">
      {/* ── DESKTOP & MOBILE UNIFIED FIGMA SVG LAYOUT ───────────────────────── */}
      <div className="figma-svg-wrapper">
        <div className="figma-svg-content">
          <div id="hard-part" className="hard-part-anchor-target" />
          <object
            data="/Homepage.svg?v=1.7"
            type="image/svg+xml"
            className="figma-svg-object"
            aria-label="Figma Homepage Design"
            fetchPriority="high"
            onLoad={(e) => {
              try {
                const svgDoc = e.target.contentDocument;
                if (!svgDoc) return;

                injectSvgStyles(svgDoc);
                animateSvgCup(svgDoc);
                animateHeroBeans(svgDoc);
                injectDynamicHeroText(svgDoc, displayName, suffix);
                hideStaticPlaceholders(svgDoc);
                compactLowerHomepageSections(svgDoc);

                // Wrap the cup elements for parallax effect
                wrapCupElements(svgDoc, 1, 2);
                wrapCupElements(svgDoc, 2, 2);
                wrapCupElements(svgDoc, 3, 2);
                wrapCupElements(svgDoc, 4, 3);

                // Hide the original SVG cups so they don't render behind our React overlay
                for (let i = 1; i <= 4; i++) {
                  const wrapper = svgDoc.querySelector(`g[data-cup-parallax-wrapper="${i}"]`);
                  if (wrapper) {
                    wrapper.style.display = 'none';
                  }
                }

                // Also hide ALL remaining SVG elements in the cups/text Y-range (2400-3460)
                // The kiosk SVG has text labels as separate path elements, not cup-group siblings
                try {
                  const svgRoot = svgDoc.querySelector('svg');
                  const allPaths = svgRoot.querySelectorAll('path, g[mask]');
                  allPaths.forEach(el => {
                    try {
                      const bbox = el.getBBox();
                      if (bbox && bbox.y > 2400 && bbox.y < 3460 && bbox.height > 5) {
                        el.style.display = 'none';
                      }
                    } catch { /* getBBox can throw for invisible elements */ }
                  });
                } catch { /* safety net */ }

                // Shrink SVG canvas height by compact shift to prevent trailing whitespace
                const svg = svgDoc.querySelector('svg');
                if (svg) {
                  const currentHeight = parseFloat(svg.getAttribute('height') || '8329');
                  svg.setAttribute('height', String(currentHeight - LOWER_SECTION_COMPACT_SHIFT));
                  svg.setAttribute('viewBox', `0 0 1512 ${currentHeight - LOWER_SECTION_COMPACT_SHIFT}`);

                  // Inject light blue background and faded Why CHILLD pattern into the SVG DOM.
                  const bgRect = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect');
                  bgRect.setAttribute('x', '0');
                  bgRect.setAttribute('y', '2110');
                  bgRect.setAttribute('width', '1512');
                  bgRect.setAttribute('height', '1350');
                  bgRect.setAttribute('fill', '#eaf5ff');

                  const firstChild = svg.firstChild;
                  svg.insertBefore(bgRect, firstChild);
                }

                // syncHardPartTextOverlay skipped — kiosk SVG has no vector text paths; using hardcoded React overlay instead
              } catch (err) {
                console.error('Error injecting dynamic assets into SVG:', err);
              }
            }}
          />

          {/* ── WHY CHILLD REACT OVERLAY — solid navy numbered cups ── */}
          <section className="desktop-homepage__why-chilld" aria-label="Why CHILLD">
            <div className="desktop-homepage__why-chilld-content">
              {WHY_CHILLD_ITEMS.map((item, index) => (
                <WhyChilldCup
                  key={item.id}
                  item={item}
                  className={`desktop-homepage__why-chilld-item item-${item.id}`}
                  cupWrapClassName="desktop-homepage__why-chilld-cup-wrap"
                  cupClassName="desktop-homepage__why-chilld-cup"
                  ref={[reactCup1Ref, reactCup2Ref, reactCup3Ref, reactCup4Ref][index]}
                />
              ))}
            </div>
          </section>

        {/* ── HARD-PART SECTION: COFFEESWIRL2, CLIPPED TO FIGMA WAVES ── */}
        <div className="hard-part-shadow-wrapper">
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
              <div className="hard-part-video-overlay" />
            </div>
          </div>
        </div>

        {/* ── HARD-PART TEXT OVERLAY — Hardcoded React matching Figma reference ── */}
        <div
          className="hard-part-copy-overlay"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            top: '13.6%',
            height: '12.8%',
            left: 0,
            right: 0,
            padding: '0.5% 10%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {/* ── Big heading ── */}
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.1rem, 2.4vw, 2.8rem)',
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            margin: '0 0 0.3vw 0',
            textShadow: '0 2px 8px rgba(43,22,8,0.35)',
            userSelect: 'none',
          }}>
            We handled the hard part, the fun part's on you
          </h2>

          {/* ── Horizontal divider ── */}
          <div style={{
            width: '80%',
            maxWidth: 780,
            height: 2,
            background: 'rgba(255,255,255,0.55)',
            margin: '0.2vw auto 0.5vw auto',
            borderRadius: 1,
          }} />

          {/* ── Body paragraphs ── */}
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.45rem, 0.68vw, 0.78rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 660,
            margin: '0 auto 0.4vw auto',
            textShadow: '0 1px 4px rgba(43,22,8,0.3)',
            userSelect: 'none',
          }}>
            We get you exceptional coffee concentrate. We take care of the nitty-gritties of sourcing, grinding and brewing.
            After that, you are free to tailor your daily coffee to your liking. Add water, if you are in a hurry for your
            presentation. Add syrup, milk, experiment with everyday ingredients in your kitchen, if you feel like it.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.5rem, 0.78vw, 0.85rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 660,
            margin: '0 auto 0.4vw auto',
            textShadow: '0 1px 4px rgba(43,22,8,0.3)',
            userSelect: 'none',
          }}>
            If you've been on-call all night, add an extra spoon of our cold brew concentrate. If you get jittery, like me, but
            enjoy the occasional pick-me-up, add a spoon less. No one's judging you.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.5rem, 0.78vw, 0.85rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 660,
            margin: '0 auto 0.5vw auto',
            textShadow: '0 1px 4px rgba(43,22,8,0.3)',
            userSelect: 'none',
          }}>
            We guarantee that it will taste good; we promise that it won't eat into your wallet.
          </p>

          {/* ── Italic quote heading ── */}
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(0.6rem, 1vw, 1.15rem)',
            fontWeight: 600,
            fontStyle: 'italic',
            color: '#FFFFFF',
            textAlign: 'center',
            margin: '0 0 0.4vw 0',
            letterSpacing: '-0.01em',
            textShadow: '0 1px 5px rgba(43,22,8,0.35)',
            userSelect: 'none',
          }}>
            {"\u201CCoffee is too much work\u201D or \u201Cthis sounds difficult\u201D"}
          </p>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.5rem, 0.78vw, 0.85rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 660,
            margin: '0 auto 0.4vw auto',
            textShadow: '0 1px 4px rgba(43,22,8,0.3)',
            userSelect: 'none',
          }}>
            If you can make lemonade or iced-water, this is a walk in the park.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.5rem, 0.78vw, 0.85rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 660,
            margin: '0 auto 0.5vw auto',
            textShadow: '0 1px 4px rgba(43,22,8,0.3)',
            userSelect: 'none',
          }}>
            Chilld is built for people who like things their way. From milk choices to sweetness levels, every drink is designed
            by you. No complicated menus. Just cold coffee made for your mood, your routine, and your kind of day.
          </p>

          {/* ── CTA Buttons ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(12px, 1.5vw, 24px)',
            pointerEvents: 'auto',
          }}>
            <Link
              to="/build"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(8px, 0.7vw, 14px) clamp(18px, 1.8vw, 36px)',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(0.55rem, 0.8vw, 0.9rem)',
                color: '#1a1a1a',
                background: '#FFFFFF',
                borderRadius: 999,
                textDecoration: 'none',
                border: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Buy CHILLD Cold Brew Core
            </Link>
            <Link
              to="/recipes"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(8px, 0.7vw, 14px) clamp(12px, 1vw, 20px)',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: 'clamp(0.55rem, 0.8vw, 0.9rem)',
                color: '#FFFFFF',
                background: 'transparent',
                textDecoration: 'none',
                border: 'none',
                transition: 'opacity 0.2s',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                opacity: 0.9,
              }}
            >
              Explore Recipes
            </Link>
          </div>
        </div>

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
          className={`scroll-video-wrapper ${
            (scrollVideoMode === 'fullscreen' || scrollVideoMode === 'exiting')
              ? 'scroll-video-wrapper--covered'
              : ''
          }`}
          style={videoStyles}
        >
          <div className="video-container-inner">
            <video
              ref={videoRef}
              src="/Videos/coffee_concentrate_with_glass.mp4"
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
              d="M-150 7202 L0 7136 L63 7107.96 C126 7080.35 252 7023.65 378 7023.97 C504 7023.65 630 7080.35 756 7107.96 C882 7136 1008 7136 1134 7107.96 C1260 7080.35 1386 7023.65 1449 6996.03 L1512 6968 L1662 6902"
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
          title="Buy Cold Brew Concentrate"
        />

        {/* Explore Recipes Swirl Button */}
        <Link
          to="/recipes"
          className="homepage-link link-swirl-recipes"
          style={{ left: '55.68%', top: '23.19%', width: '12.2%', height: '0.60%' }}
          title="Explore Recipes"
        />

        {/* Static Figma mix-card link overlays removed: the live carousel cards above own all interaction. */}

        {/* Original SVG trending CTA is hidden; the live React CTA above owns this action. */}

        {/* B2B Call Button */}
        <a
          href="tel:+918693852250"
          className="homepage-link link-b2b-call"
          style={{ left: '7.94%', top: `calc(84.56% - ${LOWER_SECTION_COMPACT_SHIFT_PERCENT})`, width: '17.26%', height: '0.60%' }}
          title="Call Us"
        />

        {/* Footer Link - Cold Brew Core */}
        <Link
          to="/menu?cat=cold-brew"
          className="homepage-link link-footer-shop-1"
          style={{ left: '55.49%', top: `calc(93.65% - ${LOWER_SECTION_COMPACT_SHIFT_PERCENT})`, width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Shop Cold Brew Core"
        />

        {/* Footer Link - Ceremonial Matcha */}
        <Link
          to="/menu?cat=matcha"
          className="homepage-link link-footer-shop-2"
          style={{ left: '55.49%', top: `calc(94.13% - ${LOWER_SECTION_COMPACT_SHIFT_PERCENT})`, width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Shop Ceremonial Matcha"
        />

        {/* Footer Link - Create Your Mix */}
        <Link
          to="/build"
          className="homepage-link link-footer-shop-3"
          style={{ left: '55.49%', top: `calc(94.61% - ${LOWER_SECTION_COMPACT_SHIFT_PERCENT})`, width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Code Your Drink"
        />

        {/* Footer Link - Create Recipe */}
        <Link
          to="/create-recipe"
          className="homepage-link link-footer-recipe-create"
          style={{ left: '64.15%', top: `calc(94.13% - ${LOWER_SECTION_COMPACT_SHIFT_PERCENT})`, width: '10.5%', height: '0.36%', borderRadius: '0' }}
          title="Create Recipe"
        />

        {/* Footer Link - Recipe Details */}
        <Link
          to="/recipes"
          className="homepage-link link-footer-recipe-details"
          style={{ left: '64.15%', top: `calc(94.61% - ${LOWER_SECTION_COMPACT_SHIFT_PERCENT})`, width: '10.5%', height: '0.36%', borderRadius: '0' }}
          title="Recipes"
        />

        {/* Footer Link - Indiranagar */}
        <Link
          to="/location"
          className="homepage-link link-footer-visit-1"
          style={{ left: '72.75%', top: `calc(93.65% - ${LOWER_SECTION_COMPACT_SHIFT_PERCENT})`, width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Indiranagar Cafe"
        />

        {/* Footer Link - Koramangala */}
        <Link
          to="/location"
          className="homepage-link link-footer-visit-2"
          style={{ left: '72.75%', top: `calc(94.13% - ${LOWER_SECTION_COMPACT_SHIFT_PERCENT})`, width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="Koramangala Cafe"
        />

        {/* Footer Link - HSR Layout */}
        <Link
          to="/location"
          className="homepage-link link-footer-visit-3"
          style={{ left: '72.75%', top: `calc(94.61% - ${LOWER_SECTION_COMPACT_SHIFT_PERCENT})`, width: '13.23%', height: '0.36%', borderRadius: '0' }}
          title="HSR Layout Cafe"
        />
        </div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <section
          className={`scroll-video-stage scroll-video-stage--${scrollVideoMode}`}
          aria-label="Fullscreen coffee swirl video"
          style={{
            display: (scrollVideoMode === 'fullscreen' || scrollVideoMode === 'exiting') ? 'grid' : 'none',
            pointerEvents: (scrollVideoMode === 'fullscreen' || scrollVideoMode === 'exiting') ? 'auto' : 'none'
          }}
        >
          <video
            ref={scrollVideoFullscreenRef}
            src="/Videos/coffee_concentrate_with_glass.mp4"
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
        </section>,
        document.body
      )}
    </div>
  );
}

export default DesktopHomePage;
