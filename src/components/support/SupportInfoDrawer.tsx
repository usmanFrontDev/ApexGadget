import { RichText } from '@/components/common/RichText'
import { Drawer } from '@/components/ui/Drawer'
import { Skeleton } from '@/components/ui/Skeleton'
import { Typography } from '@/components/ui/Typography'
import { ACCEPTED_PAYMENTS } from '@/constants/cart'
import { SUPPORT_CONTENT, SupportSectionId, type SupportPanelId } from '@/constants/support'
import { TypographyTone, TypographyVariant } from '@/constants/ui'
import { useShopPolicies } from '@/hooks/useShopPolicies'
import { useWarranty } from '@/hooks/useSupportContent'

export interface SupportInfoDrawerProps {
  /** Which card's full text is open (`null` = closed). */
  panel: SupportPanelId | null
  onClose: () => void
}

const Loading = () => (
  <div aria-hidden="true" className="flex flex-col gap-2.5">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
)

/** The full text behind a card: shipping + returns policies, warranty, or the payment methods. */
export function SupportInfoDrawer({ panel, onClose }: SupportInfoDrawerProps) {
  const policies = useShopPolicies()
  const warranty = useWarranty()
  const { cards } = SUPPORT_CONTENT
  // Keep the last panel's title while the drawer slides out.
  const current = panel ?? SupportSectionId.Shipping

  let body
  if (current === SupportSectionId.Shipping) {
    body = policies.isPending ? (
      <Loading />
    ) : (
      <div className="flex flex-col gap-4">
        <RichText html={policies.data?.shippingHtml} empty={cards.shipping.empty} />
        {policies.data?.refundHtml && <RichText html={policies.data.refundHtml} empty="" />}
      </div>
    )
  } else if (current === SupportSectionId.Warranty) {
    body = warranty.isPending ? <Loading /> : <RichText html={warranty.data} empty={cards.warranty.empty} />
  } else {
    body = (
      <div>
        <ul className="flex flex-col gap-2">
          {ACCEPTED_PAYMENTS.map((method) => (
            <li key={method.id} className="rounded-[14px] bg-white px-4 py-3 text-[13.5px] font-semibold shadow-ring">
              {method.label}
            </li>
          ))}
        </ul>
        <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-4">
          {cards.payments.note}
        </Typography>
      </div>
    )
  }

  return (
    <Drawer open={panel !== null} onClose={onClose} title={cards[current].title}>
      {body}
    </Drawer>
  )
}
