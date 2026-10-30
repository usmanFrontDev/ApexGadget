import type { ProductSortKey, ShopCategoryId } from '@/constants/shop'
import type { ProductSummary } from '@/types/product.types'

/**
 * Shopify's `ProductFilter` input. A selected filter value is stored as exactly this object, so the
 * shop never depends on filter ids (docs/shopify/10-filters-and-search-discovery.md §5).
 */
export type ProductFilterInput =
  | { available: boolean }
  | { price: { min?: number; max?: number } }
  | { productType: string }
  | { productVendor: string }
  | { variantOption: { name: string; value: string } }
  | { productMetafield: { namespace: string; key: string; value: string } }
  | { variantMetafield: { namespace: string; key: string; value: string } }
  | { category: { id: string } }

export const FilterGroupType = {
  List: 'LIST',
  PriceRange: 'PRICE_RANGE',
} as const
export type FilterGroupType = (typeof FilterGroupType)[keyof typeof FilterGroupType]

export interface FilterValue {
  /** From the API; only used as a React key. */
  id: string
  label: string
  count: number
  input: ProductFilterInput
  /** URL param (`f.productMetafield.custom.storage`) and its value (`256gb`). */
  urlKey: string
  urlValue: string
}

export interface FilterGroup {
  id: string
  /** Set in Shopify Search & Discovery. */
  label: string
  type: FilterGroupType
  values: FilterValue[]
  /** PRICE_RANGE only. */
  priceBounds?: PriceBounds
}

export interface PriceBounds {
  min: number
  max: number
}

/** Everything the shop page asks Shopify for (mirrors the URL query string). */
export interface ShopQuery {
  category: ShopCategoryId
  sort: ProductSortKey
  /** Non-empty switches the shop to Shopify search. */
  search: string
  /** Selected filter values; different filter kinds combine with AND, same kind with OR. */
  selection: ProductFilterInput[]
}

/** One page of shop results (cursor based). Mock and Shopify services return exactly this. */
export interface ShopResultsPage {
  products: ProductSummary[]
  filters: FilterGroup[]
  hasNextPage: boolean
  endCursor: string | null
  /** Search: `totalCount` (max 1,000). Collections: derived from the availability filter, may be missing. */
  totalCount?: number
}
