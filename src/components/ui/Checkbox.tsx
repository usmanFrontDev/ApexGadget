import type { ReactNode } from 'react'
import { CheckIcon } from '@/components/icons'
import { cn } from '@/lib/cn'

export interface CheckboxProps {
  checked: boolean
  onChange: () => void
  label: string
  /** Number shown in brackets after the label. */
  count?: number
  /** Tailwind background class -> shows a color dot before the label. */
  swatchClass?: string
  disabled?: boolean
  children?: ReactNode
}

export function Checkbox({ checked, onChange, label, count, swatchClass, disabled = false }: CheckboxProps) {
  return (
    <label
      className={cn(
        // `relative`: the hidden input is absolutely positioned; its containing block must be this row,
        // not a faraway ancestor (focusing it would otherwise scroll that ancestor).
        'relative flex cursor-pointer items-center gap-2.5 py-[5px] text-[13px] text-ink/70 transition-colors hover:text-ink',
        disabled && 'cursor-not-allowed opacity-45 hover:text-ink/70',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="grid size-4 shrink-0 place-items-center rounded-[5px] border border-ink/25 bg-white text-white transition peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
      >
        <CheckIcon width={12} height={12} strokeWidth={2.2} />
      </span>
      {swatchClass && (
        <span aria-hidden="true" className={cn('size-3.5 shrink-0 rounded-full shadow-ring', swatchClass)} />
      )}
      <span className="min-w-0 truncate">{label}</span>
      {count !== undefined && <span className="text-ink/35">({count})</span>}
    </label>
  )
}
