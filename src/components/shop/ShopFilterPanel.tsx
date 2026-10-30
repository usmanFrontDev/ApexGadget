import { FilterGroupList } from '@/components/shop/FilterGroupList'
import { PriceRangeFilter } from '@/components/shop/PriceRangeFilter'
import { getSelectedPrice, sameInput } from '@/lib/shopFilters'
import { FilterGroupType, type FilterGroup, type ProductFilterInput } from '@/types/shop.types'

export interface ShopFilterPanelProps {
  groups: readonly FilterGroup[]
  selection: readonly ProductFilterInput[]
  onToggle: (input: ProductFilterInput) => void
  onPriceChange: (min?: number, max?: number) => void
}

const divider = 'border-t border-ink/8 pt-5 first:border-t-0 first:pt-0'

/** A list with a single value can't narrow anything, unless that value is selected. */
function isUseful(group: FilterGroup, selection: readonly ProductFilterInput[]) {
  if (group.type === FilterGroupType.PriceRange) {
    return Boolean(group.priceBounds && group.priceBounds.max > group.priceBounds.min)
  }
  return group.values.length > 1 || group.values.some((value) => selection.some((input) => sameInput(input, value.input)))
}

/** Renders whatever filter groups Shopify returns (Search & Discovery decides which, and in what order). */
export function ShopFilterPanel({ groups, selection, onToggle, onPriceChange }: ShopFilterPanelProps) {
  const price = getSelectedPrice(selection)

  return (
    <div className="flex flex-col gap-5">
      {groups
        .filter((group) => isUseful(group, selection))
        .map((group) => (
          <div key={group.id} className={divider}>
            {group.type === FilterGroupType.PriceRange && group.priceBounds ? (
              <fieldset className="min-w-0 border-0 p-0">
                <legend className="mb-3 text-[13px] font-bold">{group.label}</legend>
                <PriceRangeFilter
                  bounds={group.priceBounds}
                  minPrice={price?.min}
                  maxPrice={price?.max}
                  onChange={onPriceChange}
                />
              </fieldset>
            ) : (
              <FilterGroupList group={group} selection={selection} onToggle={onToggle} />
            )}
          </div>
        ))}
    </div>
  )
}
