import { DEFAULT_TRADE_IN_TEMPLATE } from '@/constants/trade'
import type { TradeInSettings } from '@/types/settings.types'

export interface ShopifySettingsNode {
  fields: Array<{ key: string; value: string | null }>
}

/** International number, digits only (`923001234567`), 8–15 digits. Anything else = not configured. */
const WHATSAPP_DIGITS = /^\d{8,15}$/

export function mapTradeInSettings(node: ShopifySettingsNode | null): TradeInSettings {
  const field = (key: string) => node?.fields.find((item) => item.key === key)?.value?.trim() ?? ''
  const number = field('whatsapp_number').replace(/[\s+-]/g, '')
  return {
    whatsappNumber: WHATSAPP_DIGITS.test(number) ? number : '',
    messageTemplate: field('trade_in_message_template') || DEFAULT_TRADE_IN_TEMPLATE,
  }
}
