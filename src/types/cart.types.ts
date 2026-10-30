export interface Money {
  amount: number
  currencyCode: string
}

/** Contract of docs/shopify/06 §4. */
export interface CartLine {
  id: string
  quantity: number
  total: Money
  variantId: string
  variantTitle: string
  productHandle: string
  productTitle: string
  image?: string
  unitPrice: Money
  availableForSale: boolean
  quantityAvailable?: number
}

export interface Cart {
  id: string
  checkoutUrl: string
  note?: string
  totalQuantity: number
  subtotal: Money
  total: Money
  tax?: Money
  discountCodes: { code: string; applicable: boolean }[]
  attributes: { key: string; value: string }[]
  lines: CartLine[]
}

export interface AddToCartInput {
  variantId: string
  productHandle: string
  productTitle: string
  variantTitle: string
  image?: string
  unitPrice: Money
  quantity: number
  /** Stock limit when known (used phones are usually 1). */
  quantityAvailable?: number
}

export const AddToCartStatus = {
  Added: 'added',
  /** The line is already in the cart at the maximum quantity. */
  AlreadyInCart: 'already-in-cart',
} as const
export type AddToCartStatus = (typeof AddToCartStatus)[keyof typeof AddToCartStatus]
