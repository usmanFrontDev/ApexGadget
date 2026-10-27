import { useState } from 'react'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { PRICE_SLIDER_STEP, SHOP_CURRENCY_CODE, SHOP_PRICE_DEBOUNCE_MS } from '@/constants/shop'
import { useDebouncedCommit } from '@/hooks/useDebouncedCommit'
import { formatPrice } from '@/lib/format'
import type { PriceBounds } from '@/types/shop.types'

export interface PriceRangeFilterProps {
  bounds: PriceBounds
  minPrice?: number
  maxPrice?: number
  /** Called with `undefined` for a side that sits at the edge of the bounds. */
  onChange: (min?: number, max?: number) => void
}

/** Price slider: moves smoothly, writes to the URL once you let go for a moment. */
export function PriceRangeFilter({ bounds, minPrice, maxPrice, onChange }: PriceRangeFilterProps) {
  const urlValue = `${minPrice ?? bounds.min}|${maxPrice ?? bounds.max}`
  const [value, setValue] = useState<[number, number]>([minPrice ?? bounds.min, maxPrice ?? bounds.max])
  const [syncedValue, setSyncedValue] = useState(urlValue)

  // The URL (or the category's bounds) changed under us -> adopt it.
  if (urlValue !== syncedValue) {
    setSyncedValue(urlValue)
    setValue([minPrice ?? bounds.min, maxPrice ?? bounds.max])
  }

  useDebouncedCommit(
    `${value[0]}|${value[1]}`,
    (committed) => {
      const [low, high] = committed.split('|').map(Number)
      setSyncedValue(committed)
      onChange(low <= bounds.min ? undefined : low, high >= bounds.max ? undefined : high)
    },
    SHOP_PRICE_DEBOUNCE_MS,
  )

  const money = (amount: number) => formatPrice(amount, SHOP_CURRENCY_CODE)

  return (
    <div>
      <RangeSlider
        min={bounds.min}
        max={bounds.max}
        step={PRICE_SLIDER_STEP}
        value={value}
        onChange={setValue}
        labels={['Minimum price', 'Maximum price']}
      />
      <div className="mt-2 flex justify-between text-[12.5px] text-ink/55">
        <span>{money(value[0])}</span>
        <span>{money(value[1])}</span>
      </div>
    </div>
  )
}
