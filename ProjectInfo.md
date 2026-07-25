# CHILLD Customer Website — Project Information

**Project:** `coffee-ordering-kiosk`  
**Last verified:** July 24, 2026  
**Local URL:** `http://localhost:5176`

## 1. Purpose

This React application is CHILLD’s public customer ordering website. It provides the branded homepage, product catalog, product detail, persistent cart drawer, location selection, OTP authentication, checkout, Razorpay payment, order confirmation, profile/orders, recipes, contact, store, B2B, and policy pages.

It is the active public storefront. The secondary `/store/*` routes inside the CRM project are a separate legacy implementation.

## 2. Technology

| Area | Current implementation |
|---|---|
| UI | React 19.2.6 |
| Build | Vite 8.0.12 |
| Routing | React Router 7.17 |
| State | Zustand 5 |
| Animation | Framer Motion, Lenis, CSS, requestAnimationFrame, IntersectionObserver |
| 3D | Three.js, React Three Fiber, Drei, Rapier |
| Icons/toasts | Lucide React, React Hot Toast |
| Styling | Global design tokens plus page/component CSS |

Path alias `@` maps to `src`. The Vite server runs on port 5176 and proxies `/api` to the local backend.

## 3. Active Routes

| Route | Purpose | Welcome guard |
|---|---|---|
| `/welcome` | Name/coffee preference onboarding or skip | No |
| `/` | Device-selected branded homepage | Yes |
| `/menu` | Product catalog | Yes |
| `/menu/:id` | Product details and variant selection | Yes |
| `/location` | Collection location and order type | Yes |
| `/checkout` | Order summary and customer checks | Yes |
| `/auth` | Login/sign-up and OTP verification | No |
| `/payment` | Razorpay payment launch and verification | Yes |
| `/order-confirm` | Verified order confirmation | Yes |
| `/profile` | Customer profile and order history | Yes |
| `/recipes` | Recipe catalog | Yes |
| `/recipe-details/:id` | Recipe detail | Yes |
| `/create-recipe` | Authenticated recipe submission | Yes |
| `/contact` | Contact/support submission | Yes |
| `/store` | Store information page | Yes |
| `/b2b` | B2B information | Yes |
| `/policies` | Policies | Yes |

There is **no `/cart` route**. The cart is rendered as `CartDrawer` from the shared layout.

The Coffee Builder components and data remain in the source tree, but `/build` is commented out in `src/App.jsx` and is not active.

## 4. Onboarding and Homepage

`RequireWelcome` redirects every main route to `/welcome` until `useUserStore.hasCompletedWelcome` is true. `useUserStore` is intentionally not persisted, so a new page load/new browser session must complete or skip the welcome step again.

The root page uses `DeviceLayoutSelector` for responsive layout selection. The homepage has personalized and skipped-welcome variants, desktop/mobile compositions, branded hero/cup media, feature video, B2B content, testimonials, responsive typography, and custom motion.

Lenis is initialized globally in `App.jsx`. Route changes return the page to the top through the same Lenis instance when available.

The detailed homepage motion target remains in `CHILLD_Homepage_Motion_Implementation_Spec.md`; it is a specification, not a substitute for current implementation status.

## 5. Product Catalog

The website source catalog is `src/data/products.js`.

| Product ID | Display name | Variants | Status |
|---|---|---|---|
| `coffee-50-50-concentrate` | Bold Concentrate | 325 ml ₹355; 1 L ₹1030 | Available |
| `classic-cb-concentrate` | Classic CB Concentrate | 325 ml ₹360; 1 L ₹1050 | Available |
| `sif-concentrate` | Kappi Concentrate | 325 ml ₹350; 1 L ₹1010 | Available |
| `sampler-concentrate` | Discovery Kit | 540 ml ₹725 | Coming Soon |

The same IDs and authoritative prices are represented in the backend product seed/pricing configuration. This ID alignment is required for order creation.

Add to cart is enabled on both `ProductCard` and `ProductDetailPage` for available products. The Discovery Kit button remains disabled because that product is marked unavailable.

## 6. Cart and Checkout

`useCartStore` is persisted under `chilld-cart`.

Cart behavior:

- Items are distinguished by product ID, selected size, and add-ons.
- Adding the same configuration increases quantity.
- Quantity can be increased, reduced, or removed.
- Total item count and subtotal are derived from current cart items.
- Cart contents are cleared only after successful server-side payment verification.

Checkout behavior:

- A collection location is required.
- Order type is `dine-in` or `takeaway`; takeaway receives the backend packaging charge.
- Checkout requires customer authentication and redirects through `/auth?redirect=/payment` when needed.
- Browser prices are for display only. The backend validates products and recomputes totals.

## 7. Payment Integration

The active payment implementation is Razorpay Checkout. There are no locally collected fake card or UPI forms.

Flow:

