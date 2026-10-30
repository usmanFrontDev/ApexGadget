# OPEN-ISSUES

Legend: **K** code/brief conflict (open) · **R** resolved · **A** assumption · **U** unverified · **BLOCKED-ON-CLIENT** value or decision we must not invent.
Docs revised 2026-10-30 (v2 brief). Sources: shopify.dev versioning, filter-products guide, search + Collection + productRecommendations references, rate limits; help.shopify.com Search & Discovery filters; Shopify community posts (Product Reviews sunset).

## Resolved (v2 brief + Phase 0 code)

| ID | Item | Where |
|---|---|---|
| R1 | Currency USD → **PKR**: `SHOP_CURRENCY_CODE`, mock + bestseller prices, `formatPrice` (`en-PK`, whole rupees → "Rs 359,500"), steps 5,000 / 500 | code ✔ |
| R2 | Card payments not needed: footer shows COD / Bank transfer / EasyPaisa / JazzCash; docs use manual methods | code ✔ + 01 §B |
| R3 | Storefront API version from `VITE_SHOPIFY_API_VERSION`, default `2026-10` (`src/constants/shopify.ts`) | code ✔ |
| R4 | `.env.example`: `VITE_USE_MOCK_DATA=true`, empty placeholders; `typecheck` script; `package-lock.json` removed (deletion is staged, not committed) | code ✔ |
| R5 | `handle`, `compareAtAmount?`, `imageAlt?` added to `ProductSummary` | code ✔ |
| R6 | `condition` → `ptaStatus` (`ProductPtaStatus`: `pta, non-pta, jv`; labels PTA Approved / Non-PTA / JV; filter param `pta`) | code ✔ |
| R7 | Promo cards: `imageClassName` replaced by `layout` preset (`PromoLayout` → `PROMO_LAYOUT_CLASSES`) | code ✔ |
| R8 | Model enums gained `iphone-16`, `iphone-17` (+2 mock iPhone 16 listings); battery buckets now `90-100, 80-89, 70-79, below-70` (code + mock + facet labels) | code ✔ |
| R9 | Categories are real: Audio, Wearables, Chargers, Cases, Accessories + iPhones (collections + productType). **Code change deferred to Phase B step 3** (see K3) | docs ✔ |
| R10 | Featured sort = `COLLECTION_DEFAULT` (not `BEST_SELLING`) | 10 §4 |
| R11 | Trade-in = WhatsApp link, no backend, no Admin token at launch; `api/*` and `apex_trade_in_request` are post-launch | 06 §7 |
| R12 | Sold listings stay online as "Sold" with similar items | 02 §1, 03 §C, 05 §4 |
| R13 | **Server-side catalogue (Phase B step 3, on mock):** `FilterGroup`/`ProductFilterInput`/`ShopResultsPage` types, generic `f.*` URL codec (`lib/shopFilters.ts`), `getShopProducts` (collection + search queries, mapper, mock engine with the same shape), `useShopProducts` (infinite, `keepPreviousData`), dynamic `ShopFilterPanel`, **Load more**, stale-filter cleanup, real categories (`audio, wearables, chargers, cases, accessories, all`). Removed: `useCatalog`, `useShopCatalog`, `lib/shopCatalog.ts`, `FacetFilter`, `Pagination`, `SHOP_FACETS`/`FacetKey`. | code ✔ |
| R14 | K11 (generic `f.*` encoding, never per-filter hardcoding) and K12 (filters on category collections + `all-products`) **approved**; URL param rename (`condition`→`pta`) approved. To be verified against a live store later. | – |
| R15 | Pagination = **Load more** (Q3). | code ✔ |
| R16 | Launch newsletter = WhatsApp "drop alerts" button from `apex_site_settings` (`drop_alerts_*`, `whatsapp_number`); email newsletter function stays post-launch (Q2). Docs ✔, code in plan step 4b. | 02, 06 §8 |
| R17 | SEO stays **Option A as a recommendation only**, not implemented (Q1). | 09 |
| R18 | `yarn shopify:audit` built (`scripts/`). The unit tests (vitest) written during the build were **removed** before the branch was pushed (decision of the owner); fixtures are in git history of branch `feat/shopify-server-side-catalogue` / earlier commits of this branch if tests are wanted again. | code ✔ |

