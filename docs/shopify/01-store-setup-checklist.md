# 01 — Store setup checklist

Tick in order. ⚠ = unverified (see OPEN-ISSUES). The store is inactive today; reactivate it before step A.

## A. Store basics
- [ ] Plan: Basic or higher. Currency **PKR**, timezone Asia/Karachi, metric units.
- [ ] Markets: single market "Pakistan", PKR. English only.
- [ ] Checkout: customer accounts **Optional**, guest checkout on; **phone number required**; address line 2 optional.
- [ ] Domains: storefront domain → Vercel; Shopify checkout stays on the store/checkout domain.

## B. Payments — manual methods only at launch
Shopify Payments is **not offered in Pakistan** (third-party sources; confirm on Shopify's country payment list ⚠). No online card payments at launch.

1. **Settings → Payments → Manual payment methods**
   - [ ] **Cash on delivery (COD)** — add instructions ("Pay the rider in cash; inspect before paying").
   - [ ] **Bank deposit** — account title, bank, IBAN, "Send the receipt on WhatsApp".
   - [ ] **Custom payment method** named **EasyPaisa** and another named **JazzCash** — account number/name, "Send screenshot on WhatsApp with your order number".
2. **Client workflow for manual orders:** the order arrives as *Payment pending* → staff verify the transfer (or COD handover) → open the order → **Mark as paid** (COD: after delivery) → fulfil. Use order tags `paid-verified`, `cod`, `bank`, `easypaisa`, `jazzcash` for reporting. Orders unpaid after N days (client decides) are cancelled → inventory restocks (listing becomes available again).
3. **Research (not a launch blocker):** automatic EasyPaisa/JazzCash confirmation inside Shopify-hosted checkout. Only vendor pages (ECOSIRE build-to-order apps using Shopify's Payments Apps API, 2–4 weeks, needs merchant credentials) were found; nothing from Shopify/Easypaisa/JazzCash confirms it — ⚠ UNVERIFIED. Ask the gateway account managers and Shopify support before committing.

## C. Shipping, taxes, policies — values are **BLOCKED-ON-CLIENT**
- [ ] Shipping profile "General": zone Pakistan, flat rate PKR `TBD`, free over `TBD`, COD allowed on all rates. Do not invent numbers.
- [ ] Taxes: tax-inclusive prices only if the client confirms GST applies (`TBD`).
- [ ] Policies (refund, shipping, privacy, terms) and the **warranty page** (handle `warranty`) — client text. Until then the product field `custom.warranty_months` holds a clearly marked PLACEHOLDER.

## D. Headless channel and Storefront token
- [ ] Install the **Headless** channel → create a storefront → copy the **public access token**.
- [ ] Scopes — **confirm each is ticked** (labels may differ ⚠):
  - `unauthenticated_read_product_listings`, `unauthenticated_read_product_tags`
  - **`unauthenticated_read_product_inventory`** (needed for `quantityAvailable`, "Sold"/stock states)
  - `unauthenticated_read_collection_listings`
  - **`unauthenticated_read_metaobjects`** (home CMS, FAQ, testimonials, settings)
  - `unauthenticated_read_content` (pages, policies)
  - `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts` (cart)
  - customer scopes only when accounts start **[P]**
- [ ] Publish every product, collection and page to the **Headless** channel (unpublished ⇒ invisible; a sold listing must stay published).
- [ ] No Admin app, no Flow, no Vercel Admin token at launch.

## E. Search & Discovery and collections (filters are server-side — see doc 10)
- [ ] Install **Shopify Search & Discovery**.
- [ ] Create collections: `all-products`, `iphones`, `audio`, `wearables`, `chargers`, `cases`, `accessories`, `bestsellers`, `new-arrivals` (conditions in 10 §3). Each < 5,000 products.
- [ ] Add the 9 launch filters (10 §3): Availability, Price, Product type, Model, Storage, PTA status, Battery health, Color, Condition.
- [ ] Test on the dev store: open `/shop?category=iphones` filters, then run `yarn shopify:audit`.

## F. Custom data
- [ ] Products → metafield definitions from 02 §3 (12 definitions) with **Storefront access ON**; choices configured as listed (`device_model` includes `iphone-16`, `iphone-17`; `pta_status` includes `jv`; `battery_bucket` new).
- [ ] Metaobject definitions from 02 §5 with Storefront access **Active** (`apex_trade_in_request` is post-launch — do not create).
- [ ] Create entries: 1 hero (`home`), 1 settings (`main`, incl. `whatsapp_number` and `trade_in_message_template`), 2 promo cards, 6 category cards, banner slides, 4 why-us, ≥3 testimonials, footer links, FAQ.
- [ ] Settings entry `payment_methods` = the four labels shown in the footer.

## G. Go-live
- [ ] Test orders for each payment method; 1-unit stock race with two carts; sold listing page.
- [ ] Remove password page; verify `robots.txt` and sitemap on the Vercel domain; set `VITE_USE_MOCK_DATA=false` in Vercel env.
- [ ] `yarn shopify:audit` must be clean (no ERRORs; WARNs reviewed).
