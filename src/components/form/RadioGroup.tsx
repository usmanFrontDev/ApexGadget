import { useRef, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { cn } from '@/lib/cn'

export interface RadioGroupOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
}

export interface RadioGroupProps<T extends string, O extends RadioGroupOption<T>> {
  options: readonly O[]
  value: T | '' | undefined
  onChange: (value: T) => void
  /** Accessible name of the group (use `labelledBy` when a visible label exists). */
  label?: string
  labelledBy?: string
  describedBy?: string
  invalid?: boolean
  onBlur?: () => void
  /** Focus target for form libraries (`setFocus`): the group's tab stop. */
  focusRef?: Ref<HTMLButtonElement>
  /** Class of the wrapper (layout: flex / grid). */
  className?: string
  optionClassName: (state: { checked: boolean; option: O }) => string
  renderOption: (state: { checked: boolean; option: O }) => ReactNode
}

/**
 * Accessible single-select group (`role="radiogroup"`): one tab stop (roving tabindex), arrow keys / Home / End
 * move and select, Space/Enter select. Base of ChoiceChips, SegmentedControl, SwatchPicker and ChoiceCardGroup.
 */
export function RadioGroup<T extends string, O extends RadioGroupOption<T>>({
  options,
  value,
  onChange,
  label,
  labelledBy,
  describedBy,
  invalid,
  onBlur,
  focusRef,
  className,
  optionClassName,
  renderOption,
}: RadioGroupProps<T, O>) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const enabled = options.filter((option) => !option.disabled)
  const checkedIndex = options.findIndex((option) => option.value === value)
  // The tab stop is the checked option, or the first enabled one when nothing is chosen.
  const tabIndex = checkedIndex >= 0 ? checkedIndex : options.findIndex((option) => !option.disabled)

  const move = (from: number, step: 1 | -1 | 'first' | 'last') => {
    if (enabled.length === 0) return
    const enabledIndexes = options.map((option, index) => (option.disabled ? -1 : index)).filter((i) => i >= 0)
    const position = enabledIndexes.indexOf(from)
    const nextPosition =
      step === 'first'
        ? 0
        : step === 'last'
          ? enabledIndexes.length - 1
          : (position + step + enabledIndexes.length) % enabledIndexes.length
    const next = enabledIndexes[nextPosition]
    if (next === undefined) return
    onChange(options[next].value)
    buttons.current[next]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        move(index, 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        move(index, -1)
        break
      case 'Home':
        event.preventDefault()
        move(index, 'first')
        break
      case 'End':
        event.preventDefault()
        move(index, 'last')
        break
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={className}
    >
      {options.map((option, index) => {
        const checked = index === checkedIndex
        return (
          <button
            key={option.value}
            ref={(element) => {
              buttons.current[index] = element
              if (index === tabIndex && focusRef) {
                if (typeof focusRef === 'function') focusRef(element)
                else (focusRef as { current: HTMLButtonElement | null }).current = element
              }
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={option.disabled}
            tabIndex={index === tabIndex ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            onBlur={onBlur}
            className={cn(
              'transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50',
              optionClassName({ checked, option }),
            )}
          >
            {renderOption({ checked, option })}
          </button>
        )
      })}
    </div>
  )
}
