import type { ComponentType } from 'react'
import { CardIcon, ReturnIcon, TruckIcon, type IconProps } from '@/components/icons'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { TRUST_ITEMS, TrustIconKey } from '@/constants/product'
import { GlassCardVariant, TypographyTone, TypographyVariant } from '@/constants/ui'

const ICONS: Record<TrustIconKey, ComponentType<IconProps>> = {
  [TrustIconKey.Truck]: TruckIcon,
  [TrustIconKey.Return]: ReturnIcon,
  [TrustIconKey.Card]: CardIcon,
}

/** Three short promises (icon + title + caption). Wording is client-owned placeholder copy (constants/product.ts). */
export function TrustStrip() {
  return (
    <GlassCard variant={GlassCardVariant.Soft} className="flex items-center rounded-[20px] p-4 sm:p-5 lg:min-h-[120px]">
      <ul className="grid w-full gap-4 sm:grid-cols-3 sm:gap-2 sm:divide-x sm:divide-ink/8">
        {TRUST_ITEMS.map((item) => {
          const Icon = ICONS[item.icon]
          return (
            <li key={item.id} className="flex items-center gap-3 sm:justify-center sm:px-2">
              <Icon width={22} height={22} className="shrink-0 text-ink/65" />
              <span className="min-w-0">
                <Typography as="span" variant={TypographyVariant.BodySm} className="block truncate font-sans font-bold">
                  {item.title}
                </Typography>
                <Typography as="span" variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="block truncate">
                  {item.caption}
                </Typography>
              </span>
            </li>
          )
        })}
      </ul>
    </GlassCard>
  )
}
