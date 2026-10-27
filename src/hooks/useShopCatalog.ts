import { useMemo } from 'react'
import { useCatalog } from '@/hooks/useCatalog'
import { buildCatalogView } from '@/lib/shopCatalog'
import type { ShopFilters } from '@/types/shop.types'

/** Catalogue + shop filters -> the page of products, counts and price bounds to render. */
export function useShopCatalog(filters: ShopFilters) {
  const catalog = useCatalog()
  const view = useMemo(
    () => (catalog.data ? buildCatalogView(catalog.data, filters) : undefined),
    [catalog.data, filters],
  )
  return { view, isPending: catalog.isPending, isError: catalog.isError, refetch: catalog.refetch }
}
