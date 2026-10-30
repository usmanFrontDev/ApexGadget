import { Link } from 'react-router-dom'
import { ArrowUpRightIcon } from '@/components/icons'
import { IconCircle } from '@/components/ui/IconCircle'
import { Typography } from '@/components/ui/Typography'
import { IconAnimation, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface CtaBannerProps {
  title: string
  description: string
  to: string
  /** Optional art on the left (a red phone); without it the banner is text only. */
  image?: string
  className?: string
}

/** Dark gradient banner, the whole thing is a link (no transforms on the link: stretched-link rule). */
export function CtaBanner({ title, description, to, image, className }: CtaBannerProps) {
  return (
    <Link
      to={to}
      data-hover-scope=""
      className={cn(
        'group relative flex flex-col items-center gap-4 overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#17070a_0%,#0c0c0e_62%)] px-5 py-6 text-center shadow-banner focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:flex-row sm:gap-6 sm:px-8 sm:py-6 sm:text-left',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-24 size-[320px] rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.28),transparent_95%)]"
      />
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="pointer-events-none relative hidden h-[86px] w-auto shrink-0 object-contain sm:block lg:h-[96px]"
        />
      )}
      <div className="relative min-w-0 flex-1">
        <Typography
          variant={TypographyVariant.Subtitle}
          tone={TypographyTone.Inverse}
          align={TypographyAlign.CenterBelowSm}
        >
          {title}
        </Typography>
        <Typography
          variant={TypographyVariant.BodySm}
          tone={TypographyTone.InverseMuted}
          align={TypographyAlign.CenterBelowSm}
          className="mt-1.5"
        >
          {description}
        </Typography>
      </div>
      <IconCircle
        iconAnimation={IconAnimation.PointRight}
        className="relative size-11 shrink-0 bg-white/10 text-white shadow-ring group-hover:bg-white/20"
      >
        <ArrowUpRightIcon width={15} height={15} />
      </IconCircle>
    </Link>
  )
}
