import { cn } from '@/lib/cn'

export interface GlassGlowProps {
  /** Size and position (`absolute`), e.g. `-bottom-16 -right-12 size-[280px]`. */
  className?: string
}

/**
 * Soft red-tinted radial glow behind a card's art or icon (decorative). Put it inside a `relative` / `overflow-clip`
 * card with `group` on it: the glow gets stronger on hover.
 */
export function GlassGlow({ className }: GlassGlowProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.15),transparent_92%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none',
        className,
      )}
    />
  )
}
