import { IconButtonSize, IconButtonVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

const sizeClasses: Record<IconButtonSize, string> = {
  [IconButtonSize.Sm]: 'size-9',
  [IconButtonSize.Md]: 'size-[38px]',
  [IconButtonSize.Lg]: 'size-11',
}

const variantClasses: Record<IconButtonVariant, string> = {
  [IconButtonVariant.Default]: 'bg-white/92 text-ink shadow-ring',
  [IconButtonVariant.Primary]: 'bg-primary text-white shadow-primary-soft',
}

/** Shared look of the round icon buttons / badges (white glass by default). */
export function iconCircleClasses(
  size: IconButtonSize,
  className?: string,
  variant: IconButtonVariant = IconButtonVariant.Default,
) {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-full',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}
