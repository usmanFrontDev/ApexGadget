/**
 * Default Storefront API version, used when `VITE_SHOPIFY_API_VERSION` is not set.
 * Latest stable per Shopify's versioning page (docs/shopify/OPEN-ISSUES.md U16); bump quarterly.
 */
export const DEFAULT_SHOPIFY_API_VERSION = '2026-10'

/** Product metafields live in this namespace (docs/shopify/02-data-model.md §3). */
export const METAFIELD_NAMESPACE = 'custom'

export const ProductMetafield = {
  DeviceModel: 'device_model',
  Storage: 'storage',
  Color: 'color',
  BatteryHealth: 'battery_health',
  BatteryBucket: 'battery_bucket',
  ConditionGrade: 'condition_grade',
  PtaStatus: 'pta_status',
  CardSubtitle: 'card_subtitle',
  WarrantyMonths: 'warranty_months',
} as const
export type ProductMetafield = (typeof ProductMetafield)[keyof typeof ProductMetafield]

/** Collection that holds every product (shop `category=all`, audit). */
export const ALL_PRODUCTS_COLLECTION = 'all-products'
