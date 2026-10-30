import { Link } from 'react-router-dom'
import { ArrowUpRightIcon, TrashIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { WISHLIST_CONTENT } from '@/constants/wishlist'
import {
  ButtonSize,
  ButtonVariant,
  ChipSize,
  ChipVariant,
  GlassCardVariant,
  IconAnimation,
  IconPosition,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { cn } from '@/lib/cn'
import { labelFor } from '@/lib/filterLabels'
import { formatPrice } from '@/lib/format'
import { getCardMetaParts } from '@/lib/productView'
import type { ProductSummary } from '@/types/product.types'

export interface WishlistRowProps {
  product: ProductSummary
  onRemove: () => void
}

/**
 * A saved product as a list row: picture, details, and a right column with the price over the two buttons (stacked on phones).
 * Everything in the row is a saved item, so there is no heart: "Remove" takes it out.
 */
export function WishlistRow({ product, onRemove }: WishlistRowProps) {
  const { title, subtitle, priceAmount, currencyCode, image, grade, to, availableForSale } = product
  const soldOut = availableForSale === false
  const meta = getCardMetaParts(product)

  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Soft}
      className="group grid grid-cols-[92px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 rounded-[18px] p-3 sm:grid-cols-[132px_minmax(0,1fr)_auto] sm:gap-x-6 sm:p-4"
    >
      <Link
        to={to}
        aria-label={title}
        tabIndex={-1}
        className="relative block aspect-square overflow-hidden rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {image ? (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_closest-side,rgb(200_32_40/0.15),transparent_96%)]"
            />
            <img
              src={image}
              alt=""
              loading="lazy"
              className={cn('relative size-full object-contain p-2 sm:p-3', soldOut && 'opacity-50 grayscale')}
            />
          </>
        ) : (
          <span className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#e9e9eb_0_7px,#f1f1f3_7px_13px)]" />
        )}
      </Link>

      <div className="min-w-0">
        {(soldOut || grade) && (
          <Chip size={ChipSize.Xs} variant={ChipVariant.Tint} className="mb-1.5 h-6 text-[11px]">
            {soldOut ? 'Sold out' : labelFor(grade)}
          </Chip>
        )}
        <Typography variant={TypographyVariant.CardTitle} className="line-clamp-2">
          <Link
            to={to}
            className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {title}
          </Link>
        </Typography>
        <Typography variant={TypographyVariant.BodySm} tone={TypographyTone.Muted} className="mt-0.5 line-clamp-1">
          {[subtitle, ...meta].filter(Boolean).join(' · ')}
        </Typography>
        {/* phones: the price sits under the details */}
        <Typography variant={TypographyVariant.Price} className="mt-2 sm:hidden">
          {formatPrice(priceAmount, currencyCode)}
        </Typography>
      </div>

      {/* sm+: price on top, the two buttons under it (a narrow right column leaves the room to the details). */}
      <div className="col-span-2 flex flex-col gap-3 sm:col-span-1 sm:items-end">
        <Typography variant={TypographyVariant.Price} className="hidden whitespace-nowrap sm:block">
          {formatPrice(priceAmount, currencyCode)}
        </Typography>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
        <Button
          to={to}
          size={ButtonSize.Xs}
          icon={<ArrowUpRightIcon width={12} height={12} />}
          iconAnimation={IconAnimation.PointRight}
          className="shadow-primary-soft"
        >
          {WISHLIST_CONTENT.viewDetails}
        </Button>
        <Button
          type="button"
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Xs}
          icon={<TrashIcon width={14} height={14} />}
          iconPosition={IconPosition.Start}
          onClick={onRemove}
          aria-label={`Remove ${title} from favorites`}
        >
          {WISHLIST_CONTENT.remove}
        </Button>
        </div>
      </div>
    </GlassCard>
  )
}
