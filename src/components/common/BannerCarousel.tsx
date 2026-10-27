import { AnimatePresence, motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { useCarousel } from '@/hooks/useCarousel'
import { cn } from '@/lib/cn'
import { GlassCardVariant } from '@/constants/ui'
import type { BannerSlide } from '@/types/home.types'

export interface BannerCarouselProps {
  slides: readonly BannerSlide[]
  autoPlayMs?: number
  className?: string
}

export function BannerCarousel({ slides, autoPlayMs, className }: BannerCarouselProps) {
  const { index, goTo, setPaused } = useCarousel({ count: slides.length, autoPlayMs })
  const active = slides[index]

  return (
    <GlassCard
      as="section"
      variant={GlassCardVariant.Hero}
      className={cn('rounded-[32px] px-3 py-3.5 sm:rounded-[56px] sm:px-6 sm:py-7', className)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-[140px] -top-[200px] size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.28),transparent_95%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[168px] right-[-1px] size-[560px] rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.28),transparent_95%)]"
      />

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Featured offers"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative aspect-[1215/531] min-h-[200px] overflow-hidden rounded-[22px] bg-[#1a0407] shadow-banner sm:rounded-[56px]"
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={active.id}
            src={active.image}
            alt={active.alt}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(10_2_4/0.72),rgb(10_2_4/0.3)_48%,transparent_78%)]"
        />

        <div className="absolute bottom-3 left-1/2 flex h-[50px] w-[387px] max-w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-center rounded-full bg-black/32 backdrop-blur-[24px] sm:bottom-[17px]">
          <div className="flex items-center gap-4">
            {slides.map((slide, i) => {
              const isActive = i === index
              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={isActive}
                  onClick={() => goTo(i)}
                  className={cn(
                    'h-3 rounded-full transition-all duration-300',
                    isActive ? 'w-10 bg-primary-deep/95' : 'w-3 bg-white/50 hover:bg-white/80',
                  )}
                />
              )
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
