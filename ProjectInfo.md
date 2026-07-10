# CHILLD Coffee — Project Information

> **Agent instructions**: Before working on this project, first check the `.agents/` folder (if present) for skills, knowledge files, and context that may override or supplement this document. If `.agents/` does not exist, rely solely on this file and the codebase.

## Overview
A React-based coffee ordering kiosk application with a 6-step interactive coffee recipe builder, menu browsing, cart management, OTP-based authentication, order placement, and a rich animated homepage. Built with Vite + React 19 + Zustand.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 (JSX, hooks) |
| **Build** | Vite 8 |
| **State** | Zustand 5 (with `persist` middleware) |
| **Routing** | React Router DOM 7 |
| **Animation** | Framer Motion 12, Three.js (R3F via `@react-three/fiber` 9 + `@react-three/drei` 10 + `three` 0.184) |
| **3D Physics** | `@react-three/rapier` 2 |
| **Icons** | Lucide React |
| **Notifications** | react-hot-toast 2 |
| **CSS** | Global design system with CSS custom properties, `clamp()` fluid sizing, Scroll-driven animations |
| **Backend** | REST API (Node.js, deployed on Render) |
| **Auth** | JWT + refresh token, OTP-based phone login |
| **Storage** | localStorage (cart, auth, user preferences) |

---

## Project Structure

```
src/
├── App.jsx                    # Router setup, Toaster config, welcome guard
├── App.css                    # Empty — delegates to styles/global.css
├── index.css                  # Empty — delegates to styles/global.css
├── main.jsx                   # Entry point
├── styles/
│   └── global.css             # Design tokens, CSS reset, utilities, keyframe animations
├── layouts/
│   └── MainLayout.jsx         # Navbar + <main> + Footer + BottomNav wrapper
├── data/
│   ├── recipes.js             # 62 recipe catalog (full menu)
│   ├── products.js            # Product data for store
│   ├── ingredients.js         # Ingredient definitions
│   ├── locations.js           # Store locations
│   └── recommendations.js     # Recommendation engine
├── services/
│   ├── api.js                 # HTTP client (JWT auth, 401 refresh, error handling)
│   ├── auth.js                # Auth API: sendOTP, verifyOTP, refresh, logout
│   └── orders.js              # Order CRUD API
├── store/
│   ├── useAuthStore.js        # Auth state (phone, OTP, login status) — persisted
│   ├── useCartStore.js        # Cart items, add/remove/qty — persisted ("chilld-cart")
│   ├── useUserStore.js        # Welcome onboarding (name, coffeeType, skippedWelcome) — persisted
│   ├── useOrderStore.js       # Order tracking state
│   └── useBuilderStore.js     # Coffee Builder state (6 steps, costs, recipes)
├── pages/
│   ├── WelcomePage/           # Onboarding flow (name + coffee preference)
│   ├── HomePage/              # Main landing — two sub-entries:
│   │   ├── HomePage.jsx       #   Desktop layout (welcome flow / skip flow)
│   │   ├── HomePage.css       #   Desktop styles (~3157 lines)
│   │   ├── MobileHomePage.jsx #   Mobile-first layout (<768px)
│   │   └── MobileHomePage.css #   Mobile styles
│   ├── MenuPage/              # Product listing
│   ├── ProductDetailPage/     # Product detail + add to cart
│   ├── CoffeeBuilderPage/     # 6-step recipe builder (core feature)
│   │   ├── CoffeeBuilderPage.jsx
│   │   ├── CoffeeBuilderPage.css
│   │   ├── StepLayout.css
│   │   └── steps/
│   │       ├── Step1Concentrate.jsx
│   │       ├── Step2Coffee.jsx
│   │       ├── Step3Milk.jsx
│   │       ├── Step4Sweetener.jsx
│   │       ├── Step5Topping.jsx
│   │       └── Step6Review.jsx
│   │   └── CoffeeBuilder/
│   │       └── coffeeRecipes.js    # 77 builder recipes + image maps
│   ├── LocationPage/
│   ├── CheckoutPage/
│   ├── AuthPage/
│   ├── PaymentPage/
│   ├── OrderConfirmPage/
│   ├── ProfilePage/
│   ├── CreateRecipePage/
│   ├── RecipeDetailsPage/
│   │   ├── RecipeDetailsPage.jsx
│   │   ├── MobileRecipeDetailsPage.css
│   │   └── recipe-details-page.css
│   ├── RecipesPage/
│   ├── ContactPage/
│   ├── StorePage/
│   └── B2BPage/
├── components/
│   ├── Navbar/                # Main site navigation
│   ├── BottomNav/             # Mobile bottom navigation bar
│   ├── Footer/                # Footer with links + social icons
│   ├── CartDrawer/             # Slide-in cart drawer with qty controls
│   ├── DeviceLayoutSelector/  # Binary desktop/mobile render selector
│   ├── StepProgressBar/       # 6-step builder progress indicator
│   ├── SizeSelector/          # Drink size picker
│   ├── ProductCard/           # Menu product card
│   ├── IngredientCard/        # Builder ingredient selection card
│   ├── RecipeMedia/           # Recipe image/video display
│   ├── SkippedWelcomeHero/    # Hero for skipped-welcome flow
│   ├── CoffeeCupVisualizer/   # Three.js 3D cup visualization
│   ├── OTPInput/              # Digit-by-digit OTP input
│   ├── Logo/                  # Brand logo component
│   ├── WhyChilldCup/          # "Why Chilld" cup cards (used in all three layouts)
│   └── TestimonialsBento/     # Testimonial/bento grid component
└── utils/
    ├── coffeeBuilder.js        # formatPrice, utility helpers
    ├── apiResponse.js          # Response unwrapping helpers
    ├── animations.js           # Shared Framer Motion variants
    └── deviceDetection.js      # getNativeDeviceMode() with 768px breakpoint
```

