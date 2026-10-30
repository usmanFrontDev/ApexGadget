import { OrderSummary } from '@/components/cart/OrderSummary'
import { GlassCard } from '@/components/ui/GlassCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { GlassCardVariant } from '@/constants/ui'

const LINE_PLACEHOLDERS = 3

/** Same footprint as the real page: three line cards and the summary at "Rs 0" with a disabled grey Checkout. */
export function CartSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your cart" className="grid gap-5 lg:grid-cols-[65fr_35fr] lg:items-start lg:gap-6">
      <ul aria-hidden="true" className="flex flex-col gap-3 sm:gap-4">
        {Array.from({ length: LINE_PLACEHOLDERS }, (_, index) => (
          <li key={index}>
            <GlassCard variant={GlassCardVariant.Soft} className="flex gap-4 rounded-[24px] p-4 sm:gap-5 sm:p-5">
              <Skeleton className="size-[88px] shrink-0 rounded-[20px] sm:size-[112px] lg:size-[132px]" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-[26px] w-20 rounded-full" />
                <Skeleton className="mt-3 h-5 w-3/5" />
                <Skeleton className="mt-2 h-4 w-2/5" />
                <Skeleton className="mt-4 h-4 w-1/3" />
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
      <OrderSummary />
    </div>
  )
}
