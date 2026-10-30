import type { ClientResponse } from '@shopify/storefront-api-client'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { USE_MOCK_DATA } from '@/lib/env'
import { getShopifyClient } from '@/lib/shopify'
import { countMockCategories } from '@/services/mock/shopMock'
import { mapCategoryCounts, type CategoryCounts, type ShopifyCategoryCountsData } from '@/services/categories.mappers'
import { CATEGORY_COUNTS_QUERY } from '@/services/categories.queries'

const MOCK_LATENCY_MS = 200

/** How many in-stock products each category has (home category cards). */
export async function getCategoryCounts(): Promise<CategoryCounts> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
    return countMockCategories(MOCK_PRODUCTS)
  }
  const response: ClientResponse<ShopifyCategoryCountsData> = await getShopifyClient().request<ShopifyCategoryCountsData>(
    CATEGORY_COUNTS_QUERY,
  )
  if (response.errors) throw new Error(response.errors.message ?? 'Could not load category counts')
  return mapCategoryCounts(response.data)
}
