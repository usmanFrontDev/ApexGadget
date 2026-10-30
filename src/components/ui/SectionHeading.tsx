import type { ReactNode } from 'react'
import { Typography } from '@/components/ui/Typography'
import { TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface SectionHeadingProps {
  eyebrow: string
  title: string
  /** Optional slot beside the title on desktop, full-width under it on phones (e.g. "All categories"). */
  action?: ReactNode
  className?: string
}

/** Centred on phones and tablets, split (title left, action right) from `lg`. */
export function SectionHeading({ eyebrow, title, action, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-x-4',
        className,
      )}
    >
      <div className="min-w-0">
        <Typography
          variant={TypographyVariant.Eyebrow}
          tone={TypographyTone.Muted}
          align={TypographyAlign.CenterBelowLg}
        >
          {eyebrow}
        </Typography>
        <Typography
          as="h2"
          variant={TypographyVariant.Heading}
          align={TypographyAlign.CenterBelowLg}
          className="mt-1.5"
        >
          {title}
        </Typography>
      </div>
      {action && <div className="flex w-full justify-center sm:w-auto">{action}</div>}
    </div>
  )
}
