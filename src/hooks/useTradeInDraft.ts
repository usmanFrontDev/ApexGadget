import { useEffect, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { TRADE_IN_DRAFT_KEY, TradeInStep } from '@/constants/trade'
import { safeSessionText } from '@/lib/safeStorage'
import { tradeInSchema, type TradeInValues } from '@/lib/schemas/tradeIn.schema'

export interface TradeInDraft {
  step: TradeInStep
  values: Partial<TradeInValues>
}

const SAVE_DELAY_MS = 300
const partialSchema = tradeInSchema.partial()

const isStep = (value: unknown): value is TradeInStep => value === 1 || value === 2 || value === 3

/** The saved draft (a refresh must not lose progress); invalid or missing data -> `undefined`. */
export function loadTradeInDraft(): TradeInDraft | undefined {
  try {
    const raw = safeSessionText.get(TRADE_IN_DRAFT_KEY)
    if (!raw) return undefined
    const data = JSON.parse(raw) as { step?: unknown; values?: unknown }
    const parsed = partialSchema.safeParse(data.values)
    if (!parsed.success) return undefined
    return { step: isStep(data.step) ? data.step : TradeInStep.Phone, values: parsed.data }
  } catch {
    return undefined
  }
}

export function clearTradeInDraft() {
  safeSessionText.remove(TRADE_IN_DRAFT_KEY)
}

/** Writes the form values + current step to sessionStorage (debounced) while the form is being filled. */
export function useTradeInDraft(form: UseFormReturn<TradeInValues>, step: TradeInStep, enabled: boolean) {
  const { watch } = form
  const stepRef = useRef(step)

  useEffect(() => {
    stepRef.current = step
  }, [step])

  useEffect(() => {
    if (!enabled) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const save = () => {
      safeSessionText.set(TRADE_IN_DRAFT_KEY, JSON.stringify({ step: stepRef.current, values: form.getValues() }))
    }
    const subscription = watch(() => {
      clearTimeout(timer)
      timer = setTimeout(save, SAVE_DELAY_MS)
    })
    save()
    return () => {
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [watch, form, enabled, step])
}
