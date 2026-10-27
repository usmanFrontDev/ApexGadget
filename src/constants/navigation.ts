import { ROUTES } from '@/constants/routes'
import type { NavItem } from '@/types/layout.types'

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Shop', to: ROUTES.shop },
  { label: 'Trade', to: ROUTES.trade },
  { label: 'Support', to: ROUTES.support },
]
