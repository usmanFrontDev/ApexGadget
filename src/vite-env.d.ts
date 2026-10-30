/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_STORE_DOMAIN: string
  readonly VITE_SHOPIFY_STOREFRONT_TOKEN: string
  readonly VITE_USE_MOCK_DATA?: string
  /** Storefront API version, e.g. `2026-10`. Falls back to DEFAULT_SHOPIFY_API_VERSION. */
  readonly VITE_SHOPIFY_API_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
