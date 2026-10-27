# Project Rules — Shopify Headless Storefront (React)

Custom React frontend; **Shopify is the backend** (products, content, cart/checkout via Storefront API). No other backend. Follow these rules for every change.

## Stack
Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `@theme` inside `src/index.css`) · React Router (`react-router-dom`) · TanStack Query (server state) · Zustand (client/UI state) · Framer Motion (animations) · react-hot-toast · `@shopify/storefront-api-client`. Package manager: **yarn**.

## Folder structure (`@/` alias = `src/`)
```
src/
  app/          providers.tsx, router.tsx        # app wiring only
  pages/        <name>/<Name>Page.tsx            # route-level, composes sections only
  sections/     page sections (Hero, Footer...)  # composed from components
  components/
    ui/         generic primitives (Button, IconButton, Chip, GlassCard, Container, SectionHeading...)
    icons/      one SVG icon component per file (currentColor), exported via index.ts
    layout/     Header, Footer, RootLayout, ScrollToTop
    shop/       shop-page parts (ProductGrid, ShopFilterPanel, ActiveFilters, ResultsFooter...)
    common/     reusable domain-agnostic blocks (ProductCard, SectionHeader...)
  hooks/        useXxx.ts — TanStack Query hooks wrapping services
  services/     <feature>.service.ts — API calls + GraphQL (no React here)
  store/        Zustand stores (useCartStore.ts ...)
  lib/          shopify.ts, queryClient.ts, cn.ts
  types/        shared TS types
  constants/    routes, queryKeys, enums (as-const objects), static config
  assets/       icons/, images/
```

## Component rules
- One component per file, PascalCase file name, named `Props` interface (`ButtonProps`) defined above it; no `any`.
- Pages compose sections; sections compose components; **no raw page-specific markup duplicated** — if used twice, extract to `components/`.
- Reusable components accept `className` and merge with `cn()` (`@/lib/cn`); use variants via props (typed unions), not copy-pasted components.
- Static content (copy, links, card data) lives in `constants/` or is passed as props — never hardcoded deep in JSX.
- Icons/images from `assets/`; prefer inline SVG components for icons.
- Keep components small and presentational; data fetching goes in hooks, not in components.

## Reusable UI building blocks (use these, don't re-create)
- `Button` (`components/ui/Button.tsx`): props `variant` (Primary|Secondary), `size` (Sm|Md|Lg), `icon` (any node), `iconPosition` (Start|End), `iconStyle` (Circle|Plain), plus `to` (router link) / `href` (anchor) / `onClick`. All option values come from `constants/ui.ts`.
- `Button` also has `fullWidth` (label left, icon right) and sizes Xs|Sm|Md|Lg; `Chip` sizes Xs|Sm|Md|Lg, variants Default|Label|Dark; `GlassCard` variants Hero|Promo|Soft (override radius via `className`).
- `IconButton` (round, `label` required for a11y), `IconCircle` (decorative round badge), `Chip`, `GlassCard`, `SectionHeading`, `Container`, `Reveal` (scroll animation). Cards: `ProductCard`, `CategoryCard`, `PromoCard`, `FeatureCard`, `TestimonialCard`; `BannerCarousel` (+ `useCarousel` hook). Link/anchor/button switching is handled by `ActionElement`.
- **Icon hover animations**: `Button`, `IconButton`, `IconCircle` take `iconAnimation` (`IconAnimation.PointRight` = up-right arrow rotates to point right, plus NudgeRight, NudgeUpRight, Spin, Grow). Animations live in `index.css` (`[data-icon-animation]` inside a `[data-hover-scope]` ancestor; reduced-motion safe). Every arrow-icon button/link should pass `iconAnimation`. To animate on a card hover, put `data-hover-scope` on the card.
- Need a new variant? Extend the existing component's variant map + `constants/ui.ts`; don't fork a new component.
- Custom theme tokens that map to Tailwind classes (`shadow-*`, `font-body`) must also be registered in `src/lib/cn.ts` (tailwind-merge config), otherwise `cn()` overrides won't resolve. One box-shadow token per element: tokens already include their inner rings; two `shadow-*` classes don't combine.
- File names must differ by more than casing (macOS is case-insensitive).
- Fonts: Plus Jakarta Sans = default (`font-sans`), Montserrat = body copy (`font-body`). Section content/data lives in `constants/<page>.ts` with types in `types/<page>.types.ts`.
- Temporary placeholders live in `constants/mock.ts` and must be replaced by Shopify data.
- **Shop page**: the whole catalogue is fetched once (`services/products.service.ts` -> `hooks/useCatalog.ts`, cached), then filtered / sorted / counted / paginated **client-side** by pure functions in `lib/shopCatalog.ts` (`hooks/useShopCatalog.ts`). That gives instant filtering, facet counts and price bounds. Filters, sort and page live in the URL (`hooks/useShopFilters.ts`, keys in `ShopParam` + `SHOP_FACETS` in `constants/shop.ts`), so every state is shareable. To add a filter: add a `FacetKey` + entry in `SHOP_FACETS` + a case in `getFacetValues`.
- Catalogue source: **mock data is the default** (`constants/mockProducts.ts`) while the frontend is being built; Shopify Storefront API is used only with an explicit `VITE_USE_MOCK_DATA=false` plus credentials. Shopify integration comes later — don't spend time on it now. Products are mapped from Shopify **tags** (`model:iphone-15`, `storage:256gb`, `battery:96`, `color:black`, `grade:excellent`, `pta` / `non-pta`) and `productType` (`iPhones` = phones, anything else = accessories) — see `SHOPIFY_TAG` in `constants/shop.ts`. Keep both sources returning `ProductSummary[]`.
- Inputs that mirror a URL value (price slider) must follow the URL when it changes elsewhere: keep a `syncedValue` state and adopt the new value during render (see `PriceRangeFilter`) — don't remount with `key`, it races with the URL update.
- **Stretched links** (whole card/banner clickable via `after:absolute after:inset-0` on a link): never put a transform on the link or its parent chain up to the positioned container (`active:scale-*`, `hover:scale-*`, `translate-*`): a transform turns that element into the containing block and shrinks the clickable area. Use `active:scale-none` on `Button`s used this way.
- Shop primitives: `Checkbox`, `RangeSlider` (two native range inputs), `Pagination`, `SelectMenu` (accessible listbox, `compact`), `Drawer` (focus trap, Esc, scroll lock), `FilterChip` (white/solid-red pill), `Skeleton`, `EmptyState`, `Breadcrumb`. Shop-only parts live in `components/shop/`.

