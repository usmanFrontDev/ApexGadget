import { describe, expect, it } from 'vitest'
import { BatteryRange, ProductColor, ProductGrade, ProductPtaStatus, ShopCategoryId, ShopModelId, ProductStorage } from '@/constants/shop'
import { PromoLayout } from '@/constants/home'
import { ProductMetafield } from '@/constants/shopify'
import { getBatteryRange } from '@/lib/battery'
import { CHOICES, REQUIRED_IPHONE_METAFIELDS, SHOP_CATEGORIES, PROMO_LAYOUTS, bucketFor } from '../../scripts/audit/contract.ts'
import {
  auditCollections,
  auditFilters,
  auditMetaobjects,
  auditProducts,
  type AuditMetaobject,
  type AuditProduct,
} from '../../scripts/audit/rules.ts'

const sorted = (values: readonly string[]) => [...values].sort()

describe('audit contract stays in sync with the app', () => {
  it('uses the same allowed values as the app enums', () => {
    expect(sorted(CHOICES.device_model)).toEqual(sorted(Object.values(ShopModelId)))
    expect(sorted(CHOICES.storage)).toEqual(sorted(Object.values(ProductStorage)))
    expect(sorted(CHOICES.color)).toEqual(sorted(Object.values(ProductColor)))
    expect(sorted(CHOICES.battery_bucket)).toEqual(sorted(Object.values(BatteryRange)))
    expect(sorted(CHOICES.condition_grade)).toEqual(sorted(Object.values(ProductGrade)))
    expect(sorted(CHOICES.pta_status)).toEqual(sorted(Object.values(ProductPtaStatus)))
    expect(sorted(SHOP_CATEGORIES)).toEqual(sorted(Object.values(ShopCategoryId).filter((id) => id !== 'all')))
    expect(sorted(PROMO_LAYOUTS)).toEqual(sorted(Object.values(PromoLayout)))
    const keys = Object.values(ProductMetafield)
    for (const key of REQUIRED_IPHONE_METAFIELDS) expect(keys).toContain(key)
  })

  it('buckets battery health like the app', () => {
    for (const health of [50, 69, 70, 79, 80, 89, 90, 100]) expect(bucketFor(health)).toBe(getBatteryRange(health))
  })
})

const goodPhone: AuditProduct = {
  handle: 'iphone-16-pro-256gb-natural-titanium-excellent-001',
  title: 'iPhone 16 Pro',
  description: 'Tested.',
  productType: 'iPhones',
  tags: ['bestseller'],
  availableForSale: true,
  price: 450000,
  imageUrl: 'https://cdn.shopify.com/a.jpg',
  metafields: {
    device_model: 'iphone-16', storage: '256gb', color: 'natural-titanium', battery_health: '92',
    battery_bucket: '90-100', condition_grade: 'excellent', pta_status: 'pta', warranty_months: '6',
  },
}

const messages = (products: AuditProduct[], level?: 'ERROR' | 'WARN') =>
  auditProducts(products).filter((f) => !level || f.level === level).map((f) => f.message)

