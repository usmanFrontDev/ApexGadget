import { FILTER_VALUE_LABELS } from '@/constants/shop'

const UPPERCASE_WORDS = new Set(['gb', 'tb', 'pta', 'jv'])

/** `natural-titanium` -> "Natural Titanium", `256gb` -> "256GB". Used when a value has no entry in the label map. */
export function humanize(value: string): string {
  return value
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/(\d)(gb|tb)\b/gi, '$1 $2')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      UPPERCASE_WORDS.has(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
}

/** Display label of a metafield / filter value: known label, else the humanised fallback. Empty -> ''. */
export function labelFor(value: string | undefined, fallback?: string): string {
  if (!value) return ''
  return FILTER_VALUE_LABELS[value] ?? humanize(fallback ?? value)
}

/** Position of a value in the label map (unknown values sort last). Keeps "iPhone 17 … 11" and "64 GB … 1 TB" in order. */
export function valueOrder(value: string): number {
  const index = Object.keys(FILTER_VALUE_LABELS).indexOf(value)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}
