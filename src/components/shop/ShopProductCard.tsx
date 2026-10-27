import { ArrowUpRightIcon, HeartIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconButton } from '@/components/ui/IconButton'
import { CONDITION_LABELS, GRADE_LABELS } from '@/constants/shop'
import {
  ButtonSize,
  ChipSize,
  ChipVariant,
  GlassCardVariant,
  IconAnimation,
  IconButtonSize,
} from '@/constants/ui'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import type { ProductSummary } from '@/types/product.types'

export interface ShopProductCardProps {
  product: ProductSummary
}

/** "PTA Approved · Battery 96%" */
function getMetaParts(product: ProductSummary) {
  const parts: string[] = []
  if (product.condition) parts.push(CONDITION_LABELS[product.condition])
  if (product.batteryHealth !== undefined) parts.push(`Battery ${product.batteryHealth}%`)
  if (parts.length === 0 && product.grade) parts.push('Original', GRADE_LABELS[product.grade])
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
            {soldOut ? 'Sold out' : grade ? GRADE_LABELS[grade] : null}
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
        <h3 className="line-clamp-2 text-[15.5px] font-bold leading-5">{title}</h3>
        <p className="mt-1 line-clamp-1 font-body text-[13px] leading-[18px] text-ink/60">{subtitle}</p>
        {meta.length > 0 && (
          <p className="mt-2.5 line-clamp-1 font-body text-[12.5px] leading-4 text-ink/55">
            {meta.join(' · ')}
          </p>
        )}
        <p className="mt-auto pt-3 text-xl font-extrabold leading-[26px] tracking-[-0.5px]">
          {formatPrice(priceAmount, currencyCode)}
        </p>
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
