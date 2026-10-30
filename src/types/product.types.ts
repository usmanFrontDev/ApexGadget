import type { ShopCategoryId } from '@/constants/shop'

export interface ProductBadge {
  label: string
}

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
  badge?: ProductBadge
  to: string
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
