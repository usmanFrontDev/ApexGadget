import { ArrowUpRightIcon, HeartIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconButton } from '@/components/ui/IconButton'
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

export interface ProductCardProps {
  product: ProductSummary
}

export function ProductCard({ product }: ProductCardProps) {
  const { title, subtitle, priceAmount, currencyCode, image, badge, to, availableForSale } = product
  const soldOut = availableForSale === false

  return (
    <GlassCard as="article" variant={GlassCardVariant.Soft} className="group flex h-full flex-col p-[15px]">
      <div
        className={cn(
          'relative h-[170px] overflow-hidden rounded-[16px]',
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

      <div className="flex flex-1 flex-col px-1 pt-4">
        <h3 className="line-clamp-2 text-base font-bold leading-[20px]">{title}</h3>
        <p className="mt-[7px] line-clamp-2 font-body text-[13px] leading-[18px] text-ink/70">{subtitle}</p>
        <p className="mt-auto pt-3 text-xl font-extrabold leading-[25px] tracking-[-0.5px]">
          {formatPrice(priceAmount, currencyCode)}
        </p>
      </div>

      <Button
        to={to}
        size={ButtonSize.Sm}
        fullWidth
        icon={<ArrowUpRightIcon width={13} height={13} />}
        iconAnimation={IconAnimation.PointRight}
        className="mt-4 shadow-primary-soft"
      >
        View details
      </Button>
    </GlassCard>
  )
}
