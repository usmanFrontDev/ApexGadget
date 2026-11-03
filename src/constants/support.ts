import { ROUTES } from '@/constants/routes'
import { FaqTopic } from '@/types/support.types'

export const SupportSectionId = {
  Contact: 'contact',
  Shipping: 'shipping',
  Warranty: 'warranty',
  Faq: 'faq',
} as const
export type SupportSectionId = (typeof SupportSectionId)[keyof typeof SupportSectionId]

/** `/support#faq`: the footer links point at the sections of the one Support page. */
export const supportPath = (section: SupportSectionId) => `${ROUTES.support}#${section}`

export const SUPPORT_NAV: readonly { id: SupportSectionId; label: string }[] = [
  { id: SupportSectionId.Contact, label: 'Contact us' },
  { id: SupportSectionId.Shipping, label: 'Shipping & returns' },
  { id: SupportSectionId.Warranty, label: 'Warranty' },
  { id: SupportSectionId.Faq, label: 'FAQs' },
]

export const FAQ_TOPIC_LABELS: Record<FaqTopic, string> = {
  [FaqTopic.Shipping]: 'Shipping',
  [FaqTopic.Returns]: 'Returns',
  [FaqTopic.Warranty]: 'Warranty',
  [FaqTopic.Payments]: 'Payments',
  [FaqTopic.TradeIn]: 'Trade-in',
  [FaqTopic.Other]: 'Other',
}

export const ContactTopic = {
  Order: 'order',
  Product: 'product',
  TradeIn: 'trade-in',
  Warranty: 'warranty',
  Other: 'other',
} as const
export type ContactTopic = (typeof ContactTopic)[keyof typeof ContactTopic]

export const CONTACT_TOPICS: readonly { value: ContactTopic; label: string }[] = [
  { value: ContactTopic.Order, label: 'My order' },
  { value: ContactTopic.Product, label: 'A product' },
  { value: ContactTopic.TradeIn, label: 'Trade-in' },
  { value: ContactTopic.Warranty, label: 'Warranty' },
  { value: ContactTopic.Other, label: 'Something else' },
]

export const CONTACT_LIMITS = { nameMin: 2, nameMax: 60, emailMax: 120, messageMin: 10, messageMax: 1000 } as const
export const CONTACT_PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/

/** Pre-filled WhatsApp text of the Support page card. */
export const SUPPORT_WHATSAPP_MESSAGE = 'Hi Apex Gadgets, I need some help.'

export const SUPPORT_CONTENT = {
  breadcrumb: 'Support',
  title: 'How can we help?',
  lead: 'Questions about an order, a phone or a trade-in? Find the answer below or message us.',
  whatsapp: {
    title: 'Fastest: WhatsApp',
    text: 'Chat with us directly. We reply during business hours.',
    button: 'Chat on WhatsApp',
  },
  contact: { title: 'Contact us', lead: 'Send us a message and we will get back to you by email.' },
  shipping: { title: 'Shipping & returns', empty: 'Shipping and return details will appear here soon.' },
  warranty: { title: 'Warranty', empty: 'Warranty details will appear here soon.' },
  faq: {
    title: 'Frequently asked questions',
    empty: 'No questions yet.',
    error: "We couldn't load the questions.",
    retry: 'Try again',
  },
  form: {
    name: 'Your name',
    namePlaceholder: 'Full name',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    phone: 'Phone',
    phoneSuffix: '(optional)',
    phonePlaceholder: '03xx xxxxxxx',
    topic: 'What is it about?',
    topicPlaceholder: 'Choose a topic',
    message: 'Message',
    messagePlaceholder: 'Tell us how we can help.',
    counter: '{n}/{max}',
    submit: 'Send message',
    sending: 'Sending…',
    errors: {
      name: 'Please enter your name.',
      email: 'Please enter a valid email address.',
      phone: 'Use digits, spaces, + or - only.',
      topic: 'Please choose a topic.',
      message: 'Please write at least 10 characters.',
      messageMax: 'Please keep it under 1000 characters.',
    },
    success: {
      title: 'Message sent',
      text: "Thanks! We'll get back to you by email.",
      again: 'Send another message',
    },
    failed: { title: "Couldn't send your message", text: 'Please try again, or message us on WhatsApp.' },
    notConfigured: { title: 'Contact form not connected yet', text: 'Please message us on WhatsApp for now.' },
  },
} as const
