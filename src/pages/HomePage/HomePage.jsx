import { Link } from 'react-router-dom';
import './HomePage.css';

function WhyMotionOverlay() {
  return (
    <div className="why-motion-overlay" aria-hidden="true">
      <svg className="why-motion-layer" viewBox="0 0 1512 1034" role="presentation">
        <defs>
          <clipPath id="why-photo-built" clipPathUnits="userSpaceOnUse">
            <rect x="68" y="64" width="226" height="290" rx="5" />
          </clipPath>
          <clipPath id="why-photo-bold" clipPathUnits="userSpaceOnUse">
            <rect x="42" y="26" width="205" height="286" rx="8" />
          </clipPath>
          <linearGradient id="why-hourglass-fade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#D8DCE2" />
            <stop offset="100%" stopColor="#A8ADB5" />
          </linearGradient>
        </defs>

        <rect width="1512" height="1034" fill="#FFFFFF" />
        <text
          x="756"
          y="82"
          textAnchor="middle"
          fontFamily="var(--font-heading)"
          fontSize="54"
          fontWeight="850"
          fill="#EFF3F8"
        >
          Why Choose Chilld?
        </text>

        <g className="why-card why-card--built" transform="translate(112 98) rotate(-8 170 245)">
          <g className="why-card__float">
            <rect className="why-tape" x="38" y="16" width="250" height="40" rx="5" />
            <rect x="67" y="63" width="228" height="292" rx="7" fill="#F7F2EA" />
            <image
              href="/images/image5_366_1172.png"
              x="68"
              y="64"
              width="226"
              height="290"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#why-photo-built)"
            />
            <rect className="why-photo-gloss" x="74" y="70" width="72" height="278" rx="4" />
            <text
              x="0"
              y="420"
              fontFamily="var(--font-heading)"
              fontSize="44"
              fontWeight="900"
              fill="#1F2A44"
            >
              Built for the grind
            </text>
            <text
              x="35"
              y="456"
              fontFamily="var(--font-body)"
              fontSize="23"
              fontWeight="700"
              fontStyle="italic"
              fill="#1F2A44"
            >
              <tspan x="35" dy="0">Heavy monday, extra shot, light</tspan>
              <tspan x="35" dy="30">friday, one less. you run the dial</tspan>
            </text>
          </g>
        </g>

        <g className="why-card why-card--bold" transform="translate(500 356) rotate(1 145 200)">
          <g className="why-card__float">
            <rect className="why-tape why-tape--blue" x="25" y="1" width="238" height="34" rx="5" />
            <rect x="41" y="25" width="207" height="288" rx="10" fill="#F7F2EA" />
            <image
              href="/images/image6_366_1172.png"
              x="42"
              y="26"
              width="205"
              height="286"
              preserveAspectRatio="xMinYMid slice"
              clipPath="url(#why-photo-bold)"
            />
            <text
              x="145"
              y="370"
              textAnchor="middle"
              fontFamily="var(--font-heading)"
              fontSize="44"
              fontWeight="900"
              fill="#1F2A44"
            >
              Brewed for the Bold
            </text>
            <text
              x="145"
              y="408"
              textAnchor="middle"
              fontFamily="var(--font-body)"
              fontSize="22"
              fontWeight="700"
              fontStyle="italic"
              fill="#1F2A44"
            >
              <tspan x="145" dy="0">Your order is on no menu, it lives</tspan>
              <tspan x="145" dy="29">in your head. now in your cup</tspan>
            </text>
          </g>
        </g>

        <g className="why-card why-card--time" transform="translate(775 122) rotate(-4 205 225)">
          <g className="why-card__float">
            <path
              className="why-hourglass-cup"
              d="M112 46 H309 L293 386 H128 Z"
              fill="url(#why-hourglass-fade)"
              opacity="0.55"
            />
            <rect className="why-hourglass-lid" x="108" y="0" width="205" height="28" rx="3" />
            <rect className="why-hourglass-lid" x="80" y="26" width="260" height="20" rx="3" />
            <image
              className="why-hourglass-img"
              href="/images/image7_366_1172.png"
              x="120"
              y="58"
              width="175"
              height="258"
              preserveAspectRatio="xMidYMid slice"
            />
            <circle className="why-sand-dot why-sand-dot--top" cx="208" cy="164" r="5" />
            <circle className="why-sand-dot why-sand-dot--bottom" cx="208" cy="220" r="5" />
            <line className="why-sand-stream" x1="208" y1="170" x2="208" y2="226" />
            <text
              x="0"
              y="430"
              fontFamily="var(--font-heading)"
              fontSize="43"
              fontWeight="900"
              fill="#1F2A44"
            >
              Time is Money
            </text>
            <text
              x="12"
              y="468"
              fontFamily="var(--font-body)"
              fontSize="22"
              fontWeight="700"
              fontStyle="italic"
              fill="#1F2A44"
            >
              <tspan x="12" dy="0">Nobody ever got a promotion</tspan>
              <tspan x="12" dy="30">standing in a coffee queue</tspan>
            </text>
          </g>
        </g>

        <g className="why-card why-card--money" transform="translate(1118 356) rotate(8 160 270)">
          <g className="why-card__float">
            <image
              className="why-iced-cup"
              href="/images/image3_366_1172.png"
              x="-2"
              y="0"
              width="308"
              height="460"
              preserveAspectRatio="xMidYMid meet"
            />
            <path
              className="why-cup-swirl"
              d="M79 227 C133 191 170 261 223 220"
              fill="none"
              stroke="#F8E0C0"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.72"
            />
            <text
              x="-70"
              y="520"
              fontFamily="var(--font-heading)"
              fontSize="43"
              fontWeight="900"
              fill="#1F2A44"
            >
              Money is Money
            </text>
            <text
              x="-50"
              y="557"
              fontFamily="var(--font-body)"
              fontSize="21"
              fontWeight="700"
              fontStyle="italic"
              fill="#1F2A44"
            >
              <tspan x="-50" dy="0">Don't pay for pendant lights and</tspan>
              <tspan x="-50" dy="29">latte art, just the coffee.</tspan>
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="homepage-figma-container">
      {/* ── DESKTOP & MOBILE UNIFIED FIGMA SVG LAYOUT ───────────────────────── */}
      <div className="figma-svg-wrapper">
        <object
          data="/Homepage.svg?v=1.7"
          type="image/svg+xml"
          className="figma-svg-object"
          aria-label="Figma Homepage Design"
        />

        <WhyMotionOverlay />

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
              Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy.......
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
              Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy....... Great coffee, made easy.......
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

      {/* Floating beans overlay for micro-motion feel */}
      <div className="beans-overlay-container" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`floating-bean-particle particle-${i}`}
            style={{
              backgroundImage: 'url(/images/image4_366_1172.png)',
              '--left': `${10 + i * 15}%`,
              '--delay': `${i * 0.8}s`,
              '--speed': `${6 + i * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

