import { Link } from 'react-router-dom'
import { CartLinePrice } from '@/components/cart/CartLinePrice'
import { TrashIcon } from '@/components/icons'
import { WishlistButton } from '@/components/common/WishlistButton'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { Notice } from '@/components/ui/Notice'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { productPath } from '@/constants/routes'
import {
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
import { getAvailabilityText, getCartLineMeta, getLineMaxQuantity, isSingleUnit } from '@/lib/cartView'
import type { CartLine } from '@/types/cart.types'

export interface CartLineCardProps {
  line: CartLine
  /** A request for this line is running: spinner, controls disabled. */
  pending?: boolean
  onRemove: (line: CartLine) => void
  onQuantityChange: (line: CartLine, quantity: number) => void
}

/** One line of the cart page: picture, details, price and actions. A sold line shows the red notice and stays removable. */
export function CartLineCard({ line, pending = false, onRemove, onQuantityChange }: CartLineCardProps) {
  const { productTitle, productHandle, availableForSale } = line
  const to = productPath(productHandle)
  const meta = getCartLineMeta(line)
  const availability = getAvailabilityText(line)
  const showStepper = availableForSale && !isSingleUnit(line)

  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Soft}
      aria-busy={pending || undefined}
      className={cn('rounded-[24px] p-4 transition-opacity sm:p-5', pending && 'opacity-70')}
    >
      <div className="flex gap-4 sm:gap-5">
        <div className="flex shrink-0 flex-col gap-3">
          <Link
            to={to}
            tabIndex={-1}
            aria-hidden="true"
            className="block size-[88px] overflow-clip rounded-[20px] bg-canvas sm:size-[112px] lg:size-[132px]"
          >
            {line.image ? (
              <img
                src={line.image}
                alt=""
                loading="lazy"
                className={cn('size-full object-contain p-2', !availableForSale && 'opacity-50 grayscale')}
              />
            ) : (
              <span className="block size-full bg-[repeating-linear-gradient(135deg,#e9e9eb_0_7px,#f1f1f3_7px_13px)]" />
            )}
          </Link>
          <CartLinePrice line={line} className="sm:hidden" />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 pr-9 sm:pr-0">
              {line.grade && (
                <Chip size={ChipSize.Xs} variant={ChipVariant.Tint}>
                  {labelFor(line.grade)}
                </Chip>
              )}
              <Typography as="h3" variant={TypographyVariant.Subtitle} className="mt-2 line-clamp-2">
                <Link
                  to={to}
                  className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Soft} className="mt-1.5 line-clamp-1">
                  {meta}
                </Typography>
              )}
            </div>
            <CartLinePrice line={line} className="hidden shrink-0 items-end text-right sm:flex" />
          </div>

          {/* Bottom row: availability / stepper on the left, the two buttons on the right (under the price). */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-3 pt-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {availableForSale ? (
              availability && !showStepper && (
                <Chip size={ChipSize.Xs}>{availability}</Chip>
              )
            ) : (
              <Chip size={ChipSize.Xs} variant={ChipVariant.Solid}>
                {CART_CONTENT.line.sold}
              </Chip>
            )}
            {showStepper && (
              <>
                <QuantityStepper
                  size={QuantityStepperSize.Sm}
                  value={line.quantity}
                  max={getLineMaxQuantity(line)}
                  label={`${CART_CONTENT.line.quantityOf} ${productTitle}`}
                  disabled={pending}
                  onChange={(quantity) => onQuantityChange(line, quantity)}
                />
                {availability && (
                  <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted}>
                    {availability}
                  </Typography>
                )}
              </>
            )}
            {pending && (
              <span role="status" className="inline-flex items-center">
                <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none" />
                <span className="sr-only">{CART_CONTENT.line.updating}</span>
              </span>
            )}
          </div>

          {/* Same buttons as the wishlist and the product page. */}
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto sm:justify-end">
            <Button
              type="button"
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Xs}
              icon={<TrashIcon width={14} height={14} />}
              iconPosition={IconPosition.Start}
              disabled={pending}
              onClick={() => onRemove(line)}
              aria-label={CART_CONTENT.line.removeLabel.replace('{title}', productTitle)}
            >
              {CART_CONTENT.line.remove}
            </Button>
            <WishlistButton
              handle={productHandle}
              title={productTitle}
              label={{ add: CART_CONTENT.line.save, saved: CART_CONTENT.line.saved }}
              buttonSize={ButtonSize.Xs}
            />
          </div>
          </div>

          {/* Second control for the same favorites toggle (the design's heart, top right on phones). */}
          <WishlistButton handle={productHandle} title={productTitle} className="absolute right-0 top-0 sm:hidden" />
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
