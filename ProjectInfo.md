# CHILLD Coffee — Project Information

## Overview
A React-based coffee ordering kiosk application with a 6-step interactive coffee recipe builder, menu browsing, cart management, OTP-based authentication, and order placement. Built with Vite + React 19 + Zustand.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 (JSX, hooks) |
| **Build** | Vite 8 |
| **State** | Zustand 5 (with `persist` middleware) |
| **Routing** | React Router DOM 7 |
| **Animation** | Framer Motion 12, Three.js (R3F) |
| **Icons** | Lucide React |
| **Notifications** | react-hot-toast 2 |
| **CSS** | Global design system, mobile-first fluid `clamp()` |
| **Backend** | REST API (Node.js, deployed on Render) |
| **Auth** | JWT + refresh token, OTP-based phone login |
| **Storage** | localStorage (cart, auth, user preferences) |

---

## Project Structure

```
src/
├── App.jsx                    # Router setup, welcome guard
├── App.css
├── index.css                  # Empty — delegates to styles/global.css
├── main.jsx                   # Entry point
├── styles/
│   └── global.css             # Design tokens, CSS reset, utilities, animations
├── layouts/
│   └── MainLayout.jsx         # Navbar + BottomNav + Footer wrapper
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
│   ├── useUserStore.js        # Welcome onboarding (name, coffeeType) — persisted
│   ├── useOrderStore.js       # Order tracking state
│   └── useBuilderStore.js     # Coffee Builder state (6 steps, costs, recipes)
├── pages/
│   ├── WelcomePage/           # Onboarding flow (name + coffee preference)
│   ├── HomePage/              # Main landing page
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
│   ├── RecipesPage/
│   ├── ContactPage/
│   ├── StorePage/
│   └── B2BPage/
├── components/
│   ├── Navbar/
│   ├── BottomNav/
│   ├── Footer/
│   ├── CartDrawer/
│   ├── StepProgressBar/
│   ├── SizeSelector/
│   ├── ProductCard/
│   ├── IngredientCard/
│   ├── RecipeMedia/
│   ├── SkippedWelcomeHero/
│   ├── CoffeeCupVisualizer/
│   ├── OTPInput/
│   └── Logo/
└── utils/
    ├── coffeeBuilder.js        # formatPrice, etc.
    ├── apiResponse.js          # Response unwrapping helpers
    └── animations.js           # Shared Framer Motion variants
```

---

## Routing (`App.jsx`)

| Path | Component | Guard |
|------|-----------|-------|
| `/welcome` | WelcomePage | None (before onboarding) |
| `/` | HomePage | RequireWelcome |
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

**Guard Logic**: `RequireWelcome` checks `useUserStore.hasCompletedWelcome`. If `false`, redirects to `/welcome`.

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
- Headings: Outfit (weights 300-900)
- Body: Inter (weights 300-600)
- Fluid sizing via `clamp()`: `--text-xs` to `--text-hero`

### Layout
- Container: max 1280px, fluid padding
- Nav height: 70px, Bottom nav: 64px
- `page-wrapper` padding accounts for nav + bottom nav
- Sticky footer via flexbox (min-height: 100vh)

### Design Tokens
- Spacing: `--space-1` (0.25rem) to `--space-24` (6rem)
- Radii: `--radius-sm` (8px) to `--radius-2xl` (32px)
- Shadows: `--shadow-sm` through `--shadow-xl`
- Z-indices: base(1) → nav(500)
- CSS class utilities: `.btn`, `.btn-primary`, `.btn-outline`, `.glass`, `.glass-dark`, `.skeleton`, `.animate-on-scroll`

### Keyframe Animations
- `steam-rise`, `float`, `marquee`, `pulse-glow`, `spin`, `bounce-dot`, `ripple`, `shimmer`, `confetti-fall`, `pour-drop`, `number-appear`, `fade-in-up`

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
- Three.js / React Three Fiber 3D visualization
- Animated coffee cup (steam, contents)

### OTPInput
- Digit-by-digit OTP entry field
- Auto-focus, paste support
- Used in AuthPage

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
