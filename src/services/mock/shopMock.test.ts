import { describe, expect, it } from 'vitest'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { ProductSortKey, SHOP_PAGE_SIZE, ShopCategoryId } from '@/constants/shop'
import { inputToUrl, urlToInput } from '@/lib/shopFilters'
import { queryMockShop } from '@/services/mock/shopMock'
import { FilterGroupType, type ProductFilterInput, type ShopQuery } from '@/types/shop.types'

const query = (patch: Partial<ShopQuery> = {}): ShopQuery => ({
  category: ShopCategoryId.Iphones,
  sort: ProductSortKey.Featured,
  search: '',
  selection: [],
  ...patch,
})

const meta = (key: string, value: string): ProductFilterInput => ({
  productMetafield: { namespace: 'custom', key, value },
})

const group = (page: ReturnType<typeof queryMockShop>, label: string) => page.filters.find((g) => g.label === label)
const iphoneCount = MOCK_PRODUCTS.filter((p) => p.category === ShopCategoryId.Iphones).length

describe('mock shop engine (same shape as Shopify)', () => {
  it('pages with a cursor ("Load more")', () => {
    const first = queryMockShop(query(), null)
    expect(first.products).toHaveLength(SHOP_PAGE_SIZE)
    expect(first.totalCount).toBe(iphoneCount)
    expect(first.hasNextPage).toBe(true)
    const second = queryMockShop(query(), first.endCursor)
    expect(second.products).toHaveLength(iphoneCount - SHOP_PAGE_SIZE)
    expect(second.hasNextPage).toBe(false)
    expect(second.endCursor).toBeNull()
    const ids = new Set([...first.products, ...second.products].map((p) => p.id))
    expect(ids.size).toBe(iphoneCount)
  })

  it('ORs values of one filter and ANDs different filters', () => {
    const storage = [meta('storage', '256gb'), meta('storage', '512gb')]
    const either = queryMockShop(query({ selection: storage }), null)
    expect(either.totalCount).toBeGreaterThan(0)
    expect(either.products.every((p) => p.storage === '256gb' || p.storage === '512gb')).toBe(true)

    const both = queryMockShop(query({ selection: [...storage, meta('pta_status', 'non-pta')] }), null)
    expect(both.totalCount).toBeLessThan(either.totalCount!)
    expect(both.products.every((p) => p.ptaStatus === 'non-pta')).toBe(true)
  })

  it('counts a group ignoring its own selection', () => {
    const none = queryMockShop(query(), null)
    const picked = queryMockShop(query({ selection: [meta('storage', '256gb')] }), null)
    const count = (page: typeof none, value: string) =>
      group(page, 'Storage')!.values.find((v) => v.urlValue === value)!.count
    expect(count(picked, '512gb')).toBe(count(none, '512gb'))
    // other groups do narrow
    expect(group(picked, 'Model')!.values.reduce((sum, v) => sum + v.count, 0)).toBeLessThan(
      group(none, 'Model')!.values.reduce((sum, v) => sum + v.count, 0),
    )
  })

  it('filters by price range and exposes the bounds', () => {
    const page = queryMockShop(query({ selection: [{ price: { min: 300000, max: 400000 } }] }), null)
    expect(page.products.length).toBeGreaterThan(0)
    expect(page.products.every((p) => p.priceAmount >= 300000 && p.priceAmount <= 400000)).toBe(true)
    const price = group(page, 'Price')!
    expect(price.type).toBe(FilterGroupType.PriceRange)
    expect(price.priceBounds!.max).toBeGreaterThan(price.priceBounds!.min)
  })

  it('sorts', () => {
    const asc = queryMockShop(query({ sort: ProductSortKey.PriceAsc }), null).products.map((p) => p.priceAmount)
    expect(asc).toEqual([...asc].sort((a, b) => a - b))
  })

  it('serves real accessory categories and search', () => {
    const audio = queryMockShop(query({ category: ShopCategoryId.Audio }), null)
    expect(audio.products.map((p) => p.title)).toEqual(['AirPods Pro (2nd Gen)', 'AirPods Max'])
    const all = queryMockShop(query({ category: ShopCategoryId.Accessories }), null)
    expect(all.products.every((p) => p.category !== ShopCategoryId.Iphones)).toBe(true)
    const search = queryMockShop(query({ search: 'iphone 16 pro', sort: ProductSortKey.Relevance }), null)
    expect(search.products.map((p) => p.title)).toEqual(['iPhone 16 Pro'])
  })

  it('hides sold products unless availability is chosen', () => {
    // all mock products are in stock: choosing "out of stock" gives nothing
    expect(queryMockShop(query({ selection: [{ available: false }] }), null).totalCount).toBe(0)
  })

  it('returns filter values that survive the URL codec (contract with the real API shape)', () => {
    for (const filterGroup of queryMockShop(query({ category: ShopCategoryId.All }), null).filters) {
      for (const value of filterGroup.values) {
        const { key, value: urlValue } = inputToUrl(value.input)
        expect(urlToInput(key, urlValue)).toEqual(value.input)
        expect(value.urlKey).toBe(key)
      }
    }
  })
})
