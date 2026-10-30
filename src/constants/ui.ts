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
  /** Solid red tag (e.g. "Sold"). */
  Solid: 'solid',
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

/**
 * Text styles. Every size is responsive (phone -> tablet -> desktop) and lives in
 * `components/ui/Typography.tsx`; never hand-write font sizes in pages or cards.
 */
export const TypographyVariant = {
  /** Page hero headline (h1). */
  Display: 'display',
  /** Section headline (h2). */
  Heading: 'heading',
  /** Big card headline (promo, newsletter). */
  Title: 'title',
  /** Small headline (feature card, drawer, empty state). */
  Subtitle: 'subtitle',
  /** Product / category name. */
  CardTitle: 'card-title',
  /** Intro paragraph under a page headline. */
  Lead: 'lead',
  /** Default paragraph. */
  Body: 'body',
  BodySm: 'body-sm',
  Caption: 'caption',
  /** Small uppercase label above a headline. */
  Eyebrow: 'eyebrow',
  Price: 'price',
  Quote: 'quote',
} as const
export type TypographyVariant = (typeof TypographyVariant)[keyof typeof TypographyVariant]

export const TypographyTone = {
  Default: 'default',
  Muted: 'muted',
  Soft: 'soft',
  Inverse: 'inverse',
  InverseMuted: 'inverse-muted',
} as const
export type TypographyTone = (typeof TypographyTone)[keyof typeof TypographyTone]

/** `Center*` values centre on small screens and go back to start-aligned above the breakpoint. */
export const TypographyAlign = {
  Start: 'start',
  Center: 'center',
  CenterBelowSm: 'center-below-sm',
  CenterBelowLg: 'center-below-lg',
} as const
export type TypographyAlign = (typeof TypographyAlign)[keyof typeof TypographyAlign]

/** Look of the page banner artwork (decides the panel colour behind the phone crop below `lg`). */
export const PageBannerTone = {
  Light: 'light',
  Dark: 'dark',
} as const
export type PageBannerTone = (typeof PageBannerTone)[keyof typeof PageBannerTone]

/** Red-tint message boxes: `Unavailable` is announced as an alert, `Error` politely (the parent is a live region). */
export const NoticeVariant = {
  Unavailable: 'unavailable',
  Error: 'error',
} as const
export type NoticeVariant = (typeof NoticeVariant)[keyof typeof NoticeVariant]

/** `Md` = the 52px pill next to a large Button; `Sm` = the compact one inside cart lines. */
export const QuantityStepperSize = {
  Md: 'md',
  Sm: 'sm',
} as const
export type QuantityStepperSize = (typeof QuantityStepperSize)[keyof typeof QuantityStepperSize]
