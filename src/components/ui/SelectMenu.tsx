import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckIcon, ChevronDownIcon } from '@/components/icons'
import { cn } from '@/lib/cn'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

export interface SelectMenuProps<T extends string> {
  options: readonly SelectOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Short prefix shown on the trigger and used as the accessible name, e.g. "Sort by". */
  label: string
  /** Small borderless field instead of the pill. */
  compact?: boolean
  className?: string
}

/** Accessible listbox dropdown (click, arrow keys, Home/End, Enter, Esc, outside click). */
export function SelectMenu<T extends string>({
  options,
  value,
  onChange,
  label,
  compact = false,
  className,
}: SelectMenuProps<T>) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [alignRight, setAlignRight] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const openMenu = () => {
    // Anchor the menu to the trigger's right edge if it's in the right half of the screen,
    // otherwise to its left edge, so it never opens off-screen.
    const rect = rootRef.current?.getBoundingClientRect()
    if (rect) setAlignRight(rect.left + rect.width / 2 > window.innerWidth / 2)
    setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)))
    setOpen(true)
  }

  const choose = (index: number) => {
    onChange(options[index].value)
    setOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) openMenu()
        else setActiveIndex((index) => Math.min(index + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!open) openMenu()
        else setActiveIndex((index) => Math.max(index - 1, 0))
        break
      case 'Home':
        if (open) {
          event.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (open) {
          event.preventDefault()
          setActiveIndex(last)
        }
        break
      case 'Enter':
      case ' ':
        if (open) {
          event.preventDefault()
          choose(activeIndex)
        }
        break
      case 'Escape':
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${selected.label}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex w-full items-center gap-2 whitespace-nowrap text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          compact
            ? 'h-10 rounded-xl bg-ink/5 pl-3.5 pr-3 text-[13px] hover:bg-ink/8'
            : 'h-12 rounded-full bg-white/92 pl-5 pr-4 shadow-ring hover:bg-white',
        )}
      >
        <span className="hidden shrink-0 whitespace-nowrap text-ink/55 sm:inline">{label}:</span>
        {/* All labels share one grid cell, so the trigger is as wide as the longest option and
            doesn't change width (or wrap) when the selection changes. */}
        <span className="grid min-w-0 flex-1 text-left font-semibold">
          {options.map((option) => (
            <span
              key={option.value}
              className={cn(
                'col-start-1 row-start-1 truncate whitespace-nowrap',
                option.value !== value && 'invisible',
              )}
            >
              {option.label}
            </span>
          ))}
        </span>
        <ChevronDownIcon
          className={cn('shrink-0 transition-transform duration-300', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={label}
            aria-activedescendant={`${listId}-${activeIndex}`}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn(
              'absolute top-full z-30 mt-2 w-max min-w-full max-w-[calc(100vw-2rem)] rounded-[22px] bg-white/90 p-1.5 shadow-glass-hero backdrop-blur-[18px]',
              alignRight ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            )}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={option.value === value}
                onClick={() => choose(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-6 whitespace-nowrap rounded-2xl px-3.5 py-2.5 text-sm transition-colors',
                  index === activeIndex && 'bg-ink/5',
                  option.value === value ? 'font-semibold text-primary' : 'text-ink',
                )}
              >
                {option.label}
                {option.value === value && <CheckIcon className="text-primary" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
