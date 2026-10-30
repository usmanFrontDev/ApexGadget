# 00 — Overview

Apex Gadgets: refurbished iPhones + Apple accessories, Pakistan, **PKR**. Shopify is the only backend; the Shopify store is
currently inactive, so everything is built on mock data (`VITE_USE_MOCK_DATA=true`) first.
`02-data-model.md` and `06-field-mapping.md` are the contract; `10-filters-and-search-discovery.md` defines the shop filters.

## Architecture

```
Shopify Admin (client enters data)
  products · collections · metafields · metaobjects · pages · policies · Search & Discovery filters
        │
        ▼
Storefront API (public token): filtered collection/search, product, cart, metaobjects, pages
        │
src/services/*.service.ts  → map raw → domain types (types/*.types.ts)
src/constants/queryKeys.ts → key factories
src/hooks/use*.ts          → TanStack Query (+ Zustand: cart id, drawers)
components / sections / pages   (never call Shopify)
```
**No Admin token and no serverless functions at launch.** Trade-in is a client-side `wa.me` link.

## Data flow per screen

| Screen | Source | Cache |
|---|---|---|
| Shop grid + filters | `collection(handle).products(filters, sortKey, first, after)` → `ShopResultsView` (products + `FilterGroup[]`), **server-side**, load-more cursor | key = normalised category+sort+filters |
| Shop `?q=` | `search(query, productFilters)` | same |
| Header search | `predictiveSearch` | per query |
| Home bestsellers | collection `bestsellers` (manual order) | 5 min |
| Home content | metaobjects `apex_*` | 10 min |
| Product page `/shop/:handle` | `product(handle)` (+ recommendations / similar); sold listings stay up | per handle |
| Cart | Storefront `cart*`, cart id in localStorage, checkout = redirect to `checkoutUrl` | cart id |
| Trade-in | form → message → `wa.me/<number>?text=…` (no request) | – |
| Account / orders | Customer Account API **[P]** | – |

## Environment variables

| Var | Where | Notes |
|---|---|---|
| `VITE_USE_MOCK_DATA` | client | `true` default; `false` only with real credentials |
| `VITE_SHOPIFY_STORE_DOMAIN` | client | `store.myshopify.com`; empty in `.env.example` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | client | **public** Headless-channel token |
| `VITE_SHOPIFY_API_VERSION` | client | optional; default in `src/constants/shopify.ts` (`2026-10`) |
| `VITE_SITE_URL` | client/build | canonical URL, sitemap (added in step 10) |
| `VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` **[P]** | client | public OAuth id |
| `SHOPIFY_ADMIN_TOKEN`, `SHOPIFY_ADMIN_STORE_DOMAIN`, `TURNSTILE_SECRET` **[P]** | Vercel server only | not used at launch; never `VITE_` |

## Launch vs post-launch

| LAUNCH | POST-LAUNCH |
|---|---|
| Catalogue + server-side filters (S&D), sort, load-more | Customer accounts (Customer Account API) |
| Product page incl. Sold state + similar items | Wishlist (and account sync) |
| Cart + Shopify-hosted checkout, manual payments (COD, bank transfer, EasyPaisa/JazzCash instructions) | Product-level reviews app |
| Home CMS (metaobjects), footer, banners, testimonials | SSR / prerender upgrade |
| WhatsApp trade-in (page UI from Figma later) | Newsletter function, trade-in backend / photo upload |
| Support content (policies, FAQ, warranty) | Online card / automatic wallet payments |
| Search (predictive + `?q=`), basic SEO, analytics | |

## Reviews (design only; do not implement)

- **Phase 1 (launch):** homepage testimonials from `apex_testimonial`, edited by the client. No product-level reviews, no `aggregateRating` markup.
- **Phase 2 options:**
  - *Shopify's own "Product Reviews" app* is **discontinued** (delisted Sept 2023, reviews stopped displaying May 2024 per Shopify community posts) — do not use it.
  - *Judge.me* or *Loox*: both are third-party apps; feature, price and headless support must be compared when phase 2 starts (⚠ UNVERIFIED here).
  - **How data reaches a headless frontend** (three routes): (a) the app writes aggregate rating/count into **product metafields** with Storefront access → readable in the normal product query (cheapest, ratings only) — ⚠ UNVERIFIED which metafields each app writes; (b) read the review list from the **app's own API** through a small server proxy (needs a backend ⇒ post-launch Vercel function, keeps API token private); (c) embed the app's widget script on the PDP (headless support varies, ⚠ UNVERIFIED). Recommended when the time comes: (a) for stars on cards + (b) for the review list.

## Related docs
01 store setup · 02 data model · 03 product entry · 04 image specs · 05 GraphQL · 06 field mapping · 07 plan · 08 risks · 09 SEO/analytics/deploy · 10 filters · OPEN-ISSUES.
