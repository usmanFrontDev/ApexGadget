import type { ClientResponse } from '@shopify/storefront-api-client'
import { DEFAULT_TRADE_IN_TEMPLATE, MOCK_WHATSAPP_NUMBER } from '@/constants/trade'
import { USE_MOCK_DATA } from '@/lib/env'
import { getShopifyClient } from '@/lib/shopify'
import { mapTradeInSettings, type ShopifySettingsNode } from '@/services/tradeInSettings.mappers'
import { TRADE_IN_SETTINGS_QUERY } from '@/services/tradeInSettings.queries'
import type { TradeInSettings } from '@/types/settings.types'

const MOCK_LATENCY_MS = 150

/**
 * WhatsApp number + message template of the trade-in flow (`apex_site_settings`, docs/shopify/06 §7).
 * Mock: PLACEHOLDER number. Shopify: no fallback number; an empty one disables the send button.
 */
export async function getTradeInSettings(): Promise<TradeInSettings> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
    return { whatsappNumber: MOCK_WHATSAPP_NUMBER, messageTemplate: DEFAULT_TRADE_IN_TEMPLATE }
  }
  const response: ClientResponse<{ metaobject: ShopifySettingsNode | null }> = await getShopifyClient().request(
    TRADE_IN_SETTINGS_QUERY,
  )
  if (response.errors) throw new Error(response.errors.message ?? 'Could not load settings')
  return mapTradeInSettings(response.data?.metaobject ?? null)
}
