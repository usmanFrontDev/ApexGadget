import type { Variants } from 'framer-motion'

/** `custom` = delay in seconds. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay },
  }),
}

export const REVEAL_VIEWPORT = { once: true, amount: 0.2 } as const
