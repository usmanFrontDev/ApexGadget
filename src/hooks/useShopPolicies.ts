import { useQuery } from '@tanstack/react-query'
import { policyKeys } from '@/constants/queryKeys'
import { getShopPolicies } from '@/services/productDetail.service'

/** Shipping and refund policy text (product page "Shipping & Returns" tab). */
export function useShopPolicies() {
  return useQuery({ queryKey: policyKeys.shipping(), queryFn: getShopPolicies, staleTime: 10 * 60_000 })
}
