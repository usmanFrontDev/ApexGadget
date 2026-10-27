import { Reveal } from '@/components/common/Reveal'
import { TestimonialCard } from '@/components/common/TestimonialCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TESTIMONIALS } from '@/constants/home'

export function TestimonialsSection() {
  return (
    <section className="mt-14 lg:mt-[88px]">
      <SectionHeading eyebrow="From real customers" title="What people say" />

      <ul className="mt-6 grid gap-3 md:grid-cols-3 lg:gap-[18px]">
        {TESTIMONIALS.map((testimonial, index) => (
          <li key={testimonial.id} className="h-full">
            <Reveal delay={index * 0.08} className="h-full">
              <TestimonialCard testimonial={testimonial} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
