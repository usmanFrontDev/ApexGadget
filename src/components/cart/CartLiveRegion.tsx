import { useAnnouncerStore } from '@/store/useAnnouncerStore'

/** Invisible polite live region: cart changes ("iPhone 14 Pro removed", "Discount applied") for screen readers. */
export function CartLiveRegion() {
  const message = useAnnouncerStore((state) => state.message)
  return (
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </p>
  )
}
