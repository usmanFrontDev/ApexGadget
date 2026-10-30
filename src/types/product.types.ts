import type { ShopCategoryId } from '@/constants/shop'
import type { Money } from '@/types/cart.types'

/**
 * Card-level product data (mapped from Shopify in the service layer).
 * Facet-like fields are plain strings (lower-case metafield values): an unknown value is kept and
 * shown humanised, never dropped (see `lib/filterLabels.ts`).
 */
export interface ProductSummary {
  id: string
  /** Shopify product handle (URL slug, e.g. `iphone-15-pro-256gb-natural-titanium-001`). */
  handle: string
  title: string
  subtitle: string
  priceAmount: number
  currencyCode: string
  /** Original price when the product is discounted (only set when higher than `priceAmount`). */
  compareAtAmount?: number
  /** Falls back to a striped placeholder when missing. */
  image?: string
  /** Alt text from Shopify; falls back to the title. */
  imageAlt?: string
  to: string
  /** The variant "Add to Cart" on a card buys: set only when the product has a single variant (none: "View details" only). */
  variantId?: string
  /** Defaults to true when omitted. */
  availableForSale?: boolean
  category?: ShopCategoryId
  /** `custom.device_model`, e.g. `iphone-15`. */
  model?: string
  /** `custom.storage`, e.g. `256gb`. */
  storage?: string
  /** `custom.pta_status`: `pta`, `non-pta` or `jv`. */
  ptaStatus?: string
  /** Battery health in percent (`custom.battery_health`). */
  batteryHealth?: number
  /** `custom.battery_bucket`, e.g. `90-100`. */
  batteryBucket?: string
  /** `custom.color`, e.g. `natural-titanium`. */
  color?: string
  /** `custom.condition_grade`: `new`, `excellent`, `very-good`, `good`. */
  grade?: string
  /** ISO date, used by the "Newest" sort. */
  createdAt?: string
}

export interface ProductImage {
  url: string
  alt: string
  width?: number
  height?: number
}

export interface ProductOption {
  name: string
  values: string[]
}

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductVariant {
  id: string
  title: string
  sku?: string
  availableForSale: boolean
  /** Needs the `unauthenticated_read_product_inventory` scope. */
  quantityAvailable?: number
  priceAmount: number
  compareAtAmount?: number
  currencyCode: string
  selectedOptions: { name: string; value: string }[]
  image?: string
}

/** Everything the product page shows (docs/shopify/06-field-mapping.md §3). */
export interface ProductDetail extends ProductSummary {
  /** Shopify HTML: sanitise before rendering (`lib/sanitizeHtml.ts`). */
  descriptionHtml: string
  images: ProductImage[]
  /** Only options with more than one value (the default "Title" option is dropped). */
  options: ProductOption[]
  variants: ProductVariant[]
  warrantyMonths?: number
  warrantyNote?: string
  boxContents: string[]
  specs: ProductSpec[]
  seo: { title?: string; description?: string }
  /** No variant can be bought: the page stays up and shows "Sold". */
  sold: boolean
}

export type { Money }
