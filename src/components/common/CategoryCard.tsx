import { Link } from 'react-router-dom'
import { ArrowUpRightIcon } from '@/components/icons'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconCircle } from '@/components/ui/IconCircle'
import { GlassCardVariant, IconAnimation } from '@/constants/ui'
import type { CategoryItem } from '@/types/home.types'

export interface CategoryCardProps {
  category: CategoryItem
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { name, productCount, image, to } = category

  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Soft}
      data-hover-scope=""
      className="group h-full px-[21px] pb-[21px] pt-3 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative flex h-[136px] items-center justify-center">
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
          className="relative size-[120px] object-contain"
        />
      </div>

      <div className="mt-4 pr-[50px]">
        <h3 className="truncate text-[15.5px] font-bold leading-[19.5px]">
          {/* Stretched link: the whole card is clickable */}
          <Link
            to={to}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-[inherit] focus-visible:after:outline-2 focus-visible:after:outline-primary"
          >
            {name}
          </Link>
        </h3>
        <p className="mt-[4.5px] truncate font-body text-[12.5px] leading-[18px] text-ink/70">
          {productCount} products
        </p>
      </div>

      <IconCircle
        iconAnimation={IconAnimation.PointRight}
        className="absolute bottom-[21px] right-[21px] transition group-hover:bg-white"
      >
        <ArrowUpRightIcon width={13} height={13} />
      </IconCircle>
    </GlassCard>
  )
}
