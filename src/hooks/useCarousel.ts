import { useCallback, useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface UseCarouselOptions {
  count: number
  autoPlayMs?: number
}

/** Index state + autoplay (paused on hover/focus and with reduced motion). */
export function useCarousel({ count, autoPlayMs }: UseCarouselOptions) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()

  const goTo = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  useEffect(() => {
    if (!autoPlayMs || paused || reducedMotion || count < 2) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), autoPlayMs)
    return () => window.clearInterval(timer)
  }, [autoPlayMs, paused, reducedMotion, count])

  return { index, goTo, setPaused }
}
