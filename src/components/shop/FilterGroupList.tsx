import { Checkbox } from '@/components/ui/Checkbox'
import { FILTER_SWATCH_CLASSES } from '@/constants/shop'
import { labelFor } from '@/lib/filterLabels'
import { sameInput } from '@/lib/shopFilters'
import type { FilterGroup, ProductFilterInput } from '@/types/shop.types'

export interface FilterGroupListProps {
  group: FilterGroup
  selection: readonly ProductFilterInput[]
  onToggle: (input: ProductFilterInput) => void
}

/** One filter group as returned by Shopify: a title and a checkbox list with counts. */
export function FilterGroupList({ group, selection, onToggle }: FilterGroupListProps) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-2 text-[13px] font-bold">{group.label}</legend>
      <div className="flex flex-col">
        {group.values.map((value) => {
          const selected = selection.some((input) => sameInput(input, value.input))
          return (
            <Checkbox
              key={value.id}
              label={labelFor(value.urlValue, value.label)}
              count={value.count}
              swatchClass={FILTER_SWATCH_CLASSES[value.urlValue]}
              checked={selected}
              disabled={value.count === 0 && !selected}
              onChange={() => onToggle(value.input)}
            />
          )
        })}
      </div>
    </fieldset>
  )
}
