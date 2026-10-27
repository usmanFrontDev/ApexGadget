import type { ReactNode } from 'react'
import { ChipSize, ChipVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface ChipProps {
  children: ReactNode
  icon?: ReactNode
  size?: ChipSize
  variant?: ChipVariant
  className?: string
}

const sizeClasses: Record<ChipSize, string> = {
  [ChipSize.Xs]: 'h-[26px] px-[11px] text-[11px]',
  [ChipSize.Sm]: 'h-[30px] px-3.5 text-[11.5px]',
  [ChipSize.Md]: 'h-[34px] pl-4 pr-[15.5px] text-[12.5px] font-semibold',
  [ChipSize.Lg]: 'h-10 px-[17px] text-[13.5px] font-semibold',
}

const variantClasses: Record<ChipVariant, string> = {
  [ChipVariant.Default]: 'text-ink',
  [ChipVariant.Label]: 'font-bold uppercase tracking-[1.2px] text-ink/66',
  [ChipVariant.Tint]: 'bg-primary/8 font-semibold text-primary shadow-none',
  [ChipVariant.Dark]:
    'bg-ink-deep/62 font-bold uppercase tracking-[0.4px] text-white backdrop-blur-sm',
}

export function Chip({
  children,
  icon,
  size = ChipSize.Md,
  variant = ChipVariant.Default,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-[9px] whitespace-nowrap rounded-full bg-white/92 shadow-ring',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {icon}
      <span className="truncate">{children}</span>
    </span>
  )
}
