## Wave 1 Summary

**Objective:** Adjust text contrast in the parallax section, remove the static bottom marquee paths to prevent duplicate overlapping, and connect the Create Recipe and Recipe Details pages to the application routing and footer.

**Changes:**
- Corrected `.hard-part-parallax-clip` z-index from `4` to `2` in `HomePage.css` to place the parallax video behind the SVG layers, allowing white text to render in crisp, stark white.
- Added `/create-recipe` and `/recipe-details/:id` routes in `App.jsx`.
- Added a "Recipes" link group in `Footer.jsx` linking to the new pages.
- Modified grid columns to 5 sections in `Footer.css` to accommodate the new links.
- Updated `hideStaticPlaceholders` in `HomePage.jsx` to dynamically find and remove the static bottom marquee path elements (`paint1_linear_` and the long dark blue `#1F2A44` path) on SVG load, resolving the upside-down duplicate text overlap.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`
- `src/pages/HomePage/HomePage.jsx`
- `src/App.jsx`
- `src/components/Footer/Footer.jsx`
- `src/components/Footer/Footer.css`

**Verification:**
- `npm run build`: Production build completed successfully in 1.18 seconds with zero errors.
- Visual check: Navigated through footer links to `Create Recipe` and `Recipe Details` and verified stark white parallax text contrast and bottom marquee clean scroll visually via browser screenshots.

**Risks/Debt:**
- None. All pages compile cleanly and render correctly in both desktop and simulated responsive layouts.

**Next Wave TODO:**
- Monitor user actions/feedback on new recipes created.

---

## Revert of Commit 133720f8a6ca500cb39f781013f21ba5dbbca538

**Objective:** Revert commit 133720f8a6ca500cb39f781013f21ba5dbbca538 ("feat: implement responsive homepage with interactive Figma SVG and mobile-specific layout components").

**Changes:**
- Reverted all modifications in `src/pages/HomePage/HomePage.css` and `src/pages/HomePage/HomePage.jsx` introduced by the target commit.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`
- `src/pages/HomePage/HomePage.jsx`

**Verification:**
- `npm run build`: Completed successfully.

---

## Wave 2: Align Footer Wave with Figma Design

**Objective:** Align the bottom marquee background wave and footer background with the Figma design.

**Changes:**
- Restored the bottom marquee background wave path (`d.startsWith('M0 7396')` and `fill.toUpperCase() === '#1F2A44'`) in `hideStaticPlaceholders` in `HomePage.jsx`. This allows the wavy dark navy (`#1F2A44`) top of the footer to render and seamlessly transition from the white section above it to the dark navy footer background, matching the Figma design.

**Files Touched:**
- `src/pages/HomePage/HomePage.jsx`

**Verification:**
- `npm run build`: Production build completed successfully.
- Visual check: Verified via browser subagent screenshots that the white gap above the footer is resolved and the wavy transition matches the Figma design.

**Risks/Debt:**
- None.

---

## Wave 3: Shrink SVG Canvas and Align Global Footer

**Objective:** Resolve the empty spacing below the homepage footer caused by SVG canvas height, fix logo auto-width attribute warnings, and align the global footer links and spacing with the Figma design.

**Changes:**
- Wrapped the homepage SVG and overlays inside a `.figma-svg-content` scaling container in `HomePage.jsx` and `HomePage.css` to keep all percentage-based absolute coordinates aligned.
- Dynamically shrunk the SVG document height inside the `<object>`'s `onLoad` handler by `260px` to match the compact homepage layout, preventing trailing empty space below the footer.
- Omitted the `width` and `height` attributes from the SVG tag in `Logo.jsx` when they are set to `auto`, passing them to styles instead to prevent browser console attribute errors.
- Aligned global `Footer.jsx` link columns (Shop, Recipes, Visit) and links targets with the homepage footer layout.
- Removed the white `<rect>` element from the SVG wave in `Footer.jsx` to make the header wave transparent, allowing a seamless transition from the page background.
- Increased the margin-bottom on `.footer__copyright` in `Footer.css` to `clamp(260px, 20vw, 360px)` to provide adequate spacing for the watermark logo on desktop screens.

