export const FaqTopic = {
  Shipping: 'shipping',
  Returns: 'returns',
  Warranty: 'warranty',
  Payments: 'payments',
  TradeIn: 'trade-in',
  Other: 'other',
} as const
export type FaqTopic = (typeof FaqTopic)[keyof typeof FaqTopic]

/** `apex_faq_item` metaobject (docs/shopify/02 §5). */
export interface FaqItem {
  id: string
  question: string
  /** Rich text (HTML): sanitised before it is rendered. */
  answer: string
  topic: FaqTopic
}

export const ContactErrorCode = {
  /** The EmailJS keys are missing from the env. */
  NotConfigured: 'not-configured',
  Failed: 'failed',
} as const
export type ContactErrorCode = (typeof ContactErrorCode)[keyof typeof ContactErrorCode]

/** Thrown by the contact service; `message` is safe to show. */
export class ContactError extends Error {
  readonly code: ContactErrorCode

  constructor(code: ContactErrorCode, message: string) {
    super(message)
    this.name = 'ContactError'
    this.code = code
  }
}