## Open conflicts between the brief/contract and current code (code untouched unless listed above)

| ID | Finding | Plan |
|---|---|---|
| K1 | ~~Shop was client-side.~~ **Fixed in step 3** (R13). | done |
| K2 | ~~Numbered pagination vs cursors.~~ **Load more** (R15). Result count: `search.totalCount`, or the sum of the availability filter's counts for collections; hidden/“N+ products” when unknown. | done |
| K3 | `ShopCategoryId` has all categories and the home cards/footer link to them. **Category counts are back** on the cards: derived from the availability filter (`getCategoryCounts`; mock = catalogue). Home categories still come from `constants/home.ts` until step 4. | done |
| K4 | `ProductSummary` facet fields are plain strings; unknown values are kept and humanised (`lib/filterLabels.ts`). | done |
| K5 | `ProductSummary.to` is still `ROUTES.shop`; no PDP, cart, search, account routes; cart count/avatar are mocks (`constants/mock.ts`). | Phases 5–7. |
| K6 | ~~Price bounds from the client catalogue.~~ Slider bounds come from the `PRICE_RANGE` group (⚠ U3: input shape unverified). | done |
| K7 | Trade page and Support page are bare titles. Trade-in needs its own model list (older iPhones) — not `ShopModelId`. Trade page UI comes from Figma later. | Phases 8–9. |
| K8 | Newsletter form only toasts: replaced at step 4b by the WhatsApp drop-alerts button (R16). | planned |
| K9 | Hero, banners, category art, shop banner, home bestsellers are bundled constants. | CMS with bundled fallback (step 4). |
| K10 | Old shared URLs break: facet param `condition` → `pta`; battery bucket `85-89`/`below-80` are gone. | Accepted (pre-launch). |
| K11 | Filter state encoded as `f.<ProductFilter type>…`, not API filter ids. **Approved.** | approved |
| K12 | Filters queried on category collections (+ `all-products`) and `search`. **Approved.** | approved |
| K13 | `formatPrice` prints "Rs 359,500" (locale `en-PK`) rather than "PKR 359,500". | One line in `lib/format.ts`. |
| K14 | Product type is free text in Shopify; a typo (`Iphones`) drops a product into `accessories`. | Audit enforces the list. |
| K15 | SEO: client-rendered SPA (09). | Q1. |
| K16 | Marketing claims ("Mercantile certified", "100% original, lab tested", "12 month warranty") must be true and client-owned. | Content. |
| K17 | Fixed-ratio, absolutely positioned hero/promo art (04); other ratios break the layout. | Designer keeps ratios. |
| K18 | **Page banners have baked-in text** (`TradeInBanner.png`, `FavBanner.png`: opaque 2172×724 RGB with headline, lead, steps). The brief said "artwork only, text is real HTML". Trade-In art is also dark, the mock hero was light. | Shown in full from `lg` (copy also in the DOM as visually hidden text); below `lg` real HTML copy + a 4:3 crop of the phones. At 1024px the baked small text is ~8–10px. Wanted: text-free exports (same size) for fully editable copy. |
| K19 | Favorites: visible banner says "Save what you love. Find it anytime."; the page `<h1>` (hidden at lg) is "Your Favorites" as in the brief. | Decide which wording leads. |
| K20 | The floating "Saved items" card is **not** built on desktop: the banner already contains a baked "Your favorites" chip. The live count is in the toolbar ("n items"), the Header badge and a chip in the phone banner. | Accepted unless text-free art arrives. |
| K21 | Header: added the wishlist link + badge, the swap icon and "Get a Trade-in Quote" (shown from `lg`, was "Quote Trade In" from `md`). **No search icon**: there is no search UI yet (plan step 7), so it would be a dead button. | Add with step 7. |
| K22 | `CtaBanner` has no phone art (none supplied): text-only banners on Favorites and Product pages. | Supply `src/assets/images/CtaBanner.png` (04) and pass it as `image`. |
| K23 | Add to Cart, quantity change and remove work in **mock mode only** (Zustand `apex.cart.v1`, header badge). Shopify mode throws "not connected yet" (`cartLinesAdd/Update/Remove`, plan step 6). No cart page/drawer/checkout (out of scope). | Step 6. |
| K29 | Product page extras added on review: stock chip ("Only n left" at ≤ 3), condition report (battery meter, grade scale), "Ask on WhatsApp" (reuses `apex_site_settings.whatsapp_number`), sticky gallery. Their texts (`constants/product.ts`) are client-owned copy. | accept / edit copy |
| K30 | Trade-In has a "Clear all" button (resets fields, draft and step) next to Back/Cancel. | done |
| K24 | Favorites now uses **list rows** (`WishlistRow`) instead of the mock's 2-column cards (user preference after review); the shop/home cards only got a working heart (Question 1: yes). | done |
| K25 | The product card is now ONE component (`ShopProductCard`) used by shop, home bestsellers and similar products; its heart saves to the wishlist. The home-only `ProductCard` (centred text, dark chip) and `ProductSummary.badge` were removed. | One-line change in the cards if it should go. |
| K26 | `ProductSummary.to` is now `/shop/<handle>` (mock, mapper); home BESTSELLERS are now real mock products so their links work. | done |
| K27 | Mock catalogue: one iPhone 11 (64GB white) is **sold** (to exercise the Sold state); the shop hides it by default (Out-of-stock filter shows it). | done |
| K28 | `Pagination` (removed in step 3) is back for the Favorites page (local data, numbered pages). Shop stays on Load more. | done |

