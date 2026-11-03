import { useQuery } from '@tanstack/react-query'
import { supportKeys } from '@/constants/queryKeys'
import { getFaqItems, getWarrantyHtml } from '@/services/support.service'

export function useFaqItems() {
  return useQuery({ queryKey: supportKeys.faq(), queryFn: getFaqItems, staleTime: 10 * 60_000 })
}

export function useWarranty() {
  return useQuery({ queryKey: supportKeys.warranty(), queryFn: getWarrantyHtml, staleTime: 10 * 60_000 })
}
