/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_STORE_DOMAIN: string
  readonly VITE_SHOPIFY_STOREFRONT_TOKEN: string
  readonly VITE_USE_MOCK_DATA?: string
  /** Storefront API version, e.g. `2026-10`. Falls back to DEFAULT_SHOPIFY_API_VERSION. */
  readonly VITE_SHOPIFY_API_VERSION?: string
  /** EmailJS (Support contact form): public values, see docs/shopify/00-overview.md. */
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
