import { CART_CONTENT, CART_DEFAULT_MAX_QUANTITY } from '@/constants/cart'
import { LOW_STOCK_MAX, PRODUCT_CONTENT } from '@/constants/product'
import { labelFor } from '@/lib/filterLabels'
import type { CartLine } from '@/types/cart.types'

/** "PTA Approved · Battery 93%": missing parts are skipped without leaving separators. */
export function getCartLineMeta(line: Pick<CartLine, 'ptaStatus' | 'batteryHealth'>): string {
  return [
    line.ptaStatus ? labelFor(line.ptaStatus) : undefined,
    line.batteryHealth !== undefined ? `Battery ${line.batteryHealth}%` : undefined,
  ]
    .filter(Boolean)
    .join(' · ')
}

/** Highest quantity a line may have (stock, or a safe cap when the stock is unknown). */
export const getLineMaxQuantity = (line: Pick<CartLine, 'quantityAvailable'>) =>
  line.quantityAvailable ?? CART_DEFAULT_MAX_QUANTITY

/** Phones (stock 1): the quantity can't go above 1. */
export const isSingleUnit = (line: Pick<CartLine, 'quantityAvailable'>) => line.quantityAvailable === 1

/** "1 of 1 available" for a single unit, "Only 2 left" for a low stock, nothing otherwise. */
export function getAvailabilityText(line: Pick<CartLine, 'quantityAvailable'>): string | undefined {
  if (line.quantityAvailable === undefined) return undefined
  if (line.quantityAvailable === 1) {
    return CART_CONTENT.line.available.replace('{quantity}', '1').replace('{stock}', '1')
  }
  if (line.quantityAvailable <= LOW_STOCK_MAX) {
    return PRODUCT_CONTENT.lowStock.replace('{n}', String(line.quantityAvailable))
  }
  return undefined
}

export const formatItemCount = (count: number) =>
  count === 1 ? CART_CONTENT.items.one : CART_CONTENT.items.other.replace('{n}', String(count))
