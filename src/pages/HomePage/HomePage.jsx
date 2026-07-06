import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useUserStore } from '@/store/useUserStore';
import './HomePage.css';
import { PRODUCTS } from '@/data/products';
import WhyChilldCup, { WHY_CHILLD_ITEMS } from '@/components/WhyChilldCup/WhyChilldCup';
const coffeeCup = '/images/iced-coffee-cup.webp';
import TestimonialsBento from '@/components/TestimonialsBento/TestimonialsBento';
import Footer from '@/components/Footer/Footer';

const Dot = ({ active = false }) => (
  <span className={active ? 'is-active' : ''} aria-hidden="true" />
);

const SKIPPED_HERO_SLIDES = [
  {
    name: 'Vandy',
    suffix: 'Brew',
    formula: '/ "Vandana" + "Cold Brew" /',
  },
  {
    name: 'Preri',
    suffix: 'Appe',
    formula: '/ "Prerita" + "Frappe" /',
  },
  {
    name: 'Rishi',
    suffix: 'Latte',
    formula: '/ "Rishima" + "Latte" /',
  },
];

function SkippedHomeHeroOverlay() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % SKIPPED_HERO_SLIDES.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  const slide = SKIPPED_HERO_SLIDES[activeSlide];

  return (
    <div className="homepage-skip-overlay">
      <section className="neha-hero" aria-labelledby="neha-title">
        <img
          className="neha-hero__subtract-bg"
          src="/Subtract (1).svg"
          alt=""
          aria-hidden="true"
        />

        <div className="neha-hero__copy">
          <h1 id="neha-title" className="neha-logo" key={slide.name}>
            {slide.name}<span>{slide.suffix}</span>
          </h1>
          <p className="neha-tagline">{slide.formula}</p>
          <h2>Code your own Coffee</h2>

          <div className="hero-dots" aria-label={`Slide ${activeSlide + 1} of ${SKIPPED_HERO_SLIDES.length}`}>
            {SKIPPED_HERO_SLIDES.map((item, index) => (
              <Dot key={item.name} active={index === activeSlide} />
            ))}
          </div>
        </div>

        <img
          className="neha-hero__coffee"
          src={coffeeCup}
          alt="Iced coffee"
          width="632"
          height="1000"
          fetchPriority="high"
        />

      </section>
    </div>
  );
}

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
      .catch(() => { });
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

  const textContent = textElem.textContent || '';
  const charCount = textContent.replace(/\s/g, '').length;

  // Limit maximum font size for short text to prevent it from being too tall and touching the header
  let allowedMaxFontSize = maxFontSize;
  if (charCount <= 5) {
    allowedMaxFontSize = 230;
  } else if (charCount === 6) {
    allowedMaxFontSize = 260;
  } else if (charCount === 7) {
    allowedMaxFontSize = 290;
  } else if (charCount === 8) {
    allowedMaxFontSize = 320;
  } else if (charCount === 9) {
    allowedMaxFontSize = 350;
  }

  textElem.setAttribute('font-size', String(allowedMaxFontSize));

  const measuredWidth = textElem.getComputedTextLength();

  if (!Number.isFinite(measuredWidth) || measuredWidth <= 0) return;

  const fittedFontSize = Math.max(
    minFontSize,
    Math.min(allowedMaxFontSize, allowedMaxFontSize * (maxTextWidth / measuredWidth))
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

  // Match the footer background above the wave with the upped light blue color (#eaf5ff)
  const footerBgRects = Array.from(svgDoc.querySelectorAll('rect')).filter(r => {
    const transform = r.getAttribute('transform') || '';
    const y = r.getAttribute('y') || '';
    const normTransform = transform.trim().replace(/[\s,]+/g, ' ');
    return normTransform.includes('translate(0 7193)') || y === '7193';
  });
  footerBgRects.forEach(r => {
    r.setAttribute('fill', '#eaf5ff');
  });
}

