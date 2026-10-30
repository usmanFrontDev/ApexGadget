import { PRODUCT_INQUIRY_TEMPLATE } from '@/constants/product'
import { buildWhatsAppUrl } from '@/lib/tradeInMessage'

/** "Ask on WhatsApp" link for a product page; `undefined` when there is no valid number. */
export function buildProductInquiryUrl(
  number: string,
  product: { title: string; storage?: string },
  pageUrl: string,
  template: string = PRODUCT_INQUIRY_TEMPLATE,
): string | undefined {
  const text = template
    .replace('{title}', product.title)
    .replace('{storage}', product.storage ? `(${product.storage.toUpperCase()})` : '')
    .replace('{url}', pageUrl)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/ {2,}/g, ' ')
    .replace(/ +([.,!?])/g, '$1')
    .trim()
  return buildWhatsAppUrl(number, text)
}
