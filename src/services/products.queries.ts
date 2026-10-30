import { METAFIELD_NAMESPACE, ProductMetafield } from '@/constants/shopify'

const metafield = (alias: string, key: ProductMetafield) =>
  `${alias}: metafield(namespace: "${METAFIELD_NAMESPACE}", key: "${key}") { value }`

/** Card fields of a product (docs/shopify/05-graphql.md §1). */
export const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFields on Product {
    id
    handle
    title
    productType
    tags
    availableForSale
    createdAt
    description
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    featuredImage { url(transform: { maxWidth: 640, preferredContentType: WEBP }) altText }
    ${metafield('deviceModel', ProductMetafield.DeviceModel)}
    ${metafield('storage', ProductMetafield.Storage)}
    ${metafield('color', ProductMetafield.Color)}
    ${metafield('batteryHealth', ProductMetafield.BatteryHealth)}
    ${metafield('batteryBucket', ProductMetafield.BatteryBucket)}
    ${metafield('conditionGrade', ProductMetafield.ConditionGrade)}
    ${metafield('ptaStatus', ProductMetafield.PtaStatus)}
    ${metafield('cardSubtitle', ProductMetafield.CardSubtitle)}
  }
`

export const FILTER_FRAGMENT = `
  fragment FilterFields on Filter {
    id
    label
    type
    values { id label count input }
  }
`

/** A category page: the collection's products, filtered / sorted by Shopify. */
export const SHOP_PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  ${FILTER_FRAGMENT}
  query ShopProducts(
    $handle: String!
    $first: Int!
    $after: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(first: $first, after: $after, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        pageInfo { hasNextPage endCursor }
        filters { ...FilterFields }
        nodes { ...ProductCardFields }
      }
    }
  }
`

/** Search results (`?q=`), filtered / sorted by Shopify. */
export const SEARCH_PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  ${FILTER_FRAGMENT}
  query SearchProducts(
    $query: String!
    $first: Int!
    $after: String
    $productFilters: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
  ) {
    search(
      query: $query
      first: $first
      after: $after
      types: [PRODUCT]
      productFilters: $productFilters
      sortKey: $sortKey
      reverse: $reverse
    ) {
      totalCount
      pageInfo { hasNextPage endCursor }
      productFilters { ...FilterFields }
      nodes { ... on Product { ...ProductCardFields } }
    }
  }
`
