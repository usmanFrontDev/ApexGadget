import type { ReactNode } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassCardVariant } from '@/constants/ui'

export interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <GlassCard as="article" variant={GlassCardVariant.Soft} className="h-full p-[27px]">
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary shadow-ring-primary"
      >
        {icon}
      </span>
      <h3 className="mt-[18px] text-[17px] font-bold leading-[21.4px]">{title}</h3>
      <p className="mt-[11px] font-body text-[14.5px] leading-5 text-ink/60">{description}</p>
    </GlassCard>
  )
}
