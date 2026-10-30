import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { productKeys } from '@/constants/queryKeys'
import { getShopProducts } from '@/services/products.service'
import type { ShopQuery } from '@/types/shop.types'

const SHOP_STALE_MS = 60_000

/** Shop products for the current category / search / filters: server-side, cursor based ("Load more"). */
export function useShopProducts(query: ShopQuery) {
  const result = useInfiniteQuery({
    queryKey: productKeys.shop(query),
    queryFn: ({ pageParam }) => getShopProducts(query, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => (last.hasNextPage ? last.endCursor : undefined),
    placeholderData: keepPreviousData,
    staleTime: SHOP_STALE_MS,
  })

  const pages = result.data?.pages ?? []
  const first = pages[0]
  return {
    products: pages.flatMap((page) => page.products),
    /** Filters are re-sent with every page; the first page is the source of truth. */
    filters: first?.filters ?? [],
    totalCount: first?.totalCount,
    hasNextPage: result.hasNextPage,
    fetchNextPage: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    isPending: result.isPending,
    isError: result.isError,
    /** Showing the previous filters' results while the new ones load. */
    isStale: result.isPlaceholderData,
    refetch: result.refetch,
  }
}
