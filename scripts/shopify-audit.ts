/**
 * `yarn shopify:audit` — checks the live Shopify store against the data contract
 * (docs/shopify/02-data-model.md, 10-filters-and-search-discovery.md) using the PUBLIC Storefront token only.
 * Exit code: 0 clean (warnings allowed), 1 contract errors, 2 missing configuration / request failure.
 */
import { DEFAULT_SHOPIFY_API_VERSION } from '../src/constants/shopify.ts'
import { inputToUrl, parseFilterInput } from '../src/lib/shopFilters.ts'
import {
  ALL_PRODUCTS_COLLECTION,
  METAFIELD_KEYS,
  METAFIELD_NAMESPACE,
  METAOBJECT_TYPES,
  REQUIRED_COLLECTIONS,
} from './audit/contract.ts'
import {
  auditAll,
  type AuditCollection,
  type AuditFilterGroup,
  type AuditMetaobject,
  type AuditProduct,
  type AuditSnapshot,
  type Finding,
} from './audit/rules.ts'

const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN
const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const version = process.env.VITE_SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_API_VERSION

if (!domain || !token) {
  console.error('shopify:audit needs VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN (see .env.example).')
  console.error('The store is not connected yet — nothing to audit. (Mock data needs no audit.)')
  process.exit(2)
}

async function request<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token as string },
    body: JSON.stringify({ query, variables }),
  })
  if (!response.ok) throw new Error(`Storefront API ${response.status} ${response.statusText}`)
  const body = (await response.json()) as { data?: T; errors?: Array<{ message: string }> }
  if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join('; '))
  return body.data as T
}

const metafieldAliases = METAFIELD_KEYS.map(
  (key) => `${key}: metafield(namespace: "${METAFIELD_NAMESPACE}", key: "${key}") { value }`,
).join('\n')

interface ProductsData {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null }
    nodes: Array<Record<string, unknown> & {
      handle: string; title: string; description: string; productType: string; tags: string[]
      availableForSale: boolean
      priceRange: { minVariantPrice: { amount: string } }
      featuredImage: { url: string } | null
    }>
  }
}

async function fetchProducts(): Promise<AuditProduct[]> {
  const products: AuditProduct[] = []
  let after: string | null = null
  do {
    const data: ProductsData = await request<ProductsData>(
      `query ($after: String) {
        products(first: 100, after: $after) {
          pageInfo { hasNextPage endCursor }
          nodes {
            handle title description productType tags availableForSale
            priceRange { minVariantPrice { amount } }
            featuredImage { url }
            ${metafieldAliases}
          }
        }
      }`,
      { after },
    )
    for (const node of data.products.nodes) {
      const metafields: Record<string, string> = {}
      for (const key of METAFIELD_KEYS) {
        const field = node[key] as { value: string } | null | undefined
        if (field) metafields[key] = field.value
      }
      products.push({
        handle: node.handle,
        title: node.title,
        description: node.description,
        productType: node.productType,
        tags: node.tags,
        availableForSale: node.availableForSale,
        price: Number(node.priceRange.minVariantPrice.amount),
        imageUrl: node.featuredImage?.url,
        metafields,
      })
    }
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (after)
  return products
}

async function fetchCollections(): Promise<AuditCollection[]> {
  const query = `query ($handle: String!) { collection(handle: $handle) { handle products(first: 1) { nodes { id } } } }`
  return Promise.all(
    REQUIRED_COLLECTIONS.map(async (handle) => {
      const data = await request<{ collection: { products: { nodes: unknown[] } } | null }>(query, { handle })
      return { handle, exists: Boolean(data.collection), hasProducts: (data.collection?.products.nodes.length ?? 0) > 0 }
    }),
  )
}

async function fetchFilterGroups(): Promise<AuditFilterGroup[]> {
  const data = await request<{
    collection: { products: { filters: Array<{ label: string; values: Array<{ input: string }> }> } } | null
  }>(
    `query ($handle: String!) { collection(handle: $handle) { products(first: 1) { filters { label values { input } } } } }`,
    { handle: ALL_PRODUCTS_COLLECTION },
  )
  return (data.collection?.products.filters ?? []).map((filter) => ({
    label: filter.label,
    valueCount: filter.values.length,
    kinds: [
      ...new Set(
        filter.values.flatMap((value) => {
          const input = parseFilterInput(value.input)
          return input ? [inputToUrl(input).key] : []
        }),
      ),
    ],
  }))
}

interface MetaobjectData {
  metaobjects: {
    nodes: Array<{
      handle: string
      fields: Array<{
        key: string; value: string | null; type: string
        reference?: { image?: { url: string } | null } | null
      }>
    }>
  }
}

async function fetchMetaobjects(): Promise<AuditSnapshot['metaobjects']> {
  const result: AuditSnapshot['metaobjects'] = {}
  for (const type of METAOBJECT_TYPES) {
    try {
      const data = await request<MetaobjectData>(
        `query ($type: String!) {
          metaobjects(type: $type, first: 100) {
            nodes { handle fields { key value type reference { ... on MediaImage { image { url } } } } }
          }
        }`,
        { type },
      )
      result[type] = data.metaobjects.nodes.map<AuditMetaobject>((node) => ({
        handle: node.handle,
        fields: Object.fromEntries(
          node.fields.map((field) => [
            field.key,
            { value: field.value, type: field.type, imageUrl: field.reference?.image?.url },
          ]),
        ),
      }))
    } catch {
      result[type] = undefined // unknown type / no access
    }
  }
  return result
}

function print(findings: readonly Finding[]) {
  const order = ['product', 'collection', 'filters', 'metaobject'] as const
  for (const scope of order) {
    const items = findings.filter((finding) => finding.scope === scope)
    if (items.length === 0) continue
    console.log(`\n${scope.toUpperCase()}`)
    for (const finding of items) console.log(`  ${finding.level.padEnd(5)} ${finding.ref}: ${finding.message}`)
  }
}

async function main() {
  console.log(`Auditing ${domain} (Storefront API ${version})…`)
  const [products, collections, filterGroups, metaobjects] = await Promise.all([
    fetchProducts(),
    fetchCollections(),
    fetchFilterGroups(),
    fetchMetaobjects(),
  ])
  const findings = auditAll({ products, collections, filterGroups, metaobjects })

  const sold = products.filter((product) => !product.availableForSale).length
  console.log(`\nProducts: ${products.length} (${sold} sold) · filter groups seen: ${filterGroups.map((g) => `${g.label} (${g.valueCount})`).join(', ') || 'none'}`)
  console.log('Not checkable with the public token: draft/archived products, collection sizes (> 5,000 hides filters), Admin-side metafield values.')
  print(findings)

  const errors = findings.filter((finding) => finding.level === 'ERROR').length
  const warnings = findings.length - errors
  console.log(`\n${errors} error(s), ${warnings} warning(s)`)
  process.exit(errors > 0 ? 1 : 0)
}

main().catch((reason: unknown) => {
  console.error(`Audit failed: ${reason instanceof Error ? reason.message : String(reason)}`)
  process.exit(2)
})
