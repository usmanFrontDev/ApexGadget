import type { ReactNode } from 'react'
import { ArrowRightIcon } from '@/components/icons'
import { ActionElement } from '@/components/ui/ActionElement'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassGlow } from '@/components/ui/GlassGlow'
import { IconCircle } from '@/components/ui/IconCircle'
import { Typography } from '@/components/ui/Typography'
import { GlassCardVariant, IconAnimation, TypographyTone, TypographyVariant } from '@/constants/ui'

export interface SupportQuickCardProps {
  icon: ReactNode
  title: string
  text: string
  /** External URL (WhatsApp, `tel:`) or in-page `#anchor`; without one the card is plain information (no arrow). */
  href?: string
  target?: string
  onClick?: () => void
}

/** Quick help card: round icon badge, title, caption and an arrow (a link when it has a target). */
export function SupportQuickCard({ icon, title, text, href, target, onClick }: SupportQuickCardProps) {
  const interactive = Boolean(href || onClick)
  const body = (
    <>
      <span aria-hidden="true" className="relative grid size-11 place-items-center rounded-full bg-white/70 text-primary shadow-ring-primary backdrop-blur-md">
        {icon}
      </span>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <Typography as="p" variant={TypographyVariant.CardTitle} className="truncate">
            {title}
          </Typography>
          <Typography as="p" variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-0.5 line-clamp-2">
            {text}
          </Typography>
        </div>
        {interactive && (
          <IconCircle iconAnimation={IconAnimation.NudgeRight} className="relative size-9 shrink-0 text-ink shadow-ring">
            <ArrowRightIcon width={15} height={15} />
          </IconCircle>
        )}
      </div>
    </>
  )

  return (
    <GlassCard
      variant={GlassCardVariant.Promo}
      data-hover-scope=""
      className="group h-full rounded-[20px] bg-gradient-to-br from-white/90 via-white/65 to-primary/8"
    >
      <GlassGlow className="-bottom-16 -right-12 size-[190px] opacity-50" />
      {interactive ? (
        <ActionElement
          href={href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          onClick={onClick}
          className="relative block h-full w-full cursor-pointer p-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        >
          {body}
        </ActionElement>
      ) : (
        <div className="relative h-full p-5">{body}</div>
      )}
    </GlassCard>
  )
}
