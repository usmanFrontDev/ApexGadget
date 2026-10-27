import { useEffect, useRef } from 'react'

/**
 * Calls `onCommit(value)` once `value` has stopped changing for `delayMs`.
 * The initial value counts as already committed (no call on mount).
 */
export function useDebouncedCommit<T>(value: T, onCommit: (value: T) => void, delayMs: number) {
  const committed = useRef(value)
  const commitRef = useRef(onCommit)

  useEffect(() => {
    commitRef.current = onCommit
  })

  useEffect(() => {
    if (Object.is(value, committed.current)) return
    const timer = window.setTimeout(() => {
      committed.current = value
      commitRef.current(value)
    }, delayMs)
    return () => window.clearTimeout(timer)
  }, [value, delayMs])
}
