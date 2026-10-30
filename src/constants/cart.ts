export const CART_STORAGE_KEY = 'apex.cart.v1'

export const CART_NOTE_MAX = 300
export const CART_NOTE_SAVE_DELAY_MS = 600
/** Quantity cap of a line whose stock is unknown. */
export const CART_DEFAULT_MAX_QUANTITY = 10
export const DISCOUNT_CODE_MIN = 3
export const DISCOUNT_CODE_MAX = 32
/** Below this many recommendations the "You may also like" section is hidden. */
export const CART_RECOMMENDATIONS_MIN = 2

/** Demo scenario of `/cart?demo=cart` (dev only). */
export const CART_DEMO_PARAM = { key: 'demo', value: 'cart' } as const

export const PaymentIconKey = { Cash: 'cash', Bank: 'bank', Wallet: 'wallet' } as const
export type PaymentIconKey = (typeof PaymentIconKey)[keyof typeof PaymentIconKey]

/**
 * Accepted payments (launch: manual methods, docs/shopify/OPEN-ISSUES A3). Wording is BLOCKED-ON-CLIENT. `logo` is for the
 * client's own logo files later; until then a generic icon is drawn.
 */
export const ACCEPTED_PAYMENTS: readonly { id: string; label: string; icon: PaymentIconKey; logo?: string }[] = [
  { id: 'cod', label: 'Cash on Delivery', icon: PaymentIconKey.Cash },
  { id: 'bank', label: 'Bank transfer', icon: PaymentIconKey.Bank },
  { id: 'easypaisa', label: 'EasyPaisa', icon: PaymentIconKey.Wallet },
  { id: 'jazzcash', label: 'JazzCash', icon: PaymentIconKey.Wallet },
]

export const CART_CONTENT = {
  breadcrumb: 'Cart',
  title: 'Your Cart',
  items: { one: '1 item', other: '{n} items' },
  summary: {
    title: 'Order Summary',
    subtotal: 'Subtotal ({count})',
    discount: 'Discount ({code})',
    shipping: 'Shipping',
    shippingValue: 'Calculated at checkout',
    total: 'Total',
    totalWithCount: 'Total ({count})',
    checkout: 'Checkout',
    continueShopping: 'Continue shopping',
    viewCart: 'View cart',
    payments: 'Accepted Payments',
  },
  discount: {
    toggle: 'Add discount code',
    placeholder: 'Add discount code',
    label: 'Discount code',
    apply: 'Apply',
    applied: 'Applied',
    remove: 'Remove discount code {code}',
    invalidTitle: 'Code not valid',
    invalidText: 'Please check the code and try again.',
    format: 'Use 3 to 32 letters, numbers or hyphens.',
  },
  note: {
    toggle: 'Add a note for delivery',
    label: 'Delivery note',
    placeholder: 'Landmark, preferred time, anything the courier should know.',
    counter: '{n}/{max}',
  },
  line: {
    remove: 'Remove',
    removeLabel: 'Remove {title} from cart',
    save: 'Save',
    saved: 'Saved',
    available: '{quantity} of {stock} available',
    sold: 'Sold',
    quantityOf: 'Quantity of',
    updating: 'Updating',
  },
  unavailable: {
    title: 'No longer available',
    text: 'This item has been sold out and is no longer available in your cart.',
  },
  checkoutReason: {
    unavailable: 'Remove unavailable items to continue',
  },
  recommendations: 'You may also like',
  empty: {
    title: 'Your cart is empty',
    text: "Looks like you haven't added anything to your cart yet.",
    action: 'Explore products',
  },
  drawer: { title: 'Your Cart ({count})', subtotal: 'Subtotal' },
  error: {
    title: "We couldn't load your cart",
    text: 'Something went wrong while talking to the store. Please try again.',
    retry: 'Try again',
  },
  toast: {
    removedTitle: 'Item removed',
    removedText: '{title} has been removed from your cart.',
    close: 'Close',
    added: 'Added to cart',
    singleUnit: 'This phone is a single unit and is already in your cart.',
    clamped: 'Only {n} available. Quantity adjusted.',
    checkoutMock: "Checkout opens Shopify's secure checkout once the store is connected.",
    checkoutBlocked: 'Some items changed. Please review your cart.',
    failed: "We couldn't update your cart. Please try again.",
    addFailed: "We couldn't add this to your cart. Please try again.",
  },
  announce: {
    added: '{title} added to your cart',
    removed: '{title} removed',
    updated: 'Cart updated',
    discountApplied: 'Discount applied',
    discountRemoved: 'Discount removed',
  },
  viewCartButton: 'View cart',
} as const
