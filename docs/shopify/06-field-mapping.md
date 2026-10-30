# 06 — Field mapping (CONTRACT)

Mappers live in `services/*.mappers.ts` (pure functions). `[done]` = already in code after Phase 0; **NEW** = added in Phase B.

## 1. Storefront → `ProductSummary`

| `ProductSummary` | Source | Rule |
|---|---|---|
| `id` | `Product.id` | GID |
| `handle` [done] | `Product.handle` | |
| `title` | `Product.title` | |
| `subtitle` | `custom.card_subtitle` → `STORAGE` upper-case → first description line | |
| `priceAmount` / `currencyCode` | `priceRange.minVariantPrice` | whole PKR |
| `compareAtAmount` [done, optional] | `compareAtPriceRange.minVariantPrice.amount` | only if > `priceAmount` |
| `image` / `imageAlt` [done] | `featuredImage.url` (w 640, WebP) / `altText ?? title` | missing ⇒ striped placeholder |
| `badge` | derived from `ptaStatus` (`PTA_STATUS_LABELS`) or `Sold` when `availableForSale=false` | not stored |
| `to` | `/shop/${handle}` (route added in Phase B; today `ROUTES.shop`) | |
| `availableForSale` | `Product.availableForSale` | `false` ⇒ "Sold" |
| `category` | `productType` → `ShopCategoryId`: `iPhones→iphones, Audio→audio, Wearables→wearables, Chargers→chargers, Cases→cases`, else `accessories` | **NEW values** (today only `iphones`/`accessories`) |
| `model` | `custom.device_model` (fallback tag `model:*`) | typed `ShopModelId` for known values, otherwise `string` (unknown still kept) |
| `storage`, `color` | `custom.storage`, `custom.color` (fallback tags) | same rule |
| `batteryHealth` | `Number(custom.battery_health)` (fallback tag `battery:*`) | 1–100 |
| `batteryBucket` **NEW** | `custom.battery_bucket` (else derived by `getBatteryRange`) | |
| `grade` | `custom.condition_grade` (fallback tag `grade:*`) | |
| `ptaStatus` [done rename] | `custom.pta_status` (fallback tags `pta`, `non-pta`, `jv`) | was `condition` |
| `createdAt` | `Product.createdAt` | |

Filtering/sorting fields are **no longer used client-side**: `model/storage/color/batteryBucket/ptaStatus/grade` exist for card meta and labels only; the shop filters come from `FilterGroup[]` (§2).

## 2. Filters (NEW)

Types are in `10-filters-and-search-discovery.md` §6 (`ProductFilterInput`, `FilterValue`, `FilterGroup`).

| Storefront | Domain |
|---|---|
| `Filter.id` | `FilterGroup.id` |
| `Filter.label` | `FilterGroup.label` (from Search & Discovery) |
| `Filter.type` | `FilterGroup.type` (`LIST`/`PRICE_RANGE`; unknown types are skipped) |
| `Filter.values[*].id` | `FilterValue.id` (React key only) |
| `.label` | `FilterValue.label` after `labelFor()` |
| `.count` | `FilterValue.count` |
| `.input` (JSON string) | `FilterValue.input` = `JSON.parse` (guarded; invalid ⇒ value skipped) |
| derived | `urlKey`/`urlValue` from `input` (10 §5) |
| PRICE_RANGE `input.price.max` | `FilterGroup.priceBounds.max` (min `0`) — ⚠ shape UNVERIFIED |

Shop result view (`ShopResultsView`): `{ products: ProductSummary[]; filters: FilterGroup[]; hasNextPage; endCursor; totalCount? }`. Mock and Shopify services return exactly this.

| Shop param | Meaning |
|---|---|
| `category` | collection handle (`iphones` default) |
| `q` | switches to `search` |
| `sort` | `featured, newest, price-asc, price-desc, title-asc, relevance` |
| `f.*` | filter selection (10 §5) |

## 3. Storefront → `ProductDetail` (NEW)

```ts
export interface ProductDetail extends ProductSummary {
  descriptionHtml: string
  images: { url: string; alt: string; width: number; height: number }[]
  options: { name: string; values: string[] }[]
  variants: ProductVariant[]
  warrantyMonths?: number
  warrantyNote?: string
  boxContents: string[]
  specs: { label: string; value: string }[]
  seo: { title?: string; description?: string }
  /** true when no variant is available: show "Sold" + similar items */
  sold: boolean
}
export interface ProductVariant {
  id: string; title: string; sku?: string
  availableForSale: boolean; quantityAvailable?: number
  priceAmount: number; compareAtAmount?: number; currencyCode: string
  selectedOptions: { name: string; value: string }[]
  image?: string
}
```
`descriptionHtml` sanitised (DOMPurify) before render; `boxContents`/`specs` `JSON.parse` guarded; `sold = !availableForSale`.

## 4. Cart and collection (NEW)

```ts
export interface Money { amount: number; currencyCode: string }
export interface Cart { id: string; checkoutUrl: string; note?: string; totalQuantity: number
  subtotal: Money; total: Money; tax?: Money
  discountCodes: { code: string; applicable: boolean }[]; attributes: { key: string; value: string }[]; lines: CartLine[] }
export interface CartLine { id: string; quantity: number; total: Money; variantId: string; variantTitle: string
  productHandle: string; productTitle: string; image?: string; unitPrice: Money
  availableForSale: boolean; quantityAvailable?: number }
export interface Collection { id: string; handle: string; title: string; description: string; image?: string }
```
Header `cartCount` ← `cart.totalQuantity` (replaces `MOCK_CART_COUNT`). `userErrors` ⇒ thrown `CartError`, toast from the mutation hook.

