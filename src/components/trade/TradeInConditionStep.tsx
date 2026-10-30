import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { ChoiceCardGroup } from '@/components/form/ChoiceCardGroup'
import { ChoiceChips } from '@/components/form/ChoiceChips'
import { describedByFor, fieldLabelId } from '@/components/form/fieldIds'
import { FormField } from '@/components/form/FormField'
import { TextArea } from '@/components/form/TextArea'
import { SelectMenu } from '@/components/ui/SelectMenu'
import {
  TRADE_IN_BATTERY_OPTIONS,
  TRADE_IN_BODY_CONDITIONS,
  TRADE_IN_CONDITIONS,
  TRADE_IN_CONTENT,
  TRADE_IN_NOTES_MAX,
  TRADE_IN_SCREEN_CONDITIONS,
} from '@/constants/trade'
import type { TradeInValues } from '@/lib/schemas/tradeIn.schema'

const IDS = {
  condition: 'trade-in-condition',
  screen: 'trade-in-screen',
  body: 'trade-in-body',
  battery: 'trade-in-battery',
  notes: 'trade-in-notes',
} as const

/** Step 2: overall condition, screen, body, optional battery and notes. */
export function TradeInConditionStep() {
  const { control, register, formState } = useFormContext<TradeInValues>()
  const notes = useWatch({ control, name: 'notes' }) ?? ''
  const { labels } = TRADE_IN_CONTENT
  const notesError = formState.errors.notes?.message

  return (
    <div className="flex flex-col gap-6">
      <Controller
        name="condition"
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message
          return (
            <FormField id={IDS.condition} label={labels.condition} error={error} asGroup>
              <ChoiceCardGroup
                options={TRADE_IN_CONDITIONS}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                focusRef={field.ref}
                labelledBy={fieldLabelId(IDS.condition)}
                describedBy={describedByFor(IDS.condition, { error })}
                invalid={Boolean(error)}
              />
            </FormField>
          )
        }}
      />

      <Controller
        name="screen"
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message
          return (
            <FormField id={IDS.screen} label={labels.screen} error={error} asGroup>
              <ChoiceChips
                options={TRADE_IN_SCREEN_CONDITIONS}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                focusRef={field.ref}
                labelledBy={fieldLabelId(IDS.screen)}
                describedBy={describedByFor(IDS.screen, { error })}
                invalid={Boolean(error)}
              />
            </FormField>
          )
        }}
      />

      <Controller
        name="body"
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message
          return (
            <FormField id={IDS.body} label={labels.body} error={error} asGroup>
              <ChoiceChips
                options={TRADE_IN_BODY_CONDITIONS}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                focusRef={field.ref}
                labelledBy={fieldLabelId(IDS.body)}
                describedBy={describedByFor(IDS.body, { error })}
                invalid={Boolean(error)}
              />
            </FormField>
          )
        }}
      />

      <Controller
        name="batteryHealth"
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState.error?.message
          return (
            <FormField id={IDS.battery} label={labels.battery} suffix={labels.optional} error={error}>
              <SelectMenu
                field
                id={IDS.battery}
                label={labels.battery}
                showLabel={false}
                placeholder={labels.batteryPlaceholder}
                options={TRADE_IN_BATTERY_OPTIONS}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                triggerRef={field.ref}
                invalid={Boolean(error)}
                describedBy={describedByFor(IDS.battery, { error })}
              />
            </FormField>
          )
        }}
      />

      <FormField
        id={IDS.notes}
        label={labels.notes}
        suffix={labels.optional}
        error={notesError}
        hint={`${notes.length}/${TRADE_IN_NOTES_MAX}`}
      >
        <TextArea
          id={IDS.notes}
          placeholder={labels.notesPlaceholder}
          rows={3}
          invalid={Boolean(notesError)}
          aria-describedby={describedByFor(IDS.notes, { error: notesError, hint: 'counter' })}
          {...register('notes')}
        />
      </FormField>
    </div>
  )
}
