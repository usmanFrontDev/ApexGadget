# 05 — GraphQL (Storefront API, version from `VITE_SHOPIFY_API_VERSION`, default `2026-10`)

Queries live in `services/<feature>.queries.ts` and run only through services. Metafields return `null` unless the
definition has Storefront access ON. Items tagged **[P]** are post-launch.

## 1. Shared fragments

```graphql
fragment MoneyFields on MoneyV2 { amount currencyCode }

fragment ProductCardFields on Product {
  id handle title productType tags availableForSale createdAt description
  priceRange { minVariantPrice { ...MoneyFields } }
  compareAtPriceRange { minVariantPrice { ...MoneyFields } }
  featuredImage { url(transform: { maxWidth: 640, preferredContentType: WEBP }) altText width height }
  deviceModel:    metafield(namespace: "custom", key: "device_model")    { value }
  storage:        metafield(namespace: "custom", key: "storage")         { value }
  color:          metafield(namespace: "custom", key: "color")           { value }
  batteryHealth:  metafield(namespace: "custom", key: "battery_health")  { value }
  batteryBucket:  metafield(namespace: "custom", key: "battery_bucket")  { value }
  conditionGrade: metafield(namespace: "custom", key: "condition_grade") { value }
  ptaStatus:      metafield(namespace: "custom", key: "pta_status")      { value }
  cardSubtitle:   metafield(namespace: "custom", key: "card_subtitle")   { value }
}

fragment FilterFields on Filter {
  id label type
  values { id label count input }
}
```

## 2. Shop page: filtered collection (server-side)

