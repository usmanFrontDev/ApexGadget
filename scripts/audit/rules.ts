import {
  ALL_PRODUCTS_COLLECTION,
  BATTERY_MAX,
  BATTERY_MIN,
  BESTSELLERS_COLLECTION,
  CHOICES,
  EXPECTED_FILTERS,
  FOOTER_COLUMNS,
  IPHONE_PRODUCT_TYPE,
  LEGACY_TAGS,
  LEGACY_TAG_PREFIXES,
  MAX_FILTER_VALUES_SHOWN,
  METAOBJECT_RULES,
  PRODUCT_TYPES,
  PROMO_LAYOUTS,
  REQUIRED_COLLECTIONS,
  REQUIRED_IPHONE_METAFIELDS,
  SHOP_CATEGORIES,
  WHATSAPP_NUMBER_PATTERN,
  bucketFor,
  type ChoiceKey,
} from './contract.ts'

export type Level = 'ERROR' | 'WARN'

export interface Finding {
  level: Level
  scope: 'product' | 'collection' | 'filters' | 'metaobject'
  /** Handle / type the finding is about. */
  ref: string
  message: string
}

/** What the audit reads from the store (public Storefront token only). */
export interface AuditProduct {
  handle: string
  title: string
  description: string
  productType: string
  tags: string[]
  availableForSale: boolean
  price: number
  imageUrl?: string
  /** `custom.*` values by key (missing / not exposed = absent). */
  metafields: Partial<Record<string, string>>
}

export interface AuditCollection {
  handle: string
  exists: boolean
  hasProducts: boolean
}

export interface AuditFilterGroup {
  label: string
  /** URL keys of the group's values (e.g. `f.productMetafield.custom.storage`). */
  kinds: string[]
  valueCount: number
}

export interface AuditMetaobjectField {
  value: string | null
  type: string
  imageUrl?: string
}

export interface AuditMetaobject {
  handle: string
  fields: Record<string, AuditMetaobjectField>
}

export interface AuditSnapshot {
  products: AuditProduct[]
  collections: AuditCollection[]
  filterGroups: AuditFilterGroup[]
  /** Entries per metaobject type; `undefined` = the type does not exist / is not readable. */
  metaobjects: Record<string, AuditMetaobject[] | undefined>
}

const error = (scope: Finding['scope'], ref: string, message: string): Finding => ({ level: 'ERROR', scope, ref, message })
const warn = (scope: Finding['scope'], ref: string, message: string): Finding => ({ level: 'WARN', scope, ref, message })

const STORAGE_IN_TITLE = /\b\d+\s?(gb|tb)\b/i
const colourWords = CHOICES.color.flatMap((color) => color.split('-'))
const COLOUR_IN_TITLE = new RegExp(`\\b(${colourWords.join('|')})\\b`, 'i')
const HANDLE_SEQUENCE = /-\d{3,}$/