| K31 | **Cart built on mock data** (`/cart`, mini-cart, `CartService`). Deviations from the design: Checkout is blocked and totals exclude sold lines; a Discount row was added; no × on the sticky bar; generic payment icons instead of brand logos. | accepted |
| K32 | **Add to Cart now exists on every product card** as a round red bag button beside the price, turning into the quantity control once in the cart (user decision; AGENTS said "no add-to-cart on cards"). Adding only toasts; the mini-cart opens only from the header icon. Products with options (mock: MagSafe Case) show only "View details". `ProductSummary.variantId` added (mapper, mock, GraphQL, docs). | done |
| K33 | Cart "You may also like" = one row of up to 5 `ShopProductCard`s (same as the product page); hidden below 2 results. | done |

## Assumptions (correct me)
| ID | Assumption |
|---|---|
| A1 | Single market, PKR, one store, English only. |
| A2 | Guest checkout allowed; accounts are post-launch. |
| A3 | Payments at launch: COD, bank transfer, custom EasyPaisa/JazzCash instructions; staff mark orders paid. |
| A4 | Metafield namespace `custom` (works from the admin UI without an app); metaobject types `apex_*`. |
| A5 | One product per listing for phones; batch listings store the guaranteed minimum battery. |
| A6 | 100–300 products at launch; every collection stays under 5,000. |
| A7 | Product URL `/shop/:handle`. |
| A8 | Filtered/sorted URLs are `noindex`, canonical to the unfiltered category. |
| A9 | By default the shop lists available products only; sold ones via the Availability filter or direct link. |
| A10 | No cookie-consent banner (Pakistan-only audience). |
| A11 | Tax-inclusive prices only if the client confirms GST. |
| A12 | Shop sort options are per source: collections (featured/newest/price/name), search (relevance/price). |
| A13 | The WhatsApp trade-in default message wording (06 §7) is a draft the client edits in Shopify. |

## BLOCKED-ON-CLIENT (placeholders in the docs/fields; never invented)
1. Warranty policy: months per product type, coverage text (`warranty_months`, `warranty_note`, warranty page) — placeholders marked PLACEHOLDER.
2. Shipping rates, free-shipping threshold, COD fee/limits, delivery times.
3. Tax/GST handling.
4. Policy texts: refund, shipping, privacy, terms; return window; auto-cancel period for unpaid manual-payment orders.
5. EasyPaisa/JazzCash account details and bank account details for payment instructions.
6. WhatsApp number and the trade-in message wording; trade-in model list.
7. Customer-facing wording of **JV** (the filter shows "JV" until confirmed).
8. Whether Google is a main channel (re-opens the SEO option; recommendation A stays).
10. **Trade-in model list** (iPhone 11–17 + SE is a placeholder in `constants/trade.ts`); **JV** wording; **WhatsApp number** and **message template** (mock number `923357413642` is a temporary test number, mock mode only).
11. Product **trust-strip claims** ("Free Shipping / On all orders", "7 Days Return / Hassle free", "Secure Payment / 100% secure" in `constants/product.ts`; "100% secure" clashes with COD/bank-transfer at launch) and the **Shipping & Returns** text (Shopify policies; the mock shows PLACEHOLDER text).
12. Warranty months/note shown in "Detailed Information" (mock: 6 months, PLACEHOLDER).
13. CtaBanner phone image (K22).
9. Which marketing claims may be printed.
14. **Cart:** payment-method wording and logos (`ACCEPTED_PAYMENTS`), shipping rules, real discount-code rules.

