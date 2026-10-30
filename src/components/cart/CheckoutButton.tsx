import { useId } from 'react'
import { ArrowUpRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { ButtonSize, IconAnimation, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { useCheckout } from '@/hooks/useCheckout'
import { useIsCartBusy } from '@/hooks/useCartMutations'
import { cn } from '@/lib/cn'
import { getCartTotals } from '@/lib/cartTotals'
import type { Cart } from '@/types/cart.types'

export interface CheckoutButtonProps {
  /** `undefined` while the cart loads: grey and disabled. */
  cart?: Cart
  size?: ButtonSize
  /** Shows the "Remove unavailable items to continue" line under the button when it is the reason. */
  showReason?: boolean
  className?: string
}

/**
 * The one Checkout button (page, sticky bar, mini-cart). Blocked while loading, while a cart request runs, with no
 * available line, and while ANY unavailable line is in the cart. Blocked = `aria-disabled` (still focusable) + a visible reason.
 */
export function CheckoutButton({ cart, size = ButtonSize.Lg, showReason = true, className }: CheckoutButtonProps) {
  const checkout = useCheckout()
  const busy = useIsCartBusy()
  const reasonId = useId()
  const totals = cart ? getCartTotals(cart) : undefined
  const blocked = !totals || !totals.canCheckout || busy || checkout.isPending
  const reason = showReason && totals?.hasUnavailable ? CART_CONTENT.checkoutReason.unavailable : undefined

  return (
    <div className={cn('flex flex-col', className)}>
      <Button
        size={size}
        icon={<ArrowUpRightIcon />}
        iconAnimation={IconAnimation.PointRight}
        aria-disabled={blocked}
        aria-describedby={reason ? reasonId : undefined}
        onClick={() => {
          if (!blocked) checkout.mutate()
        }}
        block
        className={cn('active:scale-none', !cart && 'bg-ink/12 text-ink/50 shadow-none')}
      >
        {CART_CONTENT.summary.checkout}
      </Button>
      {reason && (
        <Typography
          id={reasonId}
          variant={TypographyVariant.Caption}
          tone={TypographyTone.Muted}
          align={TypographyAlign.Center}
          className="mt-2"
        >
          {reason}
        </Typography>
      )}
    </div>
  )
}
