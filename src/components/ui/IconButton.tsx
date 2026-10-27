import type { ReactNode } from 'react'
import { ActionElement, type ActionElementProps } from '@/components/ui/ActionElement'
import { AnimatedIcon } from '@/components/ui/AnimatedIcon'
import { iconCircleClasses } from '@/components/ui/iconCircleStyles'
import { IconAnimation, IconButtonSize } from '@/constants/ui'

export interface IconButtonProps extends Omit<ActionElementProps, 'children' | 'aria-label'> {
  /** Accessible name (required: there is no visible text). */
  label: string
  children: ReactNode
  size?: IconButtonSize
  /** Hover animation for the icon. Default: none. */
  iconAnimation?: IconAnimation
}

export function IconButton({
  label,
  size = IconButtonSize.Lg,
  iconAnimation = IconAnimation.None,
  className,
  children,
  ...actionProps
}: IconButtonProps) {
  return (
    <ActionElement
      {...actionProps}
      aria-label={label}
      data-hover-scope=""
      className={iconCircleClasses(
        size,
        `transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className ?? ''}`,
      )}
    >
      <AnimatedIcon animation={iconAnimation}>{children}</AnimatedIcon>
    </ActionElement>
  )
}
