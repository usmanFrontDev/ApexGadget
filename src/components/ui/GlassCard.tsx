import type { ReactNode } from 'react'
import { GlassCardVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface GlassCardProps {
  children: ReactNode
  variant?: GlassCardVariant
  as?: 'div' | 'section' | 'article'
  className?: string
  'aria-busy'?: boolean
  [dataAttribute: `data-${string}`]: string | undefined
}

const variantClasses: Record<GlassCardVariant, { drop: string; ring: string }> = {
  [GlassCardVariant.Hero]: { drop: 'shadow-glass-hero', ring: 'shadow-inset-glass' },
  [GlassCardVariant.Promo]: { drop: 'shadow-glass-promo', ring: 'shadow-inset-promo' },
  [GlassCardVariant.Soft]: { drop: 'shadow-glass-soft', ring: 'shadow-inset-glass' },
}

/** Frosted white surface used by hero, promo and category cards. */
export function GlassCard({
  children,
  variant = GlassCardVariant.Hero,
  as: Tag = 'div',
  className,
  ...rest
}: GlassCardProps) {
  const { drop, ring } = variantClasses[variant]
  return (
    <Tag
      {...rest}
      className={cn(
        // overflow-clip (not hidden): a clipped box can never be scrolled programmatically, so a
        // focused child can't shove the card's content out of place.
        'relative overflow-clip rounded-[28px] bg-white/80 backdrop-blur-[18px]',
        drop,
        className,
      )}
    >
      {children}
      {/* Inner hairline drawn above any child imagery */}
      <span
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', ring)}
      />
    </Tag>
  )
}