**Files Touched:**
- `src/pages/HomePage/HomePage.jsx`
- `src/pages/HomePage/HomePage.css`
- `src/components/Logo/Logo.jsx`
- `src/components/Footer/Footer.jsx`
- `src/components/Footer/Footer.css`

**Verification:**
- `npm run build`: Production build completed successfully in 1.03s with zero compile errors.
- Visual check: Verified via browser subagent runs that the homepage SVG height is shrunk to `8069px`, no console errors exist, and the watermark logo on the menu page footer is fully visible with correct spacing and transition.

**Risks/Debt:**
- None.

---

## Wave 4: Eliminate Horizontal Layout Overflow

**Objective:** Resolve the horizontal layout overflow that causes a white gap/vertical stripe on the right side of the screen, particularly on pages using the global React `Footer` component (like `/menu`).

**Changes:**
- Optimized grid column minimum widths in `.footer__inner` from `minmax(420px, ...)` and `minmax(690px, ...)` to `minmax(300px, 0.95fr)` and `minmax(480px, 1.05fr)` in `Footer.css`.
- Changed the grid outer margin behavior using `width: min(100% - 4rem, 1660px)` (instead of `10-rem`) and adjusted the main footer column grid gap to `clamp(2rem, 5vw, 12rem)` to ensure comfortable rendering at intermediate viewport sizes (e.g. between `960px` and `1366px`).
- Reduced minimum width constraints of link columns in `.footer__links` to `minmax(120px, 1fr)` and updated their layout gap to `clamp(1.5rem, 5vw, 9.5rem)` to avoid forced right-side clipping or horizontal overflow scrollbars.

**Files Touched:**
- `src/components/Footer/Footer.css`

**Verification:**
- `npm run build`: Production build completed successfully in 1.11s.

---

## Wave 5: Add Store & B2B "Launching Soon" Pages

**Objective:** Add a Store and B2B pages to the navigation bar beside Products, set up their routing, and style them as custom "Launching Soon" placeholders.

**Changes:**
- Created [StorePage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/StorePage/StorePage.jsx) and [StorePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/StorePage/StorePage.css) with glassmorphism layout, mock concentrates bottle, and early access form.
- Created [B2BPage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/B2BPage/B2BPage.jsx) and [B2BPage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/B2BPage/B2BPage.css) with a mock corporate dispensing kiosk visual and corporate partner request form.
- Updated [Navbar.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/Navbar/Navbar.jsx) to display "Store" and "B2B" menu links beside "Products".
- Updated [Footer.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/Footer/Footer.jsx) to link to `/store` and `/b2b` under Shop.
- Registered `/store` and `/b2b` routes in [App.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/App.jsx).

**Files Touched:**
- `src/pages/StorePage/StorePage.jsx`
- `src/pages/StorePage/StorePage.css`
- `src/pages/B2BPage/B2BPage.jsx`
- `src/pages/B2BPage/B2BPage.css`
- `src/components/Navbar/Navbar.jsx`
- `src/components/Footer/Footer.jsx`
- `src/App.jsx`

**Verification:**
- `npm run build`: Completed successfully in 806ms.

---

## Wave 6: Optimize Image Quality and Spacing

**Objective:** Resolve the blurry rendering of the hero section cup image and minimize the excessive spacing in the Trending Mixes section.

**Changes:**
- Replaced 14 low-resolution embedded base64 WebP images inside `public/Homepage.svg` (such as the main cup image `image3_366_1172`) with references to the high-resolution PNG files from `public/images/`.
- Shrunk the marquee height of the Trending Mixes section in `HomePage.css` from `5.52%` to `4.85%`.
- Decreased the horizontal gap between trending mix cards from `5.5vw` to `3vw` and adjusted padding to `0 3vw 0 5vw`.
- Lifted the trending mixes footer controls up by setting `top: 71.85%` (was `72.52%`) to reduce vertical whitespace below the cards.

---

## Wave 7: Seamless Curved Wave Background, Scroll Animations & Header

