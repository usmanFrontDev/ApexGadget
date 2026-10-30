import { HeartIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { ButtonSize, ButtonVariant, IconButtonSize, IconPosition } from '@/constants/ui'
import { cn } from '@/lib/cn'
import { useIsWishlisted, useWishlistStore } from '@/store/useWishlistStore'

export interface WishlistButtonProps {
  handle: string
  /** Product name, for the accessible label. */
  title: string
  size?: IconButtonSize
  /** Labelled button ("Save" / "Saved") instead of the round icon (product page). */
  label?: { add: string; saved: string }
  /** Size of the labelled button. */
  buttonSize?: ButtonSize
  className?: string
}

/** Heart toggle that saves / removes a product (by handle) in the wishlist. */
export function WishlistButton({
  handle,
  title,
  size = IconButtonSize.Sm,
  label,
  buttonSize = ButtonSize.Lg,
  className,
}: WishlistButtonProps) {
  const saved = useIsWishlisted(handle)
  const toggle = useWishlistStore((state) => state.toggle)
  const accessibleName = saved ? `Remove ${title} from favorites` : `Add ${title} to favorites`
  const heart = <HeartIcon width={16} height={16} fill={saved ? 'currentColor' : 'none'} />

  if (label) {
    return (
      <Button
        type="button"
        variant={ButtonVariant.Secondary}
        size={buttonSize}
        icon={heart}
        iconPosition={IconPosition.Start}
        aria-label={accessibleName}
        aria-pressed={saved}
        onClick={() => toggle(handle)}
        className={cn(saved && 'text-primary', className)}
      >
        {saved ? label.saved : label.add}
      </Button>
    )
  }

  return (
    <IconButton
      label={accessibleName}
      aria-pressed={saved}
      size={size}
      onClick={() => toggle(handle)}
      className={cn(saved && 'text-primary', className)}
    >
      {heart}
    </IconButton>
  )
}