function injectWhyChilldBackground(svgDoc) {
  const smoothWhyChilldWaveD =
    'M1512 2237.6C1390 2184 1277 2129 1134 2129C1004 2129 884 2184 756 2210C626 2236 505 2235 378 2209C249 2182 124 2126 0 2069.6V2372H1512V2237.6Z';

  // 1. Find the wave path using robust normalization (handles any space/comma serialization)
  const wavePath = Array.from(svgDoc.querySelectorAll('path')).find(p => {
    const d = p.getAttribute('d') || '';
    const norm = d.trim().replace(/[\s,]+/g, ' ');
    return norm.startsWith('M 1512 2237.6') || norm.startsWith('M1512 2237.6');
  });

  // 2. Find the rect below the wave using robust transform and y coordinates
  const bgRect = Array.from(svgDoc.querySelectorAll('rect')).find(r => {
    const transform = r.getAttribute('transform') || '';
    const y = r.getAttribute('y');
    const fill = r.getAttribute('fill') || '';

    const normTransform = transform.trim().replace(/[\s,]+/g, ' ');
    const hasCorrectTransform = normTransform.includes('translate(0 2372)');
    const hasCorrectY = (y === '2372');
    const isWhite = (fill === 'white' || fill.toUpperCase() === '#FFFFFF');

    return (hasCorrectTransform || hasCorrectY) && isWhite;
  });

  // 3. Find the rect further below
  const bgRect2 = Array.from(svgDoc.querySelectorAll('rect')).find(r => {
    const transform = r.getAttribute('transform') || '';
    const y = r.getAttribute('y');
    const fill = r.getAttribute('fill') || '';

    const normTransform = transform.trim().replace(/[\s,]+/g, ' ');
    const hasCorrectTransform = normTransform.includes('translate(0 3360)');
    const hasCorrectY = (y === '3360');
    const isWhite = (fill === 'white' || fill.toUpperCase() === '#FFFFFF');

    return (hasCorrectTransform || hasCorrectY) && isWhite;
  });

  if (!wavePath || !bgRect) return;

  // Change fills of original background shapes to light blue (#eaf5ff)
  wavePath.setAttribute('d', smoothWhyChilldWaveD);
  wavePath.setAttribute('fill', '#eaf5ff');
  bgRect.setAttribute('fill', '#eaf5ff');
  if (bgRect2) {
    bgRect2.setAttribute('fill', '#eaf5ff');
  }

  // Create clipPath
  const defs = svgDoc.querySelector('defs');
  if (defs) {
    let clipPath = svgDoc.getElementById('why-chilld-bg-clip');
    if (!clipPath) {
      clipPath = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPath.setAttribute('id', 'why-chilld-bg-clip');
      defs.appendChild(clipPath);
    }

    while (clipPath.firstChild) {
      clipPath.removeChild(clipPath.firstChild);
    }

    const waveClone = wavePath.cloneNode(true);
    waveClone.removeAttribute('fill');
    waveClone.removeAttribute('style');
    waveClone.removeAttribute('id');
    clipPath.appendChild(waveClone);

    const rectClone = bgRect.cloneNode(true);
    rectClone.removeAttribute('fill');
    rectClone.removeAttribute('style');
    rectClone.removeAttribute('id');
    clipPath.appendChild(rectClone);

    if (bgRect2) {
      const rect2Clone = bgRect2.cloneNode(true);
      rect2Clone.removeAttribute('fill');
      rect2Clone.removeAttribute('style');
      rect2Clone.removeAttribute('id');
      clipPath.appendChild(rect2Clone);
    }
  }

  // Add the single background pattern image
  if (!svgDoc.querySelector('[data-why-chilld-bg-pattern="true"]')) {
    const singleBgImage = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'image');
    singleBgImage.setAttribute('data-why-chilld-bg-pattern', 'true');
    singleBgImage.setAttribute('href', '/Subtract%20copy.svg');
    singleBgImage.setAttribute('x', '-1512');
    singleBgImage.setAttribute('y', '2069.6');
    singleBgImage.setAttribute('width', '1512');
    singleBgImage.setAttribute('height', '1390.4'); // 3460 - 2069.6 = 1390.4
    singleBgImage.setAttribute('transform', 'scale(-1, 1)');
    singleBgImage.setAttribute('clip-path', 'url(#why-chilld-bg-clip)');
    singleBgImage.setAttribute('opacity', '0.42');
    singleBgImage.setAttribute('style', 'mix-blend-mode: multiply;');

    wavePath.parentNode.insertBefore(singleBgImage, wavePath.nextSibling);
  }
}

