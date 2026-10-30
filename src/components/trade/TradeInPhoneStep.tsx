import { Controller, useFormContext } from 'react-hook-form'
import { ChoiceChips } from '@/components/form/ChoiceChips'
import { describedByFor, fieldLabelId } from '@/components/form/fieldIds'
import { FormField } from '@/components/form/FormField'
import { SegmentedControl } from '@/components/form/SegmentedControl'
import { SwatchPicker } from '@/components/form/SwatchPicker'
import { PhoneIcon } from '@/components/icons'
import { SelectMenu } from '@/components/ui/SelectMenu'
import {
  TRADE_IN_COLOURS,
  TRADE_IN_CONTENT,
  TRADE_IN_FIRST_FIELD_ID,
  TRADE_IN_MODELS,
  TRADE_IN_PTA_STATUSES,
  TRADE_IN_STORAGES,
} from '@/constants/trade'
import type { TradeInValues } from '@/lib/schemas/tradeIn.schema'

const IDS = {
  storage: 'trade-in-storage',
  colour: 'trade-in-colour',
  pta: 'trade-in-pta',
} as const

/** Step 1: model, storage, colour, PTA status. Nothing is preselected: these are deliberate choices. */
export function TradeInPhoneStep() {
  const { control } = useFormContext<TradeInValues>()
  const { labels } = TRADE_IN_CONTENT

  return (
    <div className="flex flex-col gap-6">
      <Controller
        name="model"
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message
          return (
            <FormField id={TRADE_IN_FIRST_FIELD_ID} label={labels.model} error={error}>
              <SelectMenu
                field
                id={TRADE_IN_FIRST_FIELD_ID}
                label={labels.model}
                showLabel={false}
                placeholder={labels.modelPlaceholder}
                icon={<PhoneIcon width={18} height={18} />}
                options={TRADE_IN_MODELS}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                triggerRef={field.ref}
                invalid={Boolean(error)}
                describedBy={describedByFor(TRADE_IN_FIRST_FIELD_ID, { error })}
              />
            </FormField>
          )
        }}
      />

      <Controller
        name="storage"
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message
          return (
            <FormField id={IDS.storage} label={labels.storage} error={error} asGroup>
              <ChoiceChips
                options={TRADE_IN_STORAGES}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                focusRef={field.ref}
                labelledBy={fieldLabelId(IDS.storage)}
                describedBy={describedByFor(IDS.storage, { error })}
                invalid={Boolean(error)}
              />
            </FormField>
          )
        }}
      />

      <Controller
        name="colour"
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message
          return (
            <FormField id={IDS.colour} label={labels.colour} error={error} asGroup>
              <SwatchPicker
                options={TRADE_IN_COLOURS}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                focusRef={field.ref}
                labelledBy={fieldLabelId(IDS.colour)}
                describedBy={describedByFor(IDS.colour, { error })}
                invalid={Boolean(error)}
              />
            </FormField>
          )
        }}
      />

      <Controller
        name="ptaStatus"
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message
          return (
            <FormField id={IDS.pta} label={labels.ptaStatus} error={error} asGroup>
              <SegmentedControl
                options={TRADE_IN_PTA_STATUSES}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                focusRef={field.ref}
                labelledBy={fieldLabelId(IDS.pta)}
                describedBy={describedByFor(IDS.pta, { error })}
                invalid={Boolean(error)}
              />
            </FormField>
          )
        }}
      />
    </div>
  )
}
