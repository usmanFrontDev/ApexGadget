import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { productKeys } from '@/constants/queryKeys'
import { getProductsByHandles } from '@/services/productDetail.service'

/** Product cards for the saved handles (same order as `handles`; `null` = no longer exists). */
export function useWishlistProducts(handles: readonly string[]) {
  return useQuery({
    queryKey: productKeys.byHandles(handles),
    queryFn: () => getProductsByHandles(handles),
    enabled: handles.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}
