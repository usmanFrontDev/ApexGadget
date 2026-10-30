import { useTradeInSettings } from '@/hooks/useTradeInSettings'

/** The store's WhatsApp number (digits only), `''` when not configured, `undefined` while loading. */
export function useWhatsAppNumber() {
  const settings = useTradeInSettings()
  return settings.data?.whatsappNumber
}
