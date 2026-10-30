import { describe, expect, it } from 'vitest'
import {
  dropStaleSelection,
  getSelectedPrice,
  groupKey,
  inputToUrl,
  normalizeSelection,
  parseFilterInput,
  parseSelection,
  setPrice,
  toggleInput,
  urlToInput,
  withDefaultAvailability,
  writeSelection,
} from '@/lib/shopFilters'
import type { ProductFilterInput } from '@/types/shop.types'

const storage256: ProductFilterInput = { productMetafield: { namespace: 'custom', key: 'storage', value: '256gb' } }
const storage512: ProductFilterInput = { productMetafield: { namespace: 'custom', key: 'storage', value: '512gb' } }
const pta: ProductFilterInput = { productMetafield: { namespace: 'custom', key: 'pta_status', value: 'pta' } }

describe('filter URL codec', () => {
  const inputs: ProductFilterInput[] = [
    { available: true },
    { available: false },
    { price: { min: 100000, max: 400000 } },
    { price: { max: 5000 } },
    { productType: 'Audio' },
    { productVendor: 'Apple' },
    { variantOption: { name: 'Compatible model', value: 'iPhone 15 Pro' } },
    storage256,
    { variantMetafield: { namespace: 'custom', key: 'size', value: 'l' } },
    { category: { id: 'gid://shopify/TaxonomyCategory/aa' } },
  ]

  it.each(inputs)('round-trips %j', (input) => {
    const { key, value } = inputToUrl(input)
    expect(urlToInput(key, value)).toEqual(input)
  })

  it('encodes metafield filters generically', () => {
    expect(inputToUrl(storage256)).toEqual({ key: 'f.productMetafield.custom.storage', value: '256gb' })
    expect(groupKey(storage256)).toBe(groupKey(storage512))
    expect(groupKey(storage256)).not.toBe(groupKey(pta))
  })

  it('ignores malformed or unknown params', () => {
    expect(urlToInput('f.available', 'maybe')).toBeUndefined()
    expect(urlToInput('f.price', '-')).toBeUndefined()
    expect(urlToInput('f.price', 'abc')).toBeUndefined()
    expect(urlToInput('f.productMetafield.storage', '256gb')).toBeUndefined()
    expect(urlToInput('f.unknown.thing', 'x')).toBeUndefined()
    expect(urlToInput('sort', 'price-asc')).toBeUndefined()
    expect(urlToInput('f.productType', '')).toBeUndefined()
  })

  it('reads and writes a selection without touching other params', () => {
    const params = new URLSearchParams('category=iphones&sort=price-asc&f.available=true&f.available=true&f.bad=1')
    expect(parseSelection(params)).toEqual([{ available: true }])
    writeSelection(params, [storage256, storage512, { price: { min: 1, max: 2 } }])
    expect(params.get('category')).toBe('iphones')
    expect(params.has('f.available')).toBe(false)
    expect(params.getAll('f.productMetafield.custom.storage')).toEqual(['256gb', '512gb'])
    expect(params.get('f.price')).toBe('1-2')
  })
})

describe('selection helpers', () => {
  it('toggles values and keeps a single price range', () => {
    expect(toggleInput([], storage256)).toEqual([storage256])
    expect(toggleInput([storage256], storage256)).toEqual([])
    const withPrice = toggleInput([storage256], { price: { min: 1, max: 2 } })
    expect(toggleInput(withPrice, { price: { min: 3, max: 4 } }).filter((i) => 'price' in i)).toEqual([
      { price: { min: 3, max: 4 } },
    ])
  })

  it('sets and clears the price', () => {
    const selection = setPrice([pta], 10, undefined)
    expect(getSelectedPrice(selection)).toEqual({ min: 10 })
    expect(setPrice(selection, undefined, undefined)).toEqual([pta])
  })

  it('normalises order and duplicates (stable query key)', () => {
    expect(normalizeSelection([storage512, pta, storage256, storage256])).toEqual(
      normalizeSelection([storage256, storage512, pta]),
    )
  })

  it('applies the default availability only when none is chosen', () => {
    expect(withDefaultAvailability([pta])).toEqual([pta, { available: true }])
    expect(withDefaultAvailability([{ available: false }])).toEqual([{ available: false }])
  })

  it('drops selections whose filter kind is no longer offered', () => {
    const offered = new Set([groupKey(storage256)])
    expect(dropStaleSelection([storage256, pta, { available: true }], offered)).toEqual([storage256])
  })
})

describe('parseFilterInput (Storefront `value.input` JSON)', () => {
  it('parses every documented shape', () => {
    expect(parseFilterInput('{"available":true}')).toEqual({ available: true })
    expect(parseFilterInput('{"price":{"min":0,"max":450000}}')).toEqual({ price: { min: 0, max: 450000 } })
    expect(parseFilterInput('{"productType":"iPhones"}')).toEqual({ productType: 'iPhones' })
    expect(parseFilterInput('{"variantOption":{"name":"Color","value":"Black"}}')).toEqual({
      variantOption: { name: 'Color', value: 'Black' },
    })
    expect(parseFilterInput('{"productMetafield":{"namespace":"custom","key":"storage","value":"256gb"}}')).toEqual(
      storage256,
    )
  })

  it('rejects garbage', () => {
    for (const bad of ['', 'nope', '[]', '{}', '{"price":{}}', '{"productMetafield":{"namespace":"custom"}}', 'null']) {
      expect(parseFilterInput(bad)).toBeUndefined()
    }
  })
})
