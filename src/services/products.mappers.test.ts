import { describe, expect, it } from 'vitest'
import { ProductSortKey, ShopCategoryId } from '@/constants/shop'
import {
  buildShopVariables,
  deriveTotalCount,
  mapFilterGroups,
  mapProduct,
  offeredFilterKinds,
  productTypeToCategory,
  type ShopifyFilterNode,
  type ShopifyProductNode,
} from '@/services/products.mappers'
import { FilterGroupType, type ShopQuery } from '@/types/shop.types'

const money = (amount: string) => ({ amount, currencyCode: 'PKR' })
const field = (value: string) => ({ value })

const baseNode: ShopifyProductNode = {
  id: 'gid://shopify/Product/1',
  handle: 'iphone-16-pro-256gb-natural-titanium-excellent-001',
  title: 'iPhone 16 Pro',
  description: 'PTA-approved iPhone 16 Pro.\nTested.',
  tags: ['bestseller'],
  productType: 'iPhones',
  availableForSale: true,
  createdAt: '2026-10-01T00:00:00Z',
  priceRange: { minVariantPrice: money('450000.0') },
  compareAtPriceRange: { minVariantPrice: money('480000.0') },
  featuredImage: { url: 'https://cdn.shopify.com/a.webp', altText: 'front' },
  deviceModel: field('iphone-16'),
  storage: field('256gb'),
  color: field('natural-titanium'),
  batteryHealth: field('92'),
  batteryBucket: field('90-100'),
  conditionGrade: field('excellent'),
  ptaStatus: field('pta'),
  cardSubtitle: field('256GB · Natural Titanium'),
}

describe('mapProduct', () => {
  it('maps the metafield contract (docs/shopify/06-field-mapping.md §1)', () => {
    expect(mapProduct(baseNode)).toMatchObject({
      id: baseNode.id,
      handle: baseNode.handle,
      title: 'iPhone 16 Pro',
      subtitle: '256GB · Natural Titanium',
      priceAmount: 450000,
      currencyCode: 'PKR',
      compareAtAmount: 480000,
      image: 'https://cdn.shopify.com/a.webp',
      imageAlt: 'front',
      category: ShopCategoryId.Iphones,
      model: 'iphone-16',
      storage: '256gb',
      color: 'natural-titanium',
      batteryHealth: 92,
      batteryBucket: '90-100',
      grade: 'excellent',
      ptaStatus: 'pta',
    })
  })

  it('keeps unknown values instead of dropping them', () => {
    const mapped = mapProduct({ ...baseNode, deviceModel: field('iphone-18'), color: field('Cosmic Orange'), ptaStatus: field('JV') })
    expect(mapped.model).toBe('iphone-18')
    expect(mapped.color).toBe('cosmic orange')
    expect(mapped.ptaStatus).toBe('jv')
  })

  it('falls back to legacy tags and derives the battery bucket', () => {
    const mapped = mapProduct({
      ...baseNode,
      tags: ['Model:iphone-15', 'storage:128gb', 'battery:85', 'color:blue', 'grade:good', 'Non-PTA'],
      deviceModel: null, storage: null, color: null, batteryHealth: null, batteryBucket: null,
      conditionGrade: null, ptaStatus: null, cardSubtitle: null, compareAtPriceRange: null,
    })
    expect(mapped).toMatchObject({
      model: 'iphone-15', storage: '128gb', color: 'blue', grade: 'good',
      batteryHealth: 85, batteryBucket: '80-89', ptaStatus: 'non-pta', subtitle: '128GB',
    })
    expect(mapped.compareAtAmount).toBeUndefined()
  })

  it('ignores a compare-at price that is not higher', () => {
    const mapped = mapProduct({ ...baseNode, compareAtPriceRange: { minVariantPrice: money('450000.0') } })
    expect(mapped.compareAtAmount).toBeUndefined()
  })

  it('maps product types to categories (unknown -> accessories)', () => {
    expect(productTypeToCategory('iPhones')).toBe('iphones')
    expect(productTypeToCategory(' audio ')).toBe('audio')
    expect(productTypeToCategory('Cases')).toBe('cases')
    expect(productTypeToCategory('Gadgets')).toBe('accessories')
    expect(productTypeToCategory('')).toBe('accessories')
  })
})