## 5. Metaobjects → `HomeContent` (NEW)

```ts
export interface HomeContent {
  hero: HeroContent & { image: string }
  promoCards: PromoCardData[]      // layout ← PROMO_LAYOUT_CLASSES[layout_preset] [done]
  categories: CategoryItem[]       // productCount filled by useCategoryCounts (derived from the availability filter, not stored)
  banners: BannerSlide[]; features: FeatureItem[]; testimonials: Testimonial[]
  footerColumns: FooterColumn[]
  settings: SiteSettings
}
export interface SiteSettings {
  footerDescription: string; copyrightText?: string
  social: SocialLink[]; supportEmail?: string; supportPhone?: string
  paymentMethods: string[]
  dropAlerts: { titleLines: string[]; description: string; buttonLabel: string; message: string }   // launch replacement of the newsletter form
  shopBanner: { image: string; alt: string; to: string }
  tradeIn: { whatsappNumber: string; messageTemplate: string }   // WhatsApp-only flow (§7)
}
```
| Type field | Metaobject field |
|---|---|
| `HeroContent.*` | `badge, description, follow_label`; `titleLines=[title_line_1,title_line_2?]`; `highlights` (JSON list); CTAs `{label, to\|href}` (`/…`⇒`to`, else `href`) |
| `PromoCardData` | `slug→id, label, title_line_*→titleLines, description, cta_label/cta_url→cta, image, image_alt→imageAlt, layout_preset→layout` |
| `CategoryItem` | `slug→id, name, image`, `to = getShopPath(shop_category)`; `productCount` ← `useCategoryCounts()[id]` (in-stock products; `accessories` = all non-iPhones) |
| `BannerSlide` / `FeatureItem` / `Testimonial` | `handle|slug`, `image/alt` · `title/description` · `quote/author/rating` |
| `FooterColumn` | group `apex_footer_link` by `column` |
| `SiteSettings.social` | each non-empty `social_*` ⇒ `{label, shortLabel, href}` from a code table |
| `SiteSettings.tradeIn` | `whatsapp_number`, `trade_in_message_template` (empty ⇒ code default template) |

All lists sorted by `sort_order`; entries missing a required field are skipped (audit flags them); empty list renders nothing; on error fall back to the bundled defaults in `constants/home.ts`.

## 6. Search

`PredictiveResult { products: {id,handle,title,image?,price,available}[]; collections: {handle,title}[]; queries: string[] }` — straight rename of `predictiveSearch`.

## 7. Trade-in contract (WhatsApp only, no backend) — BUILT (`/trade`)

Form (React Hook Form + Zod, `lib/schemas/tradeIn.schema.ts`; every option list lives once in `constants/trade.ts`):

| Field | Values (value → label) | Required |
|---|---|---|
| `model` | slug → label, iPhone 11 … 17 + SE (PLACEHOLDER list, BLOCKED-ON-CLIENT) | ✔ |
| `storage` | `64gb … 1tb` | ✔ |
| `colour` | `black, white, blue, red, purple, gold, natural-titanium` ("Natural") | ✔ |
| `ptaStatus` | `pta, non-pta, jv` | ✔ |
| `condition` | `like-new, good, fair, damaged` | ✔ |
| `screen` | `no-issues, scratches, cracked` (default `no-issues`) | ✔ |
| `body` | `no-issues, scratches, dents` (default `no-issues`) | ✔ |
| `batteryHealth` | `90-plus, 80-89, 70-79, below-70, not-sure` | optional |
| `notes` | text ≤ 500 | optional |
| `name` | 2–60 chars, trimmed | ✔ |
| `wantToBuy` | a model slug | optional |

Nothing is preselected except `screen`/`body`. Draft kept in `sessionStorage` (`apex.tradein.draft.v1`), cleared on success.

Message: `buildTradeInMessage(values, template)` (`lib/tradeInMessage.ts`). Tokens `{name} {model} {storage} {colour} {pta} {condition} {screen} {body} {battery} {notes} {wantToBuy}` are replaced by the option **labels**; a line whose tokens are all empty is dropped; `notes` newlines become spaces. Link: `buildWhatsAppUrl(number, text)` → `https://wa.me/<digits>?text=<encodeURIComponent(text)>` (8–15 digits; `+`, spaces, dashes stripped). Opened with `window.open(url, '_blank', 'noopener,noreferrer')`; the success screen also shows the same URL as a real `<a>`.

Settings (`useTradeInSettings` → `getTradeInSettings`): `apex_site_settings` (`main`) fields `whatsapp_number` (digits, validated) and `trade_in_message_template` (empty → code default). **Mock mode only** falls back to the temporary test number `923357413642` (0335 7413642); Shopify mode has no fallback: no number ⇒ the "Send on WhatsApp" button is disabled with an inline message.
No pricing logic anywhere; staff quote manually.

## 8. Drop alerts instead of a newsletter (launch)
No newsletter form and no backend at launch. The home block becomes a **WhatsApp "drop alerts" button**: copy from `apex_site_settings.drop_alerts_*`, link `https://wa.me/<whatsapp_number>?text=<encodeURIComponent(drop_alerts_message)>`, same number as the trade-in. Empty number ⇒ the block is hidden. The email newsletter function (`api/newsletter`, Admin token) stays **post-launch** (07 #15). Code change: step 4 (Home CMS); `NewsletterSection` is untouched until then.
