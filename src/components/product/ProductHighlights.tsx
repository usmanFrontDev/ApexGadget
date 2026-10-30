import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import { GlassCardVariant, TypographyTone, TypographyVariant } from '@/constants/ui'
import { getSpecIcon } from '@/lib/specIcon'
import type { ProductSpec } from '@/types/product.types'

export const HIGHLIGHTS_MAX = 4
export const HIGHLIGHTS_MIN = 2

export interface ProductHighlightsProps {
  specs: readonly ProductSpec[]
}

/** Up to 4 key specs as icon + value + label under the gallery; hidden with fewer than 2 specs. */
export function ProductHighlights({ specs }: ProductHighlightsProps) {
  const items = specs.slice(0, HIGHLIGHTS_MAX)
  if (items.length < HIGHLIGHTS_MIN) return null

  return (
    <GlassCard variant={GlassCardVariant.Soft} className="flex items-center rounded-[20px] p-4 sm:p-5 lg:min-h-[120px]">
      <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
        {items.map((spec) => {
          const Icon = getSpecIcon(spec.label)
          return (
            <li key={spec.label} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
              <Icon width={22} height={22} className="text-ink/70" />
              <Typography variant={TypographyVariant.CardTitle} className="line-clamp-2 text-[12.5px]">
                {spec.value}
              </Typography>
              <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="truncate">
                {spec.label}
              </Typography>
            </li>
          )
        })}
      </ul>
    </GlassCard>
  )
}