## Unverified (could not confirm in official docs; marked ⚠ in the docs)
- U1 Shopify Payments unavailability in Pakistan (third-party sources only) and the official gateway list for Pakistan.
- U2 Automatic EasyPaisa/JazzCash confirmation in Shopify-hosted checkout (only vendor pages found).
- U3 Storefront `filters` ids / `value.id` format for metafield filters, and the exact `PRICE_RANGE` value `input` shape.
- U4 Filter count semantics (disjunctive or not).
- U5 Numeric (integer) range filtering — assumed **not** supported; `battery_bucket` used instead.
- U6 Exact `ProductCollectionSortKeys` / `SearchSortKeys` values; `unavailableProducts` enum names.
- U7 Total count for `collection.products` (none documented) and a Storefront collection product count (field list says none).
- U8 Whether an API filter for a metafield removed from Search & Discovery errors, is ignored, or returns nothing.
- U9 Exact Storefront scope label for metaobjects (`unauthenticated_read_metaobjects`) and cost/complexity accounting for the shop query.
- U10 Customer Account API discovery URLs, field names, domain constraints **[P]**.
- U11 Admin `customerCreate` accepting `emailMarketingConsent`; newsletter backend **[P]**.
- U12 Judge.me / Loox headless support, metafields they write, API limits **[P]**.
- U13 `cdn.shopify.com/...?width=` URL param (the GraphQL `transform` argument is documented).
- U14 That Settings → Custom data can only create `custom.*` definitions from the UI.
- U15 Shopify Customer Privacy API requirement for headless pixels.
- U20 Category counts via `collection.products(first:1, filters:[{available:true}]).filters` (availability value count): depends on the Availability filter being enabled in Search & Discovery and on its counts reflecting the applied filter.
- U17 The batched wishlist lookup (`p0: product(handle: $h0) … p49`) is standard GraphQL but untested on a live store (cost/complexity of 50 aliases; nodes(ids:) is the alternative if GIDs are stored).
- U18 `productRecommendations` on a new store/with few products (may be empty → falls back to a same-model `collection(iphones)` query), and that `product(handle)` returns a sold listing while it stays Active + published to Headless.
- U19 DOMPurify profile: Shopify descriptions with iframes/embeds are stripped (intended).
- U16 `2026-10` as the live version: the versioning table lists it latest stable (released 2026-10-01) but the release-notes page still says 2026-07; no live call was possible (store inactive).

- U21 Where the discount amount comes from in a Storefront cart (`cost` vs line `discountAllocations`).
- U22 How `warnings` are returned when a quantity is clamped.
- U23 Whether `totalQuantity` counts unavailable lines (the app counts every line for the badge).

## Questions that still block
None for Phase B step 4 onwards. Still open for later: whether the SEO recommendation (A) becomes real work, and real values for the BLOCKED-ON-CLIENT list.

## Observations from step 3
- `yarn shopify:audit` run against the configured store (`apex-gadgets-7788.myshopify.com`) returns **402 Payment Required** from the Storefront API (store inactive/frozen), so nothing could be audited live; the rules are covered by fixtures only. Mock mode is unaffected.
- Mock counts are **disjunctive** (a group ignores its own selection); real Shopify behaviour is unverified (U4), so counts may differ on the live store.
- Default availability (`available:true` when none chosen) means the Availability group shows "In stock / Out of stock" only when both exist; with nothing sold, it is hidden (single value).
