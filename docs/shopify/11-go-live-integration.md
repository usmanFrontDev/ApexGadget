# 11 — Go-live integration (Shopify)

Shopify integration is ON HOLD: everything runs on mock data. This file lists what is still missing for the day the store is connected.

## Pending Shopify implementations (cart) — `TODO(shopify)` markers

| Where | What |
|---|---|
| `services/cart.service.ts` `getCart` | `cart(id)` query; `null` when expired / completed (the app then creates a fresh cart silently) |
| `createCart` | `cartCreate(input: { lines })`; `userErrors` -> `CartError`; `warnings` -> `CartResult.warnings` (quantity clamped) |
| `addLines` / `updateLines` / `removeLines` | `cartLinesAdd` / `cartLinesUpdate` / `cartLinesRemove` (single-unit rule: phones have `quantityAvailable` 1, a second add must throw `SingleUnitInCart`) |
| `updateDiscountCodes` | `cartDiscountCodesUpdate`; a code with `applicable: false` -> `CartError(InvalidDiscount)`; fill `Cart.discount` |
| `updateNote` | `cartNoteUpdate` |
| `validateForCheckout` | re-fetch, check every line `availableForSale` and within stock |
| `hooks/useCheckout.ts` | `begin_checkout` analytics event; `window.location.assign(cart.checkoutUrl)` (already written for Shopify mode) |
| cart query fields | `merchandise.product` metafields (`condition_grade`, `pta_status`, `battery_health`, `card_subtitle`, `storage`, `color`), `quantityAvailable` (needs `unauthenticated_read_product_inventory`), `compareAtPrice` |

Mock-only things that must not ship connected: `constants/mockCart.ts` (discount codes, `apex.cart.mock.v1`), `services/mock/cartDemo.ts` (dev seed).
