# 09 — SEO, analytics, deploy

## SEO (client has not decided)

**Problem:** the app is a client-rendered Vite SPA. Google renders JavaScript (slowly, unreliably for large sites); WhatsApp/Facebook/X link previews and many other crawlers do **not**. Product and collection pages are the pages that matter.

| Option | What crawlers get | Effort (estimate, one developer) | Cost / trade-off |
|---|---|---|---|
| **A. Bot-only HTML via Vercel Edge Middleware/Function** (recommended minimum) | for `/`, `/shop`, `/shop?category=…`, `/shop/:handle` and bot user-agents: real HTML with `<title>`, meta, canonical, Open Graph, JSON-LD and a plain product/list markup fetched from the Storefront API (public token, `s-maxage` cache) | ~2–4 days incl. sitemap | cheapest; humans still get the SPA; must keep markup in sync with the page |
| B. Hosted prerender (e.g. Prerender.io-type service) | rendered HTML of the live SPA for bots | ~0.5–1 day | monthly fee; third-party dependency; cache invalidation by URL |
| C. SSR (React Router framework mode / Hydrogen) | full server-rendered app | ~1.5–3 weeks (routing, data loaders, hosting change) | best long-term; services/mappers/hooks are reusable |

**Recommendation:** A at launch (previews + indexable product pages), re-evaluate C after traffic data. Not implemented yet — **client decision open** (OPEN-ISSUES Q1).

Basics (launch regardless of option, step 10):
- `useSeo` hook for per-route title/description/canonical; titles `{Title} — {Storage} {Color} | Apex Gadgets`.
- **Filtered/sorted shop URLs** (`f.*`, `sort`, `q`): `noindex, follow`, canonical = the unfiltered category URL. Category URLs `/shop?category=audio` are indexable (consider real paths `/shop/category/audio` in phase 3).
- JSON-LD `Product` on the PDP: `name, image[], description, sku, brand, offers{price, priceCurrency:"PKR", availability, itemCondition, url}`; `availability` = `InStock` or **`OutOfStock` for sold listings** (page stays 200); `itemCondition` `NewCondition` for grade `new`, else `UsedCondition`/`RefurbishedCondition` (client decides wording); no `aggregateRating` until real reviews exist. `Organization` + `WebSite(SearchAction → /shop?q={q})` on the home page; `BreadcrumbList` on shop and PDP.
- Sitemap: build script from the Storefront API (all available **and** sold products, `/`, `/shop`, category URLs, `/trade`, `/support`); `public/robots.txt` references it. Sold products stay in the sitemap (they carry "similar items").
- Redirects: `vercel.json` `redirects` for renamed handles (list kept in repo); SPA rewrite last; apex → `www`.

## Analytics (headless)
- GA4 + Meta Pixel loaded client-side. Typed events in `lib/analytics.ts` (`as const`): `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `begin_checkout` (just before the redirect), `search`, `generate_lead` (WhatsApp trade-in click), `contact` (WhatsApp links). Meta: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Lead`, `Contact`.
- Checkout and the thank-you page are Shopify-hosted: add the purchase pixels under **Settings → Customer events**; dedupe with a stable `event_id`. Manual-payment orders count at *order created*, not *paid* — report both.
- Consent banner not planned (Pakistan-only audience, assumption A14). ⚠ UNVERIFIED whether Shopify's Customer Privacy API is needed for headless pixels.

## Deploy (Vercel)
- Env (Production + Preview): `VITE_USE_MOCK_DATA=false`, `VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`, `VITE_SHOPIFY_API_VERSION` (optional), `VITE_SITE_URL`. **No Admin token and no `/api/*` functions at launch**; the edge middleware for SEO option A uses only the public token.
- `vercel.json`: SPA rewrite stays; add security headers (`X-Content-Type-Options`, `Referrer-Policy`, CSP allowing `cdn.shopify.com`, `*.myshopify.com`, analytics hosts, `wa.me`).
- Allowed domains: storefront domain + `*.vercel.app` previews. Customer Account API callbacks **[P]** need fixed HTTPS URLs (previews can't be registered).
- CI: `yarn typecheck && yarn lint && yarn build`; add `yarn shopify:audit` when the Shopify env is present.
- **[P] Later:** `api/newsletter.ts`, `api/trade-in.ts` (+ photo upload), `api/reviews.ts` — Vercel Node functions holding `SHOPIFY_ADMIN_TOKEN`/app tokens server-side, `Origin` allow-list, Turnstile, rate limit; exclude `/api/*` from the SPA rewrite.
