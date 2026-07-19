# CHILLD Homepage Motion & Parallax Implementation Specification

## Objective

Transform the existing homepage into a premium, interactive experience
while preserving the existing UI, branding, copy, and layout. This is an
enhancement project---not a redesign.

## Core Principles

-   Preserve the existing design language.
-   Implement premium motion similar to Apple, Stripe, Linear, Framer,
    Vercel, and Arc Browser.
-   Target 60 FPS animations.
-   Prefer GPU-accelerated transforms.
-   Respect `prefers-reduced-motion`.
-   Production-ready, reusable implementation.

## Global Requirements

-   Smooth scrolling throughout the site.
-   Layered parallax.
-   Scroll-triggered reveal animations.
-   Responsive layouts for Mobile, Tablet, Desktop and 4K.
-   Proper image placement.
-   Smooth transitions between sections.
-   Floating mobile CTA.
-   High accessibility and performance.

## Technology

Preferred stack: - GSAP ScrollTrigger + ScrollSmoother - Framer Motion
(where appropriate) - IntersectionObserver - requestAnimationFrame - CSS
transforms - Typed.js (or equivalent) for hero typing effect

## Hero

### Entrance Animation

1.  Navbar fades in.
2.  Background typography fades in.
3.  Coffee cup slides upward from below.
4.  Coffee beans enter from different directions.
5.  Personalized coffee name types character-by-character.
6.  CTA fades in last.

### Parallax

-   Coffee cup: translateY(scroll \* 0.25) with subtle scaling.
-   Coffee beans: independent movement, depth, floating, slight
    rotation.
-   Mouse parallax on desktop.
-   Background typography moves slowly like a watermark.
-   CTA gets premium hover and press micro-interactions.

## Smooth Scroll

Implement buttery smooth scrolling using GSAP ScrollSmoother
(preferred). No jitter, no lag, preserve accessibility.

## Coffee Section

-   Replace static feeling with looping coffee-liquid background video.
-   Dark overlay for readability.
-   Video moves slower than content.
-   Text reveals with fade-up.
-   Buttons animate smoothly.

## Shape Mask Parallax

Where curved SVG shapes exist, place image/video inside masks and
animate the media independently to create depth.

## Wave Divider

Animate subtly with scroll. Preserve the SVG shape.

## Why Chilld

Cards: - Stagger reveal. - Fade + translateY. - Hover lift, shadow, tiny
rotation, slight scale.

## Video Section

-   Pin while scrolling.
-   Expand toward fullscreen.
-   Autoplay (muted, loop).
-   Pause/play on click.
-   Unpin smoothly into the next section.

## Testimonials

-   Auto-slide every 4--6 seconds.
-   Pause on hover.
-   Swipe support on mobile.
-   Independent reveal animations.
-   Slight hover elevation.

## Trending Mixes

-   Auto-slide recipes.
-   Hover lift and scale.
-   Cup image floats upward.
-   Recipe tags animate.
-   Ripple CTA.

## Restaurant Banner

-   Bottle parallax.
-   Independent pattern movement.
-   CTA hover refinement.

## Footer

-   Large Chilld wordmark with slow parallax.
-   Footer fades in naturally.
-   Infinite marquee ("Great coffee, made easy...") with seamless
    looping.

## Responsive Strategy

### Mobile

-   Thoughtfully redesign layouts where Desktop Figma doesn't exist.
-   Comfortable spacing.
-   Correct typography scaling.
-   No clipped images.
-   Sticky floating CTA.
-   Smooth mobile navigation with backdrop blur.
-   Touch-friendly interactions.

### Tablet

-   Dedicated layout.
-   Optimized grids and spacing.

### Desktop

-   Match Figma precisely.

### 4K

-   Constrain content width.
-   Scale decorative assets proportionally.
-   Avoid oversized typography.

## Image Placement

Ensure every image: - Maintains aspect ratio. - Has no clipping or
distortion. - Looks balanced across all breakpoints.

## Motion Guidelines

Animate only: - transform - opacity

Avoid animating: - width - height - margin - padding - top - left

Preferred durations: - 200ms - 300ms - 500ms - 800ms

Preferred easing: - easeOutExpo - easeInOutCubic - easeOutQuart

## Performance

-   60 FPS
-   IntersectionObserver
-   requestAnimationFrame
-   Lazy-loaded media
-   Hardware acceleration
-   Minimal repaint/reflow
-   Lighthouse targets:
    -   Performance 95+
    -   Accessibility 100
    -   Best Practices 100
    -   SEO 100

## Client-Specific Requirements

-   Proper image placement on all devices.
-   Implement parallax exactly as envisioned in Figma.
-   Smooth scrolling everywhere.
-   Better mobile interactivity.
-   Verify Author font usage throughout.
-   Floating mobile CTA.
-   Preserve branding while enhancing UX.

## Acceptance Checklist

-   [ ] Smooth scrolling
-   [ ] Hero entrance animation
-   [ ] Typing animation
-   [ ] Layered parallax
-   [ ] Coffee liquid video background
-   [ ] Shape-mask parallax
-   [ ] Pinned fullscreen video section
-   [ ] Animated wave divider
-   [ ] Animated cards
-   [ ] Auto-sliding testimonials
-   [ ] Auto-sliding recipes
-   [ ] Infinite marquee
-   [ ] Responsive Mobile
-   [ ] Responsive Tablet
-   [ ] Responsive Desktop
-   [ ] Responsive 4K
-   [ ] Floating mobile CTA
-   [ ] Improved navigation
-   [ ] Proper image placement
-   [ ] Accessible motion
-   [ ] Production-ready architecture
