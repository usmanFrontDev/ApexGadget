/** Anchor of the Description / Specifications / Shipping tabs ("Full details" link). */
export const PRODUCT_DETAILS_ID = 'product-details'

export const ProductTabId = {
  Description: 'description',
  Specifications: 'specifications',
  Shipping: 'shipping',
} as const
export type ProductTabId = (typeof ProductTabId)[keyof typeof ProductTabId]

export const PRODUCT_TABS: readonly { id: ProductTabId; label: string }[] = [
  { id: ProductTabId.Description, label: 'Description' },
  { id: ProductTabId.Specifications, label: 'Specifications' },
  { id: ProductTabId.Shipping, label: 'Shipping & Returns' },
]

/** Days of the returns promise (client-owned, BLOCKED-ON-CLIENT); shared by the product trust strip and the cart. */
export const RETURN_WINDOW_DAYS = 7

export const TrustIconKey = { Truck: 'truck', Return: 'return', Card: 'card' } as const
export type TrustIconKey = (typeof TrustIconKey)[keyof typeof TrustIconKey]

/**
 * PLACEHOLDER trust claims copied from the design. They are client-owned (OPEN-ISSUES C21) and, for the launch
 * (COD / bank transfer / wallets), "100% secure" and "Free shipping" must be confirmed or replaced:
 * BLOCKED-ON-CLIENT.
 */
export const TRUST_ITEMS: readonly { id: string; icon: TrustIconKey; title: string; caption: string }[] = [
  { id: 'shipping', icon: TrustIconKey.Truck, title: 'Free Shipping', caption: 'On all orders' },
  { id: 'returns', icon: TrustIconKey.Return, title: `${RETURN_WINDOW_DAYS} Days Return`, caption: 'Hassle free' },
  { id: 'payment', icon: TrustIconKey.Card, title: 'Secure Payment', caption: '100% secure' },
]

/** Show "Only n left" when this few (or fewer) units are in stock. */
export const LOW_STOCK_MAX = 3

/** WhatsApp text for "Ask on WhatsApp" on a product page. Tokens: {title} {storage} {url}. */
export const PRODUCT_INQUIRY_TEMPLATE = 'Hi Apex Gadgets, I have a question about the {title} {storage}.\n{url}'

export const PRODUCT_CONTENT = {
  addToCart: 'Add to Cart',
  soldOut: 'Sold out',
  soldChip: 'Sold',
  fullDetails: 'Full details',
  inStock: 'In stock',
  viewCart: 'View cart',
  inCartHint: 'Added to your cart.',
  onlyOneHint: 'Only 1 available, so the quantity can’t be increased.',
  stockLimitHint: 'Only {n} available.',
  report: { title: 'Condition report', battery: 'Battery health', grade: 'Condition', network: 'Network', warranty: 'Warranty', box: 'In the box' },
  ask: { title: 'Questions about this phone?', text: 'Chat with us on WhatsApp before you buy.', button: 'Ask on WhatsApp' },
  lowStock: 'Only {n} left',
  favorite: { add: 'Save', saved: 'Saved' },
  soldHint: 'This one has found a new home. Have a look at similar iPhones below.',
  save: 'Save',
  selectOptions: 'Select an option',
  detailsTitle: 'Detailed Information',
  keyFeatures: 'Key Features',
  noSpecs: 'No specifications listed for this product yet.',
  noDescription: 'No description yet.',
  noPolicy: 'Shipping and return details will appear here soon.',
  warranty: 'Warranty',
  whatsInTheBox: "What's in the box",
  similar: { eyebrow: 'You may also like', title: 'Similar Products', action: 'View all' },
  cta: {
    title: 'Trade in your old device and get the best value.',
    description: 'Upgrade to the latest iPhone with our hassle-free trade-in program.',
  },
  notFound: {
    title: 'Product not found',
    description: "We couldn't find this product. It may have been removed, or the link is wrong.",
    action: 'Browse the shop',
  },
  error: {
    title: "We couldn't load this product",
    description: 'Something went wrong while talking to the store. Please try again.',
  },
} as const
