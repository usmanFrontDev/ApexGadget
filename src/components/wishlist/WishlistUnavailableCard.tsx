import { TrashIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { WISHLIST_CONTENT } from '@/constants/wishlist'
import { ButtonSize, ButtonVariant, GlassCardVariant, IconPosition, TypographyTone, TypographyVariant } from '@/constants/ui'

export interface WishlistUnavailableCardProps {
  onRemove: () => void
}

/** A saved product that no longer exists in the store (same row height as a normal item). */
export function WishlistUnavailableCard({ onRemove }: WishlistUnavailableCardProps) {
  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Soft}
      className="flex flex-col gap-3 rounded-[18px] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
    >
      <div className="min-w-0">
        <Typography variant={TypographyVariant.CardTitle}>{WISHLIST_CONTENT.unavailableTitle}</Typography>
        <Typography variant={TypographyVariant.BodySm} tone={TypographyTone.Muted} className="mt-0.5">
          {WISHLIST_CONTENT.unavailableText}
        </Typography>
      </div>
      <Button
        type="button"
        variant={ButtonVariant.Secondary}
        size={ButtonSize.Xs}
        icon={<TrashIcon width={14} height={14} />}
        iconPosition={IconPosition.Start}
        onClick={onRemove}
        className="max-sm:w-full"
      >
        {WISHLIST_CONTENT.remove}
      </Button>
    </GlassCard>
  )
}