---

## Device Detection & Layout Switching

### `src/utils/deviceDetection.js`
```js
export function getNativeDeviceMode() {
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}
```

### `src/components/DeviceLayoutSelector.jsx`
- Listens to window resize events
- Renders `<MobileHomePage />` when `activeMode === 'mobile'`, otherwise renders `<HomePage />` (desktop)
- CSS classes: `site-mode-mobile`, `site-mode-desktop` control overflow/background

---

## Routing (`src/App.jsx`)

| Path | Component | Guard |
|------|-----------|-------|
| `/welcome` | WelcomePage | None (before onboarding) |
| `/` | DeviceLayoutSelector | RequireWelcome |
| `/menu` | MenuPage | RequireWelcome |
| `/menu/:id` | ProductDetailPage | RequireWelcome |
| `/build` | CoffeeBuilderPage | RequireWelcome |
| `/location` | LocationPage | RequireWelcome |
| `/checkout` | CheckoutPage | RequireWelcome |
| `/auth` | AuthPage | RequireWelcome |
| `/payment` | PaymentPage | RequireWelcome |
| `/order-confirm` | OrderConfirmPage | RequireWelcome |
| `/profile` | ProfilePage | RequireWelcome |
| `/create-recipe` | CreateRecipePage | RequireWelcome |
| `/recipes` | RecipesPage | RequireWelcome |
| `/recipe-details/:id` | RecipeDetailsPage | RequireWelcome |
| `/contact` | ContactPage | RequireWelcome |
| `/store` | StorePage | RequireWelcome |
| `/b2b` | B2BPage | RequireWelcome |

**Guard Logic**: `RequireWelcome` checks `useUserStore.hasCompletedWelcome`. If `false`, redirects to `/welcome`. All guarded routes render inside `<MainLayout>`.

---

## HomePage Architecture — Three Layouts

The homepage has three distinct render paths depending on device and user state:

### 1. Desktop Welcome Flow (`!skippedWelcome`, viewport ≥768px)
Uses `/Homepage.svg?v=1.7` as the main canvas via `<object>`, with React components positioned absolutely over it.

