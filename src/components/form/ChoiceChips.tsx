import type { Ref } from 'react'
import { RadioGroup, type RadioGroupOption } from '@/components/form/RadioGroup'

export interface ChoiceChipsProps<T extends string> {
  options: readonly RadioGroupOption<T>[]
  value: T | '' | undefined
  onChange: (value: T) => void
  label?: string
  labelledBy?: string
  describedBy?: string
  invalid?: boolean
  onBlur?: () => void
  focusRef?: Ref<HTMLButtonElement>
  className?: string
}

/** Single-select pills (storage, screen / body condition). Selected = red outline + red tint. */
export function ChoiceChips<T extends string>({ className, ...props }: ChoiceChipsProps<T>) {
  return (
    <RadioGroup
      {...props}
      className={className ?? 'flex flex-wrap gap-2'}
      optionClassName={({ checked }) =>
        checked
          ? 'inline-flex h-[42px] min-w-[64px] items-center justify-center whitespace-nowrap rounded-full bg-primary/8 px-4 text-[13px] font-semibold text-primary shadow-ring-selected'
          : 'inline-flex h-[42px] min-w-[64px] items-center justify-center whitespace-nowrap rounded-full bg-white px-4 text-[13px] font-medium text-ink/80 shadow-ring hover:bg-white hover:text-ink'
      }
      renderOption={({ option }) => <span className="truncate">{option.label}</span>}
    />
  )
}
