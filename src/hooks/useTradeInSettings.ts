import { useQuery } from '@tanstack/react-query'
import { settingsKeys } from '@/constants/queryKeys'
import { getTradeInSettings } from '@/services/tradeInSettings.service'

/** WhatsApp number + message template for the trade-in hand-off. */
export function useTradeInSettings() {
  return useQuery({ queryKey: settingsKeys.tradeIn(), queryFn: getTradeInSettings, staleTime: 10 * 60_000 })
}
