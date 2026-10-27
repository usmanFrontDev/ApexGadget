import type { FacetKey, ProductSortKey, ShopCategoryId } from '@/constants/shop'
import type { ProductSummary } from '@/types/product.types'

export interface FacetOption {
  value: string
  label: string
  /** Tailwind background class of the color dot (color facet only). */
  swatchClass?: string
}

export interface FacetConfig {
  key: FacetKey
  /** URL query-string key. */
  param: string
  title: string
  options: readonly FacetOption[]
}

export type FacetSelections = Record<FacetKey, string[]>

/** Everything the shop page filters / sorts by (mirrors the URL query string). */
export interface ShopFilters {
  category: ShopCategoryId
  facets: FacetSelections
  minPrice?: number
  maxPrice?: number
  sort: ProductSortKey
  /** 1-based page number. */
  page: number
  search: string
}

export interface PriceBounds {
  min: number
  max: number
}

/** What the shop page renders for the current filters. */
export interface ShopCatalogView {
  /** Products of the current page. */
  products: ProductSummary[]
  total: number
  page: number
  pageCount: number
  /** Option counts per facet (disjunctive: a facet ignores its own selection). */
  facetCounts: Record<FacetKey, Record<string, number>>
  /** Facets that have at least one value in this category (others are hidden). */
  availableFacets: FacetKey[]
  priceBounds: PriceBounds
}
