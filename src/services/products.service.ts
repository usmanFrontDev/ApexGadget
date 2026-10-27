import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { ROUTES } from '@/constants/routes'
import {
  ProductColor,
  ProductCondition,
  ProductGrade,
  ProductStorage,
  SHOPIFY_CONDITION_TAGS,
  SHOPIFY_IPHONE_PRODUCT_TYPE,
  SHOPIFY_TAG,
  ShopCategoryId,
  ShopModelId,
} from '@/constants/shop'
import { USE_MOCK_DATA } from '@/lib/env'
import { shopifyClient } from '@/lib/shopify'
import { CATALOG_PAGE_SIZE, CATALOG_QUERY } from '@/services/products.queries'
import type { ProductSummary } from '@/types/product.types'

interface ShopifyProductNode {
  id: string
  handle: string
  title: string
  description: string
  tags: string[]
  productType: string
  availableForSale: boolean
  createdAt: string
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  featuredImage: { url: string; altText: string | null } | null
}

interface ShopifyCatalogData {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null }
    edges: Array<{ node: ShopifyProductNode }>
  }
}

const MOCK_LATENCY_MS = 400

const oneOf = <T extends string>(values: Record<string, T>, value: string | undefined) =>
  Object.values(values).find((candidate) => candidate === value)

/** Value of a `prefix:value` tag, if the product has one. */
const tagValue = (tags: string[], prefix: string) =>
  tags.find((tag) => tag.startsWith(prefix))?.slice(prefix.length)

function mapProduct(node: ShopifyProductNode): ProductSummary {
  const tags = node.tags.map((tag) => tag.toLowerCase())
  const { amount, currencyCode } = node.priceRange.minVariantPrice
  const battery = Number(tagValue(tags, SHOPIFY_TAG.Battery))
  const storage = oneOf(ProductStorage, tagValue(tags, SHOPIFY_TAG.Storage))

  return {
    id: node.id,
    title: node.title,
    subtitle: storage ? storage.toUpperCase() : (node.description.split('\n')[0] ?? ''),
    priceAmount: Number(amount),
    currencyCode,
    image: node.featuredImage?.url,
    availableForSale: node.availableForSale,
    createdAt: node.createdAt,
    category:
      node.productType === SHOPIFY_IPHONE_PRODUCT_TYPE
        ? ShopCategoryId.Iphones
        : ShopCategoryId.Accessories,
    model: oneOf(ShopModelId, tagValue(tags, SHOPIFY_TAG.Model)),
    storage,
    color: oneOf(ProductColor, tagValue(tags, SHOPIFY_TAG.Color)),
    grade: oneOf(ProductGrade, tagValue(tags, SHOPIFY_TAG.Grade)),
    batteryHealth: Number.isFinite(battery) && battery > 0 ? battery : undefined,
    condition: tags.includes(SHOPIFY_CONDITION_TAGS[ProductCondition.Pta])
      ? ProductCondition.Pta
      : tags.includes(SHOPIFY_CONDITION_TAGS[ProductCondition.NonPta])
        ? ProductCondition.NonPta
        : undefined,
    // TODO: link to the product detail page (`/shop/${node.handle}`) once it exists.
    to: ROUTES.shop,
  }
}

/** Every product, best selling first (follows Shopify's cursor until the last page). */
async function getShopifyCatalog(): Promise<ProductSummary[]> {
  const products: ProductSummary[] = []
  let after: string | null = null

  do {
    const response: Awaited<ReturnType<typeof shopifyClient.request<ShopifyCatalogData>>> =
      await shopifyClient.request<ShopifyCatalogData>(CATALOG_QUERY, {
        variables: { first: CATALOG_PAGE_SIZE, after },
      })
    if (response.errors) throw new Error(response.errors.message ?? 'Could not load products')

    const connection = response.data?.products
    products.push(...(connection?.edges ?? []).map((edge) => mapProduct(edge.node)))
    after = connection?.pageInfo.hasNextPage ? (connection.pageInfo.endCursor ?? null) : null
  } while (after)

  return products
}

async function getMockCatalog(): Promise<ProductSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
  return [...MOCK_PRODUCTS]
}

/** The whole catalogue (Shopify, or the mock one in dev). Filtering happens client-side. */
export function getCatalog(): Promise<ProductSummary[]> {
  return USE_MOCK_DATA ? getMockCatalog() : getShopifyCatalog()
}
