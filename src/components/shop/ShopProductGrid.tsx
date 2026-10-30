import { Reveal } from '@/components/common/Reveal'
import { ShopProductCard } from '@/components/shop/ShopProductCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { SHOP_PAGE_SIZE } from '@/constants/shop'
import { GlassCardVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'
import type { ProductSummary } from '@/types/product.types'

/** 1 col < 520px, 2 cols, 3 cols from 768px, 4 cols from 1400px (sidebar included). */
const gridClasses =
  'grid gap-4 min-[520px]:grid-cols-2 md:grid-cols-3 md:gap-5 hd:grid-cols-4'

export interface ShopProductGridProps {
  products: readonly ProductSummary[]
  /** Column classes; default = the shop grid (with the filter sidebar). */
  gridClassName?: string
}

export function ShopProductGrid({ products, gridClassName = gridClasses }: ShopProductGridProps) {
  return (
    <ul className={gridClassName}>
      {products.map((product, index) => (
        <li key={product.id} className="h-full">
          <Reveal trigger="mount" delay={(index % 3) * 0.05} className="h-full">
            <ShopProductCard product={product} />
          </Reveal>
        </li>
      ))}
    </ul>
  )
}

/** Same footprint as ShopProductCard so the grid doesn't jump when data arrives. */
export function ShopProductGridSkeleton({
  count = SHOP_PAGE_SIZE,
  gridClassName = gridClasses,
}: {
  count?: number
  gridClassName?: string
}) {
  return (
    <ul aria-hidden="true" className={cn(gridClassName)}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <GlassCard variant={GlassCardVariant.Soft} className="rounded-[18px] p-[15px]">
            <Skeleton className="h-[170px] rounded-[16px]" />
            <div className="px-1 pt-3.5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-[14px] w-1/3" />
              <Skeleton className="mt-3 h-3 w-1/2" />
              <Skeleton className="mt-6 h-6 w-1/4" />
            </div>
            <Skeleton className="mt-3 h-[42px] rounded-full" />
          </GlassCard>
        </li>
      ))}
    </ul>
  )
}
