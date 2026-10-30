# 02 — Data model (CONTRACT)

Tags: **[L]** launch · **[P]** post-launch.

## 1. Modelling decision: one product per listing (approved)

**Phones: one Shopify product per sellable listing** (a physical unit, or a batch of identical units) with a single
default variant. Storage, colour, battery, grade and PTA status are **product-level metafields**, not variant options.

Why: the shop card, and the server-side filters (10), operate on products with one value per field; battery and grade are per unit;
inventory is usually 1. Batch listings (qty N) store the **guaranteed minimum** battery.
**Accessories:** one product per item; variants (Color / Compatible model) only when price/stock differ.

**Sold listings never disappear.** The product stays Active with quantity 0; the product page shows **Sold** and links
to similar items (`productRecommendations` + same-model query, 05). It never 404s.

## 2. Taxonomy [L]

| Thing | Rule |
|---|---|
| `productType` | exactly one of `iPhones`, `Audio`, `Wearables`, `Chargers`, `Cases`, `Accessories` (the last = everything else). **Real shop categories** (1.5): each has a smart collection with the same handle lower-cased (10 §3). |
| Code mapping | `iPhones→iphones`, `Audio→audio`, `Wearables→wearables`, `Chargers→chargers`, `Cases→cases`, other→`accessories` (`ShopCategoryId`) |
| `vendor` | `Apple` (or brand); also a possible filter later |
| Tags | merchandising only: `bestseller`, `new-arrival`, `featured`, `deal`. Legacy `model:`/`storage:`… tags are read as a fallback until migrated, then removed. |
| Collections | `all-products`, `iphones`, `audio`, `wearables`, `chargers`, `cases`, `accessories`, `bestsellers` (manual), `new-arrivals` |

## 3. Product metafields (namespace `custom`) [L]

Created in Settings → Custom data → Products. **Storefront access: ON for every row.** "Filter" = also added in Search & Discovery (10 §3).

| namespace.key | Type | Validation (choices) | Req. | Filter | Example | Maps to |
|---|---|---|---|---|---|---|
| `custom.device_model` | single_line_text | `iphone-17, iphone-16, iphone-15, iphone-14, iphone-13, iphone-12, iphone-11, iphone-se` | iPhones | ✔ Model | `iphone-16` | `model` |
| `custom.storage` | single_line_text | `64gb, 128gb, 256gb, 512gb, 1tb` | iPhones | ✔ Storage | `256gb` | `storage` |
| `custom.color` | single_line_text | `black, white, blue, red, purple, gold, natural-titanium, graphite` (+ add as the stock needs) | iPhones | ✔ Color | `natural-titanium` | `color` |
| `custom.battery_health` | integer | min 50, max 100 | iPhones; AirPods/Watch if shown | ✘ (display only; integer **range** filtering assumed unsupported) | `96` | `batteryHealth` |
| `custom.battery_bucket` | single_line_text | `90-100, 80-89, 70-79, below-70` | with battery_health | ✔ Battery health | `90-100` | `batteryBucket` |
| `custom.condition_grade` | single_line_text | `new, excellent, very-good, good` | all non-sealed | ✔ Condition | `excellent` | `grade` |
| `custom.pta_status` | single_line_text | `pta, non-pta, jv` | iPhones | ✔ PTA status | `pta` | `ptaStatus` |
| `custom.warranty_months` | integer | min 0, max 36 | all | ✘ | `6` — **PLACEHOLDER until the client sets the policy** | `warrantyMonths` |
| `custom.warranty_note` | multi_line_text | max 300 | optional | ✘ | PLACEHOLDER | `warrantyNote` |
| `custom.box_contents` | list.single_line_text | max 8 | optional | ✘ | `["Phone","Cable","Box"]` | `boxContents` |
| `custom.specs` | json | `[{label,value}]` | optional | ✘ | `[{"label":"Chip","value":"A17 Pro"}]` | `specs` |
| `custom.card_subtitle` | single_line_text | max 60 | optional | ✘ | `256GB · Natural Titanium` | `subtitle` |

**Bucket rule** (audit-enforced): `battery_health ≥ 90 → 90-100`; `80–89 → 80-89`; `70–79 → 70-79`; `< 70 → below-70`.
**Site labels:** `pta` → "PTA Approved", `non-pta` → "Non-PTA", `jv` → "JV" (**BLOCKED-ON-CLIENT**: confirm the wording shown to customers).

Values are lower-case slugs. A new model/colour = add the choice in Shopify; the filter UI shows it automatically (label fallback, 10 §6).
Code enums (`ShopModelId`, `ProductColor`…) only type the mapper and supply nicer labels/swatches — unknown values still render.

## 4. Variant data [L]
- Phones: one default variant, SKU `IP16P-256-NTI-A-001` (`model-storage-colour-grade-seq`), `inventoryPolicy DENY`, track quantity, weight set.
- Price in whole PKR; `compareAtPrice` optional.

