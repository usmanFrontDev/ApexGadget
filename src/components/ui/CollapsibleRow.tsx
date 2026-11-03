import { useId, type ReactNode } from 'react'
import { ChevronDownIcon, MinusIcon, PlusIcon } from '@/components/icons'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { CollapsibleRowVariant, GlassCardVariant, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface CollapsibleRowProps {
  /** Row label, e.g. "Add a note for delivery". */
  label: string
  icon?: ReactNode
  /** Let a long label wrap (FAQ questions) instead of truncating it. */
  wrapLabel?: boolean
  variant?: CollapsibleRowVariant
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  className?: string
}

/**
 * Accordion row. `Card`: glass card with icon, label and chevron. `Plain`: a list row with a bottom divider and a
 * plus / minus (FAQ). Closed content is `inert`.
 */
export function CollapsibleRow({
  label,
  icon,
  wrapLabel = false,
  variant = CollapsibleRowVariant.Card,
  open,
  onOpenChange,
  children,
  className,
}: CollapsibleRowProps) {
  const panelId = useId()
  const plain = variant === CollapsibleRowVariant.Plain
  const Indicator = plain ? (open ? MinusIcon : PlusIcon) : ChevronDownIcon

  const content = (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
          plain ? 'min-h-[52px] px-1' : 'min-h-[54px] rounded-[20px] px-4',
        )}
      >
        {icon && <span className="shrink-0 text-ink/70">{icon}</span>}
        <Typography
          as="span"
          variant={plain ? TypographyVariant.Body : TypographyVariant.BodySm}
          className={cn('min-w-0 flex-1 font-sans font-semibold', wrapLabel ? 'py-3' : 'truncate')}
        >
          {label}
        </Typography>
        <Indicator
          width={16}
          height={16}
          className={cn(
            'shrink-0 text-ink/60 transition-transform duration-300 motion-reduce:transition-none',
            !plain && open && 'rotate-180',
          )}
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
          <div className={plain ? 'px-1 pb-4' : 'px-4 pb-4'}>{children}</div>
        </div>
      </div>
    </>
  )

  if (plain) return <div className={cn('border-b border-ink/9', className)}>{content}</div>
  return (
    <GlassCard variant={GlassCardVariant.Soft} className={cn('rounded-[20px]', className)}>
      {content}
    </GlassCard>
  )
}
