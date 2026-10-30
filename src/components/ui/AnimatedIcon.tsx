import type { ReactNode } from 'react'
import { IconAnimation } from '@/constants/ui'

export interface AnimatedIconProps {
  children: ReactNode
  animation?: IconAnimation
}

/** Wraps an icon so it plays a CSS hover animation (see `index.css`). */
export function AnimatedIcon({ children, animation = IconAnimation.None }: AnimatedIconProps) {
  return (
    <span className="inline-flex" data-icon-animation={animation === IconAnimation.None ? undefined : animation}>
      {children}
    </span>
  )
}