**Objective:** Fix the layout and repeating pattern seams in the Why Chilled background section, restore the curved wave top boundary, and add a centered "Why Chilld?" title header that animates in staggered fashion with the cups, keeping everything correctly spaced and positioned below the name during scroll.

**Changes:**
- Modified [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) to set the background of `.desktop-homepage__why-chilld` to transparent, and removed the repeating seamed background-image pseudo-element.
- Implemented `injectWhyChilldBackground` in [HomePage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.jsx) to find background wave elements using space-and-comma normalization (immunizing them to browser-specific DOM serialization), color them with `#eaf5ff`, and overlay a single stretched instance of `/Subtract%20copy.svg` with `mix-blend-mode: multiply` at `opacity: 0.42` using a seamless SVG `<clipPath>` for perfect dynamic scaling and resize.
- Added `<h2 className="desktop-homepage__why-chilld-title">Why Chilld?</h2>` in [HomePage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.jsx) and styled it in [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) to center it below the wave curve.
- Shifted the Why Chilled cup item positions downward and clamped scroll parallax translation `shift` to `Math.max(0, shift)` in [HomePage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.jsx) so that cups never translate upward above their layout coordinates.
- Added staggered scroll-triggered fade-in and slide-up entrance animations for the Why Chilled title and 4 cup cards using `IntersectionObserver`.
- Imported the **Antonio** condensed Google Font in `global.css` and updated cup number labels in [WhyChilldCup.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/WhyChilldCup/WhyChilldCup.jsx) to use it with `fontFamily="'Antonio', sans-serif"`, `fontWeight="700"`, and `fontSize="54"`.
- Inverted the background pattern fading direction (now fading from left-to-right) by applying `transform="scale(-1, 1)"` and `x="-1512"` on the SVG background image tag.
- Balanced the horizontal layout spacing of the cup elements symmetrically in [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) (Cup 1 at `left: 6%`, Cup 2 at `left: 27.7%`, Cup 3 at `left: 49.5%`, and Cup 4 at `right: 6%`).
- Created `injectB2bGraffiti` in [HomePage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.jsx) which overlays the scribble pattern `/Subtract%20copy.svg` on the B2B section light blue background rect using a linear gradient mask, creating a beautiful fade-out from left (fully visible) to right (fully transparent).
- Modified `hideStaticPlaceholders` in [HomePage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.jsx) to match and set the fill of the footer background rects at `y=7193` to `#eaf5ff` (upped light blue), removing the white/gray gap above the dark navy footer wave shape.
- Refined the typography styles in [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) for Why Chilld cards: increased title size to `1.95rem` at `line-height: 1.1`, and changed description `font-weight` to `500` to match the elegant thin italics of the Figma design.
- Corrected description copy punctuation (changed comma to period) in [WhyChilldCup.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/WhyChilldCup/WhyChilldCup.jsx) for the second cup card.

**Files Touched:**
- `src/pages/HomePage/HomePage.jsx`
- `src/pages/HomePage/HomePage.css`
- `src/components/WhyChilldCup/WhyChilldCup.jsx`
- `src/styles/global.css`

**Verification:**
- `npm run build`: Production build completed successfully in 2.04s.

---

## Wave 8: Update Recipes Page Headline, Subheadline and Verify Fonts

**Objective:** Check page fonts and update the Recipes page headline and subheadline according to the user's requirements.

**Changes:**
- Modified [RecipesPage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/RecipesPage/RecipesPage.jsx) to change the main title to "One Cold Brew, Many Vibes" and subheadline to "Why invent when prompting can do? Get inspired or just copy, do what you like with our collection of cold brew recipes created by the enthu types."
- Verified that active fonts match the design tokens ('Outfit' for headers, 'Inter' for body and subheads) and Google Fonts loading is fully functional.

**Files Touched:**
- `src/pages/RecipesPage/RecipesPage.jsx`

**Verification:**
- `npm run build`: Production build completed successfully in 2.06s with zero errors.
- Visual check: Navigated to `/recipes` via browser subagent and verified the headline, subheadline, and font loading match the layout specifications.

---

## Wave 9: Align Homepage Cup Images and Colors with Figma Design

