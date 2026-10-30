import type { ReactNode } from 'react'
import { ActionElement, type ActionElementProps } from '@/components/ui/ActionElement'
import { AnimatedIcon } from '@/components/ui/AnimatedIcon'
import {
  ButtonIconStyle,
  ButtonSize,
  ButtonVariant,
  IconAnimation,
  IconPosition,
} from '@/constants/ui'
import { cn } from '@/lib/cn'

export interface ButtonProps extends ActionElementProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Any node (usually an icon component). Omit for a text-only button. */
  icon?: ReactNode
  /** Icon before or after the label. Default: after. */
  iconPosition?: IconPosition
  /** Dark round badge around the icon or bare icon. Default depends on variant. */
  iconStyle?: ButtonIconStyle
  /** Hover animation for the icon. Default: none. */
  iconAnimation?: IconAnimation
  /** Stretch to the container; label and icon sit at opposite edges. */
  fullWidth?: boolean
  /** Phones only (< sm): full width, label centred, icon pinned to the right edge. */
  blockOnMobile?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'bg-primary font-bold text-white shadow-primary hover:brightness-110',
  [ButtonVariant.Secondary]: 'bg-white/92 font-semibold text-ink shadow-ring hover:bg-white',
}

const defaultIconStyle: Record<ButtonVariant, ButtonIconStyle> = {
  [ButtonVariant.Primary]: ButtonIconStyle.Circle,
  [ButtonVariant.Secondary]: ButtonIconStyle.Plain,
}

interface SizeConfig {
  root: string
  /** Padding when there is no icon or a bare icon. */
  plainPadding: string
  /** Padding when the icon sits in a dark circle (end / start position). */
  circlePadding: { end: string; start: string }
  circle: string
}

const sizeClasses: Record<ButtonSize, SizeConfig> = {
  [ButtonSize.Xs]: {
    root: 'h-[42px] text-[13.8px]',
    plainPadding: 'px-[26px]',
    circlePadding: { end: 'pl-5 pr-1.5', start: 'pl-1.5 pr-5' },
    circle: 'size-[30px]',
  },
  [ButtonSize.Sm]: {
    root: 'h-[46px] text-sm',
    plainPadding: 'px-[22px]',
    circlePadding: { end: 'pl-5 pr-2', start: 'pl-2 pr-5' },
    circle: 'size-8',
  },
  [ButtonSize.Md]: {
    root: 'h-[50px] text-[14.5px]',
    plainPadding: 'px-6.5',
    circlePadding: { end: 'pl-6 pr-2', start: 'pl-2 pr-6' },
    circle: 'size-[34px]',
  },
  [ButtonSize.Lg]: {
    root: 'h-[52px] text-[14.5px]',
    plainPadding: 'px-6.5',
    circlePadding: { end: 'pl-6 pr-2', start: 'pl-2 pr-6' },
    circle: 'size-9',
  },
}

export function Button({
  variant = ButtonVariant.Primary,
  size = ButtonSize.Lg,
  icon,
  iconPosition = IconPosition.End,
  iconStyle,
  iconAnimation = IconAnimation.None,
  fullWidth = false,
  blockOnMobile = false,
  className,
  children,
  ...actionProps
}: ButtonProps) {
  const style = iconStyle ?? defaultIconStyle[variant]
  const hasCircle = Boolean(icon) && style === ButtonIconStyle.Circle
  const sizing = sizeClasses[size]
  const iconAtStart = iconPosition === IconPosition.Start

  const iconNode = icon ? (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        blockOnMobile &&
          cn('max-sm:absolute max-sm:inset-y-0 max-sm:my-auto', iconAtStart ? 'max-sm:left-2' : 'max-sm:right-2'),
        hasCircle && cn('rounded-full bg-ink-deep text-white', sizing.circle),
      )}
    >
      <AnimatedIcon animation={iconAnimation}>{icon}</AnimatedIcon>
    </span>
  ) : null

  const padding = hasCircle
    ? sizing.circlePadding[iconAtStart ? 'start' : 'end']
    : sizing.plainPadding

  return (
    <ActionElement
      {...actionProps}
      data-hover-scope=""
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
        fullWidth ? 'w-full justify-between' : 'justify-center',
        blockOnMobile && 'max-sm:relative max-sm:w-full max-sm:justify-center max-sm:px-14',
        hasCircle ? 'gap-[13px]' : 'gap-2',
        sizing.root,
        padding,
        variantClasses[variant],
        className,
      )}
    >
      {iconAtStart && iconNode}
      {blockOnMobile ? <span className="min-w-0 truncate">{children}</span> : children}
      {!iconAtStart && iconNode}
    </ActionElement>
  )
}
