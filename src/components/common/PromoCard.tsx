import { ArrowUpRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconButton } from '@/components/ui/IconButton'
import {
  ButtonSize,
  ChipSize,
  ChipVariant,
  GlassCardVariant,
  IconAnimation,
} from '@/constants/ui'
import { cn } from '@/lib/cn'
import type { PromoCardData } from '@/types/home.types'

export interface PromoCardProps {
  data: PromoCardData
}

export function PromoCard({ data }: PromoCardProps) {
  const { label, titleLines, description, cta, image, imageAlt, imageClassName } = data

  return (
    <GlassCard
      as="article"
      variant={GlassCardVariant.Promo}
      className="flex h-full min-h-[311px] flex-col p-6 sm:p-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-[42%] hidden size-[400px] rounded-full bg-[radial-gradient(closest-side,rgb(200_32_40/0.52),transparent_95%)] sm:block"
      />

      <img
        src={image}
        alt={imageAlt}
        // Eager on purpose: an absolutely-positioned lazy image inside a clipped, blurred card
        // can fail to trigger its load and the card's picture goes missing.
        loading="eager"
        decoding="async"
        className={cn(
          'pointer-events-none relative order-2 mx-auto mt-6 h-auto w-3/5 max-w-[240px] select-none sm:absolute sm:mx-0 sm:mt-0 sm:max-w-none',
          imageClassName,
        )}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,#fff_0%,rgb(255_255_255/0.48)_42%,transparent_85%)] sm:block"
      />

      <div className="relative z-10 order-1 flex flex-1 flex-col items-start sm:max-w-[min(311px,56%)]">
        <Chip size={ChipSize.Sm} variant={ChipVariant.Label}>
          {label}
        </Chip>
        <h3 className="mt-[15px] text-[24px] font-extrabold leading-[1.14] tracking-[-0.9px] sm:text-[27px]">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h3>
        <p className="mt-3 font-body text-[14.5px] leading-5 text-ink/60">{description}</p>
        <div className="mt-auto pt-[19px]">
          <Button
            to={cta.to}
            size={ButtonSize.Md}
            icon={<ArrowUpRightIcon />}
            iconAnimation={IconAnimation.PointRight}
          >
            {cta.label}
          </Button>
        </div>
      </div>

      <IconButton
        to={cta.to}
        label={cta.label}
        iconAnimation={IconAnimation.PointRight}
        className="absolute right-6 top-6 z-10"
      >
        <ArrowUpRightIcon />
      </IconButton>
    </GlassCard>
  )
}
