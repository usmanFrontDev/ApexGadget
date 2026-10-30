import { useCallback, useEffect, useRef, useState } from 'react'
import { SearchIcon, SlidersIcon } from '@/components/icons'
import { ShopFilterPanel } from '@/components/shop/ShopFilterPanel'
import { ShopProductGrid, ShopProductGridSkeleton } from '@/components/shop/ShopProductGrid'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { EmptyState } from '@/components/ui/EmptyState'
import { GlassCard } from '@/components/ui/GlassCard'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { Skeleton } from '@/components/ui/Skeleton'
import { DESKTOP_FILTERS_QUERY } from '@/constants/shop'
import { Typography } from '@/components/ui/Typography'
import {
  ButtonSize,
  ButtonVariant,
  GlassCardVariant,
  IconPosition,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { getSortOptions, type ShopFiltersState } from '@/hooks/useShopFilters'
import { useShopProducts } from '@/hooks/useShopProducts'
import { dropStaleSelection } from '@/lib/shopFilters'
import { offeredFilterKinds } from '@/services/products.mappers'

const RESULTS_ID = 'shop-results'
const FILTERS_ID = 'shop-filters'
/** Same as `sticky top-28` on the sidebar (7rem) — if it sits higher, it isn't stuck. */
const STICKY_TOP_PX = 112

export interface ShopCatalogSectionProps {
  shop: ShopFiltersState
}

export function ShopCatalogSection({ shop }: ShopCatalogSectionProps) {
  const { query, activeFilterCount, replaceSelection } = shop
  const results = useShopProducts(query)
  const { products, filters, totalCount, isPending, isError, isStale, refetch } = results
  const isDesktop = useMediaQuery(DESKTOP_FILTERS_QUERY)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  // With few results the grid gets short and the sticky sidebar can't stick: it scrolls away
  // with the page while the user is mid-filtering. When that happens, bring the grid (and the
  // sidebar at its top) back into view. Does nothing while the sidebar is stuck normally.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const sidebar = document.getElementById(FILTERS_ID)
    if (sidebar && sidebar.getBoundingClientRect().top < STICKY_TOP_PX - 4) {
      document.getElementById(RESULTS_ID)?.scrollIntoView({ block: 'start' })
    }
  }, [query])

  // The client can remove a filter in Shopify at any time: drop selections whose filter is gone.
  useEffect(() => {
    if (isPending || isStale || isError || filters.length === 0) return
    const kept = dropStaleSelection(query.selection, offeredFilterKinds(filters))
    if (kept.length !== query.selection.length) replaceSelection(kept)
  }, [isPending, isStale, isError, filters, query.selection, replaceSelection])

  const filterPanel = !isPending && (
    <ShopFilterPanel
      groups={filters}
      selection={query.selection}
      onToggle={shop.toggleFilter}
      onPriceChange={shop.setPriceRange}
    />
  )

  const resultsLabel = totalCount === undefined ? undefined : `${totalCount} ${totalCount === 1 ? 'result' : 'results'}`

  const clearButton = (
    <button
      type="button"
      onClick={shop.clearFilters}
      disabled={activeFilterCount === 0}
      className="text-[12.5px] font-semibold text-primary underline-offset-4 transition-opacity hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
    >
      Clear all
    </button>
  )

  let content
  if (isError) {
    content = (
      <EmptyState
        icon={<SearchIcon width={24} height={24} />}
        title="We couldn’t load the products"
        description="Something went wrong while talking to the store. Please check your connection and try again."
        action={
          <Button size={ButtonSize.Md} onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  } else if (isPending) {
    content = <ShopProductGridSkeleton />
  } else if (products.length === 0) {
    content = (
      <EmptyState
        icon={<SearchIcon width={24} height={24} />}
        title="No products match your filters"
        description="Try removing a filter or widening the price range — new stock lands every Friday."
        action={
          <Button variant={ButtonVariant.Secondary} size={ButtonSize.Md} onClick={shop.clearFilters}>
            Clear filters
          </Button>
        }
      />
    )
  } else {
    content = (
      <div aria-busy={isStale} className={isStale ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
        <ShopProductGrid products={products} />
        {results.hasNextPage && (
          <div className="mt-8 flex justify-center">
            <Button
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Md}
              disabled={results.isFetchingNextPage}
              onClick={() => results.fetchNextPage()}
            >
              {results.isFetchingNextPage ? 'Loading…' : 'Load more'}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="mt-8 lg:grid lg:grid-cols-[236px_minmax(0,1fr)] lg:items-start lg:gap-7">
      {isDesktop && (
        <aside id={FILTERS_ID} aria-label="Filters" className="sticky top-28">
          {/* Never taller than the viewport: header stays, the options scroll inside. */}
          <GlassCard
            variant={GlassCardVariant.Soft}
            className="flex max-h-[calc(100dvh-8rem)] flex-col rounded-[18px]"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-ink/8 px-5 py-4">
              <Typography as="h2" variant={TypographyVariant.CardTitle}>
                Filters
              </Typography>
              {clearButton}
            </div>
            {/* Direct flex child of the card: it shrinks to the card's max height and scrolls. */}
            <div
              tabIndex={0}
              role="region"
              aria-label="Filter options"
              className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-5 outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-primary)]"
            >
              {filterPanel ?? (
                <div aria-hidden="true" className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="mt-6 h-4 w-1/3" />
                  <Skeleton className="h-24 w-full" />
                </div>
              )}
            </div>
            {/* Bottom fade: a plain overlay (a mask-image on the scroller repainted wrongly). */}
            <span
              aria-hidden="true"
              className="pointer-events-none -mt-7 h-7 shrink-0 bg-gradient-to-t from-white to-transparent"
            />
          </GlassCard>
        </aside>
      )}

      <div id={RESULTS_ID} className="min-w-0 scroll-mt-28">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Typography
            variant={TypographyVariant.BodySm}
            tone={TypographyTone.Muted}
            className="whitespace-nowrap"
            aria-live="polite"
          >
            {isPending ? 'Loading…' : resultsLabel ? `Showing ${resultsLabel}` : `Showing ${products.length}${results.hasNextPage ? '+' : ''} products`}
          </Typography>
          <div className="flex items-center gap-2.5">
            {!isDesktop && (
              <Button
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Sm}
                icon={<SlidersIcon />}
                iconPosition={IconPosition.Start}
                className="h-10"
                onClick={() => setDrawerOpen(true)}
              >
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Button>
            )}
            <SelectMenu
              compact
              label="Sort by"
              options={getSortOptions(query.search)}
              value={query.sort}
              onChange={shop.setSort}
              className="min-w-0 flex-1 sm:flex-none"
            />
          </div>
        </div>

        {content}
      </div>

      {!isDesktop && (
        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          title="Filters"
          footer={
            <div className="flex gap-3">
              <Button
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Md}
                className="flex-1"
                onClick={shop.clearFilters}
                disabled={activeFilterCount === 0}
              >
                Clear all
              </Button>
              <Button size={ButtonSize.Md} className="flex-1" onClick={closeDrawer}>
                {resultsLabel ? `Show ${resultsLabel}` : 'Show results'}
              </Button>
            </div>
          }
        >
          {filterPanel}
        </Drawer>
      )}
    </section>
  )
}
