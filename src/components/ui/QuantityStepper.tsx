import { MinusIcon, PlusIcon, TrashIcon } from '@/components/icons'
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
  /** Disables the buttons (a request is running). */
  disabled?: boolean
  /** At the minimum, "−" becomes a trash button that calls this (remove from the cart). */
  onRemove?: () => void
  /** Accessible name of that trash button, e.g. "Remove iPhone 16 from cart". */
  removeLabel?: string
  className?: string
}

const sizeClasses: Record<QuantityStepperSize, { root: string; button: string; value: string }> = {
  [QuantityStepperSize.Md]: { root: 'h-[52px] gap-1 px-1.5', button: 'size-10', value: 'min-w-8 text-[14.5px]' },
  [QuantityStepperSize.Sm]: { root: 'h-[42px] gap-0.5 px-1', button: 'size-9', value: 'min-w-7 text-[14px]' },
  [QuantityStepperSize.Xs]: { root: 'h-[38px] gap-0 px-0.5', button: 'size-[34px]', value: 'min-w-6 text-[13.5px]' },
}

const stepButton =
  'grid shrink-0 cursor-pointer place-items-center rounded-full text-ink transition hover:bg-ink/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent'

/**
 * − 1 + control. `Md` = the 52px pill height of a large Button, `Sm` = compact (cart lines), `Xs` = product cards.
 * With `onRemove`, "−" turns into a trash button at the minimum. The value is announced when it changes.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  label,
  size = QuantityStepperSize.Md,
  disabled = false,
  onRemove,
  removeLabel,
  className,
}: QuantityStepperProps) {
  const sizing = sizeClasses[size]
  const removes = onRemove !== undefined && value <= min
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex shrink-0 items-center rounded-full bg-white/92 shadow-ring', sizing.root, className)}
    >
      {removes ? (
        <button type="button" aria-label={removeLabel ?? 'Remove'} disabled={disabled} onClick={onRemove} className={cn(stepButton, sizing.button)}>
          <TrashIcon width={15} height={15} />
        </button>
      ) : (
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={disabled || value <= min}
          onClick={() => onChange(value - 1)}
          className={cn(stepButton, sizing.button)}
        >
          <MinusIcon width={15} height={15} />
        </button>
      )}
      <output aria-live="polite" className={cn('text-center font-bold tabular-nums', sizing.value)}>
        {value}
      </output>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className={cn(stepButton, sizing.button)}
      >
        <PlusIcon width={15} height={15} />
      </button>
    </div>
  )
}
