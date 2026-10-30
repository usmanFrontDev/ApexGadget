import { METAFIELD_NAMESPACE, ProductMetafield } from '@/constants/shopify'
import { PRODUCT_CARD_FRAGMENT } from '@/services/products.queries'

const metafield = (alias: string, key: ProductMetafield, withType = false) =>
  `${alias}: metafield(namespace: "${METAFIELD_NAMESPACE}", key: "${key}") { value${withType ? ' type' : ''} }`

/** docs/shopify/05-graphql.md §4. A sold listing still returns the product (it only goes `null` when unpublished). */
export const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductCardFields
      descriptionHtml
      seo { title description }
      images(first: 10) { nodes { url(transform: { maxWidth: 1200 }) altText width height } }
      options { name values }
      variants(first: 50) {
        nodes {
          id
          title
          sku
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { url(transform: { maxWidth: 1200 }) altText }
        }
      }
      ${metafield('warrantyMonths', ProductMetafield.WarrantyMonths)}
      warrantyNote: metafield(namespace: "${METAFIELD_NAMESPACE}", key: "warranty_note") { value }
      boxContents: metafield(namespace: "${METAFIELD_NAMESPACE}", key: "box_contents") { value type }
      specs: metafield(namespace: "${METAFIELD_NAMESPACE}", key: "specs") { value type }
    }
  }
`

/**
 * Several products by handle in ONE request: `p0: product(handle: $h0)`, `p1: …` (docs/shopify/05 §4b).
 * ⚠ UNVERIFIED on a live store (OPEN-ISSUES U-list): aliased `product(handle:)` fields are standard GraphQL,
 * but the cost/complexity of 50 aliases has not been measured.
 */
export function buildProductsByHandlesQuery(count: number) {
  const variables = Array.from({ length: count }, (_, index) => `$h${index}: String!`).join(', ')
  const fields = Array.from({ length: count }, (_, index) => `p${index}: product(handle: $h${index}) { ...ProductCardFields }`).join('\n    ')
  return `
  ${PRODUCT_CARD_FRAGMENT}
  query ProductsByHandles(${variables}) {
    ${fields}
  }
`
}

/** `{ h0: 'a', h1: 'b' }` for `buildProductsByHandlesQuery`. */
export const handlesToVariables = (handles: readonly string[]) =>
  Object.fromEntries(handles.map((handle, index) => [`h${index}`, handle]))

export const PRODUCT_RECOMMENDATIONS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query ProductRecommendations($handle: String!) {
    productRecommendations(productHandle: $handle, intent: RELATED) { ...ProductCardFields }
  }
`

/** Fallback when Shopify has no recommendations yet: same model, still available. */
export const SIMILAR_PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query SimilarProducts($filters: [ProductFilter!]) {
    collection(handle: "iphones") {
      products(first: 9, filters: $filters) { nodes { ...ProductCardFields } }
    }
  }
`

export const POLICIES_QUERY = `
  query ShopPolicies {
    shop {
      shippingPolicy { body }
      refundPolicy { body }
    }
  }
`
