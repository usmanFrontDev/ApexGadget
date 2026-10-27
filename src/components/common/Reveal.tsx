import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, REVEAL_VIEWPORT } from '@/constants/animation'

export interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** `inView` (default): animate when scrolled into view. `mount`: animate as soon as it renders. */
  trigger?: 'inView' | 'mount'
}

/** Fades + slides children in. */
export function Reveal({ children, className, delay = 0, trigger = 'inView' }: RevealProps) {
  const triggerProps =
    trigger === 'mount'
      ? { animate: 'visible' }
      : { whileInView: 'visible', viewport: REVEAL_VIEWPORT }

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      {...triggerProps}
    >
      {children}
    </motion.div>
  )
}