function injectB2bGraffiti(svgDoc) {
  const b2bRect = svgDoc.querySelector('rect[y="6516"][fill="#E6F4FF"]');
  if (!b2bRect) return;

  const rectX = b2bRect.getAttribute('x') || '80';
  const rectY = b2bRect.getAttribute('y') || '6516';
  const rectW = b2bRect.getAttribute('width') || '1352';
  const rectH = b2bRect.getAttribute('height') || '617';

  const defs = svgDoc.querySelector('defs');
  if (defs) {
    // 1. Create linear gradient for the mask
    let gradient = svgDoc.getElementById('b2b-graffiti-fade');
    if (!gradient) {
      gradient = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', 'b2b-graffiti-fade');
      gradient.setAttribute('x1', '0');
      gradient.setAttribute('y1', '0');
      gradient.setAttribute('x2', '1');
      gradient.setAttribute('y2', '0');

      const stop1 = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', 'white');
      stop1.setAttribute('stop-opacity', '1.0');

      const stop2 = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', 'white');
      stop2.setAttribute('stop-opacity', '0.0');

      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
    }

    // 2. Create mask using the gradient
    let mask = svgDoc.getElementById('b2b-graffiti-mask');
    if (!mask) {
      mask = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'mask');
      mask.setAttribute('id', 'b2b-graffiti-mask');

      const maskRect = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect');
      maskRect.setAttribute('x', rectX);
      maskRect.setAttribute('y', rectY);
      maskRect.setAttribute('width', rectW);
      maskRect.setAttribute('height', rectH);
      maskRect.setAttribute('fill', 'url(#b2b-graffiti-fade)');

      const transform = b2bRect.getAttribute('transform');
      if (transform) maskRect.setAttribute('transform', transform);

      mask.appendChild(maskRect);
      defs.appendChild(mask);
    }
  }

  // 3. Inject the single image with the mask
  if (!svgDoc.querySelector('[data-b2b-graffiti-overlay="true"]')) {
    const overlayImage = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'image');
    overlayImage.setAttribute('data-b2b-graffiti-overlay', 'true');
    overlayImage.setAttribute('href', '/images/mobile-home/Subtract.svg');
    overlayImage.setAttribute('x', rectX);
    overlayImage.setAttribute('y', rectY);
    overlayImage.setAttribute('width', rectW);
    overlayImage.setAttribute('height', rectH);
    overlayImage.setAttribute('mask', 'url(#b2b-graffiti-mask)');
    overlayImage.setAttribute('opacity', '0.7');

    const rx = b2bRect.getAttribute('rx');
    const ry = b2bRect.getAttribute('ry');
    if (rx) overlayImage.setAttribute('rx', rx);
    if (ry) overlayImage.setAttribute('ry', ry);

    const transform = b2bRect.getAttribute('transform');
    if (transform) overlayImage.setAttribute('transform', transform);

    b2bRect.parentNode.insertBefore(overlayImage, b2bRect.nextSibling);
  }
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

