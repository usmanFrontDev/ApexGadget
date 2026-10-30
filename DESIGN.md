# DESIGN.md — Apex Gadgets design system

Source of truth for tokens is `src/index.css` (`@theme`); component variants live in `src/constants/ui.ts`.
This file describes them. If they disagree, the code wins — update this file.

## 1. Character
Premium, calm, Apple-like. Frosted white glass cards on a soft grey canvas, one confident red accent, tight
heading tracking, generous rounding (28px cards, full-pill controls). Phone/tablet layouts are **centred**;
desktop is left-aligned and split.

## 2. Colour tokens

| Token | Value | Use |
|---|---|---|
| `primary` | `#c82028` | CTAs, accents, active states, price highlights |
| `primary-deep` | `#8c0002` | pressed/dark red gradients |
| `ink` | `#141416` | text, dark icon badges |
| `ink-deep` | `#0a0a0b` | dark chips over imagery, newsletter base |
| `canvas` | `#f2f2f3` | page background |
| `paper` | `#f6f7f5` | text on dark surfaces |
| white `/80`–`/92` | – | glass surfaces, secondary buttons, chips |

Opacity scale for text: body `ink`, `ink/70` soft, `ink/60` muted; on dark `paper`, `paper/62`.
Colour swatches for the colour facet are defined in `SHOP_FACETS` (`constants/shop.ts`).
Rule: don't hardcode hex for theme colours; use the utility (`bg-primary`, `text-ink`).

## 3. Typography
Fonts: **Plus Jakarta Sans** (`font-sans`, default; UI + headings, weights 600/700/800) and **Montserrat**
(`font-body`; paragraphs, weights 400/700). All text goes through `components/ui/Typography.tsx`.

| Variant | Phone → tablet → desktop | Weight / tracking | Default tag |
|---|---|---|---|
| Display | 28 → 40 → 52/56 (xl) | 800 / −0.03em | h1 |
| Heading | 26 → 32 → 40 (lg) | 700 / −0.035em | h2 |
| Title | 22 → 25 → 27 | 800 / −0.03em | h3 |
| Subtitle | 17 → 18 → 20 | 700 / −0.02em | h3 |
| CardTitle | 15.5 → 16 | 700 | h3 |
| Lead | 15/24 → 16/26 (body font) | – | p |
| Body | 14/20 → 14.5 | – | p |
| BodySm | 13/18 | – | p |
| Caption | 12/16 → 12.5 | – | p |
| Eyebrow | 11 → 11.5, uppercase, +1.61px | 700 | p |
| Price | 19 → 20 | 800 / −0.5px | p |
| Quote | 15/22 → 16 | – | blockquote |

Tones: Default, Muted, Soft, Inverse, InverseMuted. Align: Start, Center, CenterBelowSm, **CenterBelowLg**
(centred on phone/tablet, left on desktop). Headings are `text-balance` where used; long words wrap (`overflow-wrap:anywhere`).

## 4. Layout and spacing
- Breakpoints (Tailwind v4 defaults) `sm 640 · md 768 · lg 1024 · xl 1280` plus custom **`hd` = 1400px** (4-column product grid). Verify at 320, 375, 390, 430, 768, 1024, 1440.
- `Container`: gutters `px-3` → `sm:px-6` → `lg:px-8`; page column token `--container-page` 82rem.
- Section rhythm: `mt-10` → `sm:mt-14` → `lg:mt-20` (bestsellers `lg:mt-[70px]`). Grid gaps `gap-4` → `sm:gap-5` → `lg:gap-6` → `xl:gap-7`.
- **Below lg: centred approach** — centred headings and text, full-width CTAs, one product card per row (`max-w-[340px]`), odd last grid item spans the row (`max-sm:odd:last:col-span-2`).
- Product grid: 1 col (<520) → 2 → 3 (md) → 4 (`hd`). Shop filters: sidebar ≥ 1024, `Drawer` below.
- Safe areas: viewport `viewport-fit=cover`; header and footer add `env(safe-area-inset-*)`.

## 5. Surfaces, radius, elevation
- **GlassCard** (`rounded-[28px] bg-white/80 backdrop-blur-[18px]`, `overflow-clip`, inner hairline ring):
  `Hero` (`shadow-glass-hero`), `Promo` (`shadow-glass-promo`, red-tinted), `Soft` (`shadow-glass-soft`; categories, products, features, reviews).
