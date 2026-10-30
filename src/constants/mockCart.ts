/** MOCK ONLY (`VITE_USE_MOCK_DATA=true`): the mock cart's own state lives in localStorage under this key. */
export const MOCK_CART_STORAGE_KEY = 'apex.cart.mock.v1'
export const MOCK_CART_LATENCY_MS = 250
export const MOCK_CART_ID_PREFIX = 'gid://mock/Cart/'
/** Placeholder: the real `checkoutUrl` comes from Shopify (TODO(shopify), docs/shopify/11). */
export const MOCK_CHECKOUT_URL = '#mock-checkout'

/**
 * MOCK ONLY discount codes. Real codes are created in Shopify (Discounts) and validated by the Storefront API:
 * nothing here ships to a connected store.
 */
export const MOCK_DISCOUNT_CODES: Readonly<Record<string, { percent: number }>> = {
  APEX10: { percent: 10 },
}
