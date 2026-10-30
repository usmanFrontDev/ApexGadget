import { BatteryRange } from '@/constants/shop'

/** Battery bucket of a health percentage; must match docs/shopify/02-data-model.md §3. */
export function getBatteryRange(health: number): BatteryRange {
  if (health >= 90) return BatteryRange.Excellent
  if (health >= 80) return BatteryRange.Good
  if (health >= 70) return BatteryRange.Fair
  return BatteryRange.Low
}