- Radii: cards 28px; controls/chips/inputs `rounded-full`; inner image tiles ≈ 20px.
- Shadows (one token per element — tokens already include rings): `header`, `glass-hero/promo/soft`, `primary`, `primary-soft`, `newsletter`, `banner`; rings `ring`, `ring-primary`, `inset-glass`, `inset-promo`.
- Dark feature surface: newsletter `linear-gradient(135deg,#17070a,#0c0c0e)` with a faint red radial glow and `shadow-newsletter`.
- Imagery glow: a soft blush/red radial behind hero and promo images (decorative, `aria-hidden`).

## 6. Components

| Component | Variants / props | Notes |
|---|---|---|
| `Button` | `block` = full width at every size, label centred, circle icon pinned right (Checkout); `variant` Primary (red, `shadow-primary`) / Secondary (white/92, ring); `size` Xs 42 · Sm 46 · Md 50 · Lg 52px; `icon`, `iconPosition`, `iconStyle` Circle (dark round badge) / Plain; `iconAnimation`; `fullWidth`; `blockOnMobile` | Full pill. Both variants use the same weight (bold) so a Primary and a Secondary side by side read as the same size. `blockOnMobile` = full width < sm, label centred, icon pinned right. Single line, `whitespace-nowrap`. Use `active:scale-none` when stretched-link. |
| `IconButton` | `size` Sm/Md/Lg, `label` required | Round, white glass, hover scope; header uses Md → `sm:size-11`. |
| `Chip` | `size` Xs 26 · Sm 30 · Md 34 · Lg 40; `variant` Default / Label (uppercase) / Dark (over imagery, "PTA APPROVED") / Tint (soft red, grade) | White/92 pill with ring; text `truncate`. |
| `GlassCard` | Hero / Promo / Soft | see §5 |
| `SectionHeading` | eyebrow + Heading + optional action | column centred < lg, row with action right on lg. |
| `Typography`, `Container`, `Reveal` (scroll-in), `Drawer`, `SelectMenu`, `Checkbox`, `RangeSlider`, `Pagination`, `FilterChip`, `Skeleton`, `EmptyState`, `Breadcrumb` | – | see AGENTS.md |
| Cards | **one product card everywhere: `ShopProductCard`** (shop, home bestsellers, similar products), `CategoryCard`, `PromoCard`, `FeatureCard`, `TestimonialCard` | equal heights (`h-full`), price + CTA pinned bottom (`mt-auto`), titles `line-clamp`. |

Header: sticky glass bar (`shadow-header`), `h-14` phone → larger on `sm`, logo `h-7`/`sm:h-8`, nav (Shop, Trade, Support), search/cart/account icon buttons, account pill with initials avatar, cart badge capped `99+`.
Footer: brand + description, 3 link columns (Shop, Support, Company), copyright + payment chips; centred on phone.

## 7. Motion
- Hover icon animations via `data-hover-scope` + `data-icon-animation` (`point-right` rotates 45°, `nudge-right`, `nudge-up-right`, `spin`, `grow`), 300ms `cubic-bezier(0.22,1,0.36,1)`. Every arrow icon button/link passes `iconAnimation`.
- `Reveal` fades/slides sections in on scroll (staggered `delay = index * 0.06`). Banner carousel autoplay 5s.
- All motion respects `prefers-reduced-motion`.

## 8. Imagery
Product photos on neutral/transparent backgrounds, centred, `object-contain`; hero and promo art are transparent PNG/WebP
with fixed ratios (872:1015, 500:601, 600:710) positioned absolutely — keep ratios (see `docs/shopify/04-image-specs.md`).
Banners 8:3 (shop) and ≈2.36:1 (home, 4:3 crop on phone, focal point right of centre). Missing images fall back to a striped placeholder.

## 9. States and robustness
- Loading: `Skeleton` / `ProductCardSkeleton`. Empty: `EmptyState`. Error: inline message with retry.
- Controls never wrap (`whitespace-nowrap`, `min-w-0 truncate` inside, `shrink-0` icons). No fixed widths that content can overflow.
- Optional badges/subtitles render nothing without leaving gaps. Test 1-word and very long copy at 320 and 1440.
- Focus: visible 2px primary outline, offset 2px. Hit targets ≥ 38px (header) / 42px (buttons). Contrast: `ink/60` is the lowest allowed text on white.

