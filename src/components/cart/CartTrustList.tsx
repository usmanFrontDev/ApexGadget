import type { ComponentType } from 'react'
import { BadgeCheckIcon, ReturnIcon, ShieldIcon, type IconProps } from '@/components/icons'
import { Typography } from '@/components/ui/Typography'
import { CART_TRUST_ITEMS, CartTrustIconKey } from '@/constants/cart'
import { TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'

const ICONS: Record<CartTrustIconKey, ComponentType<IconProps>> = {
  [CartTrustIconKey.Shield]: ShieldIcon,
  [CartTrustIconKey.Warranty]: BadgeCheckIcon,
  [CartTrustIconKey.Return]: ReturnIcon,
}

/** Three promises under the payments (client-owned wording: BLOCKED-ON-CLIENT). */
export function CartTrustList() {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {CART_TRUST_ITEMS.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <li key={item.id} className="flex min-w-0 flex-col items-center gap-1.5 px-1 text-center">
            <Icon width={22} height={22} className="shrink-0 text-ink/65" />
            <Typography as="span" variant={TypographyVariant.Caption} tone={TypographyTone.Muted} align={TypographyAlign.Center} className="text-[11px] leading-[14px]">
              {item.label}
            </Typography>
          </li>
        )
      })}
    </ul>
  )
}