## Styling / Figma fidelity
- Tailwind utilities only; no inline styles, no CSS files except `index.css`.
- **Theme tokens first**: colors, fonts, radii, shadows, breakpoints from Figma are defined once in `@theme` in `src/index.css` and used via utilities (`bg-primary`). Never hardcode hex/px values that belong to the theme; arbitrary values (`w-[343px]`) only for one-off exact measurements.
- Match Figma exactly (spacing, font size/weight/line-height/letter-spacing, radius, colors). Mobile-first responsive: base = mobile, then `sm/md/lg/xl`. Verify at 375, 768, 1024, 1440.
- When given a screenshot instead of Figma access, follow the same tokens, component structure and conventions already in the codebase — reuse existing components before creating new ones.

## API integration flow (mandatory order)
Every API integration follows this chain: **service → hook → component/page**. Components never call services or the Shopify client directly.

1. **Service** (`services/<feature>.service.ts`): plain async functions that call the API (`shopifyClient.request` + GraphQL query string kept in the same file or `services/<feature>.queries.ts`). Fully typed params and return values; no React, no hooks, no toasts. Map raw API responses to our own domain types (`types/<feature>.types.ts`) here.
2. **Query keys** (`constants/queryKeys.ts` or `services/<feature>.keys.ts`): one central, typed key factory per feature, e.g.
   ```ts
   export const productKeys = {
     all: ['products'] as const,
     list: (params: ProductListParams) => [...productKeys.all, 'list', params] as const,
     detail: (handle: string) => [...productKeys.all, 'detail', handle] as const,
   }
   ```
   Never write inline array keys in hooks or components. Invalidate via the same factory.
3. **Hook** (`hooks/use<Feature>.ts`, e.g. `useProducts`, `useProduct`, `useAddToCart`): wraps the service with TanStack Query (`useQuery` for reads, `useMutation` for writes). Owns `queryKey`, `enabled`, `staleTime`, `select`, `onSuccess` invalidation and toast feedback for mutations. Returns the query/mutation result (typed).
4. **Component/page**: only calls the hook and renders `isLoading` / `isError` / data states. No fetching logic, no key handling.

Rules: one service file + one hook file per feature; hooks are the only place that imports from `services/`; keep services testable and framework-free.

## Enums & constants (fixed, non-changing data)
- Any value that is decided up-front and does not change at runtime must be a typed constant, never a magic string/number scattered in code. Examples: route paths, query-key roots, sort options, product sort keys, variant/size/color option names, button/badge variants, breakpoints, nav links, storage keys, toast messages, animation durations, Shopify API version.
- Use **`as const` objects + derived union types** (erasable-syntax-safe; `enum` keyword is NOT allowed because `erasableSyntaxOnly` is on):
  ```ts
  export const ProductSortKey = {
    Title: 'TITLE',
    Price: 'PRICE',
    BestSelling: 'BEST_SELLING',
  } as const
  export type ProductSortKey = (typeof ProductSortKey)[keyof typeof ProductSortKey]
  ```
