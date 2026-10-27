import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Resets scroll when you navigate to a page: new page -> top (instantly), `/#section` -> that
 * section. It deliberately does nothing for
 *  - back/forward (POP): the browser restores the old position, and
 *  - in-page `replace` updates on the same path (shop filters, sort, pagination) so the
 *    page doesn't jump while you're using them.
 */
export function ScrollToTop() {
  const { key, pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const previousPathname = useRef(pathname)

  // Keyed on the location only: the navigation type changing on its own (e.g. POP -> REPLACE
  // on the first filter click) must not re-run this.
  useEffect(() => {
    const isSamePage = previousPathname.current === pathname
    previousPathname.current = pathname

    if (navigationType === 'POP') return
    if (navigationType === 'REPLACE' && isSamePage) return

    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return null
}
