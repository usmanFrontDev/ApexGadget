import { StarIcon } from '@/components/icons'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassCardVariant } from '@/constants/ui'
import type { Testimonial } from '@/types/home.types'

export interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { quote, author, rating } = testimonial

  return (
    <GlassCard as="article" variant={GlassCardVariant.Soft} className="flex h-full flex-col p-[27px]">
      <div role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-1 text-primary">
        {Array.from({ length: rating }, (_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <blockquote className="mt-[19px] flex-1 font-body text-base leading-[22px]">{quote}</blockquote>
      <p className="mt-5 pt-0 font-body text-[13px] font-semibold leading-4 text-ink/70">{author}</p>
    </GlassCard>
  )
}
