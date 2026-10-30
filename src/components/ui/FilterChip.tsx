import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface FilterChipProps {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}

/** Toggle pill: white when off, solid red when on. */
export function FilterChip({ children, selected = false, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center whitespace-nowrap rounded-full px-5 text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        selected
          ? 'bg-primary text-white shadow-primary-soft'
          : 'bg-white/92 text-ink shadow-ring hover:bg-canvas',
        className,
      )}
    >
      {children}
    </button>
  )
}