1. `useOrderStore.createPaymentOrder()` transforms cart items into backend product IDs, sizes, quantities, and add-ons.
2. `POST /orders` creates a local pending order and Razorpay order.
3. `src/services/razorpay.js` loads `https://checkout.razorpay.com/v1/checkout.js`.
4. The page opens Razorpay with the returned public key, order ID, amount, and currency.
5. The success payload is sent to `POST /orders/verify`.
6. The backend verifies the signature and returns the paid order.
7. The website clears the cart and navigates to confirmation only after that success.

Current displayed/server total:

- item subtotal
- rounded 5% GST
- ₹15 packaging for takeaway

Security properties:

- Razorpay secret key stays on the backend.
- The backend looks up product prices rather than trusting client prices.
- The signature is checked server-side against the stored Razorpay order.
- Invalid signatures do not mark orders paid.
- Stock reduction happens after verification.

Repository code verifies the integration path, but live capture, settlement, webhook, and dashboard settings require a separate Razorpay account-level review. The verified environment uses test-mode credentials.

## 8. Authentication and Profile

`useAuthStore` persists browser auth state as `chilld-auth`. The auth service stores access and refresh tokens as `dc_token` and `dc_refresh_token`.

The authentication page supports two passwordless paths:

- **Log in:** accepts an existing 10-digit Indian mobile number, then verifies an OTP.
- **Sign up:** validates full name, email address, and a new 10-digit Indian mobile number before the OTP is sent. Verification creates the customer with that profile.

The backend rejects invalid phone numbers, malformed sign-up details, sign-up attempts for an existing number, and login attempts for an unregistered number. The website surfaces these server errors next to the relevant form state.

After OTP verification, the backend returns identity and tokens. Protected actions use the access token; the API client attempts refresh once after a 401.

The profile page reads the authenticated customer and their backend orders. Logout clears auth state and stored tokens.

## 9. Recipes

`src/data/recipes.js` contains **21 website recipes**. Each record includes:

- stable ID
- name and description
- mood and tags
- concentrate
- ingredients
- ordered steps
- image and optional video/media information
- displayed likes
- author

These are real website content, not CRM dummy data. The backend import command reads this file directly:

```powershell
cd ..\cooffee-website-backend
npm run import:website-recipes
```

The importer is idempotent and currently assigns 14 approved and 7 pending recipes. Approved recipes are public; the CRM admin endpoint shows both groups for moderation.

Customer recipe creation, likes, and comments use authenticated backend recipe endpoints.

The separate builder file under `src/pages/CoffeeBuilderPage/CoffeeBuilder/coffeeRecipes.js` is builder-specific and does not replace this 21-recipe public catalog.

## 10. API Client and Services

`src/services/api.js` selects:

- local: `http://localhost:3000/api/v1`
- non-local default: `https://coffee-website-backend.onrender.com/api/v1`
- override: `VITE_API_URL`

The client:

- sends JSON requests
- attaches the JWT bearer token
- forwards stored session/store headers when present
- retries once using the refresh token after a 401
- clears invalid auth and dispatches `auth:unauthorized`
- converts HTTP/network failures into `ApiError`

Important services include auth, orders, products, recipes, contact, and Razorpay script loading.

## 11. Zustand Stores

| Store | Persistence | Responsibility |
|---|---|---|
| `useUserStore` | No | Welcome name, coffee preference, skip/completed state |
| `useAuthStore` | `chilld-auth` | OTP state and logged-in presentation state |
| `useCartStore` | `chilld-cart` | Cart items, quantities, totals |
| `useOrderStore` | No | Location, order type, local order/payment progress |
| `useBuilderStore` | No | Inactive Coffee Builder configuration and cost state |

## 12. Key Source Areas

```text
src/
├── App.jsx                     Route map, welcome guard, global Lenis
├── components/                Shared UI, product cards, cart drawer
├── data/
│   ├── products.js            Four-product website catalog
│   └── recipes.js             21 public website recipes
├── layouts/MainLayout.jsx     Shared header/navigation/cart
├── pages/                     Route-level screens
├── services/                  API, auth, order, recipe, contact, Razorpay
├── store/                     Zustand stores
├── styles/                    Global tokens/styles
└── utils/                     Device/API helpers
```

Public product/recipe/video assets live under `public`.

## 13. Development

```powershell
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

Environment:

```text
VITE_API_URL=http://localhost:3000/api/v1
```

Never place the Razorpay secret key or backend credentials in a `VITE_*` variable.

## 14. Verification and Known Limits

Verified:

- Production build passes.
- All active routes compile.
- Three available products can be added to the cart.
- Product-detail variant prices match backend pricing.
- Cart drawer persists and leads to checkout.
- Backend order creation returns a Razorpay order.
- Invalid payment signatures are rejected.
- Recipe catalog contains 21 records and imports into CRM moderation.
- Website images used during the linked flow load successfully.

Known limits:

- No dedicated customer cart page exists.
- `/build` is inactive.
- Welcome state resets on reload because `useUserStore` is not persisted.
- Production build reports a chunk larger than 500 kB.
- Repository-wide lint still includes legacy issues.
- Live Razorpay account configuration cannot be verified from frontend source alone.
