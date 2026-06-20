import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import toast from 'react-hot-toast';
import './HomePage.css';

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
  // Hide Static Video Card placeholder (Rect 34)
  const videoRect = svgDoc.querySelector('rect[y="3460"]');
  if (videoRect) {
    videoRect.style.display = 'none';
  }

  // Hide background rect pattern0_366_1172 (image0_366_1172)
  const bgRect = svgDoc.querySelector('rect[fill^="url(#pattern0_366_1172"]');
  if (bgRect) {
    bgRect.style.display = 'none';
  }

  // Hide Static Video Card Play Button
  const pathsList = svgDoc.querySelectorAll('path');
  for (const p of pathsList) {
    const d = p.getAttribute('d') || '';
    if (d.startsWith('M786.321 3804.13')) {
      p.style.display = 'none';
      break;
    }
  }
}

export default function HomePage() {
  const { isLoggedIn } = useAuthStore();
  const getHeroText = useUserStore((state) => state.getHeroText);
  const { displayName, suffix } = useMemo(() => getHeroText(), [getHeroText]);


  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
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

  const handleVideoClick = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(err => console.log('Playback error:', err));
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

  const handleCartClick = () => {
    const cartButton = document.querySelector('.navbar__cart-btn-new');
    if (cartButton) {
      cartButton.click();
    } else {
      toast.success('Opening Cart Drawer...');
    }
  };

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

        {/* ── COFFEESWIRL1 BACKGROUND VIDEO OVERLAY ── */}
        <div className="coffeeswirl-video-bg">
          <video
            src="/Videos/coffeeswirl1.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>



        {/* ── STATIC INLINE VIDEO CARD OVERLAY ── */}
        <div
          className="scroll-video-wrapper"
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
              onClick={handleVideoClick}
              className="fullscreen-scroll-video"
            />
            {isPaused && (
              <div className="video-play-overlay" onClick={handleVideoClick}>
                <svg viewBox="0 0 24 24" fill="white" width="64" height="64">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
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
            dy="-10"
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

        {/* RajPresso Mix Card */}
        <Link
          to="/menu/p013"
          className="homepage-link link-mix-1"
          style={{ left: '5.29%', top: '66.85%', width: '19.44%', height: '6.00%', borderRadius: '8px' }}
          title="Order RajPresso"
        />

        {/* Vandy Mood Mocha Mix Card */}
        <Link
          to="/menu/p014"
          className="homepage-link link-mix-2"
          style={{ left: '28.31%', top: '66.85%', width: '19.44%', height: '6.00%', borderRadius: '8px' }}
          title="Order Vandy Mood Mocha"
        />

        {/* Kishorappe Mix Card */}
        <Link
          to="/menu/p015"
          className="homepage-link link-mix-3"
          style={{ left: '51.32%', top: '66.85%', width: '19.44%', height: '6.00%', borderRadius: '8px' }}
          title="Order Kishorappe"
        />

        {/* RishiLatte Mix Card */}
        <Link
          to="/menu/p016"
          className="homepage-link link-mix-4"
          style={{ left: '74.34%', top: '66.85%', width: '19.44%', height: '6.00%', borderRadius: '8px' }}
          title="Order RishiLatte"
        />

        {/* Create Your Recipe Button */}
        <Link
          to="/build"
          className="homepage-link link-trending-build"
          style={{ left: '43.12%', top: '74.50%', width: '13.82%', height: '0.60%' }}
          title="Create Your Recipe"
        />

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
    </div>
  );
}

