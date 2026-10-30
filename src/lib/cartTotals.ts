import { SHOP_CURRENCY_CODE } from '@/constants/shop'
import type { Cart, CartLine, Money } from '@/types/cart.types'

export interface CartTotals {
  availableLines: CartLine[]
  unavailableLines: CartLine[]
  /** Units of the available lines: the "(N items)" of the summary. */
  itemCount: number
  subtotal: number
  discountAmount: number
  total: number
  currencyCode: string
  hasUnavailable: boolean
  /** At least one line, and every line can be bought. */
  canCheckout: boolean
}

/**
 * What the Order Summary shows. Unavailable (sold) lines never count: not in the subtotal, the item count or the total.
 * (The page title and the header badge count every line: `Cart.totalQuantity`.)
 */
export function getCartTotals(cart: Pick<Cart, 'lines' | 'discount'>): CartTotals {
  const availableLines = cart.lines.filter((line) => line.availableForSale)
  const unavailableLines = cart.lines.filter((line) => !line.availableForSale)
  const subtotal = availableLines.reduce((sum, line) => sum + line.total.amount, 0)
  const discountAmount = Math.min(cart.discount?.amount.amount ?? 0, subtotal)
  const hasUnavailable = unavailableLines.length > 0
  return {
    availableLines,
    unavailableLines,
    itemCount: availableLines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal,
    discountAmount,
    total: subtotal - discountAmount,
    currencyCode: cart.lines[0]?.unitPrice.currencyCode ?? SHOP_CURRENCY_CODE,
    hasUnavailable,
    canCheckout: availableLines.length > 0 && !hasUnavailable,
  }
}

const money = (amount: number, currencyCode: string): Money => ({ amount, currencyCode })

/** Fills `totalQuantity`, `subtotal` and `total` from the lines (used by the mock service and the optimistic remove). */
export function applyTotals(cart: Omit<Cart, 'totalQuantity' | 'subtotal' | 'total'>): Cart {
  const totals = getCartTotals(cart)
  return {
    ...cart,
    totalQuantity: cart.lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: money(totals.subtotal, totals.currencyCode),
    total: money(totals.total, totals.currencyCode),
  }
}
