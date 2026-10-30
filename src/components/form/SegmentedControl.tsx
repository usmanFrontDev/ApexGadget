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

/** Equal-width segments in one row (PTA status). */
export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  return (
    <RadioGroup
      {...props}
      className="grid grid-cols-3 gap-1.5 sm:gap-2"
      optionClassName={({ checked }) =>
        checked
          ? 'inline-flex h-[46px] min-w-0 items-center justify-center whitespace-nowrap rounded-2xl bg-primary/8 px-1.5 text-[12.5px] font-semibold text-primary sm:px-3 sm:text-[13px] shadow-ring-selected'
          : 'inline-flex h-[46px] min-w-0 items-center justify-center whitespace-nowrap rounded-2xl bg-white px-1.5 text-[12.5px] font-medium text-ink/80 sm:px-3 sm:text-[13px] shadow-ring hover:text-ink'
      }
      renderOption={({ option }) => <span className="truncate">{option.label}</span>}
    />
  )
}
