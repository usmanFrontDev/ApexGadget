import type { ReactNode } from 'react'
import { RichText } from '@/components/common/RichText'
import { GlassCard } from '@/components/ui/GlassCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Typography } from '@/components/ui/Typography'
import { SUPPORT_CONTENT, SupportSectionId } from '@/constants/support'
import { GlassCardVariant, TypographyAlign, TypographyVariant } from '@/constants/ui'
import { useShopPolicies } from '@/hooks/useShopPolicies'
import { useWarranty } from '@/hooks/useSupportContent'

function PolicyCard({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <GlassCard variant={GlassCardVariant.Soft} className="rounded-[24px] p-5 sm:p-6">
        <Typography as="h2" id={`${id}-title`} variant={TypographyVariant.Title} align={TypographyAlign.CenterBelowLg}>
          {title}
        </Typography>
        <div className="mt-4">{children}</div>
      </GlassCard>
    </section>
  )
}

const PolicySkeleton = () => (
  <div aria-hidden="true" className="flex flex-col gap-2.5">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
)

/** "Shipping & returns" (the shop's Shopify policies) and "Warranty" (the Shopify page). */
export function SupportPoliciesSection() {
  const policies = useShopPolicies()
  const warranty = useWarranty()
  const { shipping, warranty: warrantyCopy } = SUPPORT_CONTENT

  return (
    <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-2 lg:items-start lg:gap-6">
      <PolicyCard id={SupportSectionId.Shipping} title={shipping.title}>
        {policies.isPending ? (
          <PolicySkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            <RichText html={policies.data?.shippingHtml} empty={shipping.empty} />
            {policies.data?.refundHtml && <RichText html={policies.data.refundHtml} empty="" />}
          </div>
        )}
      </PolicyCard>
      <PolicyCard id={SupportSectionId.Warranty} title={warrantyCopy.title}>
        {warranty.isPending ? <PolicySkeleton /> : <RichText html={warranty.data} empty={warrantyCopy.empty} />}
      </PolicyCard>
    </div>
  )
}
