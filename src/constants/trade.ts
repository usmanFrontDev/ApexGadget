import { ProductColor, ProductPtaStatus, ProductStorage, PTA_STATUS_LABELS } from '@/constants/shop'

/**
 * Trade-in form contract. Every option list is defined ONCE here as an `as const` array; the Zod
 * schema (`lib/schemas/tradeIn.schema.ts`) and the form types are derived from it.
 */

const model = <V extends string>(value: V, label: string) => ({ value, label }) as const

/**
 * PLACEHOLDER: the final model list is BLOCKED-ON-CLIENT (docs/shopify/OPEN-ISSUES.md).
 * iPhone 11 to 17 with their standard variants, plus SE.
 */
export const TRADE_IN_MODELS = [
  model('iphone-17-pro-max', 'iPhone 17 Pro Max'),
  model('iphone-17-pro', 'iPhone 17 Pro'),
  model('iphone-17-air', 'iPhone 17 Air'),
  model('iphone-17', 'iPhone 17'),
  model('iphone-16-pro-max', 'iPhone 16 Pro Max'),
  model('iphone-16-pro', 'iPhone 16 Pro'),
  model('iphone-16-plus', 'iPhone 16 Plus'),
  model('iphone-16', 'iPhone 16'),
  model('iphone-16e', 'iPhone 16e'),
  model('iphone-15-pro-max', 'iPhone 15 Pro Max'),
  model('iphone-15-pro', 'iPhone 15 Pro'),
  model('iphone-15-plus', 'iPhone 15 Plus'),
  model('iphone-15', 'iPhone 15'),
  model('iphone-14-pro-max', 'iPhone 14 Pro Max'),
  model('iphone-14-pro', 'iPhone 14 Pro'),
  model('iphone-14-plus', 'iPhone 14 Plus'),
  model('iphone-14', 'iPhone 14'),
  model('iphone-13-pro-max', 'iPhone 13 Pro Max'),
  model('iphone-13-pro', 'iPhone 13 Pro'),
  model('iphone-13', 'iPhone 13'),
  model('iphone-13-mini', 'iPhone 13 mini'),
  model('iphone-12-pro-max', 'iPhone 12 Pro Max'),
  model('iphone-12-pro', 'iPhone 12 Pro'),
  model('iphone-12', 'iPhone 12'),
  model('iphone-12-mini', 'iPhone 12 mini'),
  model('iphone-11-pro-max', 'iPhone 11 Pro Max'),
  model('iphone-11-pro', 'iPhone 11 Pro'),
  model('iphone-11', 'iPhone 11'),
  model('iphone-se-2022', 'iPhone SE (2022)'),
  model('iphone-se-2020', 'iPhone SE (2020)'),
] as const

export const TRADE_IN_STORAGES = [
  { value: ProductStorage.Gb64, label: '64GB' },
  { value: ProductStorage.Gb128, label: '128GB' },
  { value: ProductStorage.Gb256, label: '256GB' },
  { value: ProductStorage.Gb512, label: '512GB' },
  { value: ProductStorage.Tb1, label: '1TB' },
] as const

export const TRADE_IN_COLOURS = [
  { value: ProductColor.Black, label: 'Black' },
  { value: ProductColor.White, label: 'White' },
  { value: ProductColor.Blue, label: 'Blue' },
  { value: ProductColor.Red, label: 'Red' },
  { value: ProductColor.Purple, label: 'Purple' },
  { value: ProductColor.Gold, label: 'Gold' },
  { value: ProductColor.NaturalTitanium, label: 'Natural' },
] as const

export const TRADE_IN_PTA_STATUSES = [
  { value: ProductPtaStatus.Pta, label: PTA_STATUS_LABELS[ProductPtaStatus.Pta] },
  { value: ProductPtaStatus.NonPta, label: PTA_STATUS_LABELS[ProductPtaStatus.NonPta] },
  { value: ProductPtaStatus.Jv, label: PTA_STATUS_LABELS[ProductPtaStatus.Jv] },
] as const

export const TRADE_IN_CONDITIONS = [
  { value: 'like-new', label: 'Like New', description: 'Almost no signs of use' },
  { value: 'good', label: 'Good', description: 'Light signs of use' },
  { value: 'fair', label: 'Fair', description: 'Visible wear and tear' },
  { value: 'damaged', label: 'Damaged', description: 'Major damage or not working' },
] as const

export const TRADE_IN_SCREEN_CONDITIONS = [
  { value: 'no-issues', label: 'No issues' },
  { value: 'scratches', label: 'Scratches' },
  { value: 'cracked', label: 'Cracked' },
] as const

export const TRADE_IN_BODY_CONDITIONS = [
  { value: 'no-issues', label: 'No issues' },
  { value: 'scratches', label: 'Scratches' },
  { value: 'dents', label: 'Dents' },
] as const

export const TRADE_IN_BATTERY_OPTIONS = [
  { value: '90-plus', label: '90% or above' },
  { value: '80-89', label: '80–89%' },
  { value: '70-79', label: '70–79%' },
  { value: 'below-70', label: 'Below 70%' },
  { value: 'not-sure', label: 'Not sure' },
] as const

