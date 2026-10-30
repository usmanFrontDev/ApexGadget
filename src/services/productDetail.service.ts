import type { ClientResponse } from '@shopify/storefront-api-client'
import {
  getMockProductDetail,
  getMockSimilarProducts,
  MOCK_REFUND_POLICY_HTML,
  MOCK_SHIPPING_POLICY_HTML,
} from '@/constants/mockProductDetail'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { PRODUCT_ROW_SIZE } from '@/constants/shop'
import { METAFIELD_NAMESPACE, ProductMetafield } from '@/constants/shopify'
import { WISHLIST_BATCH_SIZE } from '@/constants/wishlist'
import { USE_MOCK_DATA } from '@/lib/env'
import { getShopifyClient } from '@/lib/shopify'
import { mapProductDetail, type ShopifyProductDetailNode } from '@/services/productDetail.mappers'
import {
  buildProductsByHandlesQuery,
  handlesToVariables,
  POLICIES_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY,
  SIMILAR_PRODUCTS_QUERY,
} from '@/services/productDetail.queries'
import { mapProduct, type ShopifyProductNode } from '@/services/products.mappers'
import type { ProductDetail, ProductSummary } from '@/types/product.types'

const MOCK_LATENCY_MS = 300
const SIMILAR_LIMIT = PRODUCT_ROW_SIZE

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function request<T>(query: string, variables?: Record<string, unknown>): Promise<T | undefined> {
  const response: ClientResponse<T> = await getShopifyClient().request<T>(query, { variables })
  if (response.errors) throw new Error(response.errors.message ?? 'Shopify request failed')
  return response.data
}

/** One product page. `null` = no such (published) product; a sold listing is still returned. */
export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  if (USE_MOCK_DATA) {
    await wait(MOCK_LATENCY_MS)
    return getMockProductDetail(handle)
  }
  const data = await request<{ product: ShopifyProductDetailNode | null }>(PRODUCT_BY_HANDLE_QUERY, { handle })
  return data?.product ? mapProductDetail(data.product) : null
}

/** A saved handle and its product card (`null`: the product no longer exists). */
export interface ProductLookup {
  handle: string
  product: ProductSummary | null
}

/**
 * Cards for a list of handles (the wishlist). Each result carries its handle, so the caller never depends on order;
 * a handle that no longer exists gives `product: null`.
 * Shopify: one aliased request per batch of up to `WISHLIST_BATCH_SIZE` handles.
 */
export async function getProductsByHandles(handles: readonly string[]): Promise<ProductLookup[]> {
  if (handles.length === 0) return []
  if (USE_MOCK_DATA) {
    await wait(MOCK_LATENCY_MS)
    return handles.map((handle) => ({ handle, product: MOCK_PRODUCTS.find((product) => product.handle === handle) ?? null }))
  }

  const results: ProductLookup[] = []
  for (let start = 0; start < handles.length; start += WISHLIST_BATCH_SIZE) {
    const batch = handles.slice(start, start + WISHLIST_BATCH_SIZE)
    const data = await request<Record<string, ShopifyProductNode | null>>(
      buildProductsByHandlesQuery(batch.length),
      handlesToVariables(batch),
    )
    batch.forEach((handle, index) => {
      const node = data?.[`p${index}`]
      results.push({ handle, product: node ? mapProduct(node) : null })
    })
  }
  return results
}

/** Up to 5 similar products (one row): Shopify recommendations first, then same model; mock: same model/category. */
export async function getSimilarProducts(handle: string, model?: string): Promise<ProductSummary[]> {
  if (USE_MOCK_DATA) {
    await wait(MOCK_LATENCY_MS)
    return getMockSimilarProducts(handle, SIMILAR_LIMIT)
  }

  const recommended = await request<{ productRecommendations: ShopifyProductNode[] | null }>(
    PRODUCT_RECOMMENDATIONS_QUERY,
    { handle },
  )
  const fromRecommendations = (recommended?.productRecommendations ?? []).map(mapProduct)
  if (fromRecommendations.length > 0) return fromRecommendations.slice(0, SIMILAR_LIMIT)
  if (!model) return []

  const filters = [
    { productMetafield: { namespace: METAFIELD_NAMESPACE, key: ProductMetafield.DeviceModel, value: model } },
    { available: true },
  ]
  const similar = await request<{ collection: { products: { nodes: ShopifyProductNode[] } } | null }>(
    SIMILAR_PRODUCTS_QUERY,
    { filters },
  )
  return (similar?.collection?.products.nodes ?? [])
    .filter((node) => node.handle !== handle)
    .map(mapProduct)
    .slice(0, SIMILAR_LIMIT)
}

export interface ShopPolicies {
  /** Shopify policy bodies are HTML: sanitise before rendering. */
  shippingHtml?: string
  refundHtml?: string
}

/** Shipping and refund policy text (docs/shopify/05 §8). Mock: clearly marked placeholders. */
export async function getShopPolicies(): Promise<ShopPolicies> {
  if (USE_MOCK_DATA) {
    await wait(MOCK_LATENCY_MS)
    return { shippingHtml: MOCK_SHIPPING_POLICY_HTML, refundHtml: MOCK_REFUND_POLICY_HTML }
  }
  const data = await request<{ shop: { shippingPolicy: { body: string } | null; refundPolicy: { body: string } | null } }>(
    POLICIES_QUERY,
  )
  return { shippingHtml: data?.shop.shippingPolicy?.body, refundHtml: data?.shop.refundPolicy?.body }
}
