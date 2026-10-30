import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/IconButton'
import { Typography } from '@/components/ui/Typography'
import { IconButtonSize, TypographyVariant } from '@/constants/ui'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Sticky bottom area (e.g. an "Apply" button). */
  footer?: ReactNode
  /** Focus goes back to this element on close (default: whatever had focus when it opened). */
  returnFocusSelector?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Right-hand glass sheet: Esc / backdrop to close, scroll lock, focus trap + restore. */
export function Drawer({ open, onClose, title, children, footer, returnFocusSelector }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  const returnFocusRef = useRef(returnFocusSelector)
  const titleId = useId()

  useEffect(() => {
    closeRef.current = onClose
    returnFocusRef.current = returnFocusSelector
  })

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeRef.current()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      const target = returnFocusRef.current ? document.querySelector<HTMLElement>(returnFocusRef.current) : null
      ;(target ?? previouslyFocused)?.focus()
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/35 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="absolute inset-y-0 right-0 flex w-[min(92vw,400px)] flex-col rounded-l-[28px] bg-white/92 shadow-glass-hero outline-none backdrop-blur-[18px]"
          >
            <div className="flex items-center justify-between px-6 pb-3 pt-6">
              <Typography as="h2" id={titleId} variant={TypographyVariant.Subtitle}>
                {title}
              </Typography>
              <IconButton label="Close" size={IconButtonSize.Md} onClick={onClose}>
                <CloseIcon width={16} height={16} />
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
            {footer && <div className="border-t border-ink/9 p-6">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