**Objective:** Match the homepage cup images, lid colors, and alignments with the Figma design.

**Changes:**
- Retained the original high-fidelity images of the people inside the glasses/cups (including Cup 3: man in sunglasses, Cup 4: woman) to keep them exactly as they were before.
- Modified [WhyChilldCup.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/WhyChilldCup/WhyChilldCup.jsx) to make the pattern image continue and render inside the cup lid path `<path d={item.lidPath} fill={`url(#${patternId})`} />` so the image extension is visible in the lid.
- Applied a semi-transparent lid color overlay on top of the lid image with `opacity={0.6}` and `mixBlendMode="multiply"` to match the Figma lid styling.
- Defined custom lid colors (`lidColor`) matching the Figma screenshot:
  - Cup 1: `#B89047` (golden bronze).
  - Cup 2: `#1F2A44` (dark navy).
  - Cup 3: `#BFC1C2` (silver/light grey).
  - Cup 4: `#E2E8F0` (transparent light grey/white).

**Files Touched:**
- `src/components/WhyChilldCup/WhyChilldCup.jsx`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 10: Style Code Your Own Coffee Text and Optimize Cup Image Scaling

**Objective:** Align the casing and style of the "Code your own Coffee" text with the mockup, and scale/shift the cup pattern images so that their heads extend visibly into the cup lids.

**Changes:**
- Updated [HomePage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.jsx) to display "Code your own Coffee" in sentence-case.
- Modified [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) to set `.homepage-react-hero__glass-headline` text color to `#FFFFFF`, set `font-weight: 700`, change `text-transform` to `none`, and apply a dark dropshadow `text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4)` to match the mockup.
- Adjusted `patternScale`, `patternX`, and `patternY` inside `WHY_CHILLD_ITEMS` in [WhyChilldCup.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/WhyChilldCup/WhyChilldCup.jsx) to zoom all cup images more and translate them upward, making the heads of the people show clearly in the lids of the glasses.

**Files Touched:**
- `src/pages/HomePage/HomePage.jsx`
- `src/pages/HomePage/HomePage.css`
- `src/components/WhyChilldCup/WhyChilldCup.jsx`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 11: Adjust Frappe Cup Scaling and Revert Why Chilld Cup Scaling

**Objective:** Adjust the size and positioning of the hero frappe cup, and revert Why Chilld cup image offsets/scaling to ensure the faces/bodies are fully visible.

**Changes:**
- Updated [HomePage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.jsx) `COFFEE_CUP_IMAGES` constant: increased `scale` of the `FRAPPE` cup to `1.30` (was `1.15`) and set `yOffset` to `40` to make it larger and shifted downward.
- Reverted `patternScale`, `patternX`, and `patternY` settings of the 4 cups inside [WhyChilldCup.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/WhyChilldCup/WhyChilldCup.jsx) to their original working values, ensuring the people inside the glasses/cups are fully visible without clipping out of bounds.

**Files Touched:**
- `src/pages/HomePage/HomePage.jsx`
- `src/components/WhyChilldCup/WhyChilldCup.jsx`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 12: Implement SVG Pattern Rotation Support

**Objective:** Add pattern rotation support to Why Chilld cups to enable rotation of the image pattern inside the SVG path.

**Changes:**
- Updated [WhyChilldCup.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/WhyChilldCup/WhyChilldCup.jsx) to append `item.transform` (e.g. `rotate(9)`) inside the SVG `<pattern>`'s `patternTransform` attribute, enabling the image pattern to rotate.
- Cleaned up unneeded TS imports from `three/tsl` which were causing local compile errors, and restored lid colors for the cups.

**Files Touched:**
- `src/components/WhyChilldCup/WhyChilldCup.jsx`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 13: Make Why Chilld Background Screen Responsive

**Objective:** Remove left and right padding from the abstract background illustration behind the glasses and make it screen responsive.

**Changes:**
- Updated [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) inside `.skip-why-chilld__background img` to change `object-fit` from `contain` to `cover`, forcing the abstract graphic to stretch fully across the screen without margins or letterboxing.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 14: Align Card Heading and Paragraph Text to Cup Rotation

**Objective:** Rotate the text under each "Why Chilld?" glass cup card to align exactly with the tilt/rotation angle of its corresponding cup.

**Changes:**
- Updated [WhyChilldCup.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/WhyChilldCup/WhyChilldCup.jsx) to wrap the `h3` heading and `p` description elements in a `.why-chilld-cup-text` wrapper div.
- Modified [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) to add styling for `.why-chilld-cup-text` that applies `transform: rotate(var(--why-cup-rotation, 0deg))` with `transform-origin: center top`, aligning the text rotation perfectly with the cup rotation while keeping the manually adjusted image scale/pan values untouched.

**Files Touched:**
- `src/components/WhyChilldCup/WhyChilldCup.jsx`
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 15: Align Text Rotation with Cup by Rotating Inner Container

**Objective:** Ensure that both the cup illustration and the text under it rotate together as a single unit, maintaining perfect spacing and alignment underneath the cup.

**Changes:**
- Updated [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) to shift the rotation transform, translation, hover states, and animations from `.skip-why-chilld__cup-wrap` directly onto the parent `.why-chilld-cup-inner` container.
- Cleaned up the separate transform on `.why-chilld-cup-text` since it now automatically rotates with its parent container.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 16: Separate Cup and Text Rotation to Prevent Clipping

**Objective:** Prevent cup and text clipping at the bottom of the section by restoring standard card layout and applying rotation independently to the cup wrapper and text container.

**Changes:**
- Reverted the parent `.why-chilld-cup-inner` container rotation in [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css).
- Restored standard rotation, translation, animations, and hover states directly on the `.skip-why-chilld__cup-wrap` element.
- Applied `transform: rotate(var(--why-cup-rotation, 0deg))` with `transform-origin: center top` to `.why-chilld-cup-text` so the text rotates to match the cup's rotation angle independently, preventing container bounding box shifts and clipping.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 17: Unified Rotation on Inner Container and Expanded Section Height

**Objective:** Fix text positioning and spacing under the cup, aligning both perfectly by rotating `.why-chilld-cup-inner` together and expanding the section `min-height`/`padding` to prevent bottom boundary clipping.

**Changes:**
- Restored unified rotation, translation, animations, and hover states on `.why-chilld-cup-inner` in [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css).
- Removed separate rotation styling on `.why-chilld-cup-text` and `.skip-why-chilld__cup-wrap`.
- Increased `.skip-why-chilld` `min-height` to `1060px` (was `980px`) and set `padding-bottom: 6rem` to give cards ample clearance at the bottom, eliminating text clipping.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 18: Adjust Hero Glass Headline Position Upward

**Objective:** Move the "Code your own Coffee" headline overlay on the home page hero cup slightly upward so that it rests inside the cup and doesn't overlap the bottom edge.

**Changes:**
- Updated [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) inside `.homepage-react-hero__glass-headline` to position `top` using `calc(var(--hero-cta-top, 52%) - 8%)`, shifting it 8% higher relative to the cup body.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 19: Resize Hero Glass Headline According to Glass Width

**Objective:** Prevent the "Code Your Own Coffee" text overlay from overflowing narrower glass/cup shapes (like the Espresso glass) by making the font-size responsive to the cup scale and constraining its maximum width to wrap neatly.

**Changes:**
- Updated [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) inside `.homepage-react-hero__glass-headline` to calculate `font-size` dynamically using `calc(clamp(1.4rem, 2.2vw, 2.5rem) * var(--hero-cup-scale, 1))`.
- Set `max-width: 58%` to ensure the text is constrained to the width of the glass body, forcing it to wrap to two lines on narrower cups rather than overflowing.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 20: Position Headline Higher, Prevent Wrap, and Dynamic Size Scaling

**Objective:** Move the "Code Your Own Coffee" text higher on the glass, restrict it to a single line, and scale its size dynamically to fit the width of the glass cup perfectly.

**Changes:**
- Updated [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) inside `.homepage-react-hero__glass-headline` to set `top` to `calc(var(--hero-cta-top, 52%) - 15%)` to shift it higher.
- Added `white-space: nowrap` and removed `max-width` restrictions to keep the text strictly on a single line.
- Refined the dynamic font size calculation: `calc(clamp(1.1rem, 1.6vw, 2.0rem) * var(--hero-cup-scale, 1))` to size the text up/down according to the cup scale.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 21: Apply Rotation to Card Text Container

**Objective:** Rotate the text card container underneath the cups to align exactly with the cup tilt/rotation.

**Changes:**
- Added `transform: rotate(var(--why-cup-rotation, 0deg))` back to `.why-chilld-cup-text` in [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) to ensure the text is tilted exactly at the same angle as the cup body.

**Files Touched:**
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 22: Compensate Text Spacing/Offset from Rotation Swing

**Objective:** Center the rotated text perfectly under each glass cup card by counter-translating the text container horizontally to offset the swing caused by the rotation transform.

**Changes:**
- Added custom `textXOffset` parameters for each cup card inside `WHY_CHILLD_ITEMS` in [WhyChilldCup.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/WhyChilldCup/WhyChilldCup.jsx).
- Passed the offset variable as `--why-text-x` to the component style.
- Updated [HomePage.css](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/HomePage/HomePage.css) inside `.why-chilld-cup-text` transform to include `translateX(var(--why-text-x, 0px))`, shifting Cup 4 slightly to the left (`-22px`) and other cups as needed to perfectly balance the layout.

**Files Touched:**
- `src/components/WhyChilldCup/WhyChilldCup.jsx`
- `src/pages/HomePage/HomePage.css`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 23: Disable Ordering and Add Delivery Warning Banner

**Objective:** Disable order placement system-wide, and show a clear notice banner at the checkout stage stating that delivery is only available in Mumbai and will be available soon elsewhere.

**Changes:**
- Modified [CheckoutPage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/CheckoutPage/CheckoutPage.jsx) to add a warning banner (`.delivery-notice-banner`) right above the primary order placement button.
- Disabled the "Proceed to Payment" action completely by setting `disabled={true}` and changing its label to "Ordering Temporarily Unavailable" with a locked cursor state to prevent customers from proceeding to place orders.

**Files Touched:**
- `src/pages/CheckoutPage/CheckoutPage.jsx`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 24: Add Concentrate Images, Restrict Bottle Sizes, and Declare Kiosk Launching Soon

**Objective:** Add Classic and Kaapi concentrate images, restrict size selection to 250ml only, and set product catalog states to "We will be live soon to place order" system-wide.

**Changes:**
- Updated [products.js](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/data/products.js) to configure the newly added `Classic-concentrate.png` and `Kappi-concentrate.png` images, and restricted `BOTTLE_SIZES` to a single 250ml size.
- Modified [ProductCard.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/components/ProductCard/ProductCard.jsx) to intercept grid quick-adds and show a toast warning stating that ordering is launching soon.
- Modified [ProductDetailPage.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/ProductDetailPage/ProductDetailPage.jsx) and [Step6Review.jsx](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/pages/CoffeeBuilderPage/steps/Step6Review.jsx) to disable ordering buttons and display "We will be live soon to place order".

**Files Touched:**
- `src/data/products.js`
- `src/components/ProductCard/ProductCard.jsx`
- `src/pages/ProductDetailPage/ProductDetailPage.jsx`
- `src/pages/CoffeeBuilderPage/steps/Step6Review.jsx`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.

---

## Wave 25: Map Bold Concentrate Image asset

**Objective:** Map the newly added Bold Concentrate image asset to the Bold Concentrate product and clean up accidental syntax.

**Changes:**
- Updated [products.js](file:///c:/Users/HP/Downloads/coffee-ordering-kiosk-Dev-Varun/src/data/products.js) to define `BOLD_IMAGE = '/bold-concentrate-bottle.png';` and resolved the accidental trailing double quote syntax error in the placeholder definition.
- Set the `image` property on the Bold Concentrate product to `BOLD_IMAGE` and updated the `galleryFor` selector to map the correct Bold Concentrate asset for that category.

**Files Touched:**
- `src/data/products.js`

**Verification:**
- `npm run build`: Production build completed successfully with zero compile errors.
