import { ArrowUpRightIcon, HeartIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconButton } from '@/components/ui/IconButton'
import { Typography } from '@/components/ui/Typography'
import {
  ButtonSize,
  ChipSize,
  ChipVariant,
  GlassCardVariant,
  IconAnimation,
  IconButtonSize,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import type { ProductSummary } from '@/types/product.types'

export interface ProductCardProps {
  product: ProductSummary
}

export function ProductCard({ product }: ProductCardProps) {
  const { title, subtitle, priceAmount, currencyCode, image, badge, to, availableForSale } = product
  const soldOut = availableForSale === false

  return (
    <GlassCard as="article" variant={GlassCardVariant.Soft} className="group flex h-full flex-col p-3 sm:p-[15px]">
      <div
        className={cn(
          'relative h-[210px] overflow-hidden rounded-[18px] sm:h-[170px] sm:rounded-[16px]',
          // Real image: no panel, just the soft glow. Placeholder: striped box.
          !image &&
            'bg-[repeating-linear-gradient(135deg,#e9e9eb_0_7px,#f1f1f3_7px_13px)] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.92)]',
        )}
      >
        {image ? (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_closest-side,rgb(200_32_40/0.15),transparent_96%)]"
            />
            <img
              src={image}
              alt={title}
              loading="lazy"
              className={cn(
                'relative size-full object-contain px-4 pb-2 pt-8 transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                soldOut && 'opacity-50 grayscale',
              )}
            />
          </>
        ) : (
          <span className="absolute inset-0 grid place-items-center px-4 text-center text-[10.3px] uppercase tracking-[0.6px] text-ink/66">
            {title} — product shot
          </span>
        )}

        {(soldOut || badge) && (
          <Chip
            size={ChipSize.Xs}
            variant={ChipVariant.Dark}
            className="absolute left-3 top-3 max-w-[calc(100%-4.5rem)]"
          >
            {soldOut ? 'Sold out' : badge?.label}
          </Chip>
        )}

        <IconButton
          label={`Add ${title} to wishlist`}
          size={IconButtonSize.Sm}
          className="absolute right-2.5 top-2.5 backdrop-blur-sm shadow-[0_4px_12px_rgb(20_20_22/0.07),inset_0_0_0_1px_rgb(20_20_22/0.09)]"
        >
          <HeartIcon width={15} height={15} />
        </IconButton>
      </div>

      <div className="flex flex-1 flex-col items-center px-1 pt-4 sm:items-stretch">
        <Typography
          variant={TypographyVariant.CardTitle}
          align={TypographyAlign.CenterBelowSm}
          className="line-clamp-2"
        >
          {title}
        </Typography>
        <Typography
          variant={TypographyVariant.BodySm}
          tone={TypographyTone.Soft}
          align={TypographyAlign.CenterBelowSm}
          className="mt-1.5 line-clamp-2"
        >
          {subtitle}
        </Typography>
        <Typography
          variant={TypographyVariant.Price}
          align={TypographyAlign.CenterBelowSm}
          className="mt-auto pt-3"
        >
          {formatPrice(priceAmount, currencyCode)}
        </Typography>
      </div>

      <Button
        to={to}
        size={ButtonSize.Sm}
        fullWidth
        icon={<ArrowUpRightIcon width={13} height={13} />}
        iconAnimation={IconAnimation.PointRight}
        blockOnMobile
        className="mt-4 shadow-primary-soft"
      >
        View details
      </Button>
    </GlassCard>
  )
}
