import { useEffect, useState } from 'react'

const TOP_OFFSET_RATIO = 0.35
const TIE_PX = 4

/**
 * Id of the section the shopper is reading: the last one whose top has passed 35% of the viewport (of two with the
 * same top, the first). For 900 ms after a tab click the scroll is ignored, so the clicked tab stays selected while the page scrolls.
 */
export function useActiveSection<T extends string>(ids: readonly T[]): [T, (id: T) => void] {
  const [active, setActive] = useState(ids[0])
  const [lockedUntil, setLockedUntil] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (Date.now() < lockedUntil) return
      const line = window.innerHeight * TOP_OFFSET_RATIO
      let best: { id: T; top: number } | undefined
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top === undefined || top > line) continue
        if (!best || top > best.top + TIE_PX) best = { id, top }
      }
      if (best) setActive(best.id)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids, lockedUntil])

  const select = (id: T) => {
    setActive(id)
    setLockedUntil(Date.now() + 900)
  }
  return [active, select]
}
