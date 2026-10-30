import { Link } from 'react-router-dom'
import { CartQuantityControl } from '@/components/cart/CartQuantityControl'
import { TrashIcon } from '@/components/icons'
import { Chip } from '@/components/ui/Chip'
import { IconButton } from '@/components/ui/IconButton'
import { Notice } from '@/components/ui/Notice'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { productPath } from '@/constants/routes'
import { ChipSize, ChipVariant, IconButtonSize, NoticeVariant, QuantityStepperSize, TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import type { CartLine } from '@/types/cart.types'

export interface CartDrawerLineProps {
  line: CartLine
  pending?: boolean
  onRemove: (line: CartLine) => void
  /** Navigating to the product closes the drawer. */
  onNavigate: () => void
}

/**
 * Compact line of the mini-cart: thumbnail, title, subtitle, price and the shared quantity control (trash at 1 = remove).
 * A sold line has the "Sold" chip, a remove button and the compact notice.
 */
export function CartDrawerLine({ line, pending = false, onRemove, onNavigate }: CartDrawerLineProps) {
  const { availableForSale } = line
  const to = productPath(line.productHandle)
  return (
    <article aria-busy={pending || undefined} className={cn('flex flex-col gap-3', pending && 'opacity-70')}>
      <div className="flex gap-3">
        <Link to={to} onClick={onNavigate} tabIndex={-1} aria-hidden="true" className="block size-[72px] shrink-0 overflow-clip rounded-[16px] bg-canvas">
          {line.image && (
            <img src={line.image} alt="" loading="lazy" className={cn('size-full object-contain p-1.5', !availableForSale && 'opacity-50 grayscale')} />
          )}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
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
          <div className="mt-2.5 flex items-center gap-2">
            {availableForSale ? (
              <CartQuantityControl line={line} size={QuantityStepperSize.Sm} removable />
            ) : (
              <>
                <Chip size={ChipSize.Xs} variant={ChipVariant.Solid}>
                  {CART_CONTENT.line.sold}
                </Chip>
                <IconButton
                  label={CART_CONTENT.line.removeLabel.replace('{title}', line.productTitle)}
                  size={IconButtonSize.Md}
                  disabled={pending}
                  onClick={() => onRemove(line)}
                >
                  <TrashIcon width={15} height={15} />
                </IconButton>
              </>
            )}
          </div>
        </div>
      </div>
      {!availableForSale && (
        <Notice variant={NoticeVariant.Unavailable} title={CART_CONTENT.unavailable.title} description={CART_CONTENT.unavailable.text} compact />
      )}
    </article>
  )
}