describe('auditProducts', () => {
  it('passes a correct listing', () => {
    expect(auditProducts([goodPhone])).toEqual([])
  })

  it('flags data-entry mistakes', () => {
    const bad: AuditProduct = {
      ...goodPhone,
      handle: 'iphone',
      title: 'iPhone 16 Pro 256GB Black',
      productType: 'Iphones',
      imageUrl: undefined,
      price: 0,
      tags: ['model:iphone-16', 'pta'],
      metafields: { ...goodPhone.metafields, storage: '300gb', battery_health: '95', battery_bucket: '80-89', pta_status: undefined, warranty_months: undefined },
    }
    const errors = messages([bad], 'ERROR').join('\n')
    expect(errors).toContain('productType "Iphones"')
    expect(errors).toContain('has no image')
    expect(errors).toContain('price must be greater than 0')
    expect(errors).toContain('custom.storage = "300gb" is not allowed')
    expect(errors).toContain('does not match battery_health 95 (expected "90-100")')
    const warnings = messages([bad], 'WARN').join('\n')
    expect(warnings).toContain('legacy facet tags')
    expect(warnings).toContain('contains storage or colour')
    expect(warnings).toContain('sequence number')
    expect(warnings).toContain('warranty_months')
  })

  it('rejects out-of-range battery and a bucket without health', () => {
    const range = messages([{ ...goodPhone, metafields: { ...goodPhone.metafields, battery_health: '20' } }], 'ERROR')
    expect(range.join()).toContain('must be an integer 50–100')
    const orphan = messages([{ ...goodPhone, productType: 'Audio', metafields: { battery_bucket: '90-100', condition_grade: 'new' } }], 'ERROR')
    expect(orphan.join()).toContain('has battery_bucket but no battery_health')
  })

  it('detects a metafield that is not exposed to the Storefront at all', () => {
    const hidden = { ...goodPhone, metafields: { ...goodPhone.metafields, battery_health: undefined, battery_bucket: undefined } }
    expect(messages([hidden], 'ERROR').join('\n')).toContain('Storefront API access')
  })
})

describe('collections and filters', () => {
  it('requires every collection and a filled bestsellers / all-products', () => {
    const findings = auditCollections([
      { handle: 'all-products', exists: true, hasProducts: true },
      { handle: 'bestsellers', exists: true, hasProducts: false },
    ])
    expect(findings.some((f) => f.ref === 'bestsellers' && f.message === 'collection is empty')).toBe(true)
    expect(findings.filter((f) => f.message.includes('does not exist')).length).toBe(6)
  })

  it('requires the nine launch filters', () => {
    const findings = auditFilters([
      { label: 'Storage', kinds: ['f.productMetafield.custom.storage'], valueCount: 5 },
      { label: 'Color', kinds: ['f.productMetafield.custom.color'], valueCount: 150 },
    ])
    expect(findings.filter((f) => f.level === 'ERROR')).toHaveLength(7)
    expect(findings.some((f) => f.level === 'WARN' && f.ref === 'Color')).toBe(true)
    expect(auditFilters([])).toHaveLength(9)
  })
})

const entry = (handle: string, fields: Record<string, string>): AuditMetaobject => ({
  handle,
  fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, { value, type: 'single_line_text_field' }])),
})

describe('auditMetaobjects', () => {
  it('reports missing definitions, counts, empty required fields and bad values', () => {
    const findings = auditMetaobjects({
      apex_site_settings: [entry('main', { footer_description: 'x', whatsapp_number: '+92 300', trade_in_message_template: '' })],
      apex_promo_card: [
        entry('a', { slug: 's', label: 'l', title_line_1: 't', title_line_2: 't', description: 'd', cta_label: 'c', cta_url: 'nope', image: 'i', image_alt: 'a', layout_preset: 'wide', sort_order: '1' }),
        entry('b', { slug: 's', label: 'l', title_line_1: 't', title_line_2: 't', description: 'd', cta_label: 'c', cta_url: '/trade', image: 'i', image_alt: 'a', layout_preset: 'trade-in', sort_order: '1' }),
      ],
      apex_testimonial: [entry('t1', { quote: 'q', author: 'a', rating: '7', sort_order: '1' })],
    })
    const text = findings.map((f) => `${f.ref}: ${f.message}`).join('\n')
    expect(text).toContain('apex_hero: definition missing')
    expect(text).toContain('apex_site_settings/main: required field "trade_in_message_template" is empty')
    expect(text).toContain('whatsapp_number must be digits only')
    expect(text).toContain('"layout_preset" = "wide" must be one of')
    expect(text).toContain('"cta_url" = "nope" is not a valid URL')
    expect(text).toContain('"sort_order" = "1" is used by both a and b')
    expect(text).toContain('rating must be an integer 1–5')
    expect(text).toContain('apex_testimonial: needs at least 3 entries, found 1')
    expect(text).toContain('image')
  })
})
