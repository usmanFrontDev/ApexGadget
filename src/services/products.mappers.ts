import { ROUTES } from '@/constants/routes'
import {
  CATEGORY_PRODUCT_TYPE,
  ProductPtaStatus,
  ProductSortKey,
  SHOPIFY_PTA_TAGS,
  SHOPIFY_TAG,
  ShopCategoryId,
  type ShopCategoryId as ShopCategory,
} from '@/constants/shop'
import { getBatteryRange } from '@/lib/battery'
import { inputToUrl, parseFilterInput, withDefaultAvailability } from '@/lib/shopFilters'
import type { ProductSummary } from '@/types/product.types'
import {
  FilterGroupType,
  type FilterGroup,
  type FilterValue,
  type ProductFilterInput,
  type ShopQuery,
} from '@/types/shop.types'

interface MoneyNode {
  amount: string
  currencyCode: string
}

interface MetafieldNode {
  value: string
}

/** `ProductCardFields` fragment (docs/shopify/05-graphql.md §1). */
export interface ShopifyProductNode {
  id: string
  handle: string
  title: string
  description: string
  tags: string[]
  productType: string
  availableForSale: boolean
  createdAt: string
  priceRange: { minVariantPrice: MoneyNode }
  compareAtPriceRange?: { minVariantPrice: MoneyNode | null } | null
  featuredImage: { url: string; altText: string | null } | null
  deviceModel?: MetafieldNode | null
  storage?: MetafieldNode | null
  color?: MetafieldNode | null
  batteryHealth?: MetafieldNode | null
  batteryBucket?: MetafieldNode | null
  conditionGrade?: MetafieldNode | null
  ptaStatus?: MetafieldNode | null
  cardSubtitle?: MetafieldNode | null
}

/** `FilterFields` fragment. */
export interface ShopifyFilterNode {
  id: string
  label: string
  type: string
  values: Array<{ id: string; label: string; count: number; input: string }>
}

const clean = (value: string | null | undefined) => value?.trim().toLowerCase() || undefined
const text = (field: MetafieldNode | null | undefined) => field?.value.trim() || undefined

/** Value of a legacy `prefix:value` tag (fallback until the metafields are filled in). */
const tagValue = (tags: string[], prefix: string) =>
  tags.find((tag) => tag.startsWith(prefix))?.slice(prefix.length)

/** `iPhones` -> `iphones`, `Audio` -> `audio` …; any other product type is a generic accessory. */
export function productTypeToCategory(productType: string): ShopCategory {
  const wanted = productType.trim().toLowerCase()
  const match = Object.entries(CATEGORY_PRODUCT_TYPE).find(([, type]) => type?.toLowerCase() === wanted)
  return (match?.[0] as ShopCategory | undefined) ?? ShopCategoryId.Accessories
}

export function mapProduct(node: ShopifyProductNode): ProductSummary {
  const tags = node.tags.map((tag) => tag.toLowerCase())
  const { amount, currencyCode } = node.priceRange.minVariantPrice
  const price = Number(amount)

  const storage = clean(node.storage?.value) ?? tagValue(tags, SHOPIFY_TAG.Storage)
  const batteryRaw = Number(node.batteryHealth?.value ?? tagValue(tags, SHOPIFY_TAG.Battery))
  const batteryHealth = Number.isFinite(batteryRaw) && batteryRaw > 0 ? batteryRaw : undefined
  const compareAt = Number(node.compareAtPriceRange?.minVariantPrice?.amount)

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    subtitle: text(node.cardSubtitle) ?? (storage ? storage.toUpperCase() : (node.description.split('\n')[0] ?? '')),
    priceAmount: price,
    currencyCode,
    compareAtAmount: Number.isFinite(compareAt) && compareAt > price ? compareAt : undefined,
    image: node.featuredImage?.url,
    imageAlt: node.featuredImage?.altText ?? undefined,
    availableForSale: node.availableForSale,
    createdAt: node.createdAt,
    category: productTypeToCategory(node.productType),
    model: clean(node.deviceModel?.value) ?? tagValue(tags, SHOPIFY_TAG.Model),
    storage,
    color: clean(node.color?.value) ?? tagValue(tags, SHOPIFY_TAG.Color),
    grade: clean(node.conditionGrade?.value) ?? tagValue(tags, SHOPIFY_TAG.Grade),
    batteryHealth,
    batteryBucket:
      clean(node.batteryBucket?.value) ??
      (batteryHealth !== undefined ? getBatteryRange(batteryHealth) : undefined),
    ptaStatus:
      clean(node.ptaStatus?.value) ??
      Object.values(ProductPtaStatus).find((status) => tags.includes(SHOPIFY_PTA_TAGS[status])),
    // TODO: link to the product page (`/shop/${node.handle}`) once it exists (plan step 5).
    to: ROUTES.shop,
  }
}

