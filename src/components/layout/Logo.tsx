import logoDark from '@/assets/images/logo-dark.png'
import logoLight from '@/assets/images/logo.png'
import { cn } from '@/lib/cn'

export interface LogoProps {
  /** Height (and any spacing) of both versions, e.g. `h-8`. */
  className?: string
}

/** The Apex logo: the dark-ink version on the light theme, the white version (from the Figma dark design) on the dark one. */
export function Logo({ className }: LogoProps) {
  return (
    <>
      <img src={logoLight} alt="Apex Gadgets" width={80} height={32} className={cn('w-auto dark:hidden', className)} />
      <img src={logoDark} alt="" aria-hidden="true" width={80} height={32} className={cn('hidden w-auto dark:block', className)} />
    </>
  )
}
