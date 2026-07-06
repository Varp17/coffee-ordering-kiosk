# AI Project Context And Progress

This file is for future AI chats and collaborators. Read this first before making changes.

## Project

- App: CHILLD coffee ordering kiosk / web app
- Stack: React, Vite, CSS modules/files, Zustand, React Router
- Root folder: `C:\Users\HP\Downloads\coffee-ordering-kiosk-Dev-Varun`
- Dev command: `npm run dev -- --host 127.0.0.1 --port 5173`
- Build command: `npm run build`

## Current User Goal

The current main work is on the skipped/interactivity-off home page flow.

When a user clicks `Skip Interactivity` on the welcome page, the app sets `skippedWelcome: true` and lands on the main React home page. The user wants this skipped version to match Figma screenshots closely.

Main visual areas being worked on:

1. The first skipped hero with blue background and coffee cup.
2. The `hard part` masked video section with a curved top wave and curved marquee text.
3. The `Why Chilld?` section with tilted cup illustrations and staggered scroll reveal.
4. The testimonials/reviews bento section with rotating reviews.

## Important Rule For Future AI

Plan first before editing.

Before changing files:

1. Read the relevant component and CSS.
2. Identify whether the change is for normal home or skipped/interactivity-off home.
3. Keep changes scoped to the skipped flow unless the user explicitly asks otherwise.
4. Do not restore or delete unrelated files unless the user asks.
5. After edits, run `npm run build` unless the user only asks for analysis.

## Current Git/Workspace Warning

Some older files are deleted in the worktree. Treat them as user/project state and do not restore them unless asked.

Deleted files seen recently:

- `src/components/SkippedWelcomeHero/SkippedWelcomeHero.css`
- `src/components/SkippedWelcomeHero/SkippedWelcomeHero.jsx`
- `src/pages/SkipPageHome/SkipPageHome.css`
- `src/pages/SkipPageHome/SkipPageHome.jsx`
- `src/pages/SkipPageHome/assets/coffee-cup-backdrop.svg`
- `src/pages/SkipPageHome/assets/iced-coffee-cup.png`
- `src/pages/SkipPageHome/assets/pour-doodle.png`
- `src/pages/skip-page-home/SkipPageHome.css`
- `src/pages/skip-page-home/assets/coffee-cup-backdrop.svg`
- `src/pages/skip-page-home/assets/iced-coffee-cup.png`
- `src/pages/skip-page-home/assets/pour-doodle.png`

A replacement wrapper was added:

- `src/pages/skip-page-home/SkipPageHome.jsx`

That wrapper sets skipped welcome state and redirects to `/`.

## File Map

### App Routing

`src/App.jsx`

- Defines routes.
- Imports `SkipPageHome` from `@/pages/skip-page-home/SkipPageHome`.
- The `/skip-page-home` route exists inside the guarded main layout.

### Welcome / Skip Trigger

`src/pages/WelcomePage/WelcomePage.jsx`

- Shows the welcome form.
- The `Skip Interactivity` button calls `skipWelcome()` from Zustand store.
- Then navigates to `/`.

`src/store/useUserStore.js`

- Stores welcome state.
- Important state:
  - `hasCompletedWelcome`
  - `skippedWelcome`
  - `name`
  - `coffeeType`
- Important actions:
  - `completeWelcome(name, coffeeType)`
  - `skipWelcome()`
  - `resetWelcome()`

### Main Home Page

`src/pages/HomePage/HomePage.jsx`

- Very large file.
- Contains normal home page and skipped home page behavior.
- Uses `skippedWelcome` from `useUserStore`.
- Main skipped-flow function:
  - `SkipHomepageMiddleFlow()`
- Important skipped sections:
  - `.skip-hard-part`
  - `.skip-why-chilld`
  - `.skip-feature-video`
- Also renders `TestimonialsBento`.

`src/pages/HomePage/HomePage.css`

- Main CSS for desktop home and skipped home.
- Important selectors:
  - `.skip-homepage-flow`
  - `.homepage-skip-overlay`
  - `.skip-hard-part`
  - `.skip-hard-part__video`
  - `.skip-hard-part__shade`
  - `.skip-hard-part__top-wave`
  - `.skip-hard-part__top-wave-text`
  - `.skip-hard-part__content`
  - `.skip-hard-part__bottom-wave`
  - `.skip-why-chilld`
  - `.skip-why-chilld__item`

### Why Chilld Cups

`src/components/WhyChilldCup/WhyChilldCup.jsx`

- Contains `WHY_CHILLD_ITEMS`.
- Draws tilted SVG cup illustrations with numbers `01`, `02`, `03`, `04`.
- Was updated to accept a `style` prop so staggered reveal delay can be passed from `HomePage.jsx`.

