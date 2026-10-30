import type { ClientResponse } from '@shopify/storefront-api-client'
import { CATEGORY_COLLECTION_HANDLE, SHOP_PAGE_SIZE } from '@/constants/shop'
import { USE_MOCK_DATA } from '@/lib/env'
import { getShopifyClient } from '@/lib/shopify'
import { withDefaultAvailability } from '@/lib/shopFilters'
import {
  buildShopVariables,
  deriveTotalCount,
  mapFilterGroups,
  mapProduct,
  type ShopifyFilterNode,
  type ShopifyProductNode,
} from '@/services/products.mappers'
import { queryMockShop } from '@/services/mock/shopMock'
import { SEARCH_PRODUCTS_QUERY, SHOP_PRODUCTS_QUERY } from '@/services/products.queries'
import type { ShopQuery, ShopResultsPage } from '@/types/shop.types'

interface Connection {
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
  filters?: ShopifyFilterNode[]
  productFilters?: ShopifyFilterNode[]
  totalCount?: number
  nodes: ShopifyProductNode[]
}

interface ShopData {
  collection?: { products: Connection } | null
  search?: Connection
}

const MOCK_LATENCY_MS = 250

async function getShopifyShopProducts(query: ShopQuery, after: string | null): Promise<ShopResultsPage> {
  const variables = buildShopVariables(query, SHOP_PAGE_SIZE, after)
  const isSearch = query.search.trim() !== ''

  const response: ClientResponse<ShopData> = await getShopifyClient().request<ShopData>(
    isSearch ? SEARCH_PRODUCTS_QUERY : SHOP_PRODUCTS_QUERY,
    {
      variables: isSearch
        ? { ...variables, query: query.search.trim() }
        : { ...variables, handle: CATEGORY_COLLECTION_HANDLE[query.category] },
    },
  )
  if (response.errors) throw new Error(response.errors.message ?? 'Could not load products')

  const connection = isSearch ? response.data?.search : response.data?.collection?.products
  // Unknown / unpublished collection: an empty shop, not an error.
  if (!connection) {
    return { products: [], filters: [], hasNextPage: false, endCursor: null, totalCount: 0 }
  }

  const filters = mapFilterGroups((isSearch ? connection.productFilters : connection.filters) ?? [])
  return {
    products: connection.nodes.map(mapProduct),
    filters,
    hasNextPage: connection.pageInfo.hasNextPage,
    endCursor: connection.pageInfo.endCursor,
    totalCount: isSearch ? connection.totalCount : deriveTotalCount(filters, withDefaultAvailability(query.selection)),
  }
}

async function getMockShopProducts(query: ShopQuery, after: string | null): Promise<ShopResultsPage> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
  return queryMockShop(query, after)
}

/** One page of the shop for the current category / search / filters (Shopify, or the mock engine in dev). */
export function getShopProducts(query: ShopQuery, after: string | null = null): Promise<ShopResultsPage> {
  return USE_MOCK_DATA ? getMockShopProducts(query, after) : getShopifyShopProducts(query, after)
}
