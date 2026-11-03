import type { Ref } from 'react'
import { RadioGroup, type RadioGroupOption } from '@/components/form/RadioGroup'

export interface SegmentedControlProps<T extends string> {
  options: readonly RadioGroupOption<T>[]
  value: T | '' | undefined
  onChange: (value: T) => void
  label?: string
  labelledBy?: string
  describedBy?: string
  invalid?: boolean
  onBlur?: () => void
  focusRef?: Ref<HTMLButtonElement>
}

/** Equal-width segments in one row from sm (PTA status); one under the other on phones so no label is cut. */
export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  return (
    <RadioGroup
      {...props}
      className="grid grid-cols-1 gap-2 sm:grid-cols-3"
      optionClassName={({ checked }) =>
        checked
          ? 'inline-flex h-[46px] min-w-0 items-center justify-center whitespace-nowrap rounded-2xl bg-primary/8 px-3 text-[13px] font-semibold text-primary shadow-ring-selected'
          : 'inline-flex h-[46px] min-w-0 items-center justify-center whitespace-nowrap rounded-2xl bg-surface px-3 text-[13px] font-medium text-ink/80 shadow-ring hover:text-ink'
      }
      renderOption={({ option }) => <span className="truncate">{option.label}</span>}
    />
  )
}
