import { ShopCategoryId } from '@/constants/shop'
import { deriveTotalCount, mapFilterGroups, type ShopifyFilterNode } from '@/services/products.mappers'
import { COUNTED_CATEGORIES } from '@/services/categories.queries'

export type CategoryCounts = Partial<Record<ShopCategoryId, number>>

export type ShopifyCategoryCountsData = Record<string, { products: { filters: ShopifyFilterNode[] } } | null>

/** Query result -> in-stock product count per category; a category without data is left out (the card shows no count). */
export function mapCategoryCounts(data: ShopifyCategoryCountsData | undefined): CategoryCounts {
  const counts: CategoryCounts = {}
  for (const category of COUNTED_CATEGORIES) {
    const node = data?.[category.replace(/\W/g, '_')]
    if (!node) continue
    const total = deriveTotalCount(mapFilterGroups(node.products.filters), [{ available: true }])
    if (total !== undefined) counts[category] = total
  }
  return counts
}