## 10. Content voice
Plain, honest, specific: "PTA approved and non-approved iPhones, tested before they ship." Say status (PTA / non-PTA), battery %, grade
and warranty on every listing. No unverifiable superlatives; certification claims must be owned by the client.
Currency is PKR, whole rupees, formatted by `formatPrice` ("Rs 359,500").

## 11. Page patterns: Trade-In, Favorites, Product

| Piece | Where | Notes |
|---|---|---|
| `PageBanner` | Trade-In, Favorites | glass card. `lg+`: the finished artwork (copy baked in, 3:1) + the copy as visually hidden text; below `lg`: centred chip + `h1` + lead + optional content, a 4:3 crop of the phones (`artPositionClassName`), optional action. `tone` = Light / Dark (panel colour behind the crop). |
| `CtaBanner` | Favorites, Product | dark gradient link banner (newsletter gradient, `shadow-banner`), title + caption, circular arrow (`PointRight`), optional `image` on the left. |
| `WishlistButton` | all product cards, PDP | heart `IconButton`, `aria-pressed`, filled red when saved, label "Add/Remove {title} to/from favorites". |
| Form kit | Trade-In | `FormField` (label, hint, error, `aria-describedby` via `fieldIds.ts`), `TextInput`, `TextArea`, `RadioGroup` (roving tabindex, arrows/Home/End) → `ChoiceChips`, `SegmentedControl`, `SwatchPicker`, `ChoiceCardGroup`; `Stepper` (pills from `sm`, "Step n of m" + progress bar on phones); errors are shown ONLY inline under each field (no summary box), the first invalid field gets focus and a visually hidden live region announces how many fields need attention. `SelectMenu` got a `field` look (full-width rounded input, `placeholder`, `icon`, `invalid`, scrolling list). |
| Selected state | choice controls | token `shadow-ring-selected` (1.5px red inset ring) + `bg-primary/8` + red text; hit height ≥ 42px. |
| `WishlistRow` | Favorites | list row instead of a card: picture, title + "subtitle · PTA · battery", price, red "View details" and "Remove" on one line (desktop); picture + details with the price under them and the actions below (phones). Left-aligned on purpose (it is a list). |
| Product buy box | PDP | ONE card, in decision order: stock chip → title + meta → price (+ compare-at, "Save Rs X") → short description (+ "Full details" link to the tabs) → condition report (4 tiles + box) → options → **buttons last** (Add to Cart + Save, or "View cart" + the quantity control). Full-width buttons are a phone pattern only. |
| `QuantityStepper` | PDP (in cart) | − 1 + pill, same 52px height as a large Button; `max` = stock limit (used phones: 1, so + is disabled and a hint says why). Once a variant is in the cart, "Add to Cart" becomes "View cart" (plus `CartQuantityControl` only when stock > 1; a single phone has nothing to choose). On the product page the Add to Cart button turns into `CartQuantityControl` once added. Secondary buttons, icon buttons, filter chips and pagination share one subtle hover (`hover:bg-canvas`); Primary uses `brightness-110`. Product page buttons hug their label (no min width), like every other Button. `size` Md (52px) / Sm (42px, cart lines). |
| `ConditionReport` | inside the buy box | four equal tiles (battery ring gauge, coloured by health: green ≥ 80 %, amber 70–79 %, red below; condition, network, warranty; 2 × 2 on every width) + box contents; no card of its own; only tiles with data. |
| `AskOnWhatsApp` | PDP, above the trust strip | pre-filled `wa.me` message about the product (number from `apex_site_settings`; hidden without one). |
| Product gallery | PDP | thumbnail rail (vertical from `lg`, horizontal row below), big image (fixed aspect, arrows, dots, swipe), grade/Sold chip. `ProductHighlights` (2–4 key specs, rendered through the gallery's `below` slot so it lines up with the main picture, not the thumbnail rail), `TrustStrip` (3 promises), `Tabs` (accessible tablist), "Detailed Information" card, `.rich-text` styles for Shopify HTML (sanitised). |
| PDP layout (lg) | `/shop/:handle` | two columns of **equal height, no sticky**: left = big picture (grows to fill) + key-spec strip, one width. Desktop: the **thumbnails are a vertical rail INSIDE the picture** (left edge, vertically centred) and prev / dots / next share one line at the bottom of the picture on every screen size; below `lg` the thumbnails are a row under the picture; right = buy box (grows) + WhatsApp card + trust strip. The two bottom strips share one height (120px) so they line up. Phones: gallery, specs, buy box, WhatsApp, trust. |
| Product card actions | all `ShopProductCard`s | ONE button, "View details" (no second button: it crowded the card). Price row: price left, round red bag `IconButton` (variant Primary, Md 38px) right = add (toast, no drawer); once in the cart it turns into `CartQuantityControl` (`Xs`, trash at 1). Hidden when sold or the product has options. Heart stays top right. |
| `CartQuantityControl` | card, PDP, cart page, mini-cart | wraps `QuantityStepper` (`Md` 52 / `Sm` 42 / `Xs` 38); same cart cache everywhere = always in sync; `removable` (card, PDP, mini-cart) turns − into a trash button at quantity 1; + is disabled at the stock limit (phones: 1). The cart page has its own Remove button, so it is not removable there. |
| `CartLineCard` | `/cart` | glass card: picture tile (88 → 112 → 132px), Tint grade chip, title link, subtitle, meta, "1 of 1 available" chip (quantity control `Sm` + the "1 of 1 available" / "Only n left" text), price top-right from `sm` (under the picture on phones), then the SAME buttons as everywhere: Secondary Xs "Remove" (trash, icon start) + `WishlistButton` (label "Save to favorites"/"Saved"), left-aligned under the details. A second heart sits top-right on phones (same toggle). Sold line: greyscale picture, muted price, solid red "Sold" chip, `Notice` (Unavailable). |
| `OrderSummary` | `/cart` | `<dl>`: Subtotal (N items, sold lines excluded), Discount (only when applied), Shipping "Calculated at checkout", Total; discount field (always visible from lg, `CollapsibleRow` below lg), `CheckoutButton` (`block`) + "Continue shopping", `PaymentMethods` (generic icons, optional `logo`); no trust rows. Sticky `lg:top-28` beside the lines. |
| `StickyCheckoutBar` | `/cart` below lg | fixed bottom bar, "Total (N items)" + amount + Checkout, `env(safe-area-inset-bottom)`; hidden while the summary card is in view; no ×. |
| `CartDrawer` | header cart icon only | existing `Drawer`: "Your Cart (N)", compact lines (`CartDrawerLine`: picture, title, price, quantity control with trash at 1; sold = chip + remove button), Subtotal, Checkout, "View cart"; closes on Esc / overlay / route change, focus returns to the cart icon (`returnFocusSelector`). Adding to the cart never opens it. |
| `Notice` | cart | red-tint box, variants `Unavailable` (`role="alert"`) and `Error` (put inside an `aria-live="polite"` wrapper); `compact` for the drawer / discount. |
| `CollapsibleRow` | cart | accordion row (icon, label, chevron), content `inert` while closed: "Add a note for delivery", "Add discount code" (below lg). |
| Toasts | app | `react-hot-toast` at **top-center**. ONE layout for every toast: `AppToast` (icon badge by variant Success / Error / Info, bold title, optional text, close X), always shown through `appToast.success/error/info(title, text?)` in `lib/appToast.tsx`; never call `toast()` directly. Cart copy is `{ title, text }` pairs in `CART_CONTENT.toast`. |
| Sold | PDP, cards | "Sold" chip, disabled "Sold out" button, similar items stay prominent; the page never 404s. |

Button icons sit in an `inline-flex` wrapper (`AnimatedIcon`) so they centre on the label's line in every size.

## 12. Rules for new UI
1. Reuse components; extend a variant map + `constants/ui.ts` instead of forking.
2. Tokens first; arbitrary px values only for one-off exact measurements.
3. Mobile-first; verify phone/tablet centred layout and desktop untouched.
4. Text via `Typography`; no raw `text-[..px]` on headings/paragraphs.
5. One shadow token per element; no transforms on stretched-link chains.