## 5. Metaobject definitions (types prefixed `apex_`; Storefront access **Active**)

Shorthand: `text`, `mtext`, `url`, `img`, `int`, `list.text`, `choice` (text with choices).

### `apex_hero` [L] — 1 entry, handle `home`
`badge` text ✔ · `title_line_1` text ✔ · `title_line_2` text · `description` mtext ✔ · `highlights` list.text (≤4) ✔ · `primary_cta_label`/`primary_cta_url` ✔ · `secondary_cta_label`/`secondary_cta_url` ✔ · `follow_label` text · `image` img ✔ (1000×1164).

### `apex_promo_card` [L] — 2 entries
`slug` ✔ · `label` ✔ · `title_line_1`, `title_line_2` ✔ · `description` mtext ✔ · `cta_label`, `cta_url` ✔ · `image` img ✔ · `image_alt` ✔ · **`layout_preset` choice `trade-in, accessories`** ✔ (code maps it to `PROMO_LAYOUT_CLASSES`; raw Tailwind is never stored) · `sort_order` int ✔.

### `apex_category_card` [L] — 6 entries
`slug` ✔ · `name` ✔ · `shop_category` choice `iphones, audio, wearables, chargers, cases, accessories` ✔ (→ `/shop?category=…`) · `image` img ✔ (480×480) · `sort_order` ✔.
The product count on the card is **derived at runtime** (not stored): the Storefront API has no collection count, so `getCategoryCounts` reads the in-stock value of the Availability filter of each category collection (one aliased query, `services/categories.queries.ts`). Needs the Availability filter in Search & Discovery; a category without a count shows no count line.

### `apex_banner_slide` [L] — 1–6: `image` img ✔ (2800×1184), `alt` ✔, `link_url`, `sort_order` ✔.
### `apex_why_us_feature` [L] — 4: `slug`, `title`, `description` ✔, `sort_order` ✔.
### `apex_testimonial` [L] — 3–9 (homepage reviews, client-managed): `quote` mtext ✔, `author` text ✔, `rating` int 1–5 ✔, `sort_order` ✔.
### `apex_faq_item` [L]: `question` ✔, `answer` rich_text ✔, `topic` choice `shipping, returns, warranty, payments, trade-in, other` ✔, `sort_order` ✔.
### `apex_footer_link` [L]: `column` choice `Shop, Support, Company` ✔, `label` ✔, `url` ✔ (internal paths start with `/`), `sort_order` ✔.

### `apex_site_settings` [L] — 1 entry, handle `main`
| key | type | note |
|---|---|---|
| `footer_description` | mtext | |
| `copyright_text` | text | optional; default `© {year} Apex Gadget. All rights reserved.` |
| `social_instagram`, `social_x`, `social_youtube`, `social_linkedin`, `social_facebook`, `social_tiktok` | url | empty ⇒ hidden |
| `whatsapp_number` | text | digits only with country code, e.g. `923001234567` (used for `wa.me`) |
| **`trade_in_message_template`** | mtext | WhatsApp message with `{placeholders}` (06 §7). Draft default shipped in code; **client edits here**. |
| `support_email`, `support_phone` | text | |
| `drop_alerts_title_line_1`, `drop_alerts_title_line_2`, `drop_alerts_description`, `drop_alerts_button_label` | text | copy of the launch "drop alerts" block (replaces the newsletter form) |
| `drop_alerts_message` | mtext | pre-filled WhatsApp text, e.g. "Hi Apex Gadgets, please add me to your drop alerts." (**DRAFT**, client edits) |
| `shop_banner_image` | img | 2880×1080 |
| `shop_banner_alt`, `shop_banner_url` | text, url | |
| `payment_methods` | list.text | e.g. `Cash on Delivery, Bank transfer, EasyPaisa, JazzCash` (footer chips) |

### `apex_trade_in_request` [P] — private (Storefront access OFF), only for the post-launch backend
`name, phone, device_model, storage, color, battery_health, pta_status, screen_condition, body_condition, notes, wanted_model, photos (list.file_reference), status (new/quoted/accepted/rejected/completed), quote_amount`. **Not created at launch.**

## 6. Policies and pages [L]
Refund/shipping/privacy/terms from `shop { … Policy }`; warranty text from a Shopify Page `warranty`; FAQ from `apex_faq_item`. All policy wording is **BLOCKED-ON-CLIENT**.

## 7. Customer data [P]
Wishlist v1 is localStorage (`apex.wishlist.v1`, Zustand persist `{ state: { items: { handle: string; addedAt: number }[] }, version: 1 }`; `addedAt` feeds "Newest first"). Built now (mock + Shopify batch lookup by handle, doc 05 §4b); customer-account sync is post-launch.
