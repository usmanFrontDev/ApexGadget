import type { ReactNode } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/Breadcrumb'
import { Typography } from '@/components/ui/Typography'
import { TypographyTone, TypographyVariant } from '@/constants/ui'

export interface PageBannerProps {
  title: string
  lead: string
  /** Finished banner artwork (copy included): the same file on every screen size, shown at its own ratio. */
  image: string
  imageWidth: number
  imageHeight: number
  breadcrumb: readonly BreadcrumbItem[]
  /** Below `lg`, between the lead and the banner (e.g. the 3 steps): on desktop the artwork already shows it. */
  mobileContent?: ReactNode
  /** Below `lg`, under the banner (e.g. the "Get Started" button). */
  mobileAction?: ReactNode
  className?: string
}

/**
 * Start of the Trade-In, Favorites and Support pages, the same pattern as the shop page on every screen size:
 * breadcrumb, `h1`, lead, then the banner artwork at its natural ratio (never cropped, so any banner uploaded in
 * Shopify fits).
 */
export function PageBanner({
  title,
  lead,
  image,
  imageWidth,
  imageHeight,
  breadcrumb,
  mobileContent,
  mobileAction,
  className,
}: PageBannerProps) {
  return (
    <section className={className}>
      <Breadcrumb items={breadcrumb} />

      <Typography variant={TypographyVariant.Display} className="mt-5 sm:text-[38px] xl:text-[38px] xl:leading-[1.1]">
        {title}
      </Typography>
      <Typography variant={TypographyVariant.Lead} tone={TypographyTone.Muted} className="mt-2.5 max-w-[460px]">
        {lead}
      </Typography>
      {mobileContent && <div className="lg:hidden">{mobileContent}</div>}

      <img
        src={image}
        alt=""
        width={imageWidth}
        height={imageHeight}
        className="mt-6 block h-auto w-full rounded-[16px] shadow-[0_18px_40px_rgb(20_20_22/0.18)]"
      />

      {mobileAction && <div className="mt-5 flex flex-col items-stretch sm:items-center lg:hidden">{mobileAction}</div>}
    </section>
  )
}
