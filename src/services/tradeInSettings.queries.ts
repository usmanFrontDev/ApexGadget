/** `apex_site_settings` (single entry, handle `main`): the fields the trade-in flow needs. docs/shopify/05 §7. */
export const TRADE_IN_SETTINGS_QUERY = `
  query TradeInSettings {
    metaobject(handle: { type: "apex_site_settings", handle: "main" }) {
      fields { key value }
    }
  }
`
