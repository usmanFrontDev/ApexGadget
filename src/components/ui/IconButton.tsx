import type { ReactNode } from 'react'
import { ActionElement, type ActionElementProps } from '@/components/ui/ActionElement'
import { AnimatedIcon } from '@/components/ui/AnimatedIcon'
import { iconCircleClasses } from '@/components/ui/iconCircleStyles'
import { IconAnimation, IconButtonSize, IconButtonVariant } from '@/constants/ui'

export interface IconButtonProps extends Omit<ActionElementProps, 'children' | 'aria-label'> {
  /** Accessible name (required: there is no visible text). */
  label: string
  children: ReactNode
  size?: IconButtonSize
  variant?: IconButtonVariant
  /** Hover animation for the icon. Default: none. */
  iconAnimation?: IconAnimation
}

export function IconButton({
  label,
  size = IconButtonSize.Lg,
  variant = IconButtonVariant.Default,
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
        `transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          variant === IconButtonVariant.Primary ? 'hover:brightness-110' : 'hover:bg-white'
        } ${className ?? ''}`,
        variant,
      )}
    >
      <AnimatedIcon animation={iconAnimation}>{children}</AnimatedIcon>
    </ActionElement>
  )
}
