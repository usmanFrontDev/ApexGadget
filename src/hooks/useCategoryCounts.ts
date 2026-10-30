import { useQuery } from '@tanstack/react-query'
import { categoryKeys } from '@/constants/queryKeys'
import { getCategoryCounts } from '@/services/categories.service'

/** In-stock product count per category (home category cards). */
export function useCategoryCounts() {
  return useQuery({ queryKey: categoryKeys.counts(), queryFn: getCategoryCounts, staleTime: 5 * 60_000 })
}
