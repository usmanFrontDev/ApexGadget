import type { ReactNode } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import {
  GlassCardVariant,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'

export interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Soft}
      className="flex h-full flex-col items-center p-5 sm:p-6 lg:items-start lg:p-[27px]"
    >
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary shadow-ring-primary"
      >
        {icon}
      </span>
      <Typography
        variant={TypographyVariant.Subtitle}
        align={TypographyAlign.CenterBelowLg}
        className="mt-4 lg:mt-[18px]"
      >
        {title}
      </Typography>
      <Typography
        variant={TypographyVariant.Body}
        tone={TypographyTone.Muted}
        align={TypographyAlign.CenterBelowLg}
        className="mt-2 lg:mt-[11px]"
      >
        {description}
      </Typography>
    </GlassCard>
  )
}
