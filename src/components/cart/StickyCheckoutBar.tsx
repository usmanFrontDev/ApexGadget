import { AnimatePresence, motion } from 'framer-motion'
import { CheckoutButton } from '@/components/cart/CheckoutButton'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { ButtonSize, TypographyTone, TypographyVariant } from '@/constants/ui'
import { getCartTotals } from '@/lib/cartTotals'
import { formatItemCount } from '@/lib/cartView'
import { formatPrice } from '@/lib/format'
import type { Cart } from '@/types/cart.types'

export interface StickyCheckoutBarProps {
  cart: Cart
  /** Shown only while the Order Summary card is out of view, so the total is never duplicated. */
  visible: boolean
}

/** Phones and tablets: total over the Checkout button, pinned to the bottom (safe-area aware). */
export function StickyCheckoutBar({ cart, visible }: StickyCheckoutBarProps) {
  const totals = getCartTotals(cart)
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 40 }}
          className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2.5 rounded-t-[24px] bg-surface/92 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-header backdrop-blur-[18px] sm:px-6 lg:hidden"
        >
          <div className="flex min-w-0 items-baseline justify-between gap-3 px-1">
            <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="whitespace-nowrap">
              {CART_CONTENT.summary.totalWithCount.replace('{count}', formatItemCount(totals.itemCount))}
            </Typography>
            <Typography variant={TypographyVariant.Price} className="truncate">
              {formatPrice(totals.total, totals.currencyCode)}
            </Typography>
          </div>
          <CheckoutButton cart={cart} size={ButtonSize.Md} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
