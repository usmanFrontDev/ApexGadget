import { MOCK_FAQ_ITEMS, MOCK_SUPPORT_INFO, MOCK_WARRANTY_HTML } from '@/constants/mockSupport'
import { USE_MOCK_DATA } from '@/lib/env'
import type { FaqItem, SupportInfo } from '@/types/support.types'

const MOCK_LATENCY_MS = 300
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** FAQ entries (`apex_faq_item`, docs/shopify/02 §5). Mock: placeholder questions. */
export async function getFaqItems(): Promise<FaqItem[]> {
  if (USE_MOCK_DATA) {
    await wait(MOCK_LATENCY_MS)
    return [...MOCK_FAQ_ITEMS]
  }
  // TODO(shopify): metaobjects `apex_faq_item` sorted by `sort_order` (docs/shopify/11)
  throw new Error('The Shopify support content is not connected yet.')
}

/** The warranty text (Shopify page `warranty`, as HTML). Mock: a placeholder. */
export async function getWarrantyHtml(): Promise<string> {
  if (USE_MOCK_DATA) {
    await wait(MOCK_LATENCY_MS)
    return MOCK_WARRANTY_HTML
  }
  // TODO(shopify): `page(handle: "warranty") { body }` (docs/shopify/11)
  throw new Error('The Shopify support content is not connected yet.')
}

/** Phone and business hours (`apex_site_settings`). Mock: placeholders. */
export async function getSupportInfo(): Promise<SupportInfo> {
  if (USE_MOCK_DATA) {
    await wait(MOCK_LATENCY_MS)
    return { ...MOCK_SUPPORT_INFO }
  }
  // TODO(shopify): metaobject `apex_site_settings` (`support_phone`, `support_hours`), docs/shopify/11
  throw new Error('The Shopify support content is not connected yet.')
}
