import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface SectionHeadingProps {
  eyebrow: string
  title: string
  /** Optional right-aligned slot (e.g. an "All categories" button). */
  action?: ReactNode
  className?: string
}

export function SectionHeading({ eyebrow, title, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-x-4 gap-y-3', className)}>
      <div>
        <p className="font-body text-[11.5px] font-bold uppercase tracking-[1.61px] text-ink/62">
          {eyebrow}
        </p>
        <h2 className="mt-[7px] text-[30px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[40px]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
