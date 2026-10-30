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
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { cn } from '@/lib/cn'
import { labelFor } from '@/lib/filterLabels'
import { formatPrice } from '@/lib/format'
import type { ProductSummary } from '@/types/product.types'

export interface ShopProductCardProps {
  product: ProductSummary
}

/** "PTA Approved · Battery 96%" */
function getMetaParts(product: ProductSummary) {
  const parts: string[] = []
  if (product.ptaStatus) parts.push(labelFor(product.ptaStatus))
  if (product.batteryHealth !== undefined) parts.push(`Battery ${product.batteryHealth}%`)
  if (parts.length === 0 && product.grade) parts.push('Original', labelFor(product.grade))
  return parts
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  const { title, subtitle, priceAmount, currencyCode, image, grade, to, availableForSale } = product
  const soldOut = availableForSale === false
  const meta = getMetaParts(product)

  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Soft}
      className="group flex h-full flex-col rounded-[18px] p-[15px]"
    >
      <div className="relative h-[170px] overflow-hidden rounded-[16px]">
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
          <span className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#e9e9eb_0_7px,#f1f1f3_7px_13px)]" />
        )}

        {(soldOut || grade) && (
          <Chip
            size={ChipSize.Xs}
            variant={ChipVariant.Tint}
            className="absolute left-1 top-1 h-6 text-[11px]"
          >
            {soldOut ? 'Sold out' : grade ? labelFor(grade) : null}
          </Chip>
        )}

        <IconButton
          label={`Add ${title} to wishlist`}
          size={IconButtonSize.Sm}
          className="absolute right-0 top-0 bg-transparent shadow-none hover:bg-ink/5"
        >
          <HeartIcon width={16} height={16} />
        </IconButton>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3.5">
        <Typography variant={TypographyVariant.CardTitle} className="line-clamp-2">
          {title}
        </Typography>
        <Typography
          variant={TypographyVariant.BodySm}
          tone={TypographyTone.Muted}
          className="mt-1 line-clamp-1"
        >
          {subtitle}
        </Typography>
        {meta.length > 0 && (
          <Typography
            variant={TypographyVariant.Caption}
            tone={TypographyTone.Muted}
            className="mt-2.5 line-clamp-1"
          >
            {meta.join(' · ')}
          </Typography>
        )}
        <Typography variant={TypographyVariant.Price} className="mt-auto pt-3">
          {formatPrice(priceAmount, currencyCode)}
        </Typography>
      </div>

      <Button
        to={to}
        size={ButtonSize.Xs}
        fullWidth
        icon={<ArrowUpRightIcon width={12} height={12} />}
        iconAnimation={IconAnimation.PointRight}
        className="mt-3 shadow-primary-soft"
      >
        View details
      </Button>
    </GlassCard>
  )
}
