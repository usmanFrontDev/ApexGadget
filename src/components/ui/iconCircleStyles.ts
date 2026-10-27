import { IconButtonSize } from '@/constants/ui'
import { cn } from '@/lib/cn'

const sizeClasses: Record<IconButtonSize, string> = {
  [IconButtonSize.Sm]: 'size-9',
  [IconButtonSize.Md]: 'size-[38px]',
  [IconButtonSize.Lg]: 'size-11',
}

/** Shared look of the round white icon buttons / badges. */
export function iconCircleClasses(size: IconButtonSize, className?: string) {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-full bg-white/92 text-ink shadow-ring',
    sizeClasses[size],
    className,
  )
}
