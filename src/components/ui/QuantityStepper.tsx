import { MinusIcon, PlusIcon } from '@/components/icons'
import { cn } from '@/lib/cn'

export interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  /** Stock limit. */
  max: number
  /** Accessible name, e.g. "Quantity of iPhone 16". */
  label: string
  className?: string
}

const stepButton =
  'grid size-10 place-items-center rounded-full text-ink transition hover:bg-ink/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-35 disabled:hover:bg-transparent'

/** − 1 + control (same 52px pill height as a large Button). The value is announced when it changes. */
export function QuantityStepper({ value, onChange, min = 1, max, label, className }: QuantityStepperProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex h-[52px] shrink-0 items-center gap-1 rounded-full bg-white/92 px-1.5 shadow-ring', className)}
    >
      <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)} className={stepButton}>
        <MinusIcon width={16} height={16} />
      </button>
      <output aria-live="polite" className="min-w-8 text-center text-[14.5px] font-bold tabular-nums">
        {value}
      </output>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className={stepButton}>
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  )
}