**JSX structure:**
```
<div class="homepage-figma-container">
  <div class="figma-svg-wrapper">          <!-- aspect-ratio 1512/8069, clip-path inset header -->
    <div class="figma-svg-content">         <!-- Absolute positioned, extra height for SVG -->
      <object class="figma-svg-object" />   <!-- Homepage.svg with onLoad DOM injection -->
      <section class="desktop-homepage__why-chilld">  <!-- Absolute, 4 WhyChilldCups -->
      <div class="hard-part-shadow-wrapper">          <!-- Parallax video + clip-path wave -->
      <div class="hard-part-copy-overlay">            <!-- "We handled the hard part" + CTA buttons -->
    </div>
    <div class="bento-video-card">          <!-- coffeeswirl1.mp4 -->
    <div class="bento-social-grid">         <!-- Auto-rotating social posts -->
    <div class="trending-mixes-marquee">    <!-- Infinite scroll trending cards -->
    <div class="wavy-marquee-overlay">       <!-- Top/bottom scrolling SVG marquees -->
    <div class="homepage-link overlays">     <!-- Clickable zones over SVG elements -->
  </div>
</div>
```

**SVG DOM manipulation (in `onLoad`):**
- `injectSvgStyles` — injects CSS animations/hover effects into SVG
- `animateSvgCup` — slides hero cup up with parallax wrapper
- `animateHeroBeans` — animated coffee bean entrance + floating
- `injectDynamicHeroText` — typesets user name + drink name with typing effect
- `hideStaticPlaceholders` — removes SVG elements overlapping React overlays
- `compactLowerHomepageSections` — shifts lower SVG content up by 260px
- `injectWhyChilldBackground` — pattern + clip-path for Why Chilld
- `injectB2bGraffiti` — masked graffiti overlay for B2B section
- `wrapCupElements` — parallax + hover wrappers around SVG cups

### 2. Desktop Skip Flow (`skippedWelcome`, viewport ≥768px)
A simpler scrollable layout rendered when the user skipped welcome onboarding.

**Sequence:**
1. `<SkippedHomeHeroOverlay>` — Full-viewport animated hero (Vandy Brew / Preri Appe / Rishi Latte slides, auto-rotating every 2s)
2. `<SkipHomepageMiddleFlow>` — Hard part section (full-width video, wave overlays, copy, CTAs) → Why Chilld (4 WhyChilldCups with staggered reveal) → Feature video (expandable to fullscreen)
3. `<HomepageLowerFlow>` — TestimonialsBento → Trending Mixes carousel → B2B promo → Footer

### 3. Mobile Layout (viewport <768px)
Rendered by `<MobileHomePage>` — a fully independent CSS-animated mobile layout.

**Sections:**
1. Mobile Hero — dynamic name/drink heading, floating coffee beans, cup image, CTA buttons
2. Scrolling marquee — "Great coffee, made easy"
3. Story section — background video + copy + story bullets
4. Why Chilld — grid of 4 WhyChilldCup components
5. Process — "Pour. Mix. Chill." video + copy
6. Social Proof — 7 review cards (Facebook, Amazon, Twitter/X, Reddit, Google Maps)
7. Popular Drinks — horizontal scrolling drink cards
8. Core — "One bottle. Many cups." benefits + CTA
9. Footer

---

## Global Responsiveness

- **Desktop containers**: No `min-width` constraints — `.homepage-figma-container` and `.skip-homepage-flow` scale to 100% viewport width
- **Overflow**: `overflow-x: clip` on all top-level wrappers prevents horizontal overflow
- **Fluid units**: Layout uses `clamp()`, `%`, `vw`, and `dvw` throughout
- **CSS clip-path**: Hard-part section uses percentage-based polygon matching Figma wave boundaries
- **Device breakpoint**: 768px (mobile vs desktop switch)

---

## Store Architecture

### useUserStore (persisted: `chilld-user`)
- **State**: `name`, `coffeeType`, `hasCompletedWelcome`, `skippedWelcome`
- **Actions**: `completeWelcome(name, coffeeType)`, `skipWelcome()`, `getHeroText()` — returns personalized name + coffee suffix for hero display
- **Coffee Types**: ESPRESSO, AMERICANO, CAPPUCCINO, LATTE, COLDBREW, CORTARDO, FRAPPE, AFFOGATO
- **Suffix mapping**: e.g., LATTE → " LATTE", COLDBREW → " BREW"

### useAuthStore (persisted: `chilld-auth`)
- **State**: `isLoggedIn`, `phone`, `userName`, `otpSent`, `otpVerified`
- **Actions**: `sendOTP(phone)` → calls `authService.sendOtp()`, `verifyOTP(otp)` → calls `authService.verifyOtp()` which stores JWT tokens, `logout()`, `resetOTP()`
- **Token storage**: `dc_token` (access), `dc_refresh_token` (refresh)

