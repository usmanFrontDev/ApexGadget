import { WishlistSort } from '@/constants/wishlist'
import type { WishlistItem } from '@/store/useWishlistStore'
import type { ProductSummary } from '@/types/product.types'

export interface WishlistEntry extends WishlistItem {
  /** `null`: the product no longer exists in the store. */
  product: ProductSummary | null
}

/** Sorts saved products. Entries without a product go last on the price sorts. */
export function sortWishlistEntries(entries: readonly WishlistEntry[], sort: WishlistSort): WishlistEntry[] {
  const sorted = [...entries]
  const byPrice = (direction: 1 | -1) => (a: WishlistEntry, b: WishlistEntry) => {
    if (!a.product && !b.product) return b.addedAt - a.addedAt
    if (!a.product) return 1
    if (!b.product) return -1
    return (a.product.priceAmount - b.product.priceAmount) * direction || b.addedAt - a.addedAt
  }
  switch (sort) {
    case WishlistSort.Oldest:
      return sorted.sort((a, b) => a.addedAt - b.addedAt)
    case WishlistSort.PriceAsc:
      return sorted.sort(byPrice(1))
    case WishlistSort.PriceDesc:
      return sorted.sort(byPrice(-1))
    default:
      return sorted.sort((a, b) => b.addedAt - a.addedAt)
  }
}

export const getPageCount = (total: number, pageSize: number) => Math.max(1, Math.ceil(total / pageSize))

/** The page's slice; `page` is clamped to a valid page. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): { items: T[]; page: number; pageCount: number } {
  const pageCount = getPageCount(items.length, pageSize)
  const current = Math.min(Math.max(1, page), pageCount)
  return { items: items.slice((current - 1) * pageSize, current * pageSize), page: current, pageCount }
}
