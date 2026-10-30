import { AlertIcon } from '@/components/icons'
import { Typography } from '@/components/ui/Typography'
import { NoticeVariant, TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface NoticeProps {
  title: string
  description?: string
  variant?: NoticeVariant
  /** Smaller padding and text (mini-cart). */
  compact?: boolean
  id?: string
  className?: string
}

/**
 * Red-tint message box. `Unavailable` is a `role="alert"`; `Error` has no role of its own: render it inside a
 * persistent `aria-live="polite"` wrapper so the message is announced when it appears.
 */
export function Notice({ title, description, variant = NoticeVariant.Unavailable, compact = false, id, className }: NoticeProps) {
  return (
    <div
      id={id}
      role={variant === NoticeVariant.Unavailable ? 'alert' : undefined}
      className={cn(
        'flex items-start gap-3 rounded-[16px] bg-primary/8 text-left shadow-ring-primary',
        compact ? 'px-3 py-2.5' : 'px-4 py-3.5',
        className,
      )}
    >
      <AlertIcon width={compact ? 16 : 18} height={compact ? 16 : 18} className="mt-0.5 shrink-0 text-primary" />
      <div className="min-w-0">
        <Typography as="p" variant={TypographyVariant.BodySm} className="font-sans font-bold text-primary">
          {title}
        </Typography>
        {description && (
          <Typography as="p" variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-0.5">
            {description}
          </Typography>
        )}
      </div>
    </div>
  )
}
