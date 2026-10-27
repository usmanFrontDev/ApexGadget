import { FacetFilter } from '@/components/shop/FacetFilter'
import { PriceRangeFilter } from '@/components/shop/PriceRangeFilter'
import { SHOP_FACETS, type FacetKey } from '@/constants/shop'
import type { ShopCatalogView, ShopFilters } from '@/types/shop.types'

export interface ShopFilterPanelProps {
  filters: ShopFilters
  view: ShopCatalogView
  onToggleFacet: (key: FacetKey, value: string) => void
  onPriceChange: (min?: number, max?: number) => void
}

const divider = 'border-t border-ink/8 pt-5'

/** The filter sections (price + facets) for the sidebar and the mobile drawer. */
export function ShopFilterPanel({ filters, view, onToggleFacet, onPriceChange }: ShopFilterPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-3 text-[13px] font-bold">Price range</legend>
        <PriceRangeFilter
          bounds={view.priceBounds}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={onPriceChange}
        />
      </fieldset>

      {SHOP_FACETS.filter((facet) => view.availableFacets.includes(facet.key)).map((facet) => (
        <div key={facet.key} className={divider}>
          <FacetFilter
            facet={facet}
            selected={filters.facets[facet.key]}
            counts={view.facetCounts[facet.key]}
            onToggle={(value) => onToggleFacet(facet.key, value)}
          />
        </div>
      ))}
    </div>
  )
}
