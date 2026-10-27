/** Max page size of the Storefront API. */
export const CATALOG_PAGE_SIZE = 250

export const CATALOG_QUERY = `
  query Catalog($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: BEST_SELLING) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
          description
          tags
          productType
          availableForSale
          createdAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url(transform: { maxWidth: 640 })
            altText
          }
        }
      }
    }
  }
`