```graphql
query ShopProducts(
  $handle: String!, $first: Int = 12, $after: String,
  $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys, $reverse: Boolean
) {
  collection(handle: $handle) {
    id handle title description
    products(first: $first, after: $after, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
      pageInfo { hasNextPage endCursor }
      filters { ...FilterFields }
      nodes { ...ProductCardFields }
    }
  }
}
```
Variables (iPhones, 256 GB or 512 GB, PTA, in stock, PKR 100k–400k, price low→high):
```json
{ "handle": "iphones", "first": 24, "sortKey": "PRICE", "reverse": false,
  "filters": [
    { "productMetafield": { "namespace": "custom", "key": "storage", "value": "256gb" } },
    { "productMetafield": { "namespace": "custom", "key": "storage", "value": "512gb" } },
    { "productMetafield": { "namespace": "custom", "key": "pta_status", "value": "pta" } },
    { "available": true },
    { "price": { "min": 100000, "max": 400000 } }
  ] }
```
(Same type ⇒ OR, different types ⇒ AND, one `price` range only.) `value.input` of a returned filter value is a JSON string: `JSON.parse` it into `ProductFilterInput`; never build inputs from `value.id`.
Sort map: Featured `COLLECTION_DEFAULT`; Newest `CREATED` + `reverse:true`; Price `PRICE`; Name `TITLE`. A null `collection` ⇒ unknown category (404 state).
Load more: pass `endCursor` as `$after`; the **filters block is re-returned each page** (use the first page's).

## 3. Search with filters

```graphql
query SearchProducts(
  $query: String!, $first: Int = 12, $after: String,
  $productFilters: [ProductFilter!], $sortKey: SearchSortKeys, $reverse: Boolean
) {
  search(query: $query, first: $first, after: $after, types: [PRODUCT],
         productFilters: $productFilters, sortKey: $sortKey, reverse: $reverse) {
    totalCount
    pageInfo { hasNextPage endCursor }
    productFilters { ...FilterFields }
    nodes { ... on Product { ...ProductCardFields } }
  }
}
```
Search sorts: `RELEVANCE` (default) or `PRICE`. `totalCount` is capped at 1,000. (Whether sold products are hidden by default is controlled with `unavailableProducts`; ⚠ UNVERIFIED enum names — test.)

Header predictive search:
```graphql
query PredictiveSearch($query: String!, $limit: Int = 6) {
  predictiveSearch(query: $query, limit: $limit, limitScope: EACH, types: [PRODUCT, COLLECTION, QUERY]) {
    queries { text styledText }
    products { id handle title availableForSale featuredImage { url(transform: { maxWidth: 160 }) altText } priceRange { minVariantPrice { ...MoneyFields } } }
    collections { id handle title }
  }
}
```

## 4. Product page, sold state, similar items

```graphql
query ProductByHandle($handle: String!) {
  product(handle: $handle) {
    ...ProductCardFields
    descriptionHtml vendor
    seo { title description }
    images(first: 10) { nodes { url(transform: { maxWidth: 1200 }) altText width height } }
    options { name values }
    variants(first: 50) { nodes {
      id title sku availableForSale quantityAvailable
      price { ...MoneyFields } compareAtPrice { ...MoneyFields }
      selectedOptions { name value }
      image { url(transform: { maxWidth: 1200 }) altText }
    } }
    warrantyMonths: metafield(namespace: "custom", key: "warranty_months") { value }
    warrantyNote:   metafield(namespace: "custom", key: "warranty_note")   { value }
    boxContents:    metafield(namespace: "custom", key: "box_contents")    { value type }
    specs:          metafield(namespace: "custom", key: "specs")           { value type }
  }
}
```
A sold listing still returns the product (`availableForSale:false`, `quantityAvailable:0`) as long as it is Active and published to the Headless channel → show "Sold" + similar items. `null` ⇒ really unpublished/deleted ⇒ 404 page with category links.

```graphql
query Recommendations($handle: String!) {
  productRecommendations(productHandle: $handle, intent: RELATED) { ...ProductCardFields }   # max 10, auto-generated
}
# Similar to a sold phone: same model, still available
query SimilarProducts($model: String!) {
  collection(handle: "iphones") {
    products(first: 8, filters: [
      { productMetafield: { namespace: "custom", key: "device_model", value: $model } },
      { available: true }
    ]) { nodes { ...ProductCardFields } }
  }
}
```
(`$model` is a variable inside an input literal: pass the whole `filters` array as a variable if the client rejects inline variables.)

## 5. Collections, home bestsellers

```graphql
query Collections($first: Int!) {
  collections(first: $first, sortKey: TITLE) { nodes { id handle title description image { url(transform: { maxWidth: 480 }) altText } } }
}
query Bestsellers { collection(handle: "bestsellers") { products(first: 8, sortKey: COLLECTION_DEFAULT) { nodes { ...ProductCardFields } } } }
```
There is **no product count** on `Collection` in the Storefront API; category cards show no count.

## 6. Cart [L]

```graphql
fragment CartFields on Cart {
  id checkoutUrl note totalQuantity
  attributes { key value }
  discountCodes { code applicable }
  cost { subtotalAmount { ...MoneyFields } totalAmount { ...MoneyFields } totalTaxAmount { ...MoneyFields } }
  lines(first: 50) { nodes {
    id quantity cost { totalAmount { ...MoneyFields } }
    merchandise { ... on ProductVariant {
      id title availableForSale quantityAvailable
      price { ...MoneyFields }
      image { url(transform: { maxWidth: 240 }) altText }
      product { id handle title }
    } }
  } }
}
query Cart($id: ID!) { cart(id: $id) { ...CartFields } }
mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { ...CartFields } userErrors { field message code } } }
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message code } warnings { code message } } }
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message code } warnings { code message } } }
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message code } } }
mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) { cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) { cart { ...CartFields } userErrors { field message code } } }
mutation CartNoteUpdate($cartId: ID!, $note: String!) { cartNoteUpdate(cartId: $cartId, note: $note) { cart { ...CartFields } userErrors { field message code } } }
mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) { cartAttributesUpdate(cartId: $cartId, attributes: $attributes) { cart { ...CartFields } userErrors { field message code } } }
```
`CartCreate` variables: `{"input":{"lines":[{"merchandiseId":"gid://shopify/ProductVariant/…","quantity":1}],"attributes":[{"key":"source","value":"web"}]}}`. Checkout = redirect to `cart.checkoutUrl`. Persist only `cart.id` (`apex.cart.v1`). Clamp quantity to `quantityAvailable`. Manual payment orders arrive as "Payment pending" (01 §B).

## 7. Metaobjects (home CMS) [L]

```graphql
fragment MetaobjectFields on Metaobject {
  id handle type
  fields { key value type
    reference { ... on MediaImage { image { url(transform: { maxWidth: 1200 }) altText width height } } ... on Collection { handle title } }
    references(first: 10) { nodes { ... on MediaImage { image { url altText } } } } }
}
query HomeContent {
  hero: metaobject(handle: { type: "apex_hero", handle: "home" }) { ...MetaobjectFields }
  settings: metaobject(handle: { type: "apex_site_settings", handle: "main" }) { ...MetaobjectFields }
  promos: metaobjects(type: "apex_promo_card", first: 4) { nodes { ...MetaobjectFields } }
  categories: metaobjects(type: "apex_category_card", first: 10) { nodes { ...MetaobjectFields } }
  banners: metaobjects(type: "apex_banner_slide", first: 8) { nodes { ...MetaobjectFields } }
  features: metaobjects(type: "apex_why_us_feature", first: 8) { nodes { ...MetaobjectFields } }
  testimonials: metaobjects(type: "apex_testimonial", first: 12) { nodes { ...MetaobjectFields } }
  footerLinks: metaobjects(type: "apex_footer_link", first: 30) { nodes { ...MetaobjectFields } }
}
```
Sorted by `sort_order` in the mapper. `settings` also carries `whatsapp_number` and `trade_in_message_template` (trade-in is a client-side `wa.me` link, no request).

## 8. Support content [L]

```graphql
query SupportContent {
  shop { name refundPolicy { title body } shippingPolicy { title body } privacyPolicy { title body } termsOfService { title body } }
  faq: metaobjects(type: "apex_faq_item", first: 50) { nodes { ...MetaobjectFields } }
  warranty: page(handle: "warranty") { title body }
}
```

## 9. [P] Customer Account API (separate endpoint, OAuth/PKCE)
Replaces the deprecated `storefrontCustomerAccessTokenCreate`. Discovery URLs and field names ⚠ UNVERIFIED — read the headless guide when starting.
```graphql
query Me { customer { id firstName lastName emailAddress { emailAddress }
  orders(first: 10, sortKey: PROCESSED_AT, reverse: true) { nodes { id name processedAt financialStatus totalPrice { amount currencyCode } } } } }
```

## 10. [P] Admin API — server only (Vercel `/api/*`), **not in launch scope**
```graphql
mutation TradeInCreate($metaobject: MetaobjectCreateInput!) { metaobjectCreate(metaobject: $metaobject) { metaobject { id handle } userErrors { field message code } } }
mutation NewsletterSubscribe($input: CustomerInput!) { customerCreate(input: $input) { customer { id } userErrors { field message } } }
# consent: customerEmailMarketingConsentUpdate (needs write_customers); `emailMarketingConsent` on CustomerInput ⚠ UNVERIFIED
```
Needs `SHOPIFY_ADMIN_TOKEN` (server env only). Do not build until the client asks for photo upload / newsletter backend.