### useCartStore (persisted: `chilld-cart`)
- **State**: `items[]` — each item has `id`, `name`, `price`, `size`, `image`, `qty`, `cartKey`, `isCustom`, `addons`, `ingredients`
- **Actions**: `addItem(item)` (merges duplicates by id+size+addons), `removeItem(cartKey)`, `updateQty(cartKey, qty)`, `clearCart()`, `getTotalItems()`, `getTotalPrice()`
- **Cart dedup**: Matches on `id`, `size`, and `JSON.stringify(addons)`

### useOrderStore
- **State**: `orders[]`, `currentOrder`, `loading`
- Tracks placed orders

### useBuilderStore
Full 6-step coffee builder state (see dedicated section below).

---

## Coffee Builder — Core Feature

### 6 Steps
| Step | Component | Purpose |
|------|-----------|---------|
| 1 | Step1Concentrate | Select concentrate type (Coffee 50:50, 70:30, Sif, Cascara, 100% Arabica, 60-40) |
| 2 | Step2Coffee | Select recipe drink (77 recipes, filtered by concentrate, paginated 40/page) |
| 3 | Step3Milk | Select milk type (Dairy, Oat, Coconut, Almond) with quantity presets |
| 4 | Step4Sweetener | Select sweetener (Sugar Syrup, Jaggery Syrup) with quantity presets |
| 5 | Step5Topping | Select main topping + extra toppings multi-select |
| 6 | Step6Review | Review all selections, cost breakdown, size selector, name, add to cart |

### Builder Store State
```
step (1-6), direction (1/-1 for animation),
category, selectedRecipe (full recipe object),
concentrateType, concentrateQty,
sweetener, sweetenerQty,
milkType, milkQty,
topping, extraToppings[],
remarks, image,
concentrateCost, sweetenerCost, milkCost, toppingCost,
basePrice (60),
coffeePage (for Step2 pagination),
warnings[]
```

### Cost Model
- **Base price**: ₹60 per drink
- **Concentrate costs**: Coffee 50:50=₹40, 70:30=₹45, Sif=₹35, Cascara=₹50, 100% Arabica=₹55, 60-40=₹42
- **Sweetener costs**: ₹8-15 (Sugar Syrup=₹10, Jaggery=₹12, Honey=₹15, etc.)
- **Milk costs**: Dairy=₹20, Oat=₹30, Coconut=₹25, Almond=₹35
- **Topping costs**: ₹5-15 (Ice Cubes=₹5, Golden Cream=₹15, etc.)
- **Pricing formula**: `baseCost * max(0.5, qty/reference)` where reference is 100 for concentrate/milk, 15 for sweetener/topping
- **Step2 drink costs**: Deterministic pseudo-random (`hashStr(name) % 81 + 120` → ₹120-200)
- **Size modifier**: Standard=₹30, Small=₹0
- **Total**: `basePrice + concentrateCost + sweetenerCost + milkCost + toppingCost + extraToppingsTotal + sizeModifier`

### Recipe Selection Flow
1. Select concentrate on Step1 → filters available recipes on Step2
2. Select recipe on Step2 → auto-fills all ingredient fields via `setSelectedRecipe(recipe)`
3. Auto-fill includes: concentrateType, concentrateQty, sweetener, sweetenerQty, milkType, milkQty, topping, remarks, image
4. Steps 3-5 pre-select recommended values from recipe but allow user changes
5. Changing ingredients triggers warnings ("This change may affect the original flavor balance")
6. Step5 clears auto-filled topping on first mount so user chooses manually

### Multi-Topping (Step5)
- First click → sets as main `topping`
- Subsequent clicks on different items → added to `extraToppings[]` via `addExtraTopping()`
- Clicking again → removes (main or extra)
- Changing main topping → resets extraToppings
- Selection summary: "Primary: X (₹N) + 2 extra (₹M)"

### Recommendations (Step2)
- 3 drinks per concentrate type get "Highly Recommended" badge
- Selected via deterministic hash of concentrate type
- Recommended drinks sorted first in grid

---

