import type { ReactNode } from 'react'
import { ArrowRightIcon } from '@/components/icons'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { GlassCardVariant, IconAnimation, TypographyTone, TypographyVariant } from '@/constants/ui'
import { AnimatedIcon } from '@/components/ui/AnimatedIcon'

export interface SupportInfoCardProps {
  /** Scroll target of the section tabs. */
  id: string
  icon: ReactNode
  title: string
  text: string
  /** "View details", "Learn more", "View options". */
  linkLabel: string
  image: string
  onOpen: () => void
}

/** Info card: badge, title, text, a red link that opens the full text, and a picture on the right. */
export function SupportInfoCard({ id, icon, title, text, linkLabel, image, onOpen }: SupportInfoCardProps) {
  return (
    <GlassCard as="article" variant={GlassCardVariant.Soft} data-hover-scope="" className="h-full scroll-mt-28 rounded-[24px]">
      <div id={id} className="absolute -top-28" aria-hidden="true" />
      <div className="relative flex h-full min-h-[200px] flex-col p-5 sm:p-6">
        <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary shadow-ring-primary">
          {icon}
        </span>
        <div className="mt-4 max-w-[62%] sm:max-w-[58%]">
          <Typography as="h3" variant={TypographyVariant.Subtitle}>
            {title}
          </Typography>
          <Typography variant={TypographyVariant.BodySm} tone={TypographyTone.Muted} className="mt-1.5">
            {text}
          </Typography>
        </div>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${linkLabel}: ${title}`}
          className="mt-auto inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 self-start pt-3 text-[13px] font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {linkLabel}
          <AnimatedIcon animation={IconAnimation.NudgeRight}>
            <ArrowRightIcon width={14} height={14} />
          </AnimatedIcon>
        </button>
        <img
          src={image}
          alt=""
          loading="lazy"
          className="pointer-events-none absolute bottom-3 right-3 h-[62%] max-h-[150px] w-auto max-w-[40%] object-contain"
        />
      </div>
    </GlassCard>
  )
}
