/** Trade-in part of `apex_site_settings` (docs/shopify/06 §5 `SiteSettings.tradeIn`). */
export interface TradeInSettings {
  /** Digits only with the country code; empty = not configured (the send button is disabled). */
  whatsappNumber: string
  messageTemplate: string
}
