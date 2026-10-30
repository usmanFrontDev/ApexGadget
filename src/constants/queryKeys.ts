import { normalizeSelection } from '@/lib/shopFilters'
import type { ShopQuery } from '@/types/shop.types'

export const productKeys = {
  all: ['products'] as const,
  /** Normalised, so the same filters in any order share one cache entry. */
  shop: (query: ShopQuery) =>
    [...productKeys.all, 'shop', { ...query, selection: normalizeSelection(query.selection) }] as const,
}
