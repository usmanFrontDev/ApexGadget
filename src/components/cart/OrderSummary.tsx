import { useState } from 'react'
import { CartTrustList } from '@/components/cart/CartTrustList'
import { CheckoutButton } from '@/components/cart/CheckoutButton'
import { DiscountCodeField } from '@/components/cart/DiscountCodeField'
import { PaymentMethods } from '@/components/cart/PaymentMethods'
import { TagIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { CollapsibleRow } from '@/components/ui/CollapsibleRow'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { ROUTES } from '@/constants/routes'
import {
  ButtonSize,
  ButtonVariant,
  GlassCardVariant,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { useApplyDiscount, useRemoveDiscount } from '@/hooks/useCartMutations'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { getCartTotals } from '@/lib/cartTotals'
import { formatItemCount } from '@/lib/cartView'
import { formatPrice } from '@/lib/format'
import { SHOP_CURRENCY_CODE } from '@/constants/shop'
import type { Cart } from '@/types/cart.types'

export interface OrderSummaryProps {
  /** `undefined` = loading: zero amounts, disabled controls (the skeleton state of the design). */
  cart?: Cart
  className?: string
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <Typography as="dt" variant={strong ? TypographyVariant.Subtitle : TypographyVariant.Body} tone={strong ? TypographyTone.Default : TypographyTone.Soft} className={strong ? undefined : 'font-sans'}>
        {label}
      </Typography>
      <Typography as="dd" variant={strong ? TypographyVariant.Price : TypographyVariant.Body} className={cn('text-right', !strong && 'font-sans font-semibold')}>
        {value}
      </Typography>
    </div>
  )
}

/**
 * Order Summary card: subtotal, discount, shipping (never estimated), total, Checkout, Continue shopping, discount
 * code, accepted payments and trust rows. Sold lines are not counted (`getCartTotals`).
 */
export function OrderSummary({ cart, className }: OrderSummaryProps) {
  const applyDiscount = useApplyDiscount()
  const removeDiscount = useRemoveDiscount()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [userOpen, setUserOpen] = useState<boolean | null>(null)

  const totals = cart ? getCartTotals(cart) : undefined
  const currency = totals?.currencyCode ?? SHOP_CURRENCY_CODE
  const money = (amount: number) => formatPrice(amount, currency)
  const appliedCode = cart?.discountCodes.find((item) => item.applicable)?.code
  const rejected = applyDiscount.isError
  // Below lg the discount row is collapsed until a code is applied or rejected (the shopper can still toggle it).
  const discountOpen = userOpen ?? (Boolean(appliedCode) || rejected)

  const field = (
    <DiscountCodeField
      appliedCode={appliedCode}
      rejected={rejected}
      pending={applyDiscount.isPending || removeDiscount.isPending}
      disabled={!cart}
      onApply={(code) => applyDiscount.mutate(code)}
      onRemove={() => {
        applyDiscount.reset()
        removeDiscount.mutate()
      }}
    />
  )

  return (
    <GlassCard variant={GlassCardVariant.Soft} className={cn('rounded-[24px] p-5 sm:p-6', className)} data-order-summary="">
      <Typography as="h2" variant={TypographyVariant.Subtitle} align={TypographyAlign.CenterBelowLg}>
        {CART_CONTENT.summary.title}
      </Typography>

      <dl className="mt-5 flex flex-col gap-3.5" aria-busy={!cart || undefined}>
        <SummaryRow
          label={CART_CONTENT.summary.subtotal.replace('{count}', formatItemCount(totals?.itemCount ?? 0))}
          value={money(totals?.subtotal ?? 0)}
        />
        {totals && cart?.discount && totals.discountAmount > 0 && (
          <SummaryRow
            label={CART_CONTENT.summary.discount.replace('{code}', cart.discount.code)}
            value={`−${money(totals.discountAmount)}`}
          />
        )}
        <SummaryRow label={CART_CONTENT.summary.shipping} value={CART_CONTENT.summary.shippingValue} />
        <div className="mt-1 border-t border-ink/8 pt-4">
          <SummaryRow label={CART_CONTENT.summary.total} value={money(totals?.total ?? 0)} strong />
        </div>
      </dl>

      <div className="mt-5">
        {isDesktop ? (
          field
        ) : (
          <CollapsibleRow label={CART_CONTENT.discount.toggle} icon={<TagIcon width={18} height={18} />} open={discountOpen} onOpenChange={setUserOpen}>
            {field}
          </CollapsibleRow>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <CheckoutButton cart={cart} />
        <Button to={ROUTES.shop} variant={ButtonVariant.Secondary} size={ButtonSize.Lg} block>
          {CART_CONTENT.summary.continueShopping}
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <PaymentMethods />
        <CartTrustList />
      </div>
    </GlassCard>
  )
}
