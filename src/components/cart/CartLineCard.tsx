import { Link } from 'react-router-dom'
import { CartLinePrice } from '@/components/cart/CartLinePrice'
import { CartQuantityControl } from '@/components/cart/CartQuantityControl'
import { TrashIcon } from '@/components/icons'
import { WishlistButton } from '@/components/common/WishlistButton'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { Notice } from '@/components/ui/Notice'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { productPath } from '@/constants/routes'
import {
  BUTTON_ICON_PX,
  ButtonSize,
  ButtonVariant,
  ChipSize,
  ChipVariant,
  GlassCardVariant,
  IconPosition,
  NoticeVariant,
  QuantityStepperSize,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { cn } from '@/lib/cn'
import { labelFor } from '@/lib/filterLabels'
import { getAvailabilityText, getCartLineMeta } from '@/lib/cartView'
import type { CartLine } from '@/types/cart.types'

export interface CartLineCardProps {
  line: CartLine
  /** A request for this line is running: spinner, controls disabled. */
  pending?: boolean
  onRemove: (line: CartLine) => void
}

/** One line of the cart page: picture, details, price and actions. A sold line shows the red notice and stays removable. */
export function CartLineCard({ line, pending = false, onRemove }: CartLineCardProps) {
  const { productTitle, productHandle, availableForSale } = line
  const to = productPath(productHandle)
  const meta = getCartLineMeta(line)
  const availability = getAvailabilityText(line)

  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Soft}
      aria-busy={pending || undefined}
      className={cn('relative rounded-[24px] p-4 transition-opacity sm:p-5', pending && 'opacity-70')}
    >
      {/* Phones: picture left, details right, controls under both; the whole card opens the product page (stretched title link) and only "Remove" is offered. From sm: picture left, details and controls (with Save) right. */}
      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-4 gap-y-4 sm:grid-cols-[128px_minmax(0,1fr)] sm:grid-rows-[auto_1fr] sm:gap-x-5 lg:grid-cols-[160px_minmax(0,1fr)]">
        <div className="self-start sm:row-span-2">
          <Link
            to={to}
            tabIndex={-1}
            aria-hidden="true"
            className="block aspect-square w-full overflow-clip rounded-[20px] bg-canvas"
          >
            {line.image ? (
              <img
                src={line.image}
                alt=""
                loading="lazy"
                className={cn('size-full object-contain p-2.5', !availableForSale && 'opacity-50 grayscale')}
              />
            ) : (
              <span className="block size-full bg-[repeating-linear-gradient(135deg,var(--color-placeholder-a)_0_7px,var(--color-placeholder-b)_7px_13px)]" />
            )}
          </Link>
        </div>

        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            {line.grade && (
              <Chip size={ChipSize.Xs} variant={ChipVariant.Tint}>
                {labelFor(line.grade)}
              </Chip>
            )}
            <Typography as="h3" variant={TypographyVariant.Subtitle} className="mt-2 line-clamp-2">
              <Link
                to={to}
                className="rounded-sm after:absolute after:inset-0 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {productTitle}
              </Link>
            </Typography>
            {line.subtitle && (
              <Typography variant={TypographyVariant.BodySm} tone={TypographyTone.Muted} className="mt-1 line-clamp-1">
                {line.subtitle}
              </Typography>
            )}
            {meta && (
              <Typography
                variant={TypographyVariant.Caption}
                tone={TypographyTone.Soft}
                className="mt-1.5 line-clamp-2 sm:line-clamp-1"
              >
                {meta}
              </Typography>
            )}
            {/* phones: the price sits under the details (the picture column is too narrow for it) */}
            <CartLinePrice line={line} className="mt-2.5 sm:hidden" />
          </div>
          <CartLinePrice line={line} className="hidden shrink-0 items-end text-right sm:flex" />
        </div>

        {/* Controls (above the card link): phones = quantity, then Remove; from sm one row, buttons right under the price. */}
        <div className="relative z-10 col-span-2 flex flex-col gap-3 sm:col-span-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-3 sm:self-end">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-start">
            {availableForSale ? (
              <>
                <CartQuantityControl line={line} size={QuantityStepperSize.Sm} />
                {availability && (
                  <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted}>
                    {availability}
                  </Typography>
                )}
              </>
            ) : (
              <Chip size={ChipSize.Xs} variant={ChipVariant.Solid}>
                {CART_CONTENT.line.sold}
              </Chip>
            )}
            {pending && (
              <span role="status" className="inline-flex items-center">
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none"
                />
                <span className="sr-only">{CART_CONTENT.line.updating}</span>
              </span>
            )}
          </div>

          {/* Same buttons as the wishlist and the product page. */}
          <div className="flex flex-col gap-2.5 sm:ml-auto sm:flex-row sm:items-center sm:justify-end sm:gap-2">
            <Button
              type="button"
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Xs}
              icon={<TrashIcon width={BUTTON_ICON_PX} height={BUTTON_ICON_PX} />}
              iconPosition={IconPosition.Start}
              blockOnMobile
              className="max-sm:w-full"
              disabled={pending}
              onClick={() => onRemove(line)}
              aria-label={CART_CONTENT.line.removeLabel.replace('{title}', productTitle)}
            >
              {CART_CONTENT.line.remove}
            </Button>
            <WishlistButton
              handle={productHandle}
              title={productTitle}
              label={{
                add: CART_CONTENT.line.save,
                saved: CART_CONTENT.line.saved,
              }}
              buttonSize={ButtonSize.Xs}
              className="max-sm:hidden"
            />
          </div>
        </div>
      </div>

      {!availableForSale && (
        <Notice
          variant={NoticeVariant.Unavailable}
          title={CART_CONTENT.unavailable.title}
          description={CART_CONTENT.unavailable.text}
          className="mt-4"
        />
      )}
    </GlassCard>
  )
}
