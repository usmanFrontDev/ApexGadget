import { useQuery } from '@tanstack/react-query'
import { productKeys } from '@/constants/queryKeys'
import { getSimilarProducts } from '@/services/productDetail.service'

/** Similar products of a product page (`model` is the fallback filter when Shopify has no recommendations). */
export function useSimilarProducts(handle: string | undefined, model?: string, limit?: number) {
  return useQuery({
    queryKey: productKeys.similar(handle ?? '', limit),
    queryFn: () => getSimilarProducts(handle ?? '', model, limit),
    enabled: Boolean(handle),
    staleTime: 5 * 60_000,
  })
}
