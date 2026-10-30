import type { Ref } from 'react'
import { RadioGroup, type RadioGroupOption } from '@/components/form/RadioGroup'
import { cn } from '@/lib/cn'

export interface ChoiceCardOption<T extends string> extends RadioGroupOption<T> {
  description: string
}

export interface ChoiceCardGroupProps<T extends string> {
  options: readonly ChoiceCardOption<T>[]
  value: T | '' | undefined
  onChange: (value: T) => void
  label?: string
  labelledBy?: string
  describedBy?: string
  invalid?: boolean
  onBlur?: () => void
  focusRef?: Ref<HTMLButtonElement>
}

/** 2 x 2 grid of cards with a title, a caption and a radio dot (overall condition). */
export function ChoiceCardGroup<T extends string>(props: ChoiceCardGroupProps<T>) {
  return (
    <RadioGroup
      {...props}
      className="grid grid-cols-2 gap-2.5"
      optionClassName={({ checked }) =>
        cn(
          'relative flex min-h-[78px] flex-col items-start gap-1 rounded-2xl px-3.5 py-3 text-left',
          checked ? 'bg-primary/8 shadow-ring-selected' : 'bg-white shadow-ring hover:bg-white',
        )
      }
      renderOption={({ option, checked }) => (
        <>
          <span
            aria-hidden="true"
            className={cn(
              'absolute right-3 top-3 grid size-4 place-items-center rounded-full border',
              checked ? 'border-primary' : 'border-ink/25',
            )}
          >
            {checked && <span className="size-2 rounded-full bg-primary" />}
          </span>
          <span className={cn('pr-6 text-[13.5px] font-bold', checked ? 'text-ink' : 'text-ink/85')}>{option.label}</span>
          <span className="font-body text-[11.5px] leading-[15px] text-ink/55">{option.description}</span>
        </>
      )}
    />
  )
}
