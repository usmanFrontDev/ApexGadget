import type { ReactNode } from 'react'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import {
  ChipSize,
  GlassCardVariant,
  PageBannerTone,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface PageBannerProps {
  eyebrow: string
  title: string
  lead: string
  /** Finished banner artwork (copy included), shown from `lg`. */
  image: string
  imageWidth: number
  imageHeight: number
  tone: PageBannerTone
  /** `object-position` class of the phones crop below `lg`, e.g. `object-[85%_center]`. */
  artPositionClassName: string
  /** Breadcrumb above the banner. */
  breadcrumb?: ReactNode
  /** Below `lg`, between the lead and the art (e.g. the 3 steps). */
  mobileContent?: ReactNode
  /** Below `lg`, under the art (e.g. the "Get Started" button). */
  mobileAction?: ReactNode
  className?: string
}

/**
 * Hero banner of the Trade-In and Favorites pages.
 * lg and up: the artwork is the banner; its copy is also in the page as visually hidden text (heading, lead).
 * Below lg: centred glass card with the real heading + lead, optional content, a crop of the phones, optional action.
 */
export function PageBanner({
  eyebrow,
  title,
  lead,
  image,
  imageWidth,
  imageHeight,
  tone,
  artPositionClassName,
  breadcrumb,
  mobileContent,
  mobileAction,
  className,
}: PageBannerProps) {
  return (
    <section className={className}>
      {breadcrumb && <div className="mb-3 sm:mb-4">{breadcrumb}</div>}

      <GlassCard variant={GlassCardVariant.Hero} className="lg:bg-transparent lg:backdrop-blur-none">
        <img
          src={image}
          alt=""
          width={imageWidth}
          height={imageHeight}
          className="hidden h-auto w-full lg:block"
        />

        <div className="px-4 pb-0 pt-6 text-center sm:px-8 sm:pt-8 lg:sr-only">
          <Chip size={ChipSize.Xs} icon={<span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />}>
            <span className="font-bold uppercase tracking-[1.2px]">{eyebrow}</span>
          </Chip>
          <Typography variant={TypographyVariant.Display} align={TypographyAlign.Center} className="mt-4 text-balance">
            {title}
          </Typography>
          <Typography
            variant={TypographyVariant.Lead}
            tone={TypographyTone.Muted}
            align={TypographyAlign.Center}
            className="mx-auto mt-3 max-w-[480px]"
          >
            {lead}
          </Typography>
          {mobileContent}
        </div>

        <div className="relative mx-3 mb-3 mt-5 overflow-hidden rounded-[20px] sm:mx-auto sm:mb-6 sm:w-full sm:max-w-[560px] lg:hidden">
          <img
            src={image}
            alt=""
            width={imageWidth}
            height={imageHeight}
            className={cn(
              'block aspect-[4/3] w-full object-cover',
              tone === PageBannerTone.Dark ? 'bg-ink-deep' : 'bg-canvas',
              artPositionClassName,
            )}
          />
        </div>

        {mobileAction && <div className="flex flex-col items-stretch px-4 pb-4 sm:items-center sm:px-8 sm:pb-6 lg:hidden">{mobileAction}</div>}
      </GlassCard>
    </section>
  )
}
