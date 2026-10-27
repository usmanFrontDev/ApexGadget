import type { ReactNode } from 'react'
import { AnimatedIcon } from '@/components/ui/AnimatedIcon'
import { IconAnimation, IconButtonSize } from '@/constants/ui'
import { iconCircleClasses } from '@/components/ui/iconCircleStyles'

export interface IconCircleProps {
  children: ReactNode
  size?: IconButtonSize
  iconAnimation?: IconAnimation
  className?: string
}

/** Non-interactive round icon badge (use inside an already-clickable parent). */
export function IconCircle({
  children,
  size = IconButtonSize.Md,
  iconAnimation = IconAnimation.None,
  className,
}: IconCircleProps) {
  return (
    <span aria-hidden="true" className={iconCircleClasses(size, className)}>
      <AnimatedIcon animation={iconAnimation}>{children}</AnimatedIcon>
    </span>
  )
}
