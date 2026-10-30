import type { ReactNode } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { GlassCardVariant, TypographyTone, TypographyVariant } from '@/constants/ui'

export interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <GlassCard variant={GlassCardVariant.Soft} className="px-6 py-14 text-center">
      <span
        aria-hidden="true"
        className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary shadow-ring-primary"
      >
        {icon}
      </span>
      <Typography variant={TypographyVariant.Subtitle} className="mt-5">
        {title}
      </Typography>
      <Typography
        variant={TypographyVariant.Body}
        tone={TypographyTone.Muted}
        className="mx-auto mt-2 max-w-[420px]"
      >
        {description}
      </Typography>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </GlassCard>
  )
}
