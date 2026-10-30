import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { invalid = false, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      {...rest}
      className={cn(
        'min-h-[92px] w-full min-w-0 resize-y rounded-2xl bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        invalid ? 'shadow-ring-selected' : 'shadow-ring',
        className,
      )}
    />
  )
})
