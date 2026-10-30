import type { ComponentType } from 'react'
import { AlertIcon, CheckIcon, CloseIcon, InfoIcon, type IconProps } from '@/components/icons'
import { Typography } from '@/components/ui/Typography'
import { ToastVariant, TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface AppToastProps {
  title: string
  /** One or two lines under the title. */
  text?: string
  variant?: ToastVariant
  visible: boolean
  onClose: () => void
}

const badge: Record<ToastVariant, { Icon: ComponentType<IconProps>; classes: string }> = {
  [ToastVariant.Success]: { Icon: CheckIcon, classes: 'bg-emerald-500 text-white' },
  [ToastVariant.Error]: { Icon: AlertIcon, classes: 'bg-primary text-white' },
  [ToastVariant.Info]: { Icon: InfoIcon, classes: 'bg-ink text-white' },
}

/** The one toast layout of the app: icon badge, bold title, optional text, close button. Shown through `lib/appToast.tsx`. */
export function AppToast({ title, text, variant = ToastVariant.Success, visible, onClose }: AppToastProps) {
  const { Icon, classes } = badge[variant]
  return (
    <div
      role={variant === ToastVariant.Error ? 'alert' : 'status'}
      className={cn(
        'flex w-[min(92vw,360px)] items-start gap-3 rounded-[20px] bg-white p-4 shadow-glass-hero transition duration-200 motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
    >
      <span aria-hidden="true" className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-full', classes)}>
        <Icon width={14} height={14} />
      </span>
      <div className="min-w-0 flex-1">
        <Typography as="p" variant={TypographyVariant.BodySm} className="font-sans font-bold">
          {title}
        </Typography>
        {text && (
          <Typography as="p" variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-0.5 line-clamp-3">
            {text}
          </Typography>
        )}
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="-m-2 grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink/60 transition hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
      >
        <CloseIcon width={14} height={14} />
      </button>
    </div>
  )
}