## Recipe Data

### `src/data/recipes.js` (62 recipes — full catalog)
- Source: Excel spreadsheet → exported as JSON
- Fields: `id`, `name`, `concentrate`, `concentrateQty`, `sweetener`, `sweetenerQty`, `milk`, `milkQty`, `topping`, `source`, `image`, `video`, `mediaMatch`
- Map and decorate into `RECIPES` array with:
  - `mood` classification (Bright/Spiced/Indulgent/Tropical/Smooth/Chilled)
  - `steps[]` array (Build Base → Sweeten → Add Body → Finish)
  - `tags[]` (concentrate, sweetener, milk, VIDEO flag)
  - `ingredients[]` (formatted strings)
  - `display` (formatted values with "None" for missing)

### `src/pages/CoffeeBuilderPage/CoffeeBuilder/coffeeRecipes.js` (77 recipes — builder-specific)
- Used exclusively by the coffee builder Step2
- Includes `ingredientImages` map for each recipe (4 image paths per recipe)
- Also exports image lookup functions:
  - `getIngredientImage(type, name)` — returns image path for ingredient
  - `getDrinkImage(name)` — returns product image with fuzzy fallback
  - `drinkImageMap` — name→image lookup
  - `normalize(value)` — lowercase, trim, single-space

---

## Design System (`src/styles/global.css`)

### Colors
- Primary: `#1844AB` (Royal Blue)
- Secondary: `#C67C4E` (Coffee Brown)
- Dark: `#1F2A44` (Deep Navy)
- Background: `#FFFFFF`, Alt: `#F5F9FC`
- Primary Light: `#E6F4FF`
- Text: `#1F2A44`, Muted: `#4A5568`

### Typography
- **Entire site**: Author (variable font, weight range 200–700)
- **Fallbacks stripped**: All hardcoded `'Outfit'` and `'Inter'` fallbacks removed from `HomePage.css`, `ContactPage.css`, `StorePage.css`, `B2BPage.css`, `RecipeDetailsPage/*.css`
- **One exception**: HeroTitle uses `'Heathergreen'` (desktop + mobile skip flow)
- `--font-body: 'Author', sans-serif`
- `--font-heading: 'Author', sans-serif`
- Fluid sizing via `clamp()`: `--text-xs` to `--text-hero`

### Spacing
- `--space-1` (0.25rem) to `--space-24` (6rem)
- Radii: `--radius-sm` (8px) to `--radius-2xl` (32px)
- Shadows: `--shadow-sm` through `--shadow-xl`
- Container: max 1280px, fluid padding
- Nav height: 70px, Bottom nav: 64px

### Layout
- `page-wrapper` padding accounts for nav + bottom nav
- Sticky footer via flexbox (min-height: 100vh)
- CSS class utilities: `.btn`, `.btn-primary`, `.btn-outline`, `.btn-dark`, `.glass`, `.glass-dark`, `.skeleton`, `.animate-on-scroll`

### Keyframe Animations
`steam-rise`, `float`, `marquee`, `pulse-glow`, `spin`, `bounce-dot`, `ripple`, `shimmer`, `confetti-fall`, `pour-drop`, `number-appear`, `fade-in-up`, `scroll-video-stage-enter`, `scroll-video-stage-exit`

---

## Services / API Integration

### API Client (`src/services/api.js`)
- Base URL: localhost:3000 in dev, Render backend in production
- Automatic JWT Bearer token from `dc_token` localStorage
- Token refresh on 401 (one retry via `refreshAccessToken()`)
- `auth:unauthorized` custom event on 401 after retry failure
- Methods: `get(endpoint, params)`, `post(endpoint, data)`, `put`, `patch`, `delete`
- Error handling: `ApiError` class with status + data

### Auth Service (`src/services/auth.js`)
- `sendOtp(mobile)` → POST `/auth/send-otp`
- `verifyOtp(mobile, otp)` → POST `/auth/verify-otp` (stores access + refresh tokens)
- `refreshToken()` → POST `/auth/refresh-token`
- `getMe()` → GET `/auth/me`
- `updateProfile(data)` → PATCH `/auth/profile`
- `logout()` → POST `/auth/logout` (clears tokens)

