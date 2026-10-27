export const ROUTES = {
  home: '/',
  shop: '/shop',
  trade: '/trade',
  support: '/support',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
