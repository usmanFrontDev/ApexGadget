import { CATEGORY_COLLECTION_HANDLE, ShopCategoryId } from '@/constants/shop'
import { FILTER_FRAGMENT } from '@/services/products.queries'

/** Categories shown with a product count (the `all` collection is not a card). */
export const COUNTED_CATEGORIES = [
  ShopCategoryId.Iphones,
  ShopCategoryId.Audio,
  ShopCategoryId.Wearables,
  ShopCategoryId.Chargers,
  ShopCategoryId.Cases,
  ShopCategoryId.Accessories,
] as const

/**
 * The Storefront API has no collection product count, so each count is read from the availability filter of
 * `collection.products(filters: [{ available: true }])` (docs/shopify/10 §1). One request, one alias per category.
 * Needs the Availability filter enabled in Search & Discovery.
 */
export const CATEGORY_COUNTS_QUERY = `
  ${FILTER_FRAGMENT}
  query CategoryCounts {
    ${COUNTED_CATEGORIES.map(
      (category) =>
        `${category.replace(/\W/g, '_')}: collection(handle: "${CATEGORY_COLLECTION_HANDLE[category]}") {
      products(first: 1, filters: [{ available: true }]) { filters { ...FilterFields } }
    }`,
    ).join('\n    ')}
  }
`
