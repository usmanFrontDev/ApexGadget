export interface Money {
  amount: number
  currencyCode: string
}

/** Contract of docs/shopify/06 §4. */
export interface CartLine {
  id: string
  quantity: number
  /** `unitPrice × quantity`. */
  total: Money
  variantId: string
  variantTitle: string
  productHandle: string
  productTitle: string
  /** "256GB · Natural Titanium". */
  subtitle: string
  image?: string
  imageAlt?: string
  unitPrice: Money
  /** Per-unit original price; only set when higher than the unit price. */
  compareAtAmount?: number
  availableForSale: boolean
  /** Stock limit when known (every used phone is 1). */
  quantityAvailable?: number
  /** `custom.condition_grade`. */
  grade?: string
  /** `custom.pta_status`. */
  ptaStatus?: string
  batteryHealth?: number
}

export interface CartDiscount {
  code: string
  /** Amount taken off the subtotal (always above 0). */
  amount: Money
}

export interface Cart {
  id: string
  checkoutUrl: string
  note?: string
  /** Quantity of ALL lines (header badge, page title), unavailable ones included. */
  totalQuantity: number
  /** Available lines only (see `lib/cartTotals.ts`). */
  subtotal: Money
  /** `subtotal − discount`. */
  total: Money
  tax?: Money
  discountCodes: { code: string; applicable: boolean }[]
  discount?: CartDiscount
  attributes: { key: string; value: string }[]
  lines: CartLine[]
}

/** What the product page sends to add a line. */
export interface CartLineInput {
  variantId: string
  /** Mock mode resolves the variant from the catalogue by handle; Shopify ignores it. */
  productHandle: string
  quantity: number
}

export interface CartLineUpdate {
  /** `CartLine.id`. */
  id: string
  quantity: number
}

export const CartWarningCode = {
  /** The requested quantity was above the stock and was lowered. */
  QuantityClamped: 'quantity-clamped',
} as const
export type CartWarningCode = (typeof CartWarningCode)[keyof typeof CartWarningCode]

export interface CartWarning {
  code: CartWarningCode
  lineId: string
  /** Units that can be bought. */
  available: number
}

/** The cart after a mutation, plus what the service adjusted on the way. */
export interface CartResult {
  cart: Cart
  warnings: CartWarning[]
}

/** `valid` = every line can still be bought, so checkout may open. */
export interface CartValidation {
  cart: Cart
  valid: boolean
}

export const CartErrorCode = {
  /** Shopify mode before plan step 6. */
  NotConnected: 'not-connected',
  /** The cart id is unknown or expired. */
  NotFound: 'not-found',
  Unavailable: 'unavailable',
  /** A single-unit item (every phone) that is already in the cart. */
  SingleUnitInCart: 'single-unit-in-cart',
  InvalidDiscount: 'invalid-discount',
  Unknown: 'unknown',
} as const
export type CartErrorCode = (typeof CartErrorCode)[keyof typeof CartErrorCode]

/** Thrown by the cart service. `message` is safe to show to the shopper. */
export class CartError extends Error {
  readonly code: CartErrorCode

  constructor(code: CartErrorCode, message: string) {
    super(message)
    this.name = 'CartError'
    this.code = code
  }
}

/** One interface, two implementations (mock now, Shopify later). Every mutation returns the whole cart. */
export interface CartService {
  /** `null` = no such cart (expired or completed). */
  getCart: (id: string) => Promise<Cart | null>
  createCart: (lines: CartLineInput[]) => Promise<CartResult>
  addLines: (cartId: string, lines: CartLineInput[]) => Promise<CartResult>
  updateLines: (cartId: string, lines: CartLineUpdate[]) => Promise<CartResult>
  removeLines: (cartId: string, lineIds: string[]) => Promise<CartResult>
  /** An empty list clears the discount; an unknown code throws `InvalidDiscount`. */
  updateDiscountCodes: (cartId: string, codes: string[]) => Promise<CartResult>
  updateNote: (cartId: string, note: string) => Promise<CartResult>
  /** Re-reads the cart and checks every line is still available. */
  validateForCheckout: (cartId: string) => Promise<CartValidation>
}