- Location: shared ones in `constants/` (`constants/<topic>.ts`), feature-specific ones next to the feature types in `types/`. Import them everywhere instead of re-typing the literal.
- Component variant props use these derived unions (`variant: ButtonVariant`) so invalid values fail at compile time.

## State & data
- Server state (products, collections, cart from Shopify) → always through the service → hook chain above. Never copy server data into Zustand.
- Client/UI state (cart drawer open, filters UI, etc.) → Zustand store in `store/` (`use<Name>Store.ts`), typed state + actions, select with selectors to avoid re-renders.
- Shopify client is a singleton from `lib/shopify.ts`.
- User feedback via `react-hot-toast` (triggered from mutation hooks, messages from constants). Animations via Framer Motion (shared variants in `lib/` or `constants/`; respect reduced motion).

## UI/UX robustness (check on every component)
- **Sticky sidebars** must never be taller than the viewport: `sticky top-28` + `max-h-[calc(100dvh-8rem)]`, fixed header row, scrollable body (`min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-thin`, bottom `mask-image` fade + bottom padding, focusable `role=region`).
- **Visually-hidden inputs** (`sr-only` checkbox/radio/switch inputs are `position:absolute`): their row/label MUST be `relative`. Otherwise the containing block is a far ancestor, the input doesn't move with scrolled content, and focusing it makes the browser scroll that ancestor (the filter card's content slid out and left a blank card). Card surfaces use `overflow-clip` (not `overflow-hidden`) so nothing can scroll them programmatically.
- **Sticky sidebar + changing result count**: if results shrink, the grid gets short and the sidebar can't stay stuck; `ShopCatalogSection` scrolls the grid back into view only when the sidebar has left its sticky position. Don't use `mask-image` on a scroller inside `backdrop-blur` cards (repaints wrongly) — use an overlay gradient.
- - **Product grid columns**: 1 (<520px) -> 2 -> 3 (md) -> 4 (`hd` = 1400px, custom breakpoint in `index.css`). Use `hd:` instead of arbitrary `min-[...]` breakpoints (arbitrary ones can sort before `md:` in the CSS and lose).
- **Equal heights**: cards in a grid/row must stretch to the tallest (`h-full` through `li` → `Reveal` → card, no `items-start`); pin the variable-height parts so rows align: price + CTA at the bottom (`mt-auto`), author/footer line at the bottom, CTA at the bottom of promo cards.
- **Content must never break layout**: clamp long text (`line-clamp-*` for titles/subtitles, `truncate` for single-line labels/chips/names), reserve space next to absolutely-positioned controls (e.g. `pr-*` beside an arrow button), give counters `min-w` + cap (`99+`), keep `min-w-0` on flex children that contain inputs/text.
- **Single-line controls never wrap**: buttons, chips, pills, select triggers, option rows and labels use `whitespace-nowrap`; flexible text inside them is `min-w-0 truncate` and fixed bits (icons, prefixes) are `shrink-0`. Never give a control a fixed width that its longest possible content doesn't fit — size selects by their longest option (all options in one grid cell, only the selected one visible) so the width doesn't change on selection.
- **Floating menus** (dropdowns, popovers) open toward the side with room (measure the trigger on open) and are capped at `max-w-[calc(100vw-2rem)]`.
- **Very long words**: headings/paragraphs/quotes get `overflow-wrap: anywhere` globally (`index.css`), so an unbroken string wraps inside its card instead of spilling or being cut.
- **Test text edge cases at 320px and 1440px**, with the longest sort label, many active filters, a 5-digit cart count, long titles and unbroken words (an automated audit for wrapped controls / clipped text / out-of-viewport text is easy to script with Chrome DevTools).
- **Missing data**: images fall back to a placeholder, optional badges/subtitles render nothing without leaving gaps.
- **Short and long content both look right**: before finishing a component, test with 1-word and very long copy at desktop and ~700px/390px widths.
- Wrap rows (`flex-wrap`) instead of hiding important actions on small screens.

## Code quality
- TypeScript strict; type props, hooks returns, API responses. No unused code, no `console.log` left behind.
- Use `@/` imports, not deep relative paths. Routes via `ROUTES` constant.
- Accessible by default: semantic HTML, alt text, button vs link correctness, focus states.
- Secrets: only the public Storefront token in `.env` (`VITE_` vars). Never commit/use Admin API tokens.
- Run `yarn build` and `yarn lint` before declaring work done.
