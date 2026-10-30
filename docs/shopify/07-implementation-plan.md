# 07 — Implementation plan

**L** = launch · **P** = post-launch. Every step sits behind `VITE_USE_MOCK_DATA`; mock data satisfies the same types; every mapper has fixture tests.

| # | Tag | Phase | Work | Needs from Shopify | Mock-testable |
|---|---|---|---|---|---|
| 0 | L | **Prep — DONE** | PKR + `formatPrice` (`en-PK`), price steps 5,000/500, `typecheck` script, `.env.example` (mock default, empty placeholders), `package-lock.json` removed, `VITE_SHOPIFY_API_VERSION` (default `2026-10`), `handle`/`compareAtAmount?`/`imageAlt?` on `ProductSummary`, `condition`→`ptaStatus` (+`jv`), iPhone 16/17 enums, battery buckets 90-100/80-89/70-79/below-70, footer payment labels, promo `layout` preset | – | ✔ |
| 1 | L | Store + data | 01 checklist, definitions (02), collections + Search & Discovery filters (10), 10–20 real listings | store, token | – |
| 2 | L | Audit | `yarn shopify:audit` (below) | step 1 | fixtures |
| 3 | L | **Server-side catalogue — DONE (on mock)** | `ProductFilterInput`/`FilterGroup`/`ShopResultsView` types; URL codec (`f.*`); `getShopProducts` (collection + search) service, keys, `useShopProducts` (`useInfiniteQuery`, `keepPreviousData`); mock engine producing the same shape; `FacetFilter`/`ShopFilterPanel` render `FilterGroup[]` dynamically; **Load more** replaces numbered pagination; remove `lib/shopCatalog.ts` facets from the Shopify path, `useCatalog`, `SHOP_FACETS`, `FacetKey`, `FacetSelections`; new `ShopCategoryId` values; stale-filter cleanup | listings, S&D filters | ✔ |
| 4 | L | Home CMS | `HomeContent` query/mapper/hook; bestsellers from collection `bestsellers`; defaults stay as fallback | metaobject entries | ✔ |
| 5 | L | Product page | `/shop/:handle`, `useProduct`, gallery, variants, specs, warranty, **Sold state** + `productRecommendations`/`SimilarProducts`, JSON-LD | – | ✔ |
| 6 | L | Cart + checkout | `useCartStore` (id only), cart hooks, drawer, discount, note, redirect to `checkoutUrl`; manual-payment instructions copy | payments, shipping | ✔ |
| 7 | L | Search | header predictive search + `/shop?q=` via `search(productFilters)` | S&D | ✔ |
| 4b | L | Drop alerts | replace the newsletter block with the WhatsApp button (06 §8) | settings entry | ✔ |
| 8 | L | Trade-in (WhatsApp) | `constants/tradeIn.ts`, form validation, message builder + `wa.me` link, settings from `apex_site_settings`; **page UI from Figma later** | settings entry | ✔ |
| 9 | L | Support content | policies, FAQ, warranty page, contact (WhatsApp) | policies, pages | ✔ |
| 10 | L | Basic SEO + analytics | per-route meta, canonical/noindex rules, sitemap, JSON-LD, GA4/Pixel (09) | domain | – |
| 11 | P | Customer accounts | Customer Account API OAuth, orders, addresses | API on, HTTPS | ✘ |
| 12 | P | Wishlist | localStorage store + heart + `/wishlist`; account sync later | – | ✔ |
| 13 | P | Reviews (product-level) | app integration (design in 00) | app | – |
| 14 | P | SSR / prerender upgrade | if SEO demands (09) | – | – |
| 15 | P | Backend functions | `api/newsletter`, `api/trade-in` + photo upload, Admin token | Admin app | ✔ |

Dependencies: 3 → 5 → 6; 4 independent; 7 after 3; 10 after 5. First launch cut = 0–10.

## `yarn shopify:audit` — BUILT (`scripts/shopify-audit.ts`, rules in `scripts/audit/rules.ts`, contract in `scripts/audit/contract.ts`)
Run against the real store with the public env (`.env`); exit 0 clean, 1 contract errors, 2 not connected / request failed (e.g. the store returns **402** while inactive). Rules are pure and unit-tested with fixtures (`src/audit/audit.test.ts`, which also fails if the contract drifts from the app enums).
`scripts/shopify-audit.ts` (tsx, `.env`, public token only). Exit 1 on any ERROR.
- **Products** (`all-products`, paged): `productType` in the allowed list; iPhones have `device_model, storage, color, battery_health, battery_bucket, condition_grade, pta_status` (ERROR if missing) and `warranty_months` (WARN while PLACEHOLDER); values inside the allowed choices; `battery_health` 50–100; **`battery_bucket` consistent with `battery_health`** (bucket rule, 02 §3); has an image; price > 0; handle follows `<title>-<storage>-<colour>-<grade>-<seq>` (WARN); legacy facet tags still present (WARN); title contains storage/colour (WARN); (sold products that are archived/draft are invisible to the public token and can't be audited — see the script's note).
- **Metafield exposure:** if ≥ 1 product has the value in Admin terms but the Storefront returns `null` for **every** product ⇒ ERROR "Storefront access OFF for custom.<key>".
- **Collections:** handles `all-products, iphones, audio, wearables, chargers, cases, accessories, bestsellers` exist; `bestsellers` non-empty; each < 5,000 products.
- **Filters:** `all-products.products(first:1){ filters }` returns groups for Availability, Price, Category (product type), Model, Storage, PTA status, Battery health, Color, Condition; any missing ⇒ ERROR "enable in Search & Discovery (10 §3)"; groups with > 100 values ⇒ WARN; prints the filter ids/labels seen (feeds the UNVERIFIED items).
- **Metaobjects (`apex_*`, incl. `drop_alerts_*` fields once step 4b lands):** required types exist and are non-empty (`apex_hero` 1 `home`, `apex_site_settings` 1 `main` incl. `whatsapp_number` + `trade_in_message_template`, promos 2 with valid `layout_preset`, categories 6, features ≥ 4, testimonials ≥ 3); required fields non-empty; images resolve; `sort_order` unique; URLs valid; WhatsApp number digits only.
- **Report:** counts per type, per-handle error list, API version used.
