import { Fragment } from 'react'
import { ChevronRightIcon } from '@/components/icons'
import { cn } from '@/lib/cn'

export interface StepperStep {
  id: number
  label: string
}

export interface StepperProps {
  steps: readonly StepperStep[]
  current: number
  /** Called for completed steps only. */
  onStepClick?: (id: number) => void
  className?: string
}

/**
 * Desktop: "1 Phone > 2 Condition > 3 Review" pills (completed ones are buttons).
 * Phone: "Step 1 of 3" and a thin red progress bar.
 */
export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  const total = steps.length
  return (
    <div className={className}>
      <ol className="hidden items-center gap-2.5 sm:flex" aria-label="Progress">
        {steps.map((step, index) => {
          const done = step.id < current
          const active = step.id === current
          const pill = (
            <>
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold',
                  active ? 'bg-white/20 text-white' : done ? 'bg-primary/12 text-primary' : 'bg-ink/8 text-ink/60',
                )}
              >
                {step.id}
              </span>
              <span className="whitespace-nowrap">{step.label}</span>
            </>
          )
          const pillClasses = cn(
            'inline-flex h-10 items-center gap-2.5 rounded-full pl-2.5 pr-5 text-[13px] font-semibold',
            active ? 'bg-primary text-white shadow-primary-soft' : done ? 'bg-white text-ink shadow-ring' : 'bg-white/60 text-ink/55',
          )
          return (
            <Fragment key={step.id}>
              {index > 0 && <ChevronRightIcon aria-hidden="true" className="shrink-0 text-ink/30" />}
              <li aria-current={active ? 'step' : undefined}>
                {done && onStepClick ? (
                  <button
                    type="button"
                    onClick={() => onStepClick(step.id)}
                    className={cn(pillClasses, 'transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary')}
                  >
                    {pill}
                  </button>
                ) : (
                  <span className={pillClasses}>{pill}</span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>

      <div className="sm:hidden">
        <p className="font-body text-xs text-ink/60">
          Step {current} of {total}
        </p>
        <div
          role="progressbar"
          aria-label="Form progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current}
          className="mt-2 flex h-1 overflow-hidden rounded-full bg-ink/8"
        >
          {steps.map((step) => (
            <span
              key={step.id}
              className={cn('h-full flex-1 transition-colors duration-300', step.id <= current ? 'bg-primary' : 'bg-transparent')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
