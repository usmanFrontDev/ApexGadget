import { Link } from 'react-router-dom'
import { Chip } from '@/components/ui/Chip'
import { Notice } from '@/components/ui/Notice'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { productPath } from '@/constants/routes'
import { ChipSize, ChipVariant, NoticeVariant, QuantityStepperSize, TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'
import { getLineMaxQuantity, isSingleUnit } from '@/lib/cartView'
import { formatPrice } from '@/lib/format'
import type { CartLine } from '@/types/cart.types'

export interface CartDrawerLineProps {
  line: CartLine
  pending?: boolean
  onQuantityChange: (line: CartLine, quantity: number) => void
  /** Navigating to the product closes the drawer. */
  onNavigate: () => void
}

/** Compact line of the mini-cart: thumbnail, title, subtitle, price and a quantity box (a plain "1" for single units). */
export function CartDrawerLine({ line, pending = false, onQuantityChange, onNavigate }: CartDrawerLineProps) {
  const { availableForSale } = line
  const to = productPath(line.productHandle)
  return (
    <article aria-busy={pending || undefined} className={cn('flex flex-col gap-3', pending && 'opacity-70')}>
      <div className="flex gap-3">
        <Link to={to} onClick={onNavigate} tabIndex={-1} aria-hidden="true" className="block size-[64px] shrink-0 overflow-clip rounded-[16px] bg-canvas">
          {line.image && (
            <img src={line.image} alt="" loading="lazy" className={cn('size-full object-contain p-1.5', !availableForSale && 'opacity-50 grayscale')} />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Typography as="h3" variant={TypographyVariant.CardTitle} className="line-clamp-2">
            <Link to={to} onClick={onNavigate} className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              {line.productTitle}
            </Link>
          </Typography>
          {line.subtitle && (
            <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="line-clamp-1">
              {line.subtitle}
            </Typography>
          )}
          <Typography variant={TypographyVariant.BodySm} tone={availableForSale ? TypographyTone.Default : TypographyTone.Muted} className="mt-1 font-sans font-bold">
            {formatPrice(line.total.amount, line.total.currencyCode)}
          </Typography>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {!availableForSale ? (
            <Chip size={ChipSize.Xs} variant={ChipVariant.Solid}>
              {CART_CONTENT.line.sold}
            </Chip>
          ) : isSingleUnit(line) ? (
            <span
              role="img"
              aria-label={`${CART_CONTENT.line.quantityOf} ${line.productTitle}: ${line.quantity}`}
              className="grid size-9 place-items-center rounded-[12px] bg-white text-[13px] font-bold tabular-nums shadow-ring"
            >
              {line.quantity}
            </span>
          ) : (
            <QuantityStepper
              size={QuantityStepperSize.Sm}
              value={line.quantity}
              max={getLineMaxQuantity(line)}
              label={`${CART_CONTENT.line.quantityOf} ${line.productTitle}`}
              disabled={pending}
              onChange={(quantity) => onQuantityChange(line, quantity)}
            />
          )}
        </div>
      </div>
      {!availableForSale && (
        <Notice variant={NoticeVariant.Unavailable} title={CART_CONTENT.unavailable.title} description={CART_CONTENT.unavailable.text} compact />
      )}
    </article>
  )
}