function SkipHomepageMiddleFlow() {
  const whySectionRef = useRef(null);
  const featureVideoSectionRef = useRef(null);
  const featureVideoRef = useRef(null);
  const featureVideoExpandedRef = useRef(false);
  const featureVideoLastScrollYRef = useRef(0);
  const featureVideoScrollDirectionRef = useRef('down');
  const featureVideoScrollDeltaRef = useRef(0);
  const touchStartYRef = useRef(null);
  const featureVideoDismissedRef = useRef(false);
  const [whyVisible, setWhyVisible] = useState(false);
  const [featureVideoExpanded, setFeatureVideoExpanded] = useState(false);

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
    const section = featureVideoSectionRef.current;
    const video = featureVideoRef.current;
    if (!section || !video) return undefined;

    const collapseVideo = (wasNaturalEnd = false) => {
      const scrollDirection = featureVideoScrollDirectionRef.current;
      featureVideoExpandedRef.current = false;
      featureVideoScrollDeltaRef.current = 0;
      featureVideoDismissedRef.current = true;
      video.muted = true;
      video.loop = true;
      try {
        video.play();
      } catch (e) {
        console.error(e);
      }
      setFeatureVideoExpanded(false);

      if (!wasNaturalEnd) {
        if (scrollDirection === 'down') {
          window.setTimeout(() => {
            const lowerFlow = document.querySelector('[data-homepage-lower-flow-start="true"]');
            if (!lowerFlow) return;

            const lowerFlowTop = lowerFlow.getBoundingClientRect().top + window.scrollY;
            const revealOffset = Math.min(window.innerHeight * 0.62, 580);

            window.scrollTo({
              top: Math.max(0, lowerFlowTop - revealOffset),
              behavior: 'smooth',
            });
          }, 120);
        } else if (scrollDirection === 'up') {
          window.requestAnimationFrame(() => {
            document.querySelector('[data-homepage-feature-video-return="true"]')?.scrollIntoView({
              block: 'center',
              behavior: 'smooth',
            });
          });
        }
      }
    };

    const expandVideo = () => {
      if (featureVideoExpandedRef.current || featureVideoDismissedRef.current) return;

      featureVideoExpandedRef.current = true;
      featureVideoScrollDeltaRef.current = 0;
      setFeatureVideoExpanded(true);

      try {
        video.loop = false;
        // Keep the playback continuous during expansion by not resetting currentTime to 0
        video.muted = false;
        video.volume = 1;
        video.play();
      } catch {
        // Autoplay can be blocked in some browser states; the layout interaction should still work.
      }
    };

    const shouldExpandVideo = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (featureVideoScrollDirectionRef.current === 'up') {
        return rect.bottom >= viewportHeight * 0.82 && rect.top <= viewportHeight * 0.45;
      }

      return rect.top <= viewportHeight * 0.38 && rect.bottom >= viewportHeight * 0.72;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          featureVideoDismissedRef.current = false;
          return;
        }

        if (shouldExpandVideo()) {
          expandVideo();
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.35,
      }
    );

    const handleWheel = (event) => {
      const nextScrollY = window.scrollY;
      const direction = event.deltaY < 0 ? 'up' : 'down';
      featureVideoScrollDirectionRef.current = direction;
      featureVideoLastScrollYRef.current = nextScrollY;

      if (!featureVideoExpandedRef.current) {
        window.requestAnimationFrame(() => {
          if (shouldExpandVideo()) {
            expandVideo();
          }
        });
        return;
      }

      event.preventDefault();

      // Accumulate scroll delta
      featureVideoScrollDeltaRef.current += event.deltaY;
      const wheelThreshold = 240;
      if (Math.abs(featureVideoScrollDeltaRef.current) >= wheelThreshold) {
        const netDirection = featureVideoScrollDeltaRef.current > 0 ? 'down' : 'up';
        featureVideoScrollDirectionRef.current = netDirection;
        collapseVideo(false);
      }
    };

    const handleTouchStart = (event) => {
      if (event.touches.length > 0) {
        touchStartYRef.current = event.touches[0].clientY;
      }
    };

    const handleTouchMove = (event) => {
      const nextScrollY = window.scrollY;
      const direction = nextScrollY < featureVideoLastScrollYRef.current ? 'up' : 'down';
      featureVideoLastScrollYRef.current = nextScrollY;

      if (!featureVideoExpandedRef.current) {
        window.requestAnimationFrame(() => {
          if (shouldExpandVideo()) {
            expandVideo();
          }
        });
        return;
      }

      event.preventDefault();

      if (event.touches.length > 0 && touchStartYRef.current !== null) {
        const currentY = event.touches[0].clientY;
        const deltaY = touchStartYRef.current - currentY;
        const touchThreshold = 100;

        if (Math.abs(deltaY) >= touchThreshold) {
          const netDirection = deltaY > 0 ? 'down' : 'up';
          featureVideoScrollDirectionRef.current = netDirection;
          collapseVideo(false);
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    const handleVideoClick = () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    };

    const handleEnded = () => {
      if (featureVideoExpandedRef.current) {
        collapseVideo(true);
      }
    };

    featureVideoLastScrollYRef.current = window.scrollY;
    observer.observe(section);
    video.addEventListener('click', handleVideoClick);
    video.addEventListener('ended', handleEnded);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      observer.disconnect();
      video.removeEventListener('click', handleVideoClick);
      video.removeEventListener('ended', handleEnded);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
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
        <svg
          className="skip-hard-part__top-wave"
          viewBox="0 0 1440 340"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <path
              id="skip-hard-part-wave-text"
              d="M-220,295 C40,175 220,95 430,85 S770,95 930,135 S1220,205 1460,185 S1740,120 1980,70"
            />
            <path
              id="skip-hard-part-wave-text-offset"
              d="M-220,335 C40,215 220,135 430,125 S770,135 930,175 S1220,245 1460,225 S1740,160 1980,110"
            />
          </defs>
          <text className="skip-hard-part__top-wave-text">
            <textPath href="#skip-hard-part-wave-text-offset" startOffset="-8%">
              Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......
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
          <p className="skip-hard-part__quote">{"\u201CCoffee is too much work\u201D"}</p>
          <p className="skip-hard-part__simple">
            If you can make lemonade or iced-water, this is a walk in the park.
          </p>
          <p className="skip-hard-part__closing">
            Chilld is built for people who like things their way. From milk choices to sweetness levels, every drink is designed
            by you. No complicated menus. Just cold coffee made for your mood, your routine, and your kind of day.
          </p>
          <div className="skip-hard-part__actions">
            <Link to="/build" className="skip-hard-part__primary">Cold Brew Concentrate</Link>
            <Link to="/recipes" className="skip-hard-part__secondary">Explore Recipes</Link>
          </div>
        </div>

        <svg
          className="skip-hard-part__bottom-wave"
          viewBox="0 0 1512 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 46 C178 96 348 138 532 137 C724 136 850 82 1026 82 C1210 82 1336 130 1512 176 L1512 220 L0 220 Z"
            fill="#ffffff"
          />
        </svg>
      </section>

      <section
        ref={whySectionRef}
        className={`skip-why-chilld${whyVisible ? ' is-visible' : ''}`}
        aria-labelledby="skip-why-chilld-title"
        data-homepage-feature-video-return="true"
      >
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

      <section
        ref={featureVideoSectionRef}
        className={`skip-feature-video${featureVideoExpanded ? ' is-expanded' : ''}`}
        aria-label="Chilld cold brew concentrate video"
      >
        <video
          ref={featureVideoRef}
          src="/Videos/coffee_concentrate_with_glass.mp4"
          autoPlay
          loop={!featureVideoExpanded}
          muted
          playsInline
          preload="metadata"
        />
      </section>
    </>
  );
}