### Order Service (`src/services/orders.js`)
- `create(orderData)` → POST `/orders`
- `getById(id)` → GET `/orders/:id`

---

## Component Details

### StepProgressBar
- 6 clickable dots: Category → Coffee → Body → Sweetener → Garnish → Review
- Visual states: active (pulsing), done (check icon), upcoming
- Animated connector line (Framer Motion)
- Clickable for navigation to previous steps

### CartDrawer
- Slide-in drawer with cart items list
- Per-item quantity controls (+/-)
- Remove item, total price display
- Checkout CTA

### SizeSelector
- Size options with ml indicators
- Visual selection with active state

### ProductCard
- Product image, name, price display
- Used in MenuPage, StorePage
- Hover/active effects

### CoffeeCupVisualizer
- Three.js / React Three Fiber 3D visualization with Rapier physics
- Animated coffee cup (steam, contents)

### OTPInput
- Digit-by-digit OTP entry field
- Auto-focus, paste support
- Used in AuthPage

### WhyChilldCup
- Reusable cup card used in all three homepage layouts (desktop welcome, desktop skip, mobile)
- Receives rotation, reveal delay, and visibility via props
- Includes cup SVG, title, and description
- Cup fill uses SVG `<pattern>` with PNG images (`WhyChilldCup3.png`, `WhyChilldCup4.png`) via `preserveAspectRatio="xMidYMid meet"`; per-cup `patternScale`, `patternX`, `patternY` controls for image positioning

### SkippedWelcomeHero
- Full-viewport hero for skip flow
- Rotates through slides (Vandy Brew, Preri Appe, Rishi Latte) every 2s
- Animated SVG wave at bottom

### TestimonialsBento
- Bento-grid testimonial cards
- Used in skip flow's HomepageLowerFlow

---

## CSS Organization (`src/pages/HomePage/HomePage.css`)

The desktop CSS is ~4165 lines organized into these major sections:

| Lines | Section |
|-------|---------|
| 1–35 | Top-level layout: device-layout-selector, site-mode-desktop, homepage-figma-container, skip-homepage-flow |
| 41–190 | Skip overlay hero: .homepage-skip-overlay, neha-hero, copy, logo, dots, wave |
| 193–570 | Skip flow: skip-hard-part (media wrapper, video, shade, waves, content, CTA), skip-why-chilld (4 grid cups with parallax), skip-feature-video (expandable fullscreen) |
| 570–700 | Skip flow extras: .skip-hard-part__media (overflow hidden container), .skip-hard-part__video (object-position parallax), .skip-hard-part__shade (vignette mask), top-wave (wavy marquee text), bottom-wave, content (h2, p, quote, actions) |
| 701–870 | Skip flow responsive: .skip-why-chilld (item grid positions), .skip-feature-video (.is-expanded fullscreen) |
| 871–1230 | Figma SVG wrapper + Desktop why-chilld + skip-hard-part content (h2, p, rule, quote, strong, closing, actions, primary/secondary buttons) |
| 1231–1420 | Floating bean particles, looping wavy marquees, B2B section |
| 1421–2000 | Responsive: `@media (max-width: 1024px)` — mobile/tablet adaptations |
| 2001–2600 | Bento grid: rotating social posts with enter/leave animations |
| 2601–3400 | Infinite trending mixes carousel + scroll-triggered fullscreen video |
| 3401–4165 | B2B section, lower flow, footer, responsive overrides |

---

## Recent UI Changes

### Recipes Page — Header Marquee & Search Bar Position
- **Infinite-loop marquee**: Added in `recipes-header` with horizontally scrolling cards (200px desktop, 140px mobile) showing recipe image, name, and likes. Animation speed: 200s desktop / 150s mobile, pauses on hover.
- **Search bar**: Moved out of `recipes-header` into `rp-grid-section`, positioned between the category description and the recipe grid (reverted from earlier inline filter-bar placement).
- **Compact marquee card**: New `.rp-marquee-card` CSS with 200px width, 120px image height, 12px border-radius, smooth hover lift effect.
- **Fonts**: All heading font-family references changed from `var(--font-heading, 'Outfit', sans-serif)` to direct `'Author', sans-serif`.