const filterNodes: ShopifyFilterNode[] = [
  {
    id: 'filter.v.availability', label: 'Availability', type: 'LIST',
    values: [
      { id: 'a1', label: 'In stock', count: 18, input: '{"available":true}' },
      { id: 'a2', label: 'Out of stock', count: 3, input: '{"available":false}' },
    ],
  },
  {
    id: 'filter.v.price', label: 'Price', type: 'PRICE_RANGE',
    values: [{ id: 'p', label: 'Price', count: 21, input: '{"price":{"min":0,"max":450000}}' }],
  },
  {
    id: 'filter.p.m.custom.storage', label: 'Storage', type: 'LIST',
    values: [
      { id: 's1', label: '256gb', count: 9, input: '{"productMetafield":{"namespace":"custom","key":"storage","value":"256gb"}}' },
      { id: 's2', label: 'broken', count: 1, input: 'not json' },
    ],
  },
  { id: 'future', label: 'Future', type: 'BOOLEAN', values: [{ id: 'x', label: 'x', count: 1, input: '{"available":true}' }] },
  { id: 'empty', label: 'Empty', type: 'LIST', values: [] },
]

describe('mapFilterGroups', () => {
  const groups = mapFilterGroups(filterNodes)

  it('maps list and price groups, skipping unknown types, empty groups and unreadable values', () => {
    expect(groups.map((g) => g.label)).toEqual(['Availability', 'Price', 'Storage'])
    expect(groups[1]).toMatchObject({ type: FilterGroupType.PriceRange, priceBounds: { min: 0, max: 450000 } })
    expect(groups[2]!.values).toHaveLength(1)
    expect(groups[2]!.values[0]).toMatchObject({
      label: '256gb', count: 9, urlKey: 'f.productMetafield.custom.storage', urlValue: '256gb',
    })
  })

  it('reports the offered filter kinds', () => {
    expect(offeredFilterKinds(groups)).toEqual(
      new Set(['f.available', 'f.price', 'f.productMetafield.custom.storage']),
    )
  })

  it('derives the collection total from the selected availability values', () => {
    expect(deriveTotalCount(groups, [{ available: true }])).toBe(18)
    expect(deriveTotalCount(groups, [{ available: true }, { available: false }])).toBe(21)
    expect(deriveTotalCount(groups.slice(1), [{ available: true }])).toBeUndefined()
  })
})

describe('buildShopVariables', () => {
  const query: ShopQuery = { category: ShopCategoryId.Iphones, sort: ProductSortKey.PriceDesc, search: '', selection: [] }

  it('uses collection filters, adds default availability and maps the sort', () => {
    expect(buildShopVariables(query, 12, null)).toEqual({
      filters: [{ available: true }], sortKey: 'PRICE', reverse: true, first: 12, after: null,
    })
    expect(buildShopVariables({ ...query, sort: ProductSortKey.Newest }, 12, 'c1')).toMatchObject({
      sortKey: 'CREATED', reverse: true, after: 'c1',
    })
    expect(buildShopVariables({ ...query, sort: ProductSortKey.Featured }, 12, null)).toMatchObject({
      sortKey: 'COLLECTION_DEFAULT', reverse: false,
    })
  })

  it('switches to search with productFilters and search sort keys', () => {
    const search = buildShopVariables(
      { ...query, search: 'airpods', sort: ProductSortKey.Relevance, selection: [{ available: false }] },
      12,
      null,
    )
    expect(search).toEqual({
      productFilters: [{ available: false }], sortKey: 'RELEVANCE', reverse: false, first: 12, after: null,
    })
    // a sort Shopify search can't do falls back to relevance
    expect(buildShopVariables({ ...query, search: 'x', sort: ProductSortKey.TitleAsc }, 12, null)).toMatchObject({
      sortKey: 'RELEVANCE',
    })
  })
})