function HomepageLowerFlow() {
  return (
    <section
      className="homepage-lower-flow"
      aria-label="Chilld social proof and cafe offer"
      data-homepage-lower-flow-start="true"
    >
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
            <span>‹</span>
            <span>›</span>
          </div>
          <p>
            Tag your mix with <strong>#MadeByYou</strong>
          </p>
          <Link to="/build" className="lower-flow-trending__button">
            Create your Recipe
          </Link>
        </div>
      </section>

      <section className="lower-flow-b2b" aria-labelledby="lower-flow-b2b-title">
        <div className="lower-flow-b2b__content">
          <h2 id="lower-flow-b2b-title">Premium Cold Brew for your Restaurant &amp; Cafe</h2>
          <p>Tailored Solutions for Cloud Kitchens, bars, restaurants and caterers</p>

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
              <dt>Many</dt>
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
            <a href="tel:+918693852250">Call +91 86938 52250</a>
          </div>
        </div>

        <div className="lower-flow-b2b__visual" aria-hidden="true">
          <img
            src="/images/CPB.png"
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

const COFFEE_HERO_ASSETS = {
  AMERICANO: {
    image: '/images/Images/kaffee-meister-BIeXZhg_7sw-unsplash.jpg',
    attribution: 'Photo by Kaffee Meister on Unsplash'
  },
  AFFOGATO: {
    image: '/images/Images/affogato.jpg',
    attribution: 'designed by <a href="https://www.magnific.com" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">Freepik - Magnific.com</a>'
  },
  FRAPPE: {
    image: '/images/Images/frappe.jpg',
    attribution: 'designed by <a href="https://www.magnific.com" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">muhammad.abdullah - Magnific.com</a>'
  },
  LATTE: {
    image: '/images/Images/circle-digital-marketing-agency-onzvnHqx6nc-unsplash.jpg',
    attribution: 'designed by <a href="https://www.magnific.com" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">muhammad.abdullah - Magnific.com</a>'
  },
  VIETNAMESE: {
    image: '/images/Images/andrew-valdivia-mMI5sdLFoHM-unsplash.jpg',
    attribution: 'Photo by Andrew Valdivia on Unsplash'
  },
  CORTADO: {
    image: '/images/Images/cortado.jpg',
    attribution: 'designed by <a href="https://www.magnific.com" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">jcomp - Magnific.com</a>'
  },
  COLDBREW: {
    image: '/images/Images/coldbrew.jpg',
    attribution: 'designed by <a href="https://www.magnific.com" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">muhammad.abdullah - Magnific.com</a>'
  },
  ESPRESSO: {
    image: '/images/Images/espresso.jpg',
    attribution: 'designed by <a href="https://www.magnific.com" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">nuraghies - Magnific.com</a>'
  }
};

function DesktopHomePage() {
  const getHeroText = useUserStore((state) => state.getHeroText);
  const { displayName, suffix } = useMemo(() => getHeroText(), [getHeroText]);
  const coffeeType = useUserStore((state) => state.coffeeType);
  const skippedWelcome = useUserStore((state) => state.skippedWelcome);

  const selectedAsset = useMemo(() => {
    return coffeeType ? COFFEE_HERO_ASSETS[coffeeType] : null;
  }, [coffeeType]);


  const videoRef = useRef(null);
  const scrollVideoTriggerRef = useRef(null);
  const scrollVideoFullscreenRef = useRef(null);
  const scrollVideoModeRef = useRef('inline');
  const scrollVideoExitTimerRef = useRef(null);
  const scrollVideoDismissedRef = useRef(false);
  const scrollVideoWheelDeltaRef = useRef(0);
  const scrollVideoTouchStartYRef = useRef(null);
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
  const [isWhyChilldVisible, setIsWhyChilldVisible] = useState(false);

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

  const dismissScrollVideo = () => {
    scrollVideoDismissedRef.current = true;
    updateScrollVideoMode('exiting');
    window.clearTimeout(scrollVideoExitTimerRef.current);
    scrollVideoExitTimerRef.current = window.setTimeout(() => {
      updateScrollVideoMode('after');
    }, 560);
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

      // If we scroll back up above the trigger, reset dismissal and set to inline
      if (triggerTop > enterLine + 50) {
        scrollVideoDismissedRef.current = false;
        updateScrollVideoMode('inline');
        return;
      }

      if (scrollVideoDismissedRef.current) {
        updateScrollVideoMode('after');
        return;
      }

      // Trigger fullscreen when trigger reaches enterLine
      if (scrollVideoModeRef.current === 'inline' && triggerTop <= enterLine) {
        updateScrollVideoMode('fullscreen');
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
      if (scrollVideoMode === 'fullscreen') {
        // Sync currentTime from inline video to fullscreen video for continuous playback
        if (inlineVideo) {
          fullscreenVideo.currentTime = inlineVideo.currentTime;
        }
        fullscreenVideo.muted = false;
        fullscreenVideo.volume = 1;
        scrollVideoWheelDeltaRef.current = 0;
        scrollVideoTouchStartYRef.current = null;
      } else {
        // Sync currentTime back from fullscreen video to inline video when exiting
        if (inlineVideo) {
          inlineVideo.currentTime = fullscreenVideo.currentTime;
        }
        fullscreenVideo.muted = true;
      }
      fullscreenVideo.play().catch(() => { });
    }
    pauseResetTimer = window.setTimeout(() => setIsPaused(false), 0);

    return () => window.clearTimeout(pauseResetTimer);
  }, [scrollVideoMode]);

  // ended event is handled via the onEnded prop on the video tag directly

  // Fullscreen video scroll-lock and delta-based exit listeners
  useEffect(() => {
    const handleFullscreenWheel = (event) => {
      if (scrollVideoModeRef.current !== 'fullscreen') return;

      // Lock scroll while fullscreen video is active
      event.preventDefault();

      // Accumulate wheel scroll delta
      scrollVideoWheelDeltaRef.current += event.deltaY;
      const wheelThreshold = 240;
      if (Math.abs(scrollVideoWheelDeltaRef.current) >= wheelThreshold) {
        dismissScrollVideo();
      }
    };

    const handleFullscreenTouchStart = (event) => {
      if (scrollVideoModeRef.current !== 'fullscreen') return;
      if (event.touches.length > 0) {
        scrollVideoTouchStartYRef.current = event.touches[0].clientY;
      }
    };

    const handleFullscreenTouchMove = (event) => {
      if (scrollVideoModeRef.current !== 'fullscreen') return;

      // Lock swipe scroll while fullscreen video is active
      event.preventDefault();

      if (event.touches.length > 0 && scrollVideoTouchStartYRef.current !== null) {
        const currentY = event.touches[0].clientY;
        const deltaY = scrollVideoTouchStartYRef.current - currentY;
        const touchThreshold = 100;
        if (Math.abs(deltaY) >= touchThreshold) {
          dismissScrollVideo();
        }
      }
    };

    const handleFullscreenTouchEnd = () => {
      scrollVideoTouchStartYRef.current = null;
    };

    window.addEventListener('wheel', handleFullscreenWheel, { passive: false });
    window.addEventListener('touchstart', handleFullscreenTouchStart, { passive: true });
    window.addEventListener('touchmove', handleFullscreenTouchMove, { passive: false });
    window.addEventListener('touchend', handleFullscreenTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleFullscreenWheel);
      window.removeEventListener('touchstart', handleFullscreenTouchStart);
      window.removeEventListener('touchmove', handleFullscreenTouchMove);
      window.removeEventListener('touchend', handleFullscreenTouchEnd);
    };
  }, []);

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
              const shift = Math.max(0, distanceFromCenter * cupSpeeds[i - 1]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWhyChilldVisible(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const section = document.querySelector('.desktop-homepage__why-chilld');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  useEffect(() => () => {
    window.clearTimeout(carouselResumeTimerRef.current);
  }, []);

  return (
    <div className={`homepage-figma-container${skippedWelcome ? ' homepage-figma-container--skip' : ''}`}>
      {skippedWelcome && (
        <div className="skip-homepage-flow">
          <SkippedHomeHeroOverlay />
          <SkipHomepageMiddleFlow />
          <HomepageLowerFlow />
        </div>
      )}
      {/* {!skippedWelcome && selectedAsset && (
        <div
          className="hero-image-attribution"
          style={{
            position: 'absolute',
            left: '24px',
            top: 'calc(7.4074vw + 24px)',
            zIndex: 15,
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'Outfit, sans-serif',
            background: 'rgba(31, 42, 68, 0.85)',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            pointerEvents: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: selectedAsset.attribution }}
        />
      )} */}
      {/* ── DESKTOP & MOBILE UNIFIED FIGMA SVG LAYOUT ───────────────────────── */}
      {!skippedWelcome && (
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
                  injectWhyChilldBackground(svgDoc);
                  injectB2bGraffiti(svgDoc);

                  if (selectedAsset) {
                    const pattern = svgDoc.getElementById('pattern3_366_1172') || svgDoc.querySelector('pattern[id^="pattern3_"]');
                    if (pattern) {
                      const imageNode = pattern.querySelector('image');
                      if (imageNode) {
                        imageNode.setAttribute('href', selectedAsset.image);
                      }
                    }
                  }

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

                  if (skippedWelcome) {
                    // Hide elements in the top 1100px (Figma hero cup and beans)
                    try {
                      const svgRoot = svgDoc.querySelector('svg');
                      const allNodes = svgRoot.querySelectorAll('*');
                      allNodes.forEach(node => {
                        try {
                          const bbox = node.getBBox();
                          // 1150px safely hides the cup and beans without hiding the black wave at 1185px
                          if (bbox && bbox.y < 1150 && bbox.height > 0) {
                            node.style.display = 'none';
                          }
                        } catch { /* ignore */ }
                      });
                    } catch { /* safety net */ }
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
                    bgRect.setAttribute('y', '2000');
                    bgRect.setAttribute('width', '1512');
                    bgRect.setAttribute('height', '1460');
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

            <section className="desktop-homepage__why-chilld" aria-label="Why CHILLD">
              <div className={`desktop-homepage__why-chilld-content${isWhyChilldVisible ? ' visible' : ''}`}>
                <h2 className="desktop-homepage__why-chilld-title">Why Chilld?</h2>
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
                    style={{ opacity: 0.86 }}
                  />
                  <div
                    className="hard-part-video-overlay"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.65) 25%, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0.5) 100%)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── HARD-PART TEXT OVERLAY — Clean classes matching Figma reference ── */}
            <div className="hard-part-copy-overlay">
              {/* ── Big heading ── */}
              <h2 className="hard-part-heading">
                We handled the hard part, the fun part's on you
              </h2>

              {/* ── Horizontal divider ── */}
              <div className="hard-part-divider" />

              {/* ── Body paragraphs ── */}
              <p className="hard-part-paragraph">
                We get you exceptional coffee concentrate. We take care of the nitty-gritties of sourcing, grinding and brewing.
                After that, you are free to tailor your daily coffee to your liking. Add water, if you are in a hurry for your
                presentation. Add syrup, milk, experiment with everyday ingredients in your kitchen, if you feel like it.
              </p>
              <p className="hard-part-paragraph">
                If you've been on-call all night, add an extra spoon of our cold brew concentrate. If you get jittery but
                enjoy the occasional pick-me-up, add a spoon less. No one's judging you.
              </p>
              <p className="hard-part-paragraph hard-part-paragraph-spaced">
                We guarantee that it will taste good; we promise that it won't eat into your wallet.
              </p>

              {/* ── Italic quote heading ── */}
              <p className="hard-part-quote">
                {"\u201CCoffee is too much work\u201D"}
              </p>

              <p className="hard-part-paragraph">
                If you can make lemonade or iced-water, this is a walk in the park.
              </p>
              <p className="hard-part-paragraph hard-part-paragraph-large-gap">
                Chilld is built for people who like things their way. From milk choices to sweetness levels, every drink is designed
                by you. No complicated menus. Just cold coffee made for your mood, your routine, and your kind of day.
              </p>

              {/* ── CTA Buttons ── */}
              <div className="hard-part-buttons">
                <Link to="/build" className="hard-part-btn-primary">
                  Cold Brew Concentrate
                </Link>
                <Link to="/recipes" className="hard-part-btn-secondary">
                  Explore Recipes
                </Link>
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
              className={`scroll-video-wrapper ${(scrollVideoMode === 'fullscreen' || scrollVideoMode === 'exiting')
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
                  Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......Great coffee, made easy.......
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
            {!skippedWelcome && (
              <Link
                to="/build"
                className="homepage-link link-hero-build"
                style={{ left: '40.94%', top: '9.58%', width: '18.12%', height: '0.60%' }}
                title="Code Your Own Coffee"
              />
            )}

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
      )}

      {!skippedWelcome && typeof document !== 'undefined' && createPortal(
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
            loop={false}
            muted={scrollVideoMode !== 'fullscreen'}
            playsInline
            preload="auto"
            onEnded={dismissScrollVideo}
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
