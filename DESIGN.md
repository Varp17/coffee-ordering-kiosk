---
name: Chilld Coffee
colors:
  surface: '#ffffff'
  surface-dim: '#f5f9fc'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f9fc'
  surface-container: '#ffffff'
  surface-container-high: '#f5f9fc'
  surface-container-highest: '#e2e8f0'
  on-surface: '#1f2a44'
  on-surface-variant: '#4a5568'
  inverse-surface: '#1f2a44'
  inverse-on-surface: '#ffffff'
  outline: '#e2e8f0'
  outline-variant: '#edf2f7'
  surface-tint: '#007aff'
  primary: '#007aff'
  on-primary: '#ffffff'
  primary-container: '#e6f4ff'
  on-primary-container: '#007aff'
  inverse-primary: '#0056b3'
  secondary: '#c67c4e'
  on-secondary: '#ffffff'
  secondary-container: '#f5f9fc'
  on-secondary-container: '#c67c4e'
  tertiary: '#1f2a44'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f3d5d'
  on-tertiary-container: '#e6f4ff'
  error: '#d94f4f'
  on-error: '#ffffff'
  error-container: '#f5f9fc'
  on-error-container: '#d94f4f'
  background: '#ffffff'
  on-background: '#1f2a44'
  surface-variant: '#f5f9fc'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Outfit
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 8px
  DEFAULT: 12px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system for **Chilld Coffee** represents a perfect balance of **artisanal coffee culture** and **modern tech integration**. The brand colors combine digital-first aesthetics with organic tones, creating a welcoming, high-performance web kiosk application.

The design features a **Clean Light Aesthetic** using plenty of white space, subtle background separation, and interactive floating elements that emphasize the premium, custom nature of the ordering experience.

## Colors
The palette is designed for high accessibility and strong visual identity:
- **Primary Blue:** `#007AFF` represents technology, reliability, and precision. It is used for major interactive elements, navigation markers, and CTA buttons.
- **Accent Coffee Brown:** `#C67C4E` bridges the digital design with coffee heritage, used for highlights, custom recipe features, and warm notifications.
- **Deep Navy Blue:** `#1F2A44` is the default text color, providing high contrast and clean typography without the harshness of pure black.
- **Surface Strategy:** The app uses `#FFFFFF` for main cards and interactive areas, with a soft blue-grey `#F5F9FC` for layout containers and section divisions.

## Typography
The typography strategy leverages **Outfit** for headers to deliver a modern, bold personality, paired with **Inter** for all functional text, options, and layout lists to guarantee readability:
- **Outfit:** Used for headings, titles, product tags, and numerical counts.
- **Inter:** Used for body text, inputs, descriptions, and user settings.

## Layout & Spacing
A responsive grid layout guides the positioning of components:
- **8px Base Grid:** Padding and margin scales are multiples of 8px (12px is used as stack-sm for tight groupings).
- **Desktop Grid:** Features structured rows and columns with a maximum width of 1280px (`--container-xl`).
- **Mobile Grid:** Folds into a vertical single-column layout, ensuring cards and buttons stretch to the margins with touch-friendly heights.

## Depth & Elevation
Depth is utilized to distinguish overlay states:
- **Glassmorphism:** Navigation headers and custom recipe dialogs use backdrop blurs with thin border definitions to feel premium.
- **Shadows:** Very soft navy-tinted shadows are used to float cards off the background surface without creating clutter.

## Shapes
Rounded corners are a primary element of the visual style:
- **Buttons and Inputs:** Use a pill radius (`--radius-full`) or medium radius (`--radius-md`) to feel friendly and modern.
- **Content Cards:** Rounded with `--radius-lg` (16px) or `--radius-xl` (24px) to look soft and cleanly separated.

## Responsive SVG Homepage Layout
To support mobile, tablet, and desktop viewports seamlessly, the homepage integrates a responsive SVG-driven wave architecture:
- **Scalable viewBox:** The main background is wrapped in a responsive SVG with auto-scaling `viewBox` coordinates that adapt without compressing key design elements.
- **Asset Separation:** Clean separation of static backgrounds (vector waves) from dynamic overlay text to allow independent scaling, keeping interface elements like buttons and product grids fully accessible.

## Wavy Animated Marquees
The homepage integrates motion-focused marquee texts that follow the natural curvature of the layout waves:
- **SVG Path Overlay:** Dynamic HTML5/CSS scrolling marquee elements are positioned on top of the waves via SVG `<textPath>` components.
- **Infinite Scroll:** Integrated infinite keyframe animations move the marquee text smoothly from left to right along the curved paths.
- **Clean Background:** The static vector marquee path letters embedded inside the original SVG file are completely removed or cleared to prevent visual duplication and overlapping text.

## 3D Coffee Cup Visualizer (R3F)
The coffee builder incorporates an interactive 3D rendering canvas built with **React Three Fiber (R3F)**:
- **Dynamic Layers:** Liquid, foam, toppings, and ice are represented as separate 3D meshes stacked inside a glass cup container.
- **State Integration:** The visualizer reads selection data from the builder store, updating colors, scales, and ingredient visibilities in real-time.
- **Micro-interactions:** Subtle hover rotations and physics-based collision approximations are implemented to make the customized coffee cup feel tactile and premium.
