import type {
  BatteryRange,
  ProductColor,
  ProductCondition,
  ProductGrade,
  ProductStorage,
  ShopCategoryId,
  ShopModelId,
} from '@/constants/shop'

export interface ProductBadge {
  label: string
}

/** Card-level product data (mapped from Shopify in the service layer). */
export interface ProductSummary {
  id: string
  title: string
  subtitle: string
  priceAmount: number
  currencyCode: string
  /** Falls back to a striped placeholder when missing. */
  image?: string
  badge?: ProductBadge
  to: string
  /** Defaults to true when omitted. */
  availableForSale?: boolean
  // Catalogue facets (shop page)
  category?: ShopCategoryId
  model?: ShopModelId
  storage?: ProductStorage
  condition?: ProductCondition
  /** Battery health in percent. */
  batteryHealth?: number
  color?: ProductColor
  grade?: ProductGrade
  /** ISO date, used by the "Newest" sort. */
  createdAt?: string
}

export type { BatteryRange }
