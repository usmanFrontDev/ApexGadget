import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import type { StorefrontApiClient } from '@shopify/storefront-api-client';
import { DEFAULT_SHOPIFY_API_VERSION } from '@/constants/shopify'

let client: StorefrontApiClient | undefined

/**
 * Lazy singleton: created on first use, not at import time, so the app still boots (mock mode)
 * when the Shopify env vars are missing.
 */
export function getShopifyClient(): StorefrontApiClient {
  client ??= createStorefrontApiClient({
    storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
    publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
    apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_API_VERSION,
  })
  return client
}
