import type { ProductDetail } from '@/types/product.types'

const NEW_GRADE = 'new'

/** schema.org Product block (docs/shopify/09): availability from the product, condition from the grade. */
export function buildProductJsonLd(product: ProductDetail, url: string): Record<string, unknown> {
  const sku = product.variants.find((variant) => variant.sku)?.sku
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((image) => image.url),
    description: product.seo.description ?? product.subtitle,
    ...(sku && { sku }),
    brand: { '@type': 'Brand', name: 'Apple' },
    offers: {
      '@type': 'Offer',
      url,
      price: product.priceAmount,
      priceCurrency: product.currencyCode,
      availability: product.sold ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      itemCondition:
        product.grade === NEW_GRADE ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    },
  }
}
