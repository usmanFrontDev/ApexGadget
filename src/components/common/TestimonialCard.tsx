import { StarIcon } from '@/components/icons'
import { GlassCard } from '@/components/ui/GlassCard'
import { Typography } from '@/components/ui/Typography'
import {
  GlassCardVariant,
  TypographyAlign,
  TypographyTone,
  TypographyVariant,
} from '@/constants/ui'
import type { Testimonial } from '@/types/home.types'

export interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { quote, author, rating } = testimonial

  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Soft}
      className="flex h-full flex-col items-center p-5 sm:p-6 lg:items-stretch lg:p-[27px]"
    >
      <div
        role="img"
        aria-label={`${rating} out of 5 stars`}
        className="flex gap-1 text-primary lg:self-start"
      >
        {Array.from({ length: rating }, (_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <Typography
        variant={TypographyVariant.Quote}
        align={TypographyAlign.CenterBelowLg}
        className="mt-4 flex-1 lg:mt-[19px]"
      >
        {quote}
      </Typography>
      <Typography
        variant={TypographyVariant.BodySm}
        tone={TypographyTone.Soft}
        align={TypographyAlign.CenterBelowLg}
        className="mt-4 font-semibold lg:mt-5"
      >
        {author}
      </Typography>
    </GlassCard>
  )
}
