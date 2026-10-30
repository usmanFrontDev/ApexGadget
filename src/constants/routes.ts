export const ROUTES = {
  home: '/',
  shop: '/shop',
  product: '/shop/:handle',
  trade: '/trade',
  wishlist: '/wishlist',
  cart: '/cart',
  support: '/support',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

/** `/shop/<handle>`: the product page of a Shopify product handle. */
export const productPath = (handle: string) => `${ROUTES.shop}/${encodeURIComponent(handle)}`
