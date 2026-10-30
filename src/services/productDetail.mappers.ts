import { mapProduct, type ShopifyProductNode } from '@/services/products.mappers'
import type { ProductDetail, ProductImage, ProductOption, ProductSpec, ProductVariant } from '@/types/product.types'

interface MoneyNode {
  amount: string
  currencyCode: string
}

interface MetafieldNode {
  value: string
}

/** `PRODUCT_BY_HANDLE_QUERY` result. */
export interface ShopifyProductDetailNode extends ShopifyProductNode {
  descriptionHtml: string
  seo?: { title: string | null; description: string | null } | null
  images?: { nodes: Array<{ url: string; altText: string | null; width: number | null; height: number | null }> }
  options?: Array<{ name: string; values: string[] }>
  variants?: {
    nodes: Array<{
      id: string
      title: string
      sku: string | null
      availableForSale: boolean
      quantityAvailable: number | null
      price: MoneyNode
      compareAtPrice: MoneyNode | null
      selectedOptions: Array<{ name: string; value: string }>
      image: { url: string } | null
    }>
  }
  warrantyMonths?: MetafieldNode | null
  warrantyNote?: MetafieldNode | null
  boxContents?: MetafieldNode | null
  specs?: MetafieldNode | null
}

const DEFAULT_OPTION = { name: 'Title', value: 'Default Title' } as const

function parseJson(value: string | undefined): unknown {
  if (!value) return undefined
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}

/** `custom.box_contents` (list of text) -> strings; anything unreadable -> `[]`. */
export function parseBoxContents(value: string | undefined): string[] {
  const data = parseJson(value)
  return Array.isArray(data) ? data.filter((item): item is string => typeof item === 'string' && item.trim() !== '') : []
}

/** `custom.specs` (JSON `[{label, value}]`) -> specs; invalid entries are skipped. */
export function parseSpecs(value: string | undefined): ProductSpec[] {
  const data = parseJson(value)
  if (!Array.isArray(data)) return []
  return data.flatMap((item): ProductSpec[] => {
    if (!item || typeof item !== 'object') return []
    const { label, value: specValue } = item as Record<string, unknown>
    return typeof label === 'string' && typeof specValue === 'string' && label.trim() && specValue.trim()
      ? [{ label: label.trim(), value: specValue.trim() }]
      : []
  })
}

function mapVariant(variant: NonNullable<ShopifyProductDetailNode['variants']>['nodes'][number]): ProductVariant {
  const price = Number(variant.price.amount)
  const compareAt = Number(variant.compareAtPrice?.amount)
  return {
    id: variant.id,
    title: variant.title,
    sku: variant.sku ?? undefined,
    availableForSale: variant.availableForSale,
    quantityAvailable: variant.quantityAvailable ?? undefined,
    priceAmount: price,
    compareAtAmount: Number.isFinite(compareAt) && compareAt > price ? compareAt : undefined,
    currencyCode: variant.price.currencyCode,
    selectedOptions: variant.selectedOptions,
    image: variant.image?.url,
  }
}

export function mapProductDetail(node: ShopifyProductDetailNode): ProductDetail {
  const summary = mapProduct(node)
  const variants = (node.variants?.nodes ?? []).map(mapVariant)
  const images: ProductImage[] = (node.images?.nodes ?? []).map((image) => ({
    url: image.url,
    alt: image.altText ?? node.title,
    width: image.width ?? undefined,
    height: image.height ?? undefined,
  }))
  if (images.length === 0 && summary.image) images.push({ url: summary.image, alt: summary.imageAlt ?? node.title })

  // The default "Title: Default Title" option and options with a single value are not choices.
  const options: ProductOption[] = (node.options ?? []).filter(
    (option) => option.values.length > 1 && !(option.name === DEFAULT_OPTION.name && option.values[0] === DEFAULT_OPTION.value),
  )

  const warrantyMonths = Number(node.warrantyMonths?.value)

  return {
    ...summary,
    // a variant-level price/compare-at wins over the product's "from" price when there is only one variant
    compareAtAmount: variants.length === 1 ? (variants[0]?.compareAtAmount ?? summary.compareAtAmount) : summary.compareAtAmount,
    descriptionHtml: node.descriptionHtml,
    images,
    options,
    variants,
    warrantyMonths: Number.isFinite(warrantyMonths) && warrantyMonths >= 0 && node.warrantyMonths ? warrantyMonths : undefined,
    warrantyNote: node.warrantyNote?.value.trim() || undefined,
    boxContents: parseBoxContents(node.boxContents?.value),
    specs: parseSpecs(node.specs?.value),
    seo: { title: node.seo?.title ?? undefined, description: node.seo?.description ?? undefined },
    sold: !node.availableForSale,
  }
}
