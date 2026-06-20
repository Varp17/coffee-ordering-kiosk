import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import './HomePage.css';

export default function HomePage() {
  const { isLoggedIn } = useAuthStore();

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
        />

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

