import { z } from 'zod'
import {
  TRADE_IN_BATTERY_OPTIONS,
  TRADE_IN_BODY_CONDITIONS,
  TRADE_IN_COLOURS,
  TRADE_IN_CONDITIONS,
  TRADE_IN_MODELS,
  TRADE_IN_NAME_MAX,
  TRADE_IN_NAME_MIN,
  TRADE_IN_NOTES_MAX,
  TRADE_IN_PTA_STATUSES,
  TRADE_IN_SCREEN_CONDITIONS,
  TRADE_IN_STORAGES,
} from '@/constants/trade'

/** `z.enum` from an options array: the allowed values are the options' values. */
function enumOf<const T extends readonly { readonly value: string }[]>(options: T, error: string) {
  return z.enum(options.map((option) => option.value) as [T[number]['value'], ...T[number]['value'][]], { error })
}

export const phoneStepSchema = z.object({
  model: enumOf(TRADE_IN_MODELS, 'Please select a model.'),
  storage: enumOf(TRADE_IN_STORAGES, 'Please choose the storage.'),
  colour: enumOf(TRADE_IN_COLOURS, 'Please choose the colour.'),
  ptaStatus: enumOf(TRADE_IN_PTA_STATUSES, 'Please choose the PTA status.'),
})

export const conditionStepSchema = z.object({
  condition: enumOf(TRADE_IN_CONDITIONS, 'Please choose the overall condition.'),
  screen: enumOf(TRADE_IN_SCREEN_CONDITIONS, 'Please choose the screen condition.'),
  body: enumOf(TRADE_IN_BODY_CONDITIONS, 'Please choose the body condition.'),
  batteryHealth: enumOf(TRADE_IN_BATTERY_OPTIONS, 'Please choose a valid option.').optional(),
  notes: z
    .string()
    .trim()
    .max(TRADE_IN_NOTES_MAX, { error: `Please keep this under ${TRADE_IN_NOTES_MAX} characters.` })
    .optional(),
})

export const reviewStepSchema = z.object({
  name: z
    .string({ error: 'Please enter your name.' })
    .trim()
    .min(TRADE_IN_NAME_MIN, { error: 'Please enter your full name.' })
    .max(TRADE_IN_NAME_MAX, { error: `Please keep your name under ${TRADE_IN_NAME_MAX} characters.` }),
  wantToBuy: enumOf(TRADE_IN_MODELS, 'Please choose a valid model.').optional(),
})

export const tradeInSchema = phoneStepSchema.extend(conditionStepSchema.shape).extend(reviewStepSchema.shape)

export type TradeInValues = z.infer<typeof tradeInSchema>

/** Fields validated by each step ("Next step" calls `trigger` with these). */
export const TRADE_IN_STEP_FIELDS = {
  1: ['model', 'storage', 'colour', 'ptaStatus'],
  2: ['condition', 'screen', 'body', 'batteryHealth', 'notes'],
  3: ['name', 'wantToBuy'],
} as const satisfies Record<number, readonly (keyof TradeInValues)[]>
