import type { ReactNode } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassCardVariant } from '@/constants/ui'

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
      <h3 className="mt-5 text-xl font-bold tracking-[-0.02em]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[420px] font-body text-sm leading-6 text-ink/60">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </GlassCard>
  )
}
