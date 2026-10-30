# 08 — Risks and limits

## Storefront limits (verified unless marked)
- Storefront API does not throttle buyer traffic by request count; a **query-complexity** limit exists (exact Storefront cost model ⚠ UNVERIFIED). Server-side pages are small (`first: 24`, ~15 fields + 9 metafield aliases + `filters`), far below the old fetch-all `first: 250`.
- `ProductFilter` list ≤ 250 values; one `price` range only (the first is applied).
- `search.totalCount` is capped at **1,000**; search filter counts use the first 1,000 results.
- **Collections with more than 5,000 products show no filters.** Keep every collection (incl. `all-products`) under that.
- Search & Discovery: **25 filters per store**, **100 values shown per filter**, one source per filter.
- `Collection` has no product-count field; `ProductConnection` total count is not documented ⇒ no "page X of Y" and no category counts; use **Load more**.
- `productRecommendations` returns ≤ 10 and `COMPLEMENTARY` needs manual S&D setup.

## Server-side filter risks

| Risk | Impact | Mitigation |
|---|---|---|
| **Search & Discovery dependency** — no S&D setup ⇒ `filters` empty or missing | shop shows no filters | launch checklist (01 §E), audit step "Filters", UI hides a missing group, shows products without a sidebar |
| Metafield not filterable / Storefront access OFF | group missing or `null` values | audit; 02 marks every filter metafield |
| Integer range filtering unsupported (assumed) | battery % slider impossible | `battery_bucket` text filter (02), consistency audit |
| Filter id / `input` shape differs from assumption | broken selection | app keys on `ProductFilter` inputs only (10 §5), fixtures from real responses captured in the first dev-store test |
| Count semantics unknown (disjunctive?) | confusing counts | test on dev store; if conjunctive, hide counts for the group being edited |
| One network request per filter change | latency, flicker | `keepPreviousData`, cache per normalised selection, optimistic chip update, prefetch next cursor |
| Client removes a filter that old URLs still contain | ghost chip / empty result | stale-filter cleanup after each response (10 §5) |
| Client adds a value the label map doesn't know | ugly label | humanise fallback (10 §6); never dropped |
| New store: `BEST_SELLING` meaningless | arbitrary order | Featured = `COLLECTION_DEFAULT` (manual) |
| Sort keys differ between collection and search | disabled options | per-source sort list (10 §4) |
| Filtered URLs indexed by crawlers | duplicate content | `noindex` + canonical to the unfiltered category |
| Numbered pagination expected by Figma | UI mismatch | Load more (OPEN-ISSUES Q3); if the client insists, keep cursor history for Prev/Next only |
| Collection > 5,000 products | filters vanish | keep catalogue under limit; category collections reduce size |

## Other risks
| Risk | Mitigation |
|---|---|
| SPA ⇒ weak SEO (09) | decision pending; bot-only HTML first |
| Manual payments (COD/bank/EasyPaisa/JazzCash) | orders stay "payment pending"; staff mark paid (01 §B); fraud/RTO risk on COD is a business matter |
| Unit sold while in cart | clamp quantity, Shopify enforces stock at checkout |
| WhatsApp trade-in: message length, no tracking | cap notes at 300 chars, keep template short, count clicks in analytics (`generate_lead`) |
| WhatsApp number wrong/empty | audit validates; button hidden if empty |
| Currency formatting `en-PK` ("Rs") vs "PKR" expectation | `formatPrice` central, change in one place |
| API version retirement | `VITE_SHOPIFY_API_VERSION`, bump quarterly, run audit |
| Home content missing | fallback to bundled defaults |
| Marketing claims ("Mercantile certified") | client-owned content |
| Placeholder values (warranty, shipping) shipped by mistake | `BLOCKED-ON-CLIENT` list; audit WARNs on placeholder warranty |

The client-side payload/threshold analysis from the previous revision is **removed**: the catalogue is no longer downloaded in full.
