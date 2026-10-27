/*
 * Fixed UI option sets. `as const` objects + derived unions (the `enum`
 * keyword is disabled by `erasableSyntaxOnly`).
 */

export const ButtonVariant = {
  Primary: 'primary',
  Secondary: 'secondary',
} as const
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant]

export const ButtonSize = {
  Xs: 'xs',
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize]

/** Where the icon sits relative to the button text. */
export const IconPosition = {
  Start: 'start',
  End: 'end',
} as const
export type IconPosition = (typeof IconPosition)[keyof typeof IconPosition]

/** `Circle` = icon inside a dark round badge, `Plain` = bare icon. */
export const ButtonIconStyle = {
  Circle: 'circle',
  Plain: 'plain',
} as const
export type ButtonIconStyle = (typeof ButtonIconStyle)[keyof typeof ButtonIconStyle]

export const IconButtonSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const
export type IconButtonSize = (typeof IconButtonSize)[keyof typeof IconButtonSize]

export const ChipSize = {
  Xs: 'xs',
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
} as const
export type ChipSize = (typeof ChipSize)[keyof typeof ChipSize]

/** `Label` = small uppercase tag (e.g. "TRADE IN"). */
export const ChipVariant = {
  Default: 'default',
  Label: 'label',
  /** Dark translucent tag over imagery (e.g. "PTA APPROVED"). */
  Dark: 'dark',
  /** Soft red tag (e.g. product grade "Excellent"). */
  Tint: 'tint',
} as const
export type ChipVariant = (typeof ChipVariant)[keyof typeof ChipVariant]

export const GlassCardVariant = {
  Hero: 'hero',
  Promo: 'promo',
  /** Quiet card: categories, products, features, reviews. */
  Soft: 'soft',
} as const
export type GlassCardVariant = (typeof GlassCardVariant)[keyof typeof GlassCardVariant]

/** Hover animations for icons (defined in `index.css`). */
export const IconAnimation = {
  None: 'none',
  /** Up-right arrow rotates 45° to point straight right. */
  PointRight: 'point-right',
  NudgeRight: 'nudge-right',
  NudgeUpRight: 'nudge-up-right',
  Spin: 'spin',
  Grow: 'grow',
} as const
export type IconAnimation = (typeof IconAnimation)[keyof typeof IconAnimation]
