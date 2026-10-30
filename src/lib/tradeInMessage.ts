import {
  TRADE_IN_BATTERY_OPTIONS,
  TRADE_IN_BODY_CONDITIONS,
  TRADE_IN_COLOURS,
  TRADE_IN_CONDITIONS,
  TRADE_IN_MODELS,
  TRADE_IN_PTA_STATUSES,
  TRADE_IN_SCREEN_CONDITIONS,
  TRADE_IN_STORAGES,
} from '@/constants/trade'
import type { TradeInValues } from '@/lib/schemas/tradeIn.schema'

const labelOf = (options: readonly { value: string; label: string }[], value?: string) =>
  options.find((option) => option.value === value)?.label ?? ''

/** What each `{token}` of the template is replaced with. Empty string = not provided. */
export function getTradeInTokens(values: Partial<TradeInValues>): Record<string, string> {
  return {
    name: values.name?.trim() ?? '',
    model: labelOf(TRADE_IN_MODELS, values.model),
    storage: labelOf(TRADE_IN_STORAGES, values.storage),
    colour: labelOf(TRADE_IN_COLOURS, values.colour),
    pta: labelOf(TRADE_IN_PTA_STATUSES, values.ptaStatus),
    condition: labelOf(TRADE_IN_CONDITIONS, values.condition),
    screen: labelOf(TRADE_IN_SCREEN_CONDITIONS, values.screen),
    body: labelOf(TRADE_IN_BODY_CONDITIONS, values.body),
    battery: labelOf(TRADE_IN_BATTERY_OPTIONS, values.batteryHealth),
    notes: values.notes?.replace(/\s*\n\s*/g, ' ').trim() ?? '',
    wantToBuy: labelOf(TRADE_IN_MODELS, values.wantToBuy),
  }
}

const TOKEN = /\{(\w+)\}/g

/**
 * Fills the template. A line that contains tokens is dropped when every token on it is empty
 * (so optional answers leave no "Battery health:" with nothing after it); unknown tokens are left empty.
 * Runs of blank lines are collapsed.
 */
export function buildTradeInMessage(values: Partial<TradeInValues>, template: string): string {
  const tokens = getTradeInTokens(values)
  const lines: string[] = []

  for (const line of template.split(/\r?\n/)) {
    const used = [...line.matchAll(TOKEN)].map((match) => match[1] ?? '')
    if (used.length > 0 && used.every((token) => !tokens[token])) continue
    lines.push(line.replace(TOKEN, (_, token: string) => tokens[token] ?? '').replace(/[ \t]+$/g, ''))
  }

  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** `https://wa.me/<digits>?text=<message>`; the number may contain `+`, spaces or dashes. Empty number -> `undefined`. */
export function buildWhatsAppUrl(number: string, text: string): string | undefined {
  const digits = number.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) return undefined
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}
