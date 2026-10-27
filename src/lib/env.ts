/**
 * Mock data is the default: the catalogue comes from `constants/mockProducts.ts`.
 * Shopify is only used when `VITE_USE_MOCK_DATA=false` is set explicitly (and its credentials exist).
 */
const wantsShopify =
  import.meta.env.VITE_USE_MOCK_DATA === 'false' &&
  Boolean(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN) &&
  Boolean(import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN)

export const USE_MOCK_DATA = !wantsShopify
