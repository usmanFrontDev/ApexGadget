import { cn } from '@/lib/cn'

export interface SkeletonProps {
  className?: string
}

/** Pulsing placeholder block; size and radius come from `className`. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-xl bg-ink/7 motion-reduce:animate-none', className)}
    />
  )
}
