import accessoriesImage from '@/assets/images/accessories.png'
import heroPhoneImage from '@/assets/images/hero-iphone.png'
import tradeInPhoneImage from '@/assets/images/trade-in-iphone.png'
import { ROUTES } from '@/constants/routes'

export const SupportSectionId = {
  Contact: 'contact',
  Shipping: 'shipping',
  Warranty: 'warranty',
  Payments: 'payments',
  Faq: 'faq',
} as const
export type SupportSectionId = (typeof SupportSectionId)[keyof typeof SupportSectionId]

/** `/support#warranty`: the footer links point at the Support sections (shipping / warranty / payments open their panel). */
export const supportPath = (section: SupportSectionId) => `${ROUTES.support}#${section}`

/** Sections whose card opens a side panel with the full text. */
export const SUPPORT_PANEL_IDS = [SupportSectionId.Shipping, SupportSectionId.Warranty, SupportSectionId.Payments] as const
export type SupportPanelId = (typeof SUPPORT_PANEL_IDS)[number]

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

/** Pre-filled WhatsApp text of the Support page. */
export const SUPPORT_WHATSAPP_MESSAGE = 'Hi Apex Gadgets, I need some help.'

/** Accessible name of the floating WhatsApp button. */
export const WHATSAPP_FLOAT_LABEL = 'Chat with us on WhatsApp'

/**
 * Pictures of the three info cards: DUMMIES (existing product art) until the client's final images arrive
 * (delivery box, warranty phone, payment logos): replace the imports above.
 */
export const SUPPORT_CARD_IMAGES = {
  [SupportSectionId.Shipping]: accessoriesImage,
  [SupportSectionId.Warranty]: heroPhoneImage,
  [SupportSectionId.Payments]: tradeInPhoneImage,
} as const

export const SUPPORT_CONTENT = {
  breadcrumb: 'Support',
  /** Also the text of the banner artwork. */
  banner: {
    title: 'How can we help?',
    lead: "Get quick support for your order, warranty, returns and more — we're here to help.",
  },
  quick: {
    whatsapp: { title: 'Chat on WhatsApp', text: 'Get instant help' },
    call: { title: 'Call us', text: 'Speak with our team' },
    email: { title: 'Email us', text: 'Send us a message' },
    hours: { title: 'Business hours' },
  },
  contact: {
    eyebrow: 'Contact us',
    title: 'Send us a message',
    lead: "Have a question or need assistance? Fill out the form and we'll get back to you shortly.",
    sideTitle: "We're here to help!",
    sideText: 'Our support team is ready to assist you with any questions.',
  },
  cards: {
    [SupportSectionId.Shipping]: {
      title: 'Shipping & Returns',
      text: 'Learn about our delivery areas, shipping charges and return policy.',
      link: 'View details',
      empty: 'Shipping and return details will appear here soon.',
    },
    [SupportSectionId.Warranty]: {
      title: 'Warranty',
      text: "Know what's covered and how to claim your warranty.",
      link: 'Learn more',
      empty: 'Warranty details will appear here soon.',
    },
    [SupportSectionId.Payments]: {
      title: 'Payments',
      text: 'Discover our secure payment methods and process.',
      link: 'View options',
      note: 'PLACEHOLDER: account details and the payment steps are set by the client.',
    },
  },
  faq: {
    eyebrow: 'FAQs',
    title: 'Frequently Asked Questions',
    lead: 'Find quick answers to the most common questions.',
    search: 'Search FAQs...',
    searchLabel: 'Search the FAQs',
    noMatch: 'No questions match your search.',
    empty: 'No questions yet.',
    error: "We couldn't load the questions.",
    retry: 'Try again',
  },
  closePanel: 'Close',
  form: {
    name: 'Your Name',
    namePlaceholder: 'John Doe',
    email: 'Email Address',
    emailPlaceholder: 'you@example.com',
    phone: 'Phone Number',
    phoneSuffix: '(Optional)',
    phonePlaceholder: '+92 300 1234567',
    topic: 'Topic',
    topicPlaceholder: 'Select a topic',
    message: 'Your Message',
    messagePlaceholder: 'Tell us how we can help...',
    counter: '{n} / {max}',
    submit: 'Send Message',
    sending: 'Sending…',
    errors: {
      name: 'Please enter your name.',
      email: 'Please enter a valid email address.',
      phone: 'Use digits, spaces, + or - only.',
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
