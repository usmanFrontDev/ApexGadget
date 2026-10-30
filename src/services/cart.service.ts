import { USE_MOCK_DATA } from '@/lib/env'
import { useCartStore } from '@/store/useCartStore'
import type { AddToCartInput, AddToCartStatus } from '@/types/cart.types'

/** Changes the quantity of a cart line (mock: local store; Shopify: `cartLinesUpdate`, plan step 6). */
export async function setCartLineQuantity(variantId: string, quantity: number): Promise<void> {
  if (USE_MOCK_DATA) return useCartStore.getState().setQuantity(variantId, quantity)
  // TODO(plan step 6): cartLinesUpdate
  throw new Error('The Shopify cart is not connected yet.')
}

/** Removes a cart line (mock: local store; Shopify: `cartLinesRemove`, plan step 6). */
export async function removeCartLine(variantId: string): Promise<void> {
  if (USE_MOCK_DATA) return useCartStore.getState().removeLine(variantId)
  // TODO(plan step 6): cartLinesRemove
  throw new Error('The Shopify cart is not connected yet.')
}

/**
 * Adds a line to the cart. Mock mode: local store. Shopify mode: `cartCreate` / `cartLinesAdd`
 * (docs/shopify/05-graphql.md §6) are the next step of the plan; until then this fails loudly instead of
 * pretending to work.
 */
export async function addCartLine(input: AddToCartInput): Promise<AddToCartStatus> {
  if (USE_MOCK_DATA) return useCartStore.getState().addLine(input)
  // TODO(plan step 6): Storefront Cart API (cartCreate / cartLinesAdd, cart id persisted as `apex.cart.v1`).
  throw new Error('The Shopify cart is not connected yet.')
}