### Espresso Hero Image & Cup Size
- **Image**: Switched desktop and mobile espresso config from `/images/expresso.webp` to `/images/Esspresso.png`.
- **Scale**: Desktop scale increased `1.15 → 1.25`, mobile scale `0.48 → 0.55`; `maxHeight` bumped to `76dvh`.

### Skip Flow Hero Title — Uppercase
- Added `.homepage-react-hero--skipped .homepage-react-hero__title { text-transform: uppercase; }` so the hero name/suffix appears in all caps only when coming from skip/welcome bypass.

### Feature Video (Below Why Chilld)
- Reduced side gaps: `width: min(100% - 10rem, …) → min(100% - 3rem, …)` (~24px per side vs ~80px).
- Border-radius scaled: `46px → 24px`.

### Hard Part Section — Parallax & Spacing
- **Parallax technique**: Changed from `transform: translateY()` (which caused empty gaps/overflow) to `object-position` animation. The video stays at 100% bounds while `object-position` shifts from 50%→5% as user scrolls, creating a smooth upward rush effect. Video is wrapped in `.skip-hard-part__media` with `overflow: hidden` for containment.
- **Paragraph spacing**: Reduced throughout:
  - All paragraph bottom margins: `2.4rem → 1.4rem`
  - Heading bottom margin: `2rem → 1.2rem`
  - Rule top/bottom: `1rem auto 3rem → 0.6rem auto 1.8rem`
  - Actions margin-top: `3.5rem → 1.8rem`
  - Closing margin-bottom: `3.5rem → 2rem`
  - Quote/strong top margins: `0.5rem → 0.3rem`
- **Top wave marquee text**: Font-weight `800 → 600`, font-size bumped `+2px` (`clamp(26px, 2.2vw, 36px)`), responsive also aligned.

### Buttons (hard-part section & skip-hard-part section)
- Desktop welcome flow primary button: "Cold Brew Concentrate" → `/build`
- Desktop welcome flow secondary button: "Explore Recipes" → `/recipes`
- Skip flow: "Buy CHILLD Cold Brew Core" / "Explore Recipes"
- Both desktop buttons share identical styling: white background, dark text, pill shape (`border-radius: 999px`), shadow
- **Click effect**: Blue (`#2563eb`) wave sweeps left-to-right across the button via `linear-gradient` + `background-position` transition; text turns white while held
- **Hover**: lift (`translateY(-2px) scale(1.02)`) + enhanced shadow

### Background SVG Removal
- `.welcome-figma-graffiti` background SVG removed from both `desktop-homepage__why-chilld` and `skip-why-chilld` sections

### Global Responsiveness
- Removed `min-width: 1280px` from `.homepage-figma-container` and `.skip-homepage-flow`
- Changed `overflow-x: auto` to `overflow-x: clip` on `.site-mode-desktop`
- All containers now scale to 100% viewport width without overflow or horizontal scrollbars

### Custom Brand Wave Curve
- Replaced wave text content with custom copy: `"100% real coffee…Only cold brew, nothing else…authentic coffee, without the fuss…for those who like it smooth…custom coded coffee …save money, drink Chilld…it’s not about the temperature…fuel for your next…Chilld before the next meeting…"`
- Changed wave text font-family to `'Outfit', sans-serif` with font-weight `800` (bold) and reduced size slightly (`clamp(24px, 2.2vw, 34px)`) for a cleaner look.
- Adjusted text baseline vertical alignment offset `dy` from `0.85em` to `0.35em` to keep the Outfit font centered along the wave curve.
- Resized the wave curve and mask height in `HomePage.css` from `clamp(220px, 18vw, 300px)` to `clamp(160px, 15.2vw, 230px)` to match Figma's exact `1512x230` aspect ratio and prevent excessive vertical stretching on wider viewports.
- Made the negative margin-top responsive using `margin-top: calc(-1 * clamp(160px, 15.2vw, 230px))` to eliminate spacing gaps.

