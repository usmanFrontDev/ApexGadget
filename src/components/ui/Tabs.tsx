import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: string
  panel: ReactNode
}

export interface TabsProps {
  items: readonly TabItem[]
  /** Accessible name of the tab list. */
  label: string
  className?: string
}

/** Accessible tabs: roving tabindex, Left/Right/Home/End move and activate, only the active panel is shown. */
export function Tabs({ items, label, className }: TabsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id)
  const baseId = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId))

  const select = (index: number) => {
    const target = items[index]
    if (!target) return
    setActiveId(target.id)
    buttons.current[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        select(index === last ? 0 : index + 1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        select(index === 0 ? last : index - 1)
        break
      case 'Home':
        event.preventDefault()
        select(0)
        break
      case 'End':
        event.preventDefault()
        select(last)
        break
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="scrollbar-none -mb-px flex gap-6 overflow-x-auto border-b border-ink/10 px-1 sm:gap-8"
      >
        {items.map((item, index) => {
          const selected = index === activeIndex
          return (
            <button
              key={item.id}
              ref={(element) => {
                buttons.current[index] = element
              }}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'relative shrink-0 whitespace-nowrap py-3 text-[13.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                selected ? 'text-primary' : 'text-ink/60 hover:text-ink',
              )}
            >
              {item.label}
              {selected && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={index !== activeIndex}
          tabIndex={0}
          className="pt-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {index === activeIndex && item.panel}
        </div>
      ))}
    </div>
  )
}
