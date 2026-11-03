import { AnimatePresence, motion } from 'framer-motion'
import { MoonIcon, SunIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/IconButton'
import { THEME_CONTENT } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'

export interface ThemeToggleProps {
  className?: string
}

/** Round light / dark switch: the sun and the moon turn into each other. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggle } = useTheme()
  return (
    <IconButton label={THEME_CONTENT.toggle} aria-pressed={isDark} onClick={toggle} className={className}>
      <span className="relative grid size-5 place-items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="inline-flex"
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </motion.span>
        </AnimatePresence>
      </span>
    </IconButton>
  )
}
