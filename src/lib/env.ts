const hasShopifyConfig =
  Boolean(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN) &&
  Boolean(import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN)

/**
 * `true` -> catalogue data comes from `constants/mockProducts.ts` instead of Shopify.
 * Also on when the Shopify credentials are missing (e.g. a deploy without env vars), so the
 * storefront never ends up in a state where it can only show an error.
 */
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || !hasShopifyConfig
