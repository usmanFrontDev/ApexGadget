import type { Ref } from 'react'
import { RadioGroup, type RadioGroupOption } from '@/components/form/RadioGroup'
import { FILTER_SWATCH_CLASSES } from '@/constants/shop'
import { cn } from '@/lib/cn'

export interface SwatchPickerProps<T extends string> {
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

/** Colour dots with a caption (shares the swatch map of the shop filters). Selected = red ring. */
export function SwatchPicker<T extends string>(props: SwatchPickerProps<T>) {
  return (
    <RadioGroup
      {...props}
      className="flex flex-wrap gap-x-3 gap-y-3"
      optionClassName={() => 'group flex w-[58px] flex-col items-center gap-1.5 rounded-xl py-1'}
      renderOption={({ option, checked }) => (
        <>
          <span
            className={cn(
              'grid size-9 place-items-center rounded-full bg-white p-[3px] transition-shadow',
              checked ? 'shadow-ring-selected' : 'shadow-ring group-hover:shadow-ring-primary',
            )}
          >
            <span className={cn('size-full rounded-full shadow-ring', FILTER_SWATCH_CLASSES[option.value] ?? 'bg-ink/20')} />
          </span>
          <span className={cn('max-w-full truncate text-[11.5px]', checked ? 'font-semibold text-ink' : 'text-ink/60')}>
            {option.label}
          </span>
        </>
      )}
    />
  )
}
