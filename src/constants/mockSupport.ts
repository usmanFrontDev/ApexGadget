import { FaqTopic, type FaqItem } from '@/types/support.types'

/**
 * MOCK support content (mock mode only). Every text is a PLACEHOLDER: the real wording is client-owned
 * (BLOCKED-ON-CLIENT) and comes from Shopify: `apex_faq_item` metaobjects and the `warranty` page.
 */
export const MOCK_FAQ_ITEMS: readonly FaqItem[] = [
  { id: 'faq-1', topic: FaqTopic.Shipping, question: 'How long does delivery take?', answer: '<p>PLACEHOLDER: delivery times are set by the client.</p>' },
  { id: 'faq-2', topic: FaqTopic.Shipping, question: 'Do you deliver all over Pakistan?', answer: '<p>PLACEHOLDER: delivery areas and rates are set by the client.</p>' },
  { id: 'faq-3', topic: FaqTopic.Returns, question: 'Can I return a phone?', answer: '<p>PLACEHOLDER: the return window and conditions are set by the client.</p>' },
  { id: 'faq-4', topic: FaqTopic.Warranty, question: 'Is there a warranty on used phones?', answer: '<p>PLACEHOLDER: warranty months and coverage are set by the client.</p>' },
  { id: 'faq-5', topic: FaqTopic.Payments, question: 'Which payment methods do you accept?', answer: '<p>Cash on Delivery, bank transfer, EasyPaisa and JazzCash. PLACEHOLDER: account details are set by the client.</p>' },
  { id: 'faq-6', topic: FaqTopic.TradeIn, question: 'How does a trade-in work?', answer: '<p>Fill in the trade-in form and send it to us on WhatsApp. We quote you manually.</p>' },
]

export const MOCK_WARRANTY_HTML = `
  <h3>Warranty</h3>
  <p>PLACEHOLDER: the warranty policy (months per product type and what is covered) is set by the client.</p>`
