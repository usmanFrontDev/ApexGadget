import { FilterChip } from '@/components/ui/FilterChip'
import { SHOP_PILLS, type ShopCategoryId } from '@/constants/shop'
import { METAFIELD_NAMESPACE, ProductMetafield } from '@/constants/shopify'
import type { ShopQuery } from '@/types/shop.types'

export interface ShopPillsProps {
  query: ShopQuery
  onSelect: (category: ShopCategoryId, model?: string) => void
}

/** Quick-select pills: a category, or one iPhone model. */
export function ShopPills({ query, onSelect }: ShopPillsProps) {
  const { selection } = query
  const selectedModel = selection.length === 1 ? selection[0] : undefined
  const modelValue =
    selectedModel &&
    'productMetafield' in selectedModel &&
    selectedModel.productMetafield.namespace === METAFIELD_NAMESPACE &&
    selectedModel.productMetafield.key === ProductMetafield.DeviceModel
      ? selectedModel.productMetafield.value
      : undefined

  return (
    <div role="group" aria-label="Quick filters" // Padding (offset by negative margins) leaves room for the active pill's shadow, which the
      // scroll container would otherwise clip into a visible box.
      className="scrollbar-none -mx-6 -mb-7 flex gap-2.5 overflow-x-auto px-6 pb-9 pt-2">
      {SHOP_PILLS.map((pill) => {
        const selected =
          !query.search &&
          query.category === pill.category &&
          (pill.model ? modelValue === pill.model : selection.length === 0)
        return (
          <FilterChip key={pill.id} selected={selected} onClick={() => onSelect(pill.category, pill.model)}>
            {pill.label}
          </FilterChip>
        )
      })}
    </div>
  )
}
