import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { describedByFor } from '@/components/form/fieldIds'
import { FormField } from '@/components/form/FormField'
import { TextInput } from '@/components/form/TextInput'
import { CameraIcon } from '@/components/icons'
import { DeviceSummary } from '@/components/trade/DeviceSummary'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { Typography } from '@/components/ui/Typography'
import { TRADE_IN_CONTENT, TRADE_IN_MODELS } from '@/constants/trade'
import { TypographyTone, TypographyVariant } from '@/constants/ui'
import type { TradeInValues } from '@/lib/schemas/tradeIn.schema'

const IDS = { name: 'trade-in-name', wantToBuy: 'trade-in-want' } as const

/** "No preference": lets an optional pick be cleared again. */
const NO_PREFERENCE = 'none'
const WANT_TO_BUY_OPTIONS = [{ value: NO_PREFERENCE, label: 'Not decided yet' }, ...TRADE_IN_MODELS] as const

export interface TradeInReviewStepProps {
  /** "Edit" in the device summary: back to step 1. */
  onEdit: () => void
}

/** Step 3: name, optional "iPhone you want to buy", read-only device summary and the photo note. */
export function TradeInReviewStep({ onEdit }: TradeInReviewStepProps) {
  const { control, register, formState } = useFormContext<TradeInValues>()
  const values = useWatch<TradeInValues>() as Partial<TradeInValues>
  const { labels, buttons } = TRADE_IN_CONTENT
  const nameError = formState.errors.name?.message

  return (
    <div className="flex flex-col gap-6">
      <FormField id={IDS.name} label={labels.name} error={nameError}>
        <TextInput
          id={IDS.name}
          autoComplete="name"
          placeholder={labels.namePlaceholder}
          invalid={Boolean(nameError)}
          aria-describedby={describedByFor(IDS.name, { error: nameError })}
          {...register('name')}
        />
      </FormField>

      <Controller
        name="wantToBuy"
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message
          return (
            <FormField id={IDS.wantToBuy} label={labels.wantToBuy} suffix={labels.optional} error={error}>
              <SelectMenu
                field
                id={IDS.wantToBuy}
                label={labels.wantToBuy}
                showLabel={false}
                placeholder={labels.wantToBuyPlaceholder}
                options={WANT_TO_BUY_OPTIONS}
                value={field.value ?? ''}
                onChange={(value) => field.onChange(value === NO_PREFERENCE ? undefined : value)}
                onBlur={field.onBlur}
                triggerRef={field.ref}
                invalid={Boolean(error)}
                describedBy={describedByFor(IDS.wantToBuy, { error })}
              />
            </FormField>
          )
        }}
      />

      <section aria-label={TRADE_IN_CONTENT.summaryCard} className="rounded-2xl bg-white/70 p-4 shadow-ring">
        <div className="flex items-center justify-between gap-3">
          <Typography variant={TypographyVariant.BodySm} className="font-sans font-bold">
            {TRADE_IN_CONTENT.summaryCard}
          </Typography>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full px-2 py-1 text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {buttons.edit}
          </button>
        </div>
        <DeviceSummary values={values} className="mt-3" />
      </section>

      <p className="flex items-center gap-2.5 rounded-2xl bg-white/70 px-4 py-3 font-body text-[12.5px] text-ink/70 shadow-ring">
        <CameraIcon width={17} height={17} className="shrink-0 text-ink/60" />
        <Typography as="span" variant={TypographyVariant.Caption} tone={TypographyTone.Soft}>
          {TRADE_IN_CONTENT.attachNote}
        </Typography>
      </p>
    </div>
  )
}
