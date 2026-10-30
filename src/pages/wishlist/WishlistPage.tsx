import { useMemo, useState } from 'react'
import { Reveal } from '@/components/common/Reveal'
import { CtaBanner } from '@/components/common/CtaBanner'
import { PageBanner } from '@/components/common/PageBanner'
import { HeartIcon, SearchIcon } from '@/components/icons'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { GlassCard } from '@/components/ui/GlassCard'
import { Pagination } from '@/components/ui/Pagination'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { Skeleton } from '@/components/ui/Skeleton'
import { Typography } from '@/components/ui/Typography'
import { WishlistRow } from '@/components/wishlist/WishlistRow'
import { WishlistUnavailableCard } from '@/components/wishlist/WishlistUnavailableCard'
import { PAGE_BANNERS } from '@/constants/images'
import { ROUTES } from '@/constants/routes'
import {
  ButtonSize,
  ChipSize,
  GlassCardVariant,
  PageBannerTone,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { WISHLIST_CONTENT, WISHLIST_PAGE_SIZE, WISHLIST_SORT_OPTIONS, WishlistSort } from '@/constants/wishlist'
import { useSeo } from '@/hooks/useSeo'
import { useWishlistProducts } from '@/hooks/useWishlistProducts'
import { paginate, sortWishlistEntries, type WishlistEntry } from '@/lib/wishlist'
import { useWishlistStore } from '@/store/useWishlistStore'

const LIST_ID = 'wishlist-list'

/** A list: one row per saved item. */
const listClasses = 'flex flex-col gap-3 sm:gap-4'

function WishlistSkeleton({ count = WISHLIST_PAGE_SIZE }: { count?: number }) {
  return (
    <ul aria-hidden="true" className={listClasses}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <GlassCard
            variant={GlassCardVariant.Soft}
            className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-4 rounded-[18px] p-3 sm:grid-cols-[132px_minmax(0,1fr)_auto_auto] sm:gap-6 sm:p-4"
          >
            <Skeleton className="aspect-square rounded-[14px]" />
            <div>
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-2 h-[14px] w-2/3" />
            </div>
            <Skeleton className="hidden h-6 w-24 sm:block" />
            <Skeleton className="col-span-2 h-[42px] w-full rounded-full sm:col-span-1 sm:w-[160px]" />
          </GlassCard>
        </li>
      ))}
    </ul>
  )
}

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items)
  const remove = useWishlistStore((state) => state.remove)
  const [sort, setSort] = useState<WishlistSort>(WishlistSort.Newest)
  const [requestedPage, setRequestedPage] = useState(1)

  useSeo({ title: WISHLIST_CONTENT.title, description: WISHLIST_CONTENT.lead, canonical: ROUTES.wishlist })

  const lookups = useWishlistProducts(items.map((item) => item.handle))

  const entries = useMemo<WishlistEntry[]>(() => {
    const byHandle = new Map((lookups.data ?? []).map((lookup) => [lookup.handle, lookup.product]))
    // an item added a moment ago may not have been looked up yet: wait for it instead of flashing "unavailable"
    return items.filter((item) => byHandle.has(item.handle)).map((item) => ({ ...item, product: byHandle.get(item.handle) ?? null }))
  }, [items, lookups.data])

  const sorted = useMemo(() => sortWishlistEntries(entries, sort), [entries, sort])
  const { items: pageItems, page, pageCount } = paginate(sorted, requestedPage, WISHLIST_PAGE_SIZE)

  const changePage = (next: number) => {
    setRequestedPage(next)
    document.getElementById(LIST_ID)?.scrollIntoView({ block: 'start' })
  }

  const count = items.length
  const countLabel = `${count} ${count === 1 ? 'item' : 'items'}`

  let content
  if (count === 0) {
    content = (
      <EmptyState
        icon={<HeartIcon width={24} height={24} />}
        title={WISHLIST_CONTENT.empty.title}
        description={WISHLIST_CONTENT.empty.description}
        action={
          <Button to={ROUTES.shop} size={ButtonSize.Md}>
            {WISHLIST_CONTENT.empty.action}
          </Button>
        }
      />
    )
  } else if (lookups.isError) {
    content = (
      <EmptyState
        icon={<SearchIcon width={24} height={24} />}
        title={WISHLIST_CONTENT.error.title}
        description={WISHLIST_CONTENT.error.description}
        action={
          <Button size={ButtonSize.Md} onClick={() => lookups.refetch()}>
            Try again
          </Button>
        }
      />
    )
  } else if (lookups.isPending || entries.length === 0) {
    content = <WishlistSkeleton count={Math.min(count, WISHLIST_PAGE_SIZE)} />
  } else {
    content = (
      <>
        <ul className={listClasses}>
          {pageItems.map((entry, index) => (
            <li key={entry.handle}>
              <Reveal trigger="mount" delay={index * 0.04}>
                {entry.product ? (
                  <WishlistRow product={entry.product} onRemove={() => remove(entry.handle)} />
                ) : (
                  <WishlistUnavailableCard onRemove={() => remove(entry.handle)} />
                )}
              </Reveal>
            </li>
          ))}
        </ul>
        <Pagination page={page} pageCount={pageCount} onChange={changePage} />
      </>
    )
  }

  return (
    <Container className="pt-4 sm:pt-6">
      <PageBanner
        breadcrumb={<Breadcrumb items={[{ label: 'Home', to: ROUTES.home }, { label: WISHLIST_CONTENT.breadcrumb }]} />}
        eyebrow={WISHLIST_CONTENT.eyebrow}
        title={WISHLIST_CONTENT.title}
        lead={WISHLIST_CONTENT.lead}
        image={PAGE_BANNERS.wishlist.src}
        imageWidth={PAGE_BANNERS.wishlist.width}
        imageHeight={PAGE_BANNERS.wishlist.height}
        tone={PageBannerTone.Light}
        artPositionClassName="object-[84%_center]"
        mobileContent={
          <div className="mt-5 flex justify-center">
            <Chip size={ChipSize.Lg} icon={<HeartIcon width={15} height={15} className="text-primary" fill="currentColor" />}>
              {WISHLIST_CONTENT.savedItems}: {count}
            </Chip>
          </div>
        }
      />

      <section id={LIST_ID} className="mt-8 scroll-mt-28 sm:mt-10" aria-label="Saved items">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Typography variant={TypographyVariant.BodySm} tone={TypographyTone.Muted} className="whitespace-nowrap" aria-live="polite">
            {countLabel}
          </Typography>
          {count > 1 && (
            <SelectMenu
              label="Sort by"
              options={WISHLIST_SORT_OPTIONS}
              value={sort}
              onChange={(value) => {
                setSort(value)
                setRequestedPage(1)
              }}
              className="min-w-0"
            />
          )}
        </div>
        {content}
      </section>

      <CtaBanner
        title={WISHLIST_CONTENT.cta.title}
        description={WISHLIST_CONTENT.cta.description}
        to={ROUTES.shop}
        className="mt-10 sm:mt-12"
      />
    </Container>
  )
}
