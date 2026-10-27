import { Checkbox } from '@/components/ui/Checkbox'
import type { FacetConfig } from '@/types/shop.types'

export interface FacetFilterProps {
  facet: FacetConfig
  selected: readonly string[]
  /** Matching products per option value. */
  counts: Record<string, number>
  onToggle: (value: string) => void
}

/** One filter section: a title and a checkbox list with counts. */
export function FacetFilter({ facet, selected, counts, onToggle }: FacetFilterProps) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-2 text-[13px] font-bold">{facet.title}</legend>
      <div className="flex flex-col">
        {facet.options.map((option) => {
          const count = counts[option.value] ?? 0
          const isSelected = selected.includes(option.value)
          return (
            <Checkbox
              key={option.value}
              label={option.label}
              count={count}
              swatchClass={option.swatchClass}
              checked={isSelected}
              disabled={count === 0 && !isSelected}
              onChange={() => onToggle(option.value)}
            />
          )
        })}
      </div>
    </fieldset>
  )
}
