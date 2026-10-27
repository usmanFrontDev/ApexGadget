import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Page column: full width with small side gutters (no max-width cap). */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-full px-4 sm:px-8', className)}>{children}</div>
}
