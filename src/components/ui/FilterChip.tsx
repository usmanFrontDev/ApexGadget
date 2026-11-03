import type { MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface FilterChipProps {
  children: ReactNode
  selected?: boolean
  /** Icon before the label (section tabs). */
  icon?: ReactNode
  /** `false` = navigation pill (`aria-current`) instead of a toggle (`aria-pressed`). */
  toggle?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  className?: string
}

/** Pill: white when off, solid red when on. A toggle (filters) or a navigation tab (Support sections). */
export function FilterChip({ children, selected = false, icon, toggle = true, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={toggle ? selected : undefined}
      aria-current={!toggle && selected ? 'true' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        icon ? 'pl-4 pr-5' : 'px-5',
        selected
          ? 'bg-primary text-white shadow-primary-soft'
          : 'bg-surface/92 text-ink shadow-ring hover:bg-canvas',
        className,
      )}
    >
      {icon && (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
