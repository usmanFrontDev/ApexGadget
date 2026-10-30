import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import {
  CATEGORY_PRODUCT_TYPE,
  OTHER_ACCESSORIES_PRODUCT_TYPE,
  PRICE_BOUNDS_STEP,
  ProductSortKey,
  SHOP_PAGE_SIZE,
  ShopCategoryId,
} from '@/constants/shop'
import { METAFIELD_NAMESPACE, ProductMetafield } from '@/constants/shopify'
import { valueOrder } from '@/lib/filterLabels'
import { groupKey, inputToUrl, withDefaultAvailability } from '@/lib/shopFilters'
import {
  FilterGroupType,
  type FilterGroup,
  type FilterValue,
  type ProductFilterInput,
  type ShopQuery,
  type ShopResultsPage,
} from '@/types/shop.types'
import type { ProductSummary } from '@/types/product.types'

/**
 * Mock stand-in for Shopify's server-side filtering. It answers with the SAME shape
 * (`ShopResultsPage` with `FilterGroup[]`) so the UI cannot tell the difference. The group list below
 * plays the role of the Search & Discovery configuration (docs/shopify/10-filters-and-search-discovery.md §3).
 */

const productTypeOf = (product: ProductSummary) =>
  (product.category && CATEGORY_PRODUCT_TYPE[product.category]) || OTHER_ACCESSORIES_PRODUCT_TYPE

const metafieldInput = (key: ProductMetafield, value: string): ProductFilterInput => ({
  productMetafield: { namespace: METAFIELD_NAMESPACE, key, value },
})

const isAvailable = (product: ProductSummary) => product.availableForSale !== false

const metafieldReaders: Record<string, (product: ProductSummary) => string | undefined> = {
  [ProductMetafield.DeviceModel]: (p) => p.model,
  [ProductMetafield.Storage]: (p) => p.storage,
  [ProductMetafield.Color]: (p) => p.color,
  [ProductMetafield.BatteryBucket]: (p) => p.batteryBucket,
  [ProductMetafield.ConditionGrade]: (p) => p.grade,
  [ProductMetafield.PtaStatus]: (p) => p.ptaStatus,
}

interface MockGroup {
  label: string
  /** The filter value(s) this product contributes to the group. */
  valuesOf: (product: ProductSummary) => ProductFilterInput[]
  valueLabel?: (input: ProductFilterInput) => string
}

const metafieldGroup = (label: string, key: ProductMetafield): MockGroup => ({
  label,
  valuesOf: (product) => {
    const value = metafieldReaders[key]?.(product)
    return value ? [metafieldInput(key, value)] : []
  },
})

const MOCK_GROUPS: readonly MockGroup[] = [
  {
    label: 'Availability',
    valuesOf: (product) => [{ available: isAvailable(product) }],
    valueLabel: (input) => ('available' in input && input.available ? 'In stock' : 'Out of stock'),
  },
  { label: 'Category', valuesOf: (product) => [{ productType: productTypeOf(product) }] },
  metafieldGroup('Model', ProductMetafield.DeviceModel),
  metafieldGroup('Storage', ProductMetafield.Storage),
  metafieldGroup('PTA status', ProductMetafield.PtaStatus),
  metafieldGroup('Battery health', ProductMetafield.BatteryBucket),
  metafieldGroup('Color', ProductMetafield.Color),
  metafieldGroup('Condition', ProductMetafield.ConditionGrade),
]

function matchesInput(product: ProductSummary, input: ProductFilterInput): boolean {
  if ('available' in input) return isAvailable(product) === input.available
  if ('price' in input) {
    return (
      (input.price.min === undefined || product.priceAmount >= input.price.min) &&
      (input.price.max === undefined || product.priceAmount <= input.price.max)
    )
  }
  if ('productType' in input) return productTypeOf(product) === input.productType
  if ('productMetafield' in input) {
    const { namespace, key, value } = input.productMetafield
    return namespace === METAFIELD_NAMESPACE && metafieldReaders[key]?.(product) === value
  }
  return false
}

/** Same kind of filter -> OR, different kinds -> AND (Shopify's rule). */
function matchesSelection(product: ProductSummary, selection: readonly ProductFilterInput[]) {
  const byKind = new Map<string, ProductFilterInput[]>()
  for (const input of selection) {
    const kind = groupKey(input)
    byKind.set(kind, [...(byKind.get(kind) ?? []), input])
  }
  return [...byKind.values()].every((inputs) => inputs.some((input) => matchesInput(product, input)))
}

