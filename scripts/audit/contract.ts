/**
 * The data contract the audit enforces (docs/shopify/02-data-model.md, 10-filters-and-search-discovery.md).
 * Self-contained on purpose: the script runs in Node and must not import app code that pulls in images.
 * `src/constants/shop.test.ts`-style drift is guarded by `scripts/audit/audit.test.ts`.
 */

export const PRODUCT_TYPES = ['iPhones', 'Audio', 'Wearables', 'Chargers', 'Cases', 'Accessories'] as const
export const IPHONE_PRODUCT_TYPE = 'iPhones'

export const METAFIELD_NAMESPACE = 'custom'

/** Allowed values of the dropdown (choice) metafields. */
export const CHOICES = {
  device_model: ['iphone-17', 'iphone-16', 'iphone-15', 'iphone-14', 'iphone-13', 'iphone-12', 'iphone-11', 'iphone-se'],
  storage: ['64gb', '128gb', '256gb', '512gb', '1tb'],
  color: ['black', 'white', 'blue', 'red', 'purple', 'gold', 'natural-titanium', 'graphite'],
  battery_bucket: ['90-100', '80-89', '70-79', 'below-70'],
  condition_grade: ['new', 'excellent', 'very-good', 'good'],
  pta_status: ['pta', 'non-pta', 'jv'],
} as const
export type ChoiceKey = keyof typeof CHOICES

export const REQUIRED_IPHONE_METAFIELDS = [
  'device_model',
  'storage',
  'color',
  'battery_health',
  'battery_bucket',
  'condition_grade',
  'pta_status',
] as const

export const METAFIELD_KEYS = [...REQUIRED_IPHONE_METAFIELDS, 'warranty_months', 'warranty_note', 'card_subtitle'] as const

export const BATTERY_MIN = 50
export const BATTERY_MAX = 100

/** battery_health -> battery_bucket (must match src/lib/battery.ts). */
export function bucketFor(health: number): string {
  if (health >= 90) return '90-100'
  if (health >= 80) return '80-89'
  if (health >= 70) return '70-79'
  return 'below-70'
}

export const LEGACY_TAG_PREFIXES = ['model:', 'storage:', 'battery:', 'color:', 'grade:'] as const
export const LEGACY_TAGS = ['pta', 'non-pta', 'jv'] as const

export const REQUIRED_COLLECTIONS = [
  'all-products',
  'iphones',
  'audio',
  'wearables',
  'chargers',
  'cases',
  'accessories',
  'bestsellers',
] as const
export const BESTSELLERS_COLLECTION = 'bestsellers'
export const ALL_PRODUCTS_COLLECTION = 'all-products'

/** Filters Search & Discovery must offer (label is the suggested name, kind the URL key of its values). */
export const EXPECTED_FILTERS = [
  { label: 'Availability', kind: 'f.available' },
  { label: 'Price', kind: 'f.price' },
  { label: 'Category (product type)', kind: 'f.productType' },
  { label: 'Model', kind: 'f.productMetafield.custom.device_model' },
  { label: 'Storage', kind: 'f.productMetafield.custom.storage' },
  { label: 'PTA status', kind: 'f.productMetafield.custom.pta_status' },
  { label: 'Battery health', kind: 'f.productMetafield.custom.battery_bucket' },
  { label: 'Color', kind: 'f.productMetafield.custom.color' },
  { label: 'Condition', kind: 'f.productMetafield.custom.condition_grade' },
] as const
export const MAX_FILTER_VALUES_SHOWN = 100

export const PROMO_LAYOUTS = ['trade-in', 'accessories'] as const
export const SHOP_CATEGORIES = ['iphones', 'audio', 'wearables', 'chargers', 'cases', 'accessories'] as const
export const FOOTER_COLUMNS = ['Shop', 'Support', 'Company'] as const

export interface MetaobjectRule {
  type: string
  /** Minimum number of entries. */
  min: number
  /** Exact handle the single entry must have (singletons). */
  handle?: string
  max?: number
  required: readonly string[]
  imageFields?: readonly string[]
  urlFields?: readonly string[]
  /** Fields that must be unique across entries of the type. */
  unique?: readonly string[]
}

export const METAOBJECT_RULES: readonly MetaobjectRule[] = [
  {
    type: 'apex_hero', min: 1, max: 1, handle: 'home',
    required: ['badge', 'title_line_1', 'description', 'highlights', 'primary_cta_label', 'primary_cta_url', 'secondary_cta_label', 'secondary_cta_url', 'image'],
    imageFields: ['image'], urlFields: ['primary_cta_url', 'secondary_cta_url'],
  },
  {
    type: 'apex_site_settings', min: 1, max: 1, handle: 'main',
    required: ['footer_description', 'whatsapp_number', 'trade_in_message_template'],
    urlFields: ['social_instagram', 'social_x', 'social_youtube', 'social_linkedin', 'social_facebook', 'social_tiktok'],
  },
  {
    type: 'apex_promo_card', min: 2, max: 2,
    required: ['slug', 'label', 'title_line_1', 'title_line_2', 'description', 'cta_label', 'cta_url', 'image', 'image_alt', 'layout_preset', 'sort_order'],
    imageFields: ['image'], urlFields: ['cta_url'], unique: ['sort_order', 'slug'],
  },
  {
    type: 'apex_category_card', min: 6, max: 6,
    required: ['slug', 'name', 'shop_category', 'image', 'sort_order'],
    imageFields: ['image'], unique: ['sort_order', 'slug'],
  },
  { type: 'apex_banner_slide', min: 1, max: 6, required: ['image', 'alt', 'sort_order'], imageFields: ['image'], urlFields: ['link_url'], unique: ['sort_order'] },
  { type: 'apex_why_us_feature', min: 4, required: ['slug', 'title', 'description', 'sort_order'], unique: ['sort_order', 'slug'] },
  { type: 'apex_testimonial', min: 3, required: ['quote', 'author', 'rating', 'sort_order'], unique: ['sort_order'] },
  { type: 'apex_footer_link', min: 1, required: ['column', 'label', 'url', 'sort_order'], urlFields: ['url'] },
  { type: 'apex_faq_item', min: 1, required: ['question', 'answer', 'topic', 'sort_order'], unique: ['sort_order'] },
]

export const METAOBJECT_TYPES = METAOBJECT_RULES.map((rule) => rule.type)
export const WHATSAPP_NUMBER_PATTERN = /^\d{8,15}$/