function mapFilterValue(raw: ShopifyFilterNode['values'][number]): FilterValue | undefined {
  const input = parseFilterInput(raw.input)
  if (!input) return undefined
  const { key, value } = inputToUrl(input)
  return { id: raw.id, label: raw.label, count: raw.count, input, urlKey: key, urlValue: value }
}

/** Storefront `filters` / `productFilters` -> domain groups. Unknown types and unreadable values are skipped. */
export function mapFilterGroups(raw: readonly ShopifyFilterNode[]): FilterGroup[] {
  const groups: FilterGroup[] = []
  for (const node of raw) {
    const values = node.values.map(mapFilterValue).filter((value): value is FilterValue => Boolean(value))
    if (node.type === FilterGroupType.PriceRange) {
      const input = values[0]?.input
      if (input && 'price' in input && input.price.max !== undefined) {
        groups.push({
          id: node.id,
          label: node.label,
          type: FilterGroupType.PriceRange,
          values,
          priceBounds: { min: input.price.min ?? 0, max: input.price.max },
        })
      }
    } else if (node.type === FilterGroupType.List && values.length > 0) {
      groups.push({ id: node.id, label: node.label, type: FilterGroupType.List, values })
    }
  }
  return groups
}

/** The filter kinds (URL keys) Shopify currently offers. */
export function offeredFilterKinds(groups: readonly FilterGroup[]): Set<string> {
  return new Set(groups.flatMap((group) => group.values.map((value) => value.urlKey)))
}

/** Result count of a collection page: sum of the selected availability values (collections have no total). */
export function deriveTotalCount(
  groups: readonly FilterGroup[],
  effectiveSelection: readonly ProductFilterInput[],
): number | undefined {
  const availability = groups.find((group) => group.values.length > 0 && group.values.every((v) => 'available' in v.input))
  if (!availability) return undefined
  const selected = availability.values.filter((value) =>
    effectiveSelection.some((input) => 'available' in input && 'available' in value.input && input.available === value.input.available),
  )
  return selected.length > 0 ? selected.reduce((sum, value) => sum + value.count, 0) : undefined
}

export interface ShopifyShopVariables {
  filters?: ProductFilterInput[]
  productFilters?: ProductFilterInput[]
  sortKey: string
  reverse: boolean
  first: number
  after: string | null
}

const COLLECTION_SORT: Partial<Record<ProductSortKey, { sortKey: string; reverse: boolean }>> = {
  [ProductSortKey.Featured]: { sortKey: 'COLLECTION_DEFAULT', reverse: false },
  [ProductSortKey.Newest]: { sortKey: 'CREATED', reverse: true },
  [ProductSortKey.PriceAsc]: { sortKey: 'PRICE', reverse: false },
  [ProductSortKey.PriceDesc]: { sortKey: 'PRICE', reverse: true },
  [ProductSortKey.TitleAsc]: { sortKey: 'TITLE', reverse: false },
}

const SEARCH_SORT: Partial<Record<ProductSortKey, { sortKey: string; reverse: boolean }>> = {
  [ProductSortKey.Relevance]: { sortKey: 'RELEVANCE', reverse: false },
  [ProductSortKey.PriceAsc]: { sortKey: 'PRICE', reverse: false },
  [ProductSortKey.PriceDesc]: { sortKey: 'PRICE', reverse: true },
}

/** GraphQL variables for the collection (or search, when `query.search` is set) request. */
export function buildShopVariables(query: ShopQuery, first: number, after: string | null): ShopifyShopVariables {
  const selection = withDefaultAvailability(query.selection)
  const isSearch = query.search.trim() !== ''
  const sort = isSearch
    ? (SEARCH_SORT[query.sort] ?? SEARCH_SORT[ProductSortKey.Relevance]!)
    : (COLLECTION_SORT[query.sort] ?? COLLECTION_SORT[ProductSortKey.Featured]!)
  return {
    ...(isSearch ? { productFilters: selection } : { filters: selection }),
    ...sort,
    first,
    after,
  }
}