function baseSet(query: ShopQuery): ProductSummary[] {
  const term = query.search.trim().toLowerCase()
  if (term) {
    const words = term.split(/\s+/)
    return MOCK_PRODUCTS.filter((product) => {
      const haystack = `${product.title} ${product.subtitle} ${product.model ?? ''} ${product.storage ?? ''} ${product.color ?? ''}`
        .toLowerCase()
        .replace(/-/g, ' ')
      return words.every((word) => haystack.includes(word))
    })
  }
  switch (query.category) {
    case ShopCategoryId.All:
      return [...MOCK_PRODUCTS]
    case ShopCategoryId.Accessories:
      return MOCK_PRODUCTS.filter((product) => product.category !== ShopCategoryId.Iphones)
    default:
      return MOCK_PRODUCTS.filter((product) => product.category === query.category)
  }
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
      return sorted // collection default / relevance = catalogue order
  }
}

function buildGroups(base: ProductSummary[], selection: readonly ProductFilterInput[]): FilterGroup[] {
  const groups: FilterGroup[] = []

  for (const def of MOCK_GROUPS) {
    const distinct = new Map<string, ProductFilterInput>()
    for (const product of base) {
      for (const input of def.valuesOf(product)) distinct.set(inputToUrl(input).value, input)
    }
    if (distinct.size === 0) continue

    const kind = groupKey([...distinct.values()][0]!)
    // Counts ignore the group's own selection, so ticking one value doesn't zero its siblings.
    const others = selection.filter((input) => groupKey(input) !== kind)
    const scope = base.filter((product) => matchesSelection(product, others))

    const values: FilterValue[] = [...distinct.entries()]
      .map(([urlValue, input]) => ({
        id: `${kind}=${urlValue}`,
        label: def.valueLabel?.(input) ?? urlValue,
        count: scope.filter((product) => def.valuesOf(product).some((v) => inputToUrl(v).value === urlValue)).length,
        input,
        urlKey: kind,
        urlValue,
      }))
      .sort((a, b) => valueOrder(a.urlValue) - valueOrder(b.urlValue) || a.label.localeCompare(b.label))

    groups.push({ id: kind, label: def.label, type: FilterGroupType.List, values })
  }

  if (base.length > 0) {
    const prices = base.map((product) => product.priceAmount)
    const min = Math.floor(Math.min(...prices) / PRICE_BOUNDS_STEP) * PRICE_BOUNDS_STEP
    const max = Math.ceil(Math.max(...prices) / PRICE_BOUNDS_STEP) * PRICE_BOUNDS_STEP
    const input: ProductFilterInput = { price: { min, max } }
    groups.splice(1, 0, {
      id: 'f.price',
      label: 'Price',
      type: FilterGroupType.PriceRange,
      values: [
        { id: 'f.price', label: 'Price', count: base.length, input, urlKey: 'f.price', urlValue: inputToUrl(input).value },
      ],
      priceBounds: { min, max },
    })
  }
  return groups
}

/** One page of the mock shop; `after` is the offset of the next product ("cursor"). */
export function queryMockShop(query: ShopQuery, after: string | null): ShopResultsPage {
  const base = baseSet(query)
  const selection = withDefaultAvailability(query.selection)
  const matching = sortProducts(
    base.filter((product) => matchesSelection(product, selection)),
    query.sort,
  )

  const offset = after ? Number(after) || 0 : 0
  const next = offset + SHOP_PAGE_SIZE
  return {
    products: matching.slice(offset, next),
    filters: buildGroups(base, selection),
    hasNextPage: next < matching.length,
    endCursor: next < matching.length ? String(next) : null,
    totalCount: matching.length,
  }
}

/** In-stock products per category (the same numbers the shop lists by default). `accessories` = everything but iPhones. */
export function countMockCategories(products: readonly ProductSummary[]): Partial<Record<ShopCategoryId, number>> {
  const available = products.filter((product) => product.availableForSale !== false)
  const counts: Partial<Record<ShopCategoryId, number>> = {}
  for (const category of Object.values(ShopCategoryId)) {
    if (category === ShopCategoryId.All) continue
    counts[category] =
      category === ShopCategoryId.Accessories
        ? available.filter((product) => product.category !== ShopCategoryId.Iphones).length
        : available.filter((product) => product.category === category).length
  }
  return counts
}
