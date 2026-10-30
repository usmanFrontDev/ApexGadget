import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

/** Single-line text field (pill-ish rounded input matching the select field). */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { invalid = false, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      {...rest}
      className={cn(
        'h-12 w-full min-w-0 rounded-2xl bg-white px-4 text-sm text-ink outline-none transition placeholder:text-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        invalid ? 'shadow-ring-selected' : 'shadow-ring',
        className,
      )}
    />
  )
})
