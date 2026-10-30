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
| `Button` | `variant` Primary (red, `shadow-primary`) / Secondary (white/92, ring); `size` Xs 42 · Sm 46 · Md 50 · Lg 52px; `icon`, `iconPosition`, `iconStyle` Circle (dark round badge) / Plain; `iconAnimation`; `fullWidth`; `blockOnMobile` | Full pill. `blockOnMobile` = full width < sm, label centred, icon pinned right. Single line, `whitespace-nowrap`. Use `active:scale-none` when stretched-link. |
| `IconButton` | `size` Sm/Md/Lg, `label` required | Round, white glass, hover scope; header uses Md → `sm:size-11`. |
| `Chip` | `size` Xs 26 · Sm 30 · Md 34 · Lg 40; `variant` Default / Label (uppercase) / Dark (over imagery, "PTA APPROVED") / Tint (soft red, grade) | White/92 pill with ring; text `truncate`. |
| `GlassCard` | Hero / Promo / Soft | see §5 |
| `SectionHeading` | eyebrow + Heading + optional action | column centred < lg, row with action right on lg. |
| `Typography`, `Container`, `Reveal` (scroll-in), `Drawer`, `SelectMenu`, `Checkbox`, `RangeSlider`, `Pagination`, `FilterChip`, `Skeleton`, `EmptyState`, `Breadcrumb` | – | see AGENTS.md |
| Cards | `ProductCard`, `ShopProductCard`, `CategoryCard`, `PromoCard`, `FeatureCard`, `TestimonialCard` | equal heights (`h-full`), price + CTA pinned bottom (`mt-auto`), titles `line-clamp`. |

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

## 11. Rules for new UI
1. Reuse components; extend a variant map + `constants/ui.ts` instead of forking.
2. Tokens first; arbitrary px values only for one-off exact measurements.
3. Mobile-first; verify phone/tablet centred layout and desktop untouched.
4. Text via `Typography`; no raw `text-[..px]` on headings/paragraphs.
5. One shadow token per element; no transforms on stretched-link chains.
