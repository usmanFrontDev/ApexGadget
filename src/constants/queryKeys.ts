import { normalizeSelection } from '@/lib/shopFilters'
import type { ShopQuery } from '@/types/shop.types'

export const productKeys = {
  all: ['products'] as const,
  /** Normalised, so the same filters in any order share one cache entry. */
  shop: (query: ShopQuery) =>
    [...productKeys.all, 'shop', { ...query, selection: normalizeSelection(query.selection) }] as const,
  detail: (handle: string) => [...productKeys.all, 'detail', handle] as const,
  similar: (handle: string, limit?: number) => [...productKeys.all, 'similar', handle, limit] as const,
  /** Wishlist lookup: order-independent. */
  byHandles: (handles: readonly string[]) => [...productKeys.all, 'by-handles', [...handles].sort()] as const,
}

export const categoryKeys = {
  all: ['categories'] as const,
  counts: () => [...categoryKeys.all, 'counts'] as const,
}

export const policyKeys = {
  all: ['policies'] as const,
  shipping: () => [...policyKeys.all, 'shop'] as const,
}

export const settingsKeys = {
  all: ['settings'] as const,
  tradeIn: () => [...settingsKeys.all, 'trade-in'] as const,
}

export const cartKeys = {
  all: ['cart'] as const,
  detail: (id: string) => [...cartKeys.all, 'detail', id] as const,
  /** Prefix shared by every cart mutation (`useIsMutating`). */
  mutations: () => [...cartKeys.all, 'mutation'] as const,
  mutation: (name: 'add' | 'update-line' | 'remove-line' | 'discount' | 'note' | 'checkout') =>
    [...cartKeys.mutations(), name] as const,
}
