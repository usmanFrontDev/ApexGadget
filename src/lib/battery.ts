import { BatteryRange } from '@/constants/shop'

export const BatteryTone = {
  /** 80 % and up. */
  Good: 'good',
  /** 70–79 %. */
  Fair: 'fair',
  /** Below 70 %. */
  Low: 'low',
} as const
export type BatteryTone = (typeof BatteryTone)[keyof typeof BatteryTone]

/** Colour signal of a battery percentage: green from 80 %, amber 70–79 %, red below. */
export function getBatteryTone(health: number): BatteryTone {
  if (health >= 80) return BatteryTone.Good
  if (health >= 70) return BatteryTone.Fair
  return BatteryTone.Low
}

/** Battery bucket of a health percentage; must match docs/shopify/02-data-model.md §3. */
export function getBatteryRange(health: number): BatteryRange {
  if (health >= 90) return BatteryRange.Excellent
  if (health >= 80) return BatteryRange.Good
  if (health >= 70) return BatteryRange.Fair
  return BatteryRange.Low
}
