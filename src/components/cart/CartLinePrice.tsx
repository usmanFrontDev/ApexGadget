import { Typography } from '@/components/ui/Typography'
import { TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import type { CartLine } from '@/types/cart.types'

export interface CartLinePriceProps {
  line: CartLine
  className?: string
}

/** Line total, with the struck-through original price when the item is discounted. Sold lines lose emphasis. */
export function CartLinePrice({ line, className }: CartLinePriceProps) {
  const { total, compareAtAmount, quantity, availableForSale } = line
  return (
    <div className={cn('flex flex-col', className)}>
      <Typography
        as="p"
        variant={TypographyVariant.Price}
        tone={availableForSale ? TypographyTone.Default : TypographyTone.Muted}
      >
        {formatPrice(total.amount, total.currencyCode)}
      </Typography>
      {compareAtAmount !== undefined && (
        <Typography as="p" variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="line-through">
          <span className="sr-only">Was </span>
          {formatPrice(compareAtAmount * quantity, total.currencyCode)}
        </Typography>
      )}
    </div>
  )
}
