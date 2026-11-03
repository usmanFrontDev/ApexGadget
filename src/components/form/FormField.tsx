import type { ReactNode } from 'react'
import { fieldErrorId, fieldHintId, fieldLabelId } from '@/components/form/fieldIds'
import { cn } from '@/lib/cn'

export interface FormFieldProps {
  /** Id of the control (also the label's target). The error is `${id}-error`, the hint `${id}-hint`. */
  id: string
  label: string
  /** Muted text after the label, e.g. "(optional)". */
  suffix?: string
  /** Adds a red asterisk (and "required" for screen readers). */
  required?: boolean
  hint?: string
  error?: string
  /** `group`: the control is a radiogroup, so the label is a `<span>` referenced by `aria-labelledby={`${id}-label`}`. */
  asGroup?: boolean
  children: ReactNode
  className?: string
}

/** Label + control + hint + inline error. The control wires `aria-describedby` with the helpers above. */
export function FormField({ id, label, suffix, required = false, hint, error, asGroup = false, children, className }: FormFieldProps) {
  const labelContent = (
    <>
      {label}
      {required && (
        <>
          <span aria-hidden="true" className="ml-0.5 text-primary">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      )}
      {suffix && <span className="ml-1 font-normal text-ink/50">{suffix}</span>}
    </>
  )
  const labelClasses = 'mb-2 block text-[13px] font-bold text-ink'

  return (
    <div className={cn('min-w-0', className)}>
      {asGroup ? (
        <span id={fieldLabelId(id)} className={labelClasses}>
          {labelContent}
        </span>
      ) : (
        <label htmlFor={id} className={labelClasses}>
          {labelContent}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={fieldHintId(id)} className="mt-1.5 font-body text-xs text-ink/55">
          {hint}
        </p>
      )}
      {error && (
        <p id={fieldErrorId(id)} className="mt-1.5 font-body text-xs font-semibold text-primary">
          {error}
        </p>
      )}
    </div>
  )
}
