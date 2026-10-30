import { USE_MOCK_DATA } from '@/lib/env'
import { mockCartService } from '@/services/mock/cartMock'
import {
  CartError,
  CartErrorCode,
  type Cart,
  type CartLineInput,
  type CartLineUpdate,
  type CartResult,
  type CartService,
  type CartValidation,
} from '@/types/cart.types'

const notConnected = (): never => {
  throw new CartError(CartErrorCode.NotConnected, 'The cart is not connected to the store yet.')
}

/**
 * Shopify Storefront Cart API (docs/shopify/05-graphql.md §6). On hold: every method is a TODO(shopify) listed in
 * docs/shopify/11-go-live-integration.md, and fails loudly instead of pretending to work.
 */
const shopifyCartService: CartService = {
  // TODO(shopify): `cart(id)` query, `null` when the cart is gone (expired or completed)
  getCart: async () => notConnected(),
  // TODO(shopify): `cartCreate(input: { lines })`, map `userErrors` to CartError and `warnings` to CartResult.warnings
  createCart: async () => notConnected(),
  // TODO(shopify): `cartLinesAdd`
  addLines: async () => notConnected(),
  // TODO(shopify): `cartLinesUpdate`
  updateLines: async () => notConnected(),
  // TODO(shopify): `cartLinesRemove`
  removeLines: async () => notConnected(),
  // TODO(shopify): `cartDiscountCodesUpdate`; a code with `applicable: false` becomes CartError(InvalidDiscount)
  updateDiscountCodes: async () => notConnected(),
  // TODO(shopify): `cartNoteUpdate`
  updateNote: async () => notConnected(),
  // TODO(shopify): re-fetch the cart and check availability / stock of every line (`merchandise.availableForSale`)
  validateForCheckout: async () => notConnected(),
}

const impl: CartService = USE_MOCK_DATA ? mockCartService : shopifyCartService

export const getCart = (id: string): Promise<Cart | null> => impl.getCart(id)
export const createCart = (lines: CartLineInput[]): Promise<CartResult> => impl.createCart(lines)
export const addLines = (cartId: string, lines: CartLineInput[]): Promise<CartResult> => impl.addLines(cartId, lines)
export const updateLines = (cartId: string, lines: CartLineUpdate[]): Promise<CartResult> =>
  impl.updateLines(cartId, lines)
export const removeLines = (cartId: string, lineIds: string[]): Promise<CartResult> => impl.removeLines(cartId, lineIds)
export const updateDiscountCodes = (cartId: string, codes: string[]): Promise<CartResult> =>
  impl.updateDiscountCodes(cartId, codes)
export const updateNote = (cartId: string, note: string): Promise<CartResult> => impl.updateNote(cartId, note)
export const validateForCheckout = (cartId: string): Promise<CartValidation> => impl.validateForCheckout(cartId)
