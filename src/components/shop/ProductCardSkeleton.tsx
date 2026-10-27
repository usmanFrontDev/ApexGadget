import { GlassCard } from '@/components/ui/GlassCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { GlassCardVariant } from '@/constants/ui'

/** Same footprint as ProductCard so the grid doesn't jump when data arrives. */
export function ProductCardSkeleton() {
  return (
    <GlassCard variant={GlassCardVariant.Soft} className="p-[15px]">
      <Skeleton className="h-[170px] rounded-[16px]" />
      <div className="px-1 pt-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-[9px] h-[14px] w-full" />
        <Skeleton className="mt-6 h-6 w-1/4" />
      </div>
      <Skeleton className="mt-4 h-[46px] rounded-full" />
    </GlassCard>
  )
}
