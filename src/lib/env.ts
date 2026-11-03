/**
 * Mock data is the default: the catalogue comes from `constants/mockProducts.ts`.
 * Shopify is only used when `VITE_USE_MOCK_DATA=false` is set explicitly (and its credentials exist).
 */
const wantsShopify =
  import.meta.env.VITE_USE_MOCK_DATA === 'false' &&
  Boolean(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN) &&
  Boolean(import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN)

export const USE_MOCK_DATA = !wantsShopify

/**
 * EmailJS (Support contact form, sent straight from the browser: no backend). All three values are PUBLIC by design;
 * allow only the site's domain in the EmailJS dashboard. `null` = not configured.
 */
const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const EMAILJS_CONFIG =
  emailJsServiceId && emailJsTemplateId && emailJsPublicKey
    ? { serviceId: emailJsServiceId, templateId: emailJsTemplateId, publicKey: emailJsPublicKey }
    : null
