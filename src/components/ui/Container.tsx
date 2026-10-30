import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Page column: full width with gutters that grow with the screen (no max-width cap). */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-full px-3 sm:px-6 lg:px-8', className)}>{children}</div>
}
