import type { ReactNode } from 'react'

export interface PillRowProps {
  /** Accessible name of the group / navigation. */
  label: string
  children: ReactNode
}

/**
 * Horizontally scrolling row of pills (shop quick filters). The padding (offset by negative
 * margins) leaves room for the active pill's shadow, which the scroll container would otherwise clip into a visible box.
 */
export function PillRow({ label, children }: PillRowProps) {
  return (
    <div role="group" aria-label={label} className="scrollbar-none -mx-6 -mb-7 flex gap-2.5 overflow-x-auto px-6 pb-9 pt-2">
      {children}
    </div>
  )
}