### Testimonials Bento

`src/components/TestimonialsBento/TestimonialsBento.jsx`

- Figma-style review bento.
- Uses:
  - Left image: `/images/image9_366_1172.png`
  - Right image/ad: `/images/image10_366_1172.png`
  - Video: `/Videos/coffeeswirl1.mp4`
- Review cards auto-rotate every 2 seconds.

`src/components/TestimonialsBento/TestimonialsBento.css`

- Layout CSS for testimonials bento.
- Uses compact bento grid with left image, Amazon card, center video, right review/ad stack, bottom review cards.

### Public Assets

Use Vite public paths directly in JSX/CSS:

- `/images/iced-coffee-cup.png`
- `/images/image9_366_1172.png`
- `/images/image10_366_1172.png`
- `/Videos/coffeeswirl1.mp4`
- `/Videos/coffeeswirl2.mp4`
- `/Videos/coffee_concentrate_with_glass.mp4`

Do not import public assets as `@/public/...`.

Correct:

```js
const coffeeCup = '/images/iced-coffee-cup.png';
```

Avoid:

```js
import coffeeCup from '@/public/images/iced-coffee-cup.png';
```

## Current Hard-Part Section State

The section is in `HomePage.jsx` inside `SkipHomepageMiddleFlow()`.

It has been successfully matched to the Figma design:
- Video and shade height is dynamic (`bottom: 0`) instead of fixed `1622px` to prevent text overflowing and rendering invisibly on the next white section.
- Text sizes, families, weights, and max-widths are aligned with the desktop layout (`.hard-part-paragraph`, `.hard-part-heading`, `.hard-part-divider`).
- The quote styling uses curly quotes `“Coffee is too much work”` and Outfit font.
- CTA buttons match the design: "Cold Brew Concentrate" (white solid) and "Explore Recipes" (white outline).
- Video/texture filters match the desktop layout (`filter: saturate(1.08) contrast(1.08) brightness(0.74)` with `opacity: 0.78`).

Current video:

```jsx
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
```

Current concept:

- The video is rectangular.
- A CSS mask shapes the visible top edge into a curve.
- An SVG text path overlays curved marquee text near the top edge.
- The text follows the masked video wave exactly.
- The curve is smooth, and the text sits under/following the curve.

Current Y-position:

- `.skip-hard-part { margin-top: -272px; }`

## Current Hard-Part Text Style

The hard-part content was fully updated to match the Figma mockup:

- Clean regular text and matching sizes.
- Centered divider line.
- Custom curly quotes for `"Coffee is too much work"`.
- Action buttons matched exactly to the designs.

Paragraph classes:

- `.skip-hard-part__intro`
- `.skip-hard-part__middle`
- `.skip-hard-part__promise`
- `.skip-hard-part__simple`
- `.skip-hard-part__closing`

## Why Chilld Progress

The `Why Chilld?` section was changed toward Figma:

- Large light-blue canvas.
- Big tilted cup illustrations.
- Absolute/staggered placement.
- One-by-one reveal on scroll using `IntersectionObserver`.
- `SkipHomepageMiddleFlow()` has:
  - `whySectionRef`
  - `whyVisible`
  - `IntersectionObserver`
- Each `WhyChilldCup` gets a delay via style:

```jsx
style={{ '--why-reveal-delay': `${index * 180}ms` }}
```

## Testimonials Progress

Testimonials bento was rewritten:

- Left image uses `/images/image9_366_1172.png`.
- Right ad image uses `/images/image10_366_1172.png`.
- Center video uses `/Videos/coffeeswirl1.mp4`.
- Bottom two review cards rotate every 2 seconds.

## Current Build Status

Last build after adding `src/pages/skip-page-home/SkipPageHome.jsx` and height changes passed:

```bash
npm run build
```

Vite may warn about large chunks. That warning is not part of this visual task.

## Suggested Next Plan

If continuing the hard-part wave:

1. Open `HomePage.jsx` around `SkipHomepageMiddleFlow()`.
2. Open `HomePage.css` around `.skip-hard-part`.
3. Pick one source-of-truth curve path.
4. Use the exact same curve for:
   - SVG `textPath`
   - CSS mask top-band path
5. If text should sit below the curve, create an offset text path by adding a consistent Y offset to every Y coordinate.
6. Do not use `dy` alone for large vertical movement because it can make the text appear detached from the visible curve.
7. Make sure the mask top-band SVG and visible SVG have the same `viewBox` and rendered height.
8. Run `npm run build`.

## Useful Commands

```bash
npm run dev -- --host 127.0.0.1 --port 5173
npm run build
rg -n "skip-hard-part|skip-why-chilld|TestimonialsBento" src
git status --short
```

