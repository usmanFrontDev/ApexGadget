import {
  BatteryRange,
  FacetKey,
  PRICE_BOUNDS_STEP,
  ProductSortKey,
  SHOP_FACETS,
  SHOP_PAGE_SIZE,
} from '@/constants/shop'
import type { ProductSummary } from '@/types/product.types'
import type { PriceBounds, ShopCatalogView, ShopFilters } from '@/types/shop.types'

export function getBatteryRange(health: number): BatteryRange {
  if (health >= 90) return BatteryRange.Excellent
  if (health >= 85) return BatteryRange.Good
  if (health >= 80) return BatteryRange.Fair
  return BatteryRange.Low
}

/** The value(s) of a product for one facet (empty when the product doesn't have it). */
export function getFacetValues(product: ProductSummary, key: FacetKey): string[] {
  switch (key) {
    case FacetKey.Models:
      return product.model ? [product.model] : []
    case FacetKey.Storages:
      return product.storage ? [product.storage] : []
    case FacetKey.Conditions:
      return product.condition ? [product.condition] : []
    case FacetKey.BatteryRanges:
      return product.batteryHealth !== undefined ? [getBatteryRange(product.batteryHealth)] : []
    case FacetKey.Colors:
      return product.color ? [product.color] : []
  }
}

interface MatchOptions {
  skipFacet?: FacetKey
  skipPrice?: boolean
}

function matches(product: ProductSummary, filters: ShopFilters, options: MatchOptions = {}) {
  for (const { key } of SHOP_FACETS) {
    const selected = filters.facets[key]
    if (key === options.skipFacet || selected.length === 0) continue
    if (!getFacetValues(product, key).some((value) => selected.includes(value))) return false
  }
  if (!options.skipPrice) {
    if (filters.minPrice !== undefined && product.priceAmount < filters.minPrice) return false
    if (filters.maxPrice !== undefined && product.priceAmount > filters.maxPrice) return false
  }
  const term = filters.search.trim().toLowerCase()
  if (term && !`${product.title} ${product.subtitle}`.toLowerCase().includes(term)) return false
  return true
}

function sortProducts(products: ProductSummary[], sort: ProductSortKey) {
  const sorted = [...products]
  switch (sort) {
    case ProductSortKey.Newest:
      return sorted.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    case ProductSortKey.PriceAsc:
      return sorted.sort((a, b) => a.priceAmount - b.priceAmount)
    case ProductSortKey.PriceDesc:
      return sorted.sort((a, b) => b.priceAmount - a.priceAmount)
    case ProductSortKey.TitleAsc:
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted // catalogue order = best selling first
  }
}

export function getPriceBounds(products: readonly ProductSummary[]): PriceBounds {
  if (products.length === 0) return { min: 0, max: PRICE_BOUNDS_STEP }
  const prices = products.map((product) => product.priceAmount)
  return {
    min: Math.floor(Math.min(...prices) / PRICE_BOUNDS_STEP) * PRICE_BOUNDS_STEP,
    max: Math.ceil(Math.max(...prices) / PRICE_BOUNDS_STEP) * PRICE_BOUNDS_STEP,
  }
}

/** Filters, sorts, counts and paginates the whole catalogue for the given shop filters. */
export function buildCatalogView(catalog: readonly ProductSummary[], filters: ShopFilters): ShopCatalogView {
  const inCategory = catalog.filter((product) => (product.category ?? 'accessories') === filters.category)
  const matching = sortProducts(
    inCategory.filter((product) => matches(product, filters)),
    filters.sort,
  )

  const facetCounts = {} as ShopCatalogView['facetCounts']
  const availableFacets: FacetKey[] = []
  for (const { key, options } of SHOP_FACETS) {
    const counts: Record<string, number> = Object.fromEntries(options.map((option) => [option.value, 0]))
    let hasValues = false
    for (const product of inCategory) {
      const values = getFacetValues(product, key)
      if (values.length > 0) hasValues = true
      if (values.length > 0 && matches(product, filters, { skipFacet: key })) {
        values.forEach((value) => {
          counts[value] = (counts[value] ?? 0) + 1
        })
      }
    }
    facetCounts[key] = counts
    if (hasValues) availableFacets.push(key)
  }

  const pageCount = Math.max(1, Math.ceil(matching.length / SHOP_PAGE_SIZE))
  const page = Math.min(Math.max(1, filters.page), pageCount)

  return {
    products: matching.slice((page - 1) * SHOP_PAGE_SIZE, page * SHOP_PAGE_SIZE),
    total: matching.length,
    page,
    pageCount,
    facetCounts,
    availableFacets,
    priceBounds: getPriceBounds(inCategory),
  }
}
