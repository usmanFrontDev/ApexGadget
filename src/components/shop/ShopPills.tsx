import { FilterChip } from '@/components/ui/FilterChip'
import { SHOP_PILLS, ShopCategoryId } from '@/constants/shop'
import type { ShopFilters } from '@/types/shop.types'

export interface ShopPillsProps {
  filters: ShopFilters
  onSelect: (category: ShopCategoryId, model?: string) => void
}

/** Quick-select pills: all iPhones, a single model, or accessories. */
export function ShopPills({ filters, onSelect }: ShopPillsProps) {
  const models = filters.facets.models
  const hasOtherFilters =
    Object.entries(filters.facets).some(([key, values]) => key !== 'models' && values.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined

  return (
    <div role="group" aria-label="Quick filters" // Padding (offset by negative margins) leaves room for the active pill's shadow, which the
      // scroll container would otherwise clip into a visible box.
      className="scrollbar-none -mx-6 -mb-7 flex gap-2.5 overflow-x-auto px-6 pb-9 pt-2">
      {SHOP_PILLS.map((pill) => {
        const selected =
          filters.category === pill.category &&
          !hasOtherFilters &&
          (pill.model ? models.length === 1 && models[0] === pill.model : models.length === 0)
        return (
          <FilterChip key={pill.id} selected={selected} onClick={() => onSelect(pill.category, pill.model)}>
            {pill.label}
          </FilterChip>
        )
      })}
    </div>
  )
}
