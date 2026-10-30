import { PhoneIcon } from '@/components/icons'
import { Chip } from '@/components/ui/Chip'
import { Typography } from '@/components/ui/Typography'
import { FILTER_SWATCH_CLASSES } from '@/constants/shop'
import {
  TRADE_IN_COLOURS,
  TRADE_IN_CONTENT,
  TRADE_IN_MODELS,
  TRADE_IN_PTA_STATUSES,
  TRADE_IN_STORAGES,
} from '@/constants/trade'
import { ChipSize, TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'
import type { TradeInValues } from '@/lib/schemas/tradeIn.schema'

export interface DeviceSummaryProps {
  values: Partial<TradeInValues>
  className?: string
}

const labelOf = (options: readonly { value: string; label: string }[], value?: string) =>
  options.find((option) => option.value === value)?.label

/** The device the customer described so far: model, "256GB · PTA Approved", colour. */
export function DeviceSummary({ values, className }: DeviceSummaryProps) {
  const model = labelOf(TRADE_IN_MODELS, values.model)
  const details = [labelOf(TRADE_IN_STORAGES, values.storage), labelOf(TRADE_IN_PTA_STATUSES, values.ptaStatus)]
    .filter(Boolean)
    .join(' · ')
  const colour = labelOf(TRADE_IN_COLOURS, values.colour)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        aria-hidden="true"
        className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-ink/70 shadow-ring"
      >
        <PhoneIcon width={22} height={22} />
      </span>
      <div className="min-w-0 flex-1">
        {model ? (
          <>
            <Typography variant={TypographyVariant.CardTitle} className="truncate">
              {model}
            </Typography>
            {details && (
              <Typography variant={TypographyVariant.Caption} tone={TypographyTone.Muted} className="mt-0.5 truncate">
                {details}
              </Typography>
            )}
            {colour && (
              <Typography
                as="span"
                variant={TypographyVariant.Caption}
                tone={TypographyTone.Muted}
                className="mt-0.5 flex items-center gap-1.5 truncate"
              >
                <span
                  aria-hidden="true"
                  className={cn('size-2.5 shrink-0 rounded-full shadow-ring', FILTER_SWATCH_CLASSES[values.colour ?? ''] ?? 'bg-ink/20')}
                />
                {colour}
              </Typography>
            )}
          </>
        ) : (
          <Chip size={ChipSize.Sm}>{TRADE_IN_CONTENT.summary.empty}</Chip>
        )}
      </div>
    </div>
  )
}