### Video Section Vignette & Layout Spacing
- Added `background-color: #000000;` directly behind the `.skip-hard-part__video` element to prevent the parent section's light background color (`#EBF5FF`) from bleeding through the video's opacity.
- Changed the background gradient of the `.skip-hard-part__shade` to apply a dark black fade *only from the top side* to transparent at the bottom (`linear-gradient(180deg, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.75) ...)`).
- Reduced block-padding of `.skip-feature-video` container from `10.6rem 8.4rem` to a responsive `clamp(1.5rem, 4vw, 4rem)` to minimize spacing on tablet/mobile screens.
- Reset the transform on `.skip-feature-video video` from `scale(1.12)` to `scale(1)` and centered it using flex layout, restoring the correct left/right spacing/padding on all screens.

### B2B Section Copy & Infographic Stats
- Changed headline to `"B2B - The Cold Brew Factory for your Restaurant & Cafe"`.
- Updated paragraph text to highlight HoReCa clients and cold beverage demand.
- Updated infographic stats:
  - Stat 1: `<48h` / `Fresh Brew` (was `<72h` / `Freshly Brewed`)
  - Stat 2: `0` / `Zero Capex` (remains same)
  - Stat 3: `2L` / `Small MOQ` (was `∞` / `Menu Uses`)
  - Stat 4: `₹₹₹` / `Low TCO` (was `NO` / `Special Manpower`)

### Menu/Products Page Header Spacing
- Reduced top-padding of `.menu-page__header` from `clamp(6rem, 8vw, 8rem)` to `clamp(1.5rem, 3vw, 2.5rem)` in `MenuPage.css` to reduce the large gap above the "Cold Brew Concentrates" title.

### Hero Cup Scaling & Title Vertical Stretch
- Rescaled all coffee cups (Americano, Frappe/PreriAppe, Affogato, etc.) in `COFFEE_CUP_IMAGES` config from `scale: 1.0` to `scale: 1.12 - 1.15` and `maxHeight` up to `72dvh - 78dvh` so that all cups look large and overlap the name text.
- Changed the `.homepage-react-hero__title` transform to `scaleX(1.18)` to stretch the `'Heathergreen'` name horizontally only (matching Figma's layout exactly by filling the width between the floating coffee beans without stretching the height).
- Optimized and enlarged the dynamic font size scaling rules in `HomePage.jsx` based on name length to ensure a bolder, more prominent hero title:
  - Total length > 15: `clamp(10rem, 15vw, 13rem)` (was `clamp(8rem, 11vw, 10rem)`)
  - Total length > 12: `clamp(13rem, 19vw, 17rem)` (was `clamp(11rem, 15vw, 14rem)`)
  - Total length > 9: `clamp(16rem, 23vw, 21rem)` (was `clamp(13rem, 18vw, 16rem)`)
  - Total length > 7: `clamp(18rem, 26vw, 24rem)` (was `clamp(15rem, 21vw, 19rem)`)
  - Otherwise (default): `clamp(20rem, 29vw, 27rem)` (was `clamp(17rem, 24vw, 23rem)`)

---

## Build & Deploy

```bash
npm run dev       # Development server (Vite)
npm run build     # Production build (Vite)
npm run lint      # ESLint (flat config)
npm run preview   # Preview production build
```

### Build Output
- Code-split via `React.lazy` (each builder step, pages)
- Assets: JS, CSS, images, videos
- `dist/` folder produced by Vite

---

## Key Patterns & Conventions

1. **Mobile-first CSS**: All layouts start with mobile styles, `@media (min-width: ...)` for larger screens
2. **Fluid sizing**: `clamp(min, preferred, max)` everywhere
3. **Zustand stores**: Flat state, no reducers, `create()` with direct `set()`
4. **Store persistence**: `zustand/middleware/persist` for auth, cart, user
5. **Lazy loading**: `React.lazy()` + `Suspense` for builder steps
6. **Image optimization**: `loading="lazy"`, `decoding="async"` on all images
7. **Deterministic randomness**: String hash functions for pseudo-random costs/recommendations
8. **No browser alerts**: All messages use inline banners or react-hot-toast
9. **Path aliases**: `@/` maps to `src/`
10. **CSS custom properties**: Full design token system in `:root`
11. **Three React render paths**: Desktop welcome (SVG canvas), Desktop skip (scrollable), Mobile (independent)
12. **prefers-reduced-motion**: Media query support throughout all animations
13. **IntersectionObserver**: Used for reveal animations, scroll-triggered video expansion
14. **requestAnimationFrame**: Scroll-driven parallax and infinite carousel animation