export function auditProducts(products: readonly AuditProduct[]): Finding[] {
  const findings: Finding[] = []
  const iphones = products.filter((product) => product.productType.trim().toLowerCase() === IPHONE_PRODUCT_TYPE.toLowerCase())

  // Metafields with Storefront access OFF read as null for every product.
  if (iphones.length > 0) {
    for (const key of REQUIRED_IPHONE_METAFIELDS) {
      if (iphones.every((product) => product.metafields[key] === undefined)) {
        findings.push(error('product', `custom.${key}`, `no iPhone exposes custom.${key}: check the definition exists and "Storefront API access" is ON (02 §3)`))
      }
    }
  }

  for (const product of products) {
    const { handle, metafields: meta } = product
    // Case-insensitive on purpose: a mistyped type is reported below AND the rest of the checks still run.
    const isIphone = product.productType.trim().toLowerCase() === IPHONE_PRODUCT_TYPE.toLowerCase()

    if (!(PRODUCT_TYPES as readonly string[]).includes(product.productType)) {
      findings.push(error('product', handle, `productType "${product.productType}" is not one of ${PRODUCT_TYPES.join(', ')} (it would land in "accessories")`))
    }
    if (!product.imageUrl) findings.push(error('product', handle, 'has no image'))
    if (!(product.price > 0)) findings.push(error('product', handle, 'price must be greater than 0'))
    if (!product.description.trim()) findings.push(warn('product', handle, 'description is empty'))

    for (const key of isIphone ? REQUIRED_IPHONE_METAFIELDS : []) {
      if (!meta[key]?.trim()) findings.push(error('product', handle, `missing custom.${key}`))
    }

    for (const key of Object.keys(CHOICES) as ChoiceKey[]) {
      const value = meta[key]
      if (value && !(CHOICES[key] as readonly string[]).includes(value)) {
        findings.push(error('product', handle, `custom.${key} = "${value}" is not allowed (${CHOICES[key].join(', ')})`))
      }
    }

    const healthRaw = meta.battery_health
    if (healthRaw !== undefined) {
      const health = Number(healthRaw)
      if (!Number.isInteger(health) || health < BATTERY_MIN || health > BATTERY_MAX) {
        findings.push(error('product', handle, `custom.battery_health = "${healthRaw}" must be an integer ${BATTERY_MIN}–${BATTERY_MAX}`))
      } else if (!meta.battery_bucket) {
        findings.push(error('product', handle, `has battery_health but no custom.battery_bucket (expected "${bucketFor(health)}")`))
      } else if (meta.battery_bucket !== bucketFor(health)) {
        findings.push(error('product', handle, `battery_bucket "${meta.battery_bucket}" does not match battery_health ${health} (expected "${bucketFor(health)}")`))
      }
    } else if (meta.battery_bucket) {
      findings.push(error('product', handle, 'has battery_bucket but no battery_health'))
    }

    if (!isIphone && !meta.condition_grade) findings.push(warn('product', handle, 'missing custom.condition_grade'))
    if (isIphone && !meta.warranty_months) findings.push(warn('product', handle, 'missing custom.warranty_months (BLOCKED-ON-CLIENT until the policy exists)'))
    if (meta.warranty_note?.toUpperCase().includes('PLACEHOLDER')) findings.push(warn('product', handle, 'warranty_note is still a PLACEHOLDER'))

    const tags = product.tags.map((tag) => tag.toLowerCase())
    const legacy = tags.filter((tag) => LEGACY_TAG_PREFIXES.some((prefix) => tag.startsWith(prefix)) || (LEGACY_TAGS as readonly string[]).includes(tag))
    if (legacy.length > 0) findings.push(warn('product', handle, `legacy facet tags still present: ${legacy.join(', ')} (use the custom.* metafields)`))

    if (isIphone) {
      if (STORAGE_IN_TITLE.test(product.title) || COLOUR_IN_TITLE.test(product.title)) {
        findings.push(warn('product', handle, `title "${product.title}" contains storage or colour (keep the model only)`))
      }
      if (!HANDLE_SEQUENCE.test(handle)) {
        findings.push(warn('product', handle, 'handle should end with a sequence number, e.g. …-excellent-001 (03 §A.3)'))
      }
    }
  }
  return findings
}

export function auditCollections(collections: readonly AuditCollection[]): Finding[] {
  const findings: Finding[] = []
  for (const handle of REQUIRED_COLLECTIONS) {
    const collection = collections.find((item) => item.handle === handle)
    if (!collection?.exists) {
      findings.push(error('collection', handle, 'collection does not exist or is not published to the Headless channel'))
    } else if (!collection.hasProducts && (handle === BESTSELLERS_COLLECTION || handle === ALL_PRODUCTS_COLLECTION)) {
      findings.push(error('collection', handle, 'collection is empty'))
    }
  }
  return findings
}

export function auditFilters(groups: readonly AuditFilterGroup[]): Finding[] {
  const findings: Finding[] = []
  for (const expected of EXPECTED_FILTERS) {
    if (!groups.some((group) => group.kinds.includes(expected.kind))) {
      findings.push(error('filters', expected.label, `filter "${expected.label}" (${expected.kind}) is not offered: add it in Search & Discovery (10 §3)`))
    }
  }
  for (const group of groups) {
    if (group.valueCount > MAX_FILTER_VALUES_SHOWN) {
      findings.push(warn('filters', group.label, `${group.valueCount} values; Search & Discovery shows at most ${MAX_FILTER_VALUES_SHOWN}`))
    }
  }
  return findings
}