export const DEFAULT_TRADE_IN_SCREEN = TRADE_IN_SCREEN_CONDITIONS[0].value
export const DEFAULT_TRADE_IN_BODY = TRADE_IN_BODY_CONDITIONS[0].value

export const TRADE_IN_NOTES_MAX = 500
export const TRADE_IN_NAME_MIN = 2
export const TRADE_IN_NAME_MAX = 60

/** Form field ids, also the keys of the message template tokens' source values. */
export const TradeInStep = { Phone: 1, Condition: 2, Review: 3 } as const
export type TradeInStep = (typeof TradeInStep)[keyof typeof TradeInStep]

export const TRADE_IN_STEPS = [
  { id: TradeInStep.Phone, label: 'Phone', title: 'Tell us about your iPhone', subtitle: 'Select your device details below.' },
  { id: TradeInStep.Condition, label: 'Condition', title: 'Describe the condition', subtitle: 'Be as detailed as possible.' },
  { id: TradeInStep.Review, label: 'Review', title: 'Review your details', subtitle: 'Check everything before sending.' },
] as const

export const TRADE_IN_DRAFT_KEY = 'apex.tradein.draft.v1'
export const TRADE_IN_FORM_ID = 'trade-in-form'
export const TRADE_IN_FIRST_FIELD_ID = 'trade-in-model'

/**
 * Default WhatsApp message. The client edits the real one in Shopify
 * (`apex_site_settings.trade_in_message_template`, docs/shopify/06 §7). Lines whose tokens are all empty are dropped.
 * Tokens: {name} {model} {storage} {colour} {pta} {condition} {screen} {body} {battery} {notes} {wantToBuy}
 */
export const DEFAULT_TRADE_IN_TEMPLATE = [
  'Hi Apex Gadgets, I would like a trade-in offer.',
  '',
  'Name: {name}',
  'Model: {model}',
  'Storage: {storage}',
  'Colour: {colour}',
  'PTA status: {pta}',
  'Overall condition: {condition}',
  'Screen: {screen}',
  'Body: {body}',
  'Battery health: {battery}',
  'Other problems: {notes}',
  'I want to buy: {wantToBuy}',
  '',
  "I'll send photos here.",
].join('\n')

/**
 * Mock mode only. Temporary number for testing the trade-in flow (0335 7413642, Pakistan, digits only with the
 * country code). BLOCKED-ON-CLIENT: the real number comes from `apex_site_settings.whatsapp_number`.
 * Shopify mode has no fallback: without it the send button is disabled.
 */
export const MOCK_WHATSAPP_NUMBER = '923357413642'

export const TRADE_IN_CONTENT = {
  eyebrow: 'Trade-in',
  title: 'Trade in your iPhone. Get an offer on WhatsApp.',
  lead: "It's quick, easy and secure. Tell us about your device and we'll send you a fair offer — no obligation.",
  getStarted: 'Get Started',
  steps: [
    { number: '01', title: 'Fill details', caption: 'About your device' },
    { number: '02', title: 'Send on WhatsApp', caption: 'Get your offer' },
    { number: '03', title: 'Get your offer', caption: 'Fast & hassle free' },
  ],
  summary: {
    title: 'Your phone',
    empty: 'Not added yet',
    hint: 'Complete the form to see your device summary here.',
  },
  photoTips: {
    title: 'Photo tips',
    intro: 'For a better & faster offer:',
    items: [
      'Take clear photos in good lighting',
      'Show all sides of your phone',
      'Include any damage (if there is any)',
    ],
  },
  reply: {
    title: 'We reply within hours',
    text: 'Our team will review your device and send a fair offer on WhatsApp.',
  },
  labels: {
    model: 'Model',
    modelPlaceholder: 'Choose iPhone model',
    storage: 'Storage',
    colour: 'Colour',
    ptaStatus: 'PTA Status',
    condition: 'Overall condition',
    screen: 'Screen condition',
    body: 'Body condition',
    battery: 'Battery health',
    batteryPlaceholder: 'Select battery health',
    notes: 'Any other problem?',
    notesPlaceholder: 'e.g. replaced screen, water damage...',
    name: 'Name',
    namePlaceholder: 'Your full name',
    wantToBuy: 'iPhone you want to buy',
    wantToBuyPlaceholder: 'e.g. iPhone 15 Pro',
    optional: '(optional)',
  },
  buttons: { next: 'Next step', back: 'Back', cancel: 'Cancel', clear: 'Clear all', send: 'Send on WhatsApp', edit: 'Edit' },
  cleared: 'Form cleared. Start fresh.',
  attachNote: 'Attach photos in WhatsApp after it opens.',
  summaryCard: 'Device summary',
  errorsAnnouncement: '{n} fields need your attention.',
  noNumber: "WhatsApp isn't set up yet, so we can't send your request. Please try again later or visit our Support page.",
  success: {
    title: 'All set!',
    text: "Your trade-in request has been sent on WhatsApp. We'll review your device and get back to you with the best offer.",
    open: 'Open WhatsApp',
    home: 'Back to Home',
    toast: "Request sent! We'll contact you shortly.",
    blockedHint: "If WhatsApp didn't open, tap “Open WhatsApp” below.",
  },
} as const
