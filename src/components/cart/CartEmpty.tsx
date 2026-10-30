import { EmptyCartIllustration } from '@/components/cart/EmptyCartIllustration'
import { ArrowUpRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Typography } from '@/components/ui/Typography'
import { CART_CONTENT } from '@/constants/cart'
import { ROUTES } from '@/constants/routes'
import { ButtonSize, IconAnimation, TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'

export interface CartEmptyProps {
  /** Mini-cart: no card, smaller. */
  compact?: boolean
  /** Called when the button is used (the drawer closes). */
  onAction?: () => void
}

/** "Your cart is empty" with an "Explore products" button (page and mini-cart). */
export function CartEmpty({ compact = false, onAction }: CartEmptyProps) {
  const action = (
    <Button
      to={ROUTES.shop}
      size={ButtonSize.Md}
      icon={<ArrowUpRightIcon />}
      iconAnimation={IconAnimation.PointRight}
      onClick={onAction}
      blockOnMobile
    >
      {CART_CONTENT.empty.action}
    </Button>
  )

  if (compact) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <EmptyCartIllustration />
        <Typography variant={TypographyVariant.Subtitle} className="mt-4">
          {CART_CONTENT.empty.title}
        </Typography>
        <Typography variant={TypographyVariant.Body} tone={TypographyTone.Muted} align={TypographyAlign.Center} className="mt-2">
          {CART_CONTENT.empty.text}
        </Typography>
        <div className="mt-6">{action}</div>
      </div>
    )
  }

  return (
    <EmptyState
      illustration={<EmptyCartIllustration />}
      title={CART_CONTENT.empty.title}
      description={CART_CONTENT.empty.text}
      action={action}
    />
  )
}
