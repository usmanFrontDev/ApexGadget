import { Link } from 'react-router-dom'
import { ArrowUpRightIcon } from '@/components/icons'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconCircle } from '@/components/ui/IconCircle'
import { Skeleton } from '@/components/ui/Skeleton'
import { Typography } from '@/components/ui/Typography'
import {
  GlassCardVariant,
  IconAnimation,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import type { CategoryItem } from '@/types/home.types'

export interface CategoryCardProps {
  category: CategoryItem
  /** The count is still loading: show a placeholder line so the card doesn't jump. */
  countPending?: boolean
}

export function CategoryCard({ category, countPending = false }: CategoryCardProps) {
  const { name, productCount, image, to } = category

  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Soft}
      data-hover-scope=""
      className="group h-full px-3 pb-4 pt-2.5 transition-transform sm:px-[21px] sm:pb-[21px] sm:pt-3 duration-300 hover:-translate-y-1"
    >
      <div className="relative flex h-[116px] items-center justify-center sm:h-[136px]">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.15),transparent_96%)]"
        />
        <img
          src={image}
          alt=""
          loading="lazy"
          width={120}
          height={120}
          className="relative size-[100px] object-contain sm:size-[120px]"
        />
      </div>

      <div className="mt-3 min-w-0 sm:mt-4 sm:pr-[50px]">
        <Typography
          variant={TypographyVariant.CardTitle}
          align={TypographyAlign.CenterBelowSm}
          className="truncate"
        >
          {/* Stretched link: the whole card is clickable */}
          <Link
            to={to}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-[inherit] focus-visible:after:outline-2 focus-visible:after:outline-primary"
          >
            {name}
          </Link>
        </Typography>
        {productCount !== undefined ? (
          <Typography
            variant={TypographyVariant.Caption}
            tone={TypographyTone.Soft}
            align={TypographyAlign.CenterBelowSm}
            className="mt-1 truncate"
          >
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </Typography>
        ) : (
          countPending && <Skeleton className="mx-auto mt-1.5 h-3 w-16 sm:mx-0" />
        )}
      </div>

      <IconCircle
        iconAnimation={IconAnimation.PointRight}
        className="absolute bottom-[21px] right-[21px] transition group-hover:bg-white max-sm:hidden"
      >
        <ArrowUpRightIcon width={13} height={13} />
      </IconCircle>
    </GlassCard>
  )
}
