import { useQuery } from '@tanstack/react-query'
import { productKeys } from '@/constants/queryKeys'
import { getProductByHandle } from '@/services/productDetail.service'

const PRODUCT_STALE_MS = 60_000

/** One product page. `data === null` means the product does not exist; a sold listing is still returned. */
export function useProduct(handle: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(handle ?? ''),
    queryFn: () => getProductByHandle(handle ?? ''),
    enabled: Boolean(handle),
    staleTime: PRODUCT_STALE_MS,
  })
}
