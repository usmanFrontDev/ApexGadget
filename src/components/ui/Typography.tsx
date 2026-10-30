import type { HTMLAttributes, ReactNode } from 'react'
import { TypographyAlign, TypographyTone, TypographyVariant } from '@/constants/ui'
import { cn } from '@/lib/cn'

type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'blockquote'

export interface TypographyProps extends Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'> {
  children: ReactNode
  variant?: TypographyVariant
  /** Element to render. Defaults to the natural tag of the variant. */
  as?: TypographyTag
  tone?: TypographyTone
  align?: TypographyAlign
  className?: string
}

/** Size, weight, leading and tracking per variant: phone first, then `sm` / `lg` / `xl` steps. */
const variantClasses: Record<TypographyVariant, string> = {
  [TypographyVariant.Display]:
    'text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[40px] xl:text-[52px] xl:leading-[56px]',
  [TypographyVariant.Heading]:
    'text-[26px] font-bold leading-[1.06] tracking-[-0.035em] sm:text-[32px] lg:text-[40px]',
  [TypographyVariant.Title]:
    'text-[22px] font-extrabold leading-[1.14] tracking-[-0.03em] sm:text-[25px] lg:text-[27px]',
  [TypographyVariant.Subtitle]:
    'text-[17px] font-bold leading-[1.25] tracking-[-0.02em] sm:text-[18px] lg:text-xl',
  [TypographyVariant.CardTitle]: 'text-[15.5px] font-bold leading-5 sm:text-base',
  [TypographyVariant.Lead]: 'font-body text-[15px] leading-6 sm:text-base sm:leading-[26px]',
  [TypographyVariant.Body]: 'font-body text-sm leading-5 sm:text-[14.5px]',
  [TypographyVariant.BodySm]: 'font-body text-[13px] leading-[18px]',
  [TypographyVariant.Caption]: 'font-body text-xs leading-4 sm:text-[12.5px]',
  [TypographyVariant.Eyebrow]:
    'font-body text-[11px] font-bold uppercase tracking-[1.61px] sm:text-[11.5px]',
  [TypographyVariant.Price]:
    'text-[19px] font-extrabold leading-[26px] tracking-[-0.5px] sm:text-xl',
  [TypographyVariant.Quote]: 'font-body text-[15px] leading-[22px] sm:text-base',
}

const defaultTag: Record<TypographyVariant, TypographyTag> = {
  [TypographyVariant.Display]: 'h1',
  [TypographyVariant.Heading]: 'h2',
  [TypographyVariant.Title]: 'h3',
  [TypographyVariant.Subtitle]: 'h3',
  [TypographyVariant.CardTitle]: 'h3',
  [TypographyVariant.Lead]: 'p',
  [TypographyVariant.Body]: 'p',
  [TypographyVariant.BodySm]: 'p',
  [TypographyVariant.Caption]: 'p',
  [TypographyVariant.Eyebrow]: 'p',
  [TypographyVariant.Price]: 'p',
  [TypographyVariant.Quote]: 'blockquote',
}

const toneClasses: Record<TypographyTone, string> = {
  [TypographyTone.Default]: '',
  [TypographyTone.Muted]: 'text-ink/60',
  [TypographyTone.Soft]: 'text-ink/70',
  [TypographyTone.Inverse]: 'text-paper',
  [TypographyTone.InverseMuted]: 'text-paper/62',
}

const alignClasses: Record<TypographyAlign, string> = {
  [TypographyAlign.Start]: '',
  [TypographyAlign.Center]: 'text-center',
  [TypographyAlign.CenterBelowSm]: 'text-center sm:text-left',
  [TypographyAlign.CenterBelowLg]: 'text-center lg:text-left',
}

/** The one place text styles are defined. Use it instead of raw `<h2 className="text-...">`. */
export function Typography({
  children,
  variant = TypographyVariant.Body,
  as,
  tone = TypographyTone.Default,
  align = TypographyAlign.Start,
  className,
  ...rest
}: TypographyProps) {
  const Tag = as ?? defaultTag[variant]
  return (
    <Tag
      {...rest}
      className={cn(variantClasses[variant], toneClasses[tone], alignClasses[align], className)}
    >
      {children}
    </Tag>
  )
}