const URL_PATTERN = /^(\/|#|https?:\/\/)\S*$/

export function auditMetaobjects(metaobjects: AuditSnapshot['metaobjects']): Finding[] {
  const findings: Finding[] = []
  for (const rule of METAOBJECT_RULES) {
    const entries = metaobjects[rule.type]
    if (entries === undefined) {
      findings.push(error('metaobject', rule.type, 'definition missing or Storefront access is not Active'))
      continue
    }
    if (entries.length < rule.min) findings.push(error('metaobject', rule.type, `needs at least ${rule.min} entr${rule.min === 1 ? 'y' : 'ies'}, found ${entries.length}`))
    if (rule.max !== undefined && entries.length > rule.max) findings.push(error('metaobject', rule.type, `allows at most ${rule.max} entries, found ${entries.length}`))
    if (rule.handle && entries.length > 0 && !entries.some((entry) => entry.handle === rule.handle)) {
      findings.push(error('metaobject', rule.type, `entry with handle "${rule.handle}" not found`))
    }

    for (const entry of entries) {
      const ref = `${rule.type}/${entry.handle}`
      for (const key of rule.required) {
        const field = entry.fields[key]
        if (!field || !(field.value ?? '').trim()) findings.push(error('metaobject', ref, `required field "${key}" is empty`))
      }
      for (const key of rule.imageFields ?? []) {
        const field = entry.fields[key]
        if (field?.value && !field.imageUrl) findings.push(error('metaobject', ref, `image field "${key}" does not resolve to an image`))
      }
      for (const key of rule.urlFields ?? []) {
        const value = entry.fields[key]?.value
        if (value && !URL_PATTERN.test(value)) findings.push(error('metaobject', ref, `"${key}" = "${value}" is not a valid URL or path`))
      }
      checkEntryValues(rule.type, entry, ref, findings)
    }

    for (const key of rule.unique ?? []) {
      const seen = new Map<string, string>()
      for (const entry of entries) {
        const value = entry.fields[key]?.value
        if (!value) continue
        const other = seen.get(value)
        if (other) findings.push(error('metaobject', rule.type, `"${key}" = "${value}" is used by both ${other} and ${entry.handle}`))
        seen.set(value, entry.handle)
      }
    }
  }
  return findings
}

function checkEntryValues(type: string, entry: AuditMetaobject, ref: string, findings: Finding[]) {
  const value = (key: string) => entry.fields[key]?.value ?? undefined
  const oneOf = (key: string, allowed: readonly string[]) => {
    const current = value(key)
    if (current && !allowed.includes(current)) findings.push(error('metaobject', ref, `"${key}" = "${current}" must be one of ${allowed.join(', ')}`))
  }
  if (type === 'apex_promo_card') oneOf('layout_preset', PROMO_LAYOUTS)
  if (type === 'apex_category_card') oneOf('shop_category', SHOP_CATEGORIES)
  if (type === 'apex_footer_link') oneOf('column', FOOTER_COLUMNS)
  if (type === 'apex_testimonial') {
    const rating = Number(value('rating'))
    if (value('rating') && !(Number.isInteger(rating) && rating >= 1 && rating <= 5)) findings.push(error('metaobject', ref, 'rating must be an integer 1–5'))
  }
  if (type === 'apex_site_settings') {
    const number = value('whatsapp_number')
    if (number && !WHATSAPP_NUMBER_PATTERN.test(number)) findings.push(error('metaobject', ref, 'whatsapp_number must be digits only with the country code, e.g. 923001234567'))
  }
}

export function auditAll(snapshot: AuditSnapshot): Finding[] {
  return [
    ...auditProducts(snapshot.products),
    ...auditCollections(snapshot.collections),
    ...auditFilters(snapshot.filterGroups),
    ...auditMetaobjects(snapshot.metaobjects),
  ]
}
