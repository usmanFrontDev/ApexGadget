import { useId, type ReactNode } from 'react'
import { ChevronDownIcon } from '@/components/icons'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { GlassCardVariant, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface CollapsibleRowProps {
  /** Row label, e.g. "Add a note for delivery". */
  label: string
  icon?: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  className?: string
}

/** Accordion row: a full-width toggle (icon, label, chevron) that reveals its content. Closed content is `inert`. */
export function CollapsibleRow({ label, icon, open, onOpenChange, children, className }: CollapsibleRowProps) {
  const panelId = useId()
  return (
    <GlassCard variant={GlassCardVariant.Soft} className={cn('rounded-[20px]', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className="flex min-h-[54px] w-full cursor-pointer items-center gap-3 px-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
      >
        {icon && <span className="shrink-0 text-ink/70">{icon}</span>}
        <Typography as="span" variant={TypographyVariant.BodySm} className="min-w-0 flex-1 truncate font-sans font-semibold">
          {label}
        </Typography>
        <ChevronDownIcon
          width={16}
          height={16}
          className={cn('shrink-0 text-ink/60 transition-transform duration-300 motion-reduce:transition-none', open && 'rotate-180')}
        />
      </button>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </GlassCard>
  )
}
