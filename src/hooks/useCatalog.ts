import { useQuery } from '@tanstack/react-query'
import { productKeys } from '@/constants/queryKeys'
import { getCatalog } from '@/services/products.service'

const CATALOG_STALE_MS = 5 * 60_000

/** The whole product catalogue (cached); the shop page filters it client-side. */
export function useCatalog() {
  return useQuery({
    queryKey: productKeys.catalog(),
    queryFn: getCatalog,
    staleTime: CATALOG_STALE_MS,
  })
}
