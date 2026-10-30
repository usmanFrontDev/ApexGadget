import { MinusIcon, PlusIcon } from '@/components/icons'
import { QuantityStepperSize } from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  /** Stock limit. */
  max: number
  /** Accessible name, e.g. "Quantity of iPhone 16". */
  label: string
  size?: QuantityStepperSize
  /** Disables both buttons (a request is running). */
  disabled?: boolean
  className?: string
}

const stepButton =
  'grid size-10 place-items-center rounded-full text-ink transition hover:bg-ink/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-35 disabled:hover:bg-transparent'

const sizeClasses: Record<QuantityStepperSize, string> = {
  [QuantityStepperSize.Md]: 'h-[52px] gap-1 px-1.5',
  [QuantityStepperSize.Sm]: 'h-[42px] gap-0.5 px-1',
}

/** − 1 + control (`Md` = the 52px pill height of a large Button, `Sm` = compact (cart lines)). The value is announced when it changes. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  label,
  size = QuantityStepperSize.Md,
  disabled = false,
  className,
}: QuantityStepperProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex shrink-0 items-center rounded-full bg-white/92 shadow-ring', sizeClasses[size], className)}
    >
      <button type="button" aria-label="Decrease quantity" disabled={disabled || value <= min} onClick={() => onChange(value - 1)} className={stepButton}>
        <MinusIcon width={16} height={16} />
      </button>
      <output aria-live="polite" className="min-w-8 text-center text-[14.5px] font-bold tabular-nums">
        {value}
      </output>
      <button type="button" aria-label="Increase quantity" disabled={disabled || value >= max} onClick={() => onChange(value + 1)} className={stepButton}>
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  )
}
